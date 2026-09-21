// app/api/client/profile/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/client/profile
 * Returns the current user's profile (name, phone, email).
 */
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('id, email, full_name, phone, is_admin, created_at')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || '',
        phone: profile?.phone || '',
        is_admin: profile?.is_admin || false,
        created_at: profile?.created_at || null,
      },
    });
  } catch (error) {
    console.error('GET /api/client/profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/client/profile
 * Updates full_name and/or phone on the user_profiles row.
 * Body: { full_name?: string, phone?: string }
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Only accept these two fields
    const updates: { full_name?: string; phone?: string } = {};

    if (typeof body.full_name === 'string') {
      const name = body.full_name.trim();
      if (name.length < 2) {
        return NextResponse.json(
          { error: 'Name must be at least 2 characters.' },
          { status: 400 }
        );
      }
      if (name.length > 100) {
        return NextResponse.json(
          { error: 'Name is too long.' },
          { status: 400 }
        );
      }
      updates.full_name = name;
    }

    if (typeof body.phone === 'string') {
      const phone = body.phone.trim();
      // Allow empty (clearing the phone) or a valid-looking number
      if (phone !== '' && !/^[+\d\s\-()]{7,20}$/.test(phone)) {
        return NextResponse.json(
          { error: 'Please enter a valid phone number.' },
          { status: 400 }
        );
      }
      updates.phone = phone;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Nothing to update.' },
        { status: 400 }
      );
    }

    // Upsert so it works even if the profile row doesn't exist yet
    const { data: updated, error } = await adminSupabase
      .from('user_profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          ...updates,
        },
        { onConflict: 'id' }
      )
      .select('id, email, full_name, phone, is_admin, created_at')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also sync the user_metadata so Navbar's fallback reflects changes fast
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: updated.full_name,
          phone: updated.phone,
        },
      });
    } catch (metaErr) {
      console.warn('Failed to sync user_metadata:', metaErr);
      // Non-fatal — DB is the source of truth
    }

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error('PUT /api/client/profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}