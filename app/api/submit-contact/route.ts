// app/api/submit-contact/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendContactNotification, sendContactAutoReply } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([body])
      .select();

    if (error) {
      console.error('Supabase contact insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Send emails
    try {
      await Promise.all([
        sendContactNotification({
          name: body.name,
          email: body.email,
          phone: body.phone,
          subject: body.subject,
          message: body.message,
        }),
        sendContactAutoReply({
          name: body.name,
          email: body.email,
          subject: body.subject,
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