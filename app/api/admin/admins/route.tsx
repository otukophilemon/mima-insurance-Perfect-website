// app/api/admin/admins/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { logAdminAction } from '@/lib/audit';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function getCurrentAdmin() {
  try {
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: profile } = await adminSupabase
      .from('user_profiles')
      .select('is_admin, is_super_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) return null;

    return {
      user,
      isSuperAdmin: profile.is_super_admin === true,
    };
  } catch (error) {
    console.error('getCurrentAdmin error:', error);
    return null;
  }
}

/**
 * GET /api/admin/admins
 * Returns all team members with their admin/super-admin status.
 * Only accessible to admins. Super-admin flag returned so UI can gate actions.
 */
export async function GET() {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: teamMembers, error } = await adminSupabase
      .from('user_profiles')
      .select(
        'id, email, full_name, phone, is_admin, is_super_admin, is_team_member, team_slug, team_title, team_photo, team_display_order, created_at'
      )
      .eq('is_team_member', true)
      .order('is_super_admin', { ascending: false })
      .order('team_display_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Team members fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      admins: teamMembers || [],
      isSuperAdmin: current.isSuperAdmin,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/admins
 * Grant or revoke admin status for a user.
 * Only super admins can perform this action.
 * Body: { userId: string, isAdmin: boolean }
 */
export async function PUT(request: Request) {
  try {
    const current = await getCurrentAdmin();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only super admin can manage admin status
    if (!current.isSuperAdmin) {
      return NextResponse.json(
        { error: 'Only a super admin can grant or revoke admin access' },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!body.userId || typeof body.isAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing userId or isAdmin' },
        { status: 400 }
      );
    }

    // Prevent super admin from revoking their own super admin via this endpoint
    if (body.userId === current.user.id && body.isAdmin === false) {
      return NextResponse.json(
        { error: 'You cannot remove your own admin access' },
        { status: 400 }
      );
    }

    const { data: targetUser, error: targetError } = await adminSupabase
      .from('user_profiles')
      .select('is_super_admin, email')
      .eq('id', body.userId)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent modifying other super admins
    if (targetUser.is_super_admin && body.userId !== current.user.id) {
      return NextResponse.json(
        { error: 'Super admin accounts cannot be modified by other admins' },
        { status: 400 }
      );
    }

    const { data: updatedUser, error } = await adminSupabase
      .from('user_profiles')
      .update({ is_admin: body.isAdmin })
      .eq('id', body.userId)
      .select('id, email, full_name, is_admin, is_super_admin, is_team_member')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 📝 Audit log
    await logAdminAction({
      action: body.isAdmin ? 'promote_admin' : 'demote_admin',
      entity_type: 'admin',
      entity_id: body.userId,
      details: {
        target_email: updatedUser.email,
        new_is_admin: body.isAdmin,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}