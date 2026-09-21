// app/api/track/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/track?number=MIMA-XXXXXX
 * Public endpoint — no auth required.
 * Returns LIMITED claim info for tracking (no PII beyond masked name).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number')?.trim();

    if (!number) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    if (number.length < 4) {
      return NextResponse.json(
        { error: 'Tracking number is too short' },
        { status: 400 }
      );
    }

    const { data: claim, error } = await adminSupabase
      .from('claims')
      .select(
        'tracking_number, claim_type, incident_date, status, created_at, full_name'
      )
      .ilike('tracking_number', number)
      .maybeSingle();

    if (error) {
      console.error('Track fetch error:', error);
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
    }

    if (!claim) {
      return NextResponse.json(
        { error: 'No claim found with that tracking number' },
        { status: 404 }
      );
    }

    // Mask claimant name for privacy: "Otuko Philemon" -> "O*** P***"
    const maskedName = maskName(claim.full_name);

    return NextResponse.json({
      claim: {
        tracking_number: claim.tracking_number,
        claim_type: claim.claim_type,
        incident_date: claim.incident_date,
        status: claim.status,
        created_at: claim.created_at,
        claimant_name: maskedName,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function maskName(name: string | null): string {
  if (!name) return '—';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + '***')
    .join(' ');
}