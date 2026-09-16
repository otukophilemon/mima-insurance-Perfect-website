// app/api/client/me/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/client/me
 * Returns the current logged-in user's info including admin status.
 */
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Get admin status via service role (bypasses RLS)
    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('is_admin, full_name, phone')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        phone: profile?.phone || user.user_metadata?.phone || null,
        is_admin: profile?.is_admin || false,
      },
    });
  } catch (error) {
    console.error('GET /api/client/me error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
