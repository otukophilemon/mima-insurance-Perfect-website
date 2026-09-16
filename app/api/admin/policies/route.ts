// app/api/admin/policies/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return profile?.is_admin ? user : null;
}

// ============================================
// POST: Create a new policy
// ============================================
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    if (
      !body.client_email ||
      !body.policy_number ||
      !body.policy_type ||
      !body.coverage_description ||
      !body.annual_premium ||
      !body.start_date ||
      !body.expiry_date
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Look up client by email
    const { data: clientProfile, error: profileError } = await adminSupabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', body.client_email.toLowerCase().trim())
      .single();

    if (profileError || !clientProfile) {
      return NextResponse.json(
        { error: `No user found with email: ${body.client_email}` },
        { status: 404 }
      );
    }

    // Insert policy
    const { data: policy, error: policyError } = await adminSupabase
      .from('policies')
      .insert([
        {
          user_id: clientProfile.id,
          policy_number: body.policy_number,
          policy_type: body.policy_type,
          coverage_description: body.coverage_description,
          annual_premium: parseFloat(body.annual_premium),
          start_date: body.start_date,
          expiry_date: body.expiry_date,
          status: body.status || 'active',
          notes: body.notes || null,
        },
      ])
      .select()
      .single();

    if (policyError) {
      console.error('Policy insert error:', policyError);
      return NextResponse.json({ error: policyError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, policy }, { status: 201 });
  } catch (error) {
    console.error('POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ============================================
// GET: List all policies with client info
// ============================================
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch all policies
    const { data: policies, error: policiesError } = await adminSupabase
      .from('policies')
      .select('*')
      .order('created_at', { ascending: false });

    if (policiesError) {
      console.error('Policies fetch error:', policiesError);
      return NextResponse.json({ error: policiesError.message }, { status: 500 });
    }

    // Fetch all user profiles separately
    const { data: profiles, error: profilesError } = await adminSupabase
      .from('user_profiles')
      .select('id, email, full_name');

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError);
    }

    // Merge profiles into policies
    const profileMap = new Map(
      (profiles || []).map((p) => [
        p.id,
        { email: p.email, full_name: p.full_name },
      ])
    );

    const policiesWithClients = (policies || []).map((policy) => ({
      ...policy,
      user_profiles: profileMap.get(policy.user_id) || null,
    }));

    return NextResponse.json({ policies: policiesWithClients });
  } catch (error) {
    console.error('GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}