// app/api/client/payments/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/client/payments
 * Returns the current user's payments (with policy info joined).
 */
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ payments: [] }, { status: 401 });
    }

    const { data: payments, error } = await adminSupabase
      .from('payments')
      .select(
        'id, amount, currency, method, reference, status, paid_at, notes, policy_id'
      )
      .eq('user_id', user.id)
      .order('paid_at', { ascending: false });

    if (error) {
      console.error('Payments fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch policy numbers for linked payments
    const policyIds = (payments || [])
      .map((p) => p.policy_id)
      .filter((id): id is number => id !== null);

    let policyMap = new Map<number, { policy_number: string; policy_type: string }>();
    if (policyIds.length > 0) {
      const { data: policies } = await adminSupabase
        .from('policies')
        .select('id, policy_number, policy_type')
        .in('id', policyIds);

      policyMap = new Map(
        (policies || []).map((p) => [
          p.id,
          { policy_number: p.policy_number, policy_type: p.policy_type },
        ])
      );
    }

    const enriched = (payments || []).map((p) => ({
      ...p,
      policy: p.policy_id ? policyMap.get(p.policy_id) || null : null,
    }));

    return NextResponse.json({ payments: enriched });
  } catch (error) {
    console.error('GET /api/client/payments error:', error);
    return NextResponse.json({ payments: [] }, { status: 500 });
  }
}