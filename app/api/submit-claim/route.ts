// app/api/submit-claim/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendClaimNotification, sendClaimAutoReply } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.tracking_number ||
      !body.claim_type ||
      !body.full_name ||
      !body.email
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('claims')
      .insert([body])
      .select();

    if (error) {
      console.error('Supabase claim insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Send emails
    try {
      await Promise.all([
        sendClaimNotification({
          tracking_number: body.tracking_number,
          claim_type: body.claim_type,
          incident_date: body.incident_date,
          incident_description: body.incident_description,
          estimated_value: body.estimated_value,
          full_name: body.full_name,
          email: body.email,
          phone: body.phone,
          policy_number: body.policy_number,
        }),
        sendClaimAutoReply({
          full_name: body.full_name,
          email: body.email,
          tracking_number: body.tracking_number,
          claim_type: body.claim_type,
        }),
      ]);
    } catch (emailError) {
      console.error('Email sending failed (data was saved):', emailError);
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}