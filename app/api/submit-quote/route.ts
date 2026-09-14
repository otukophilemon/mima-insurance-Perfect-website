// app/api/submit-quote/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendQuoteNotification, sendQuoteAutoReply } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (
      !body.insurance_type ||
      !body.full_name ||
      !body.email ||
      !body.phone
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('quotes')
      .insert([body])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Send emails (fire-and-forget — don't block response on email failure)
    try {
      await Promise.all([
        sendQuoteNotification({
          insurance_type: body.insurance_type,
          full_name: body.full_name,
          email: body.email,
          phone: body.phone,
          location: body.location,
          age: body.age,
          details: body.details,
        }),
        sendQuoteAutoReply({
          full_name: body.full_name,
          email: body.email,
          insurance_type: body.insurance_type,
        }),
      ]);
    } catch (emailError) {
      // Log email failure but still return success — data was saved
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