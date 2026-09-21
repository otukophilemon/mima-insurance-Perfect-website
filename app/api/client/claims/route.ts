// app/api/client/claims/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/client/claims
 * Returns the current logged-in user's claims.
 * Matches by email since claims table has no user_id column.
 */
export async function GET() {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json({ claims: [] }, { status: 401 });
    }

    const { data: claims, error } = await adminSupabase
      .from('claims')
      .select(
        'id, tracking_number, claim_type, incident_date, incident_description, estimated_value, policy_number, status, created_at'
      )
      .eq('email', user.email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Claims fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ claims: claims || [] });
  } catch (error) {
    console.error('GET /api/client/claims error:', error);
    return NextResponse.json({ claims: [] }, { status: 500 });
  }
}