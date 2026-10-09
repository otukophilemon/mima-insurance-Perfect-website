// app/api/admin/team/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { logAdminAction } from '@/lib/audit';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function verifyAdmin() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return profile?.is_admin ? user : null;
  } catch (error) {
    console.error('verifyAdmin error:', error);
    return null;
  }
}

async function verifySuperAdmin() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('is_admin, is_super_admin')
      .eq('id', user.id)
      .single();

    return profile?.is_admin && profile?.is_super_admin ? user : null;
  } catch (error) {
    console.error('verifySuperAdmin error:', error);
    return null;
  }
}

/**
 * GET /api/admin/team
 * Returns all team members. Any admin can view.
 */
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: members, error } = await adminSupabase
      .from('user_profiles')
      .select(
        'id, email, full_name, phone, is_admin, is_super_admin, is_team_member, team_slug, team_title, team_bio, team_email, team_phone, team_whatsapp, team_photo, team_specialties, team_experience_years, team_certifications, team_display_order, team_active, created_at'
      )
      .eq('is_team_member', true)
      .order('team_display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Team fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: members || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/team
 * Add a team member. SUPER ADMIN ONLY.
 */
export async function POST(request: Request) {
  try {
    const admin = await verifySuperAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Only super admins can add team members' },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.email || !body.title || !body.bio) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, title, bio' },
        { status: 400 }
      );
    }

    const email = body.email.toLowerCase().trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const slug =
      body.slug?.trim() ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

    // Check if user already exists
    const { data: existingProfile } = await adminSupabase
      .from('user_profiles')
      .select('id, is_team_member')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json(
        {
          error:
            'A user with this email already exists. Promote them via Admin Management instead.',
        },
        { status: 400 }
      );
    }

    // Create auth user
    const tempPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12).toUpperCase() +
      '!9A';

    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: body.name,
          phone: body.phone || null,
        },
      });

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth account' },
        { status: 500 }
      );
    }

    // Create user_profiles row
    const { data: newMember, error: profileError } = await adminSupabase
      .from('user_profiles')
      .upsert(
        {
          id: authData.user.id,
          email,
          full_name: body.name,
          phone: body.phone || null,
          is_admin: true,
          is_super_admin: false,
          is_team_member: true,
          team_slug: slug,
          team_title: body.title,
          team_bio: body.bio,
          team_email: body.email_public || email,
          team_phone: body.phone || null,
          team_whatsapp: body.whatsapp || null,
          team_photo: body.photo || null,
          team_specialties: body.specialties || [],
          team_experience_years: body.experience_years || null,
          team_certifications: body.certifications || [],
          team_display_order: body.display_order ?? 0,
          team_active: body.active !== false,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (profileError) {
      console.error('Profile upsert error:', profileError);
      await adminSupabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Send password reset email
    let emailSent = false;
    try {
      const origin =
        request.headers.get('origin') ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://mima-insurance-perfect-website-ashen.vercel.app';

      await adminSupabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });
      emailSent = true;
      console.log(`✅ Password reset email sent to ${email}`);
    } catch (emailErr) {
      console.warn(`⚠️ Reset email failed for ${email}:`, emailErr);
    }

    await logAdminAction({
      action: 'create_policy' as any,
      entity_type: 'policy' as any,
      entity_id: newMember.id,
      details: {
        type: 'create_team_member',
        email,
        team_slug: slug,
        email_sent: emailSent,
      },
    });

    return NextResponse.json(
      {
        success: true,
        agent: newMember,
        email_sent: emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}