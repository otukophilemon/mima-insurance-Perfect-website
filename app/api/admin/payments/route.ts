// app/api/admin/payments/route.ts
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

/**
 * GET /api/admin/payments
 * List all payments with user + policy info.
 */
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: payments, error } = await adminSupabase
      .from('payments')
      .select('*')
      .order('paid_at', { ascending: false });

    if (error) {
      console.error('Payments fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch user profiles + policies for enrichment
    const userIds = [...new Set((payments || []).map((p) => p.user_id))];
    const policyIds = (payments || [])
      .map((p) => p.policy_id)
      .filter((id): id is number => id !== null);

    const [{ data: profiles }, { data: policies }] = await Promise.all([
      adminSupabase
        .from('user_profiles')
        .select('id, email, full_name')
        .in('id', userIds),
      policyIds.length > 0
        ? adminSupabase
            .from('policies')
            .select('id, policy_number, policy_type')
            .in('id', policyIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.id, p])
    );
    const policyMap = new Map(
      (policies || []).map((p: any) => [p.id, p])
    );

    const enriched = (payments || []).map((p) => ({
      ...p,
      user_profiles: profileMap.get(p.user_id) || null,
      policy: p.policy_id ? policyMap.get(p.policy_id) || null : null,
    }));

    return NextResponse.json({ payments: enriched });
  } catch (error) {
    console.error('GET /api/admin/payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/payments
 * Create a new payment record.
 * Body: { client_email, policy_id?, amount, method, reference?, status?, paid_at?, notes? }
 */
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.client_email || !body.amount) {
      return NextResponse.json(
        { error: 'client_email and amount are required' },
        { status: 400 }
      );
    }

    // Look up client by email
    const { data: client, error: clientError } = await adminSupabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', body.client_email.toLowerCase().trim())
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: `No client found with email: ${body.client_email}` },
        { status: 404 }
      );
    }

    const { data: payment, error } = await adminSupabase
      .from('payments')
      .insert([
        {
          user_id: client.id,
          policy_id: body.policy_id ? parseInt(body.policy_id) : null,
          amount: parseFloat(body.amount),
          currency: body.currency || 'KES',
          method: body.method || 'mpesa',
          reference: body.reference || null,
          status: body.status || 'completed',
          paid_at: body.paid_at || new Date().toISOString(),
          notes: body.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Payment insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}