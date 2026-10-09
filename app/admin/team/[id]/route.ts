// app/api/admin/team/[id]/route.ts
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

/**
 * GET /api/admin/team/[id]
 * Returns a single team member.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const { data, error } = await adminSupabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .eq('is_team_member', true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ agent: data });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/team/[id]
 * Update team member details.
 * Only updates team_* fields (never auth/email).
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.full_name = body.name;
    if (body.phone !== undefined) updates.phone = body.phone || null;
    if (body.slug !== undefined) updates.team_slug = body.slug;
    if (body.title !== undefined) updates.team_title = body.title;
    if (body.bio !== undefined) updates.team_bio = body.bio;
    if (body.email_public !== undefined) updates.team_email = body.email_public;
    if (body.whatsapp !== undefined) updates.team_whatsapp = body.whatsapp || null;
    if (body.photo !== undefined) updates.team_photo = body.photo || null;
    if (body.specialties !== undefined) updates.team_specialties = body.specialties;
    if (body.experience_years !== undefined)
      updates.team_experience_years = body.experience_years || null;
    if (body.certifications !== undefined)
      updates.team_certifications = body.certifications;
    if (body.display_order !== undefined)
      updates.team_display_order = body.display_order ?? 0;
    if (body.active !== undefined) updates.team_active = body.active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data: updated, error } = await adminSupabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .eq('is_team_member', true)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 📝 Audit log
    await logAdminAction({
      action: 'create_policy' as any, // TODO: add 'update_team_member' action type
      entity_type: 'policy' as any,
      entity_id: id,
      details: {
        type: 'update_team_member',
        updated_fields: Object.keys(updates),
      },
    });

    return NextResponse.json({ success: true, agent: updated });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/team/[id]
 * Removes a team member.
 * - Deletes user_profiles row (but keeps auth account for audit trail)
 * - OR full delete including auth account if ?hard=true
 *
 * Default: soft delete (unmark team member, keep auth + profile)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const url = new URL(request.url);
    const hardDelete = url.searchParams.get('hard') === 'true';

    // Prevent super admin from deleting themselves
    const { data: target } = await adminSupabase
      .from('user_profiles')
      .select('is_super_admin, email')
      .eq('id', id)
      .single();

    if (target?.is_super_admin) {
      return NextResponse.json(
        { error: 'Super admin accounts cannot be deleted' },
        { status: 400 }
      );
    }

    if (hardDelete) {
      // Full delete: auth account + user_profiles row
      const { error: authError } = await adminSupabase.auth.admin.deleteUser(id);
      if (authError) {
        console.error('Auth delete error:', authError);
      }

      const { error } = await adminSupabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Soft delete: just unmark as team member, keep everything else
      const { error } = await adminSupabase
        .from('user_profiles')
        .update({
          is_team_member: false,
          team_slug: null,
          team_active: false,
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // 📝 Audit log
    await logAdminAction({
      action: 'demote_admin',
      entity_type: 'admin',
      entity_id: id,
      details: {
        type: hardDelete ? 'delete_team_member_hard' : 'delete_team_member_soft',
        target_email: target?.email,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}