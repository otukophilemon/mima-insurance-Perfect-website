// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

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

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: profiles, error: profilesError } = await adminSupabase
      .from('user_profiles')
      .select('id, email, full_name, phone, is_admin, created_at')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
      return NextResponse.json({ error: profilesError.message }, { status: 500 });
    }

    const { data: policies } = await adminSupabase
      .from('policies')
      .select('user_id, status');

    const policyCounts = new Map<string, { total: number; active: number }>();
    (policies || []).forEach((policy) => {
      const existing = policyCounts.get(policy.user_id) || { total: 0, active: 0 };
      existing.total += 1;
      if (policy.status === 'active') existing.active += 1;
      policyCounts.set(policy.user_id, existing);
    });

    const usersWithCounts = (profiles || []).map((profile) => ({
      ...profile,
      policy_count: policyCounts.get(profile.id)?.total || 0,
      active_policy_count: policyCounts.get(profile.id)?.active || 0,
    }));

    return NextResponse.json({ users: usersWithCounts });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}