// app/api/admin/quotes/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { sendQuoteStatusUpdate } from '@/lib/email';

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
 * GET /api/admin/quotes/:id
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

    const { data: quote, error } = await adminSupabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/quotes/:id
 * Update quote status + notify client by email.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔵 PUT /api/admin/quotes/[id] — starting');

  try {
    const admin = await verifyAdmin();
    if (!admin) {
      console.log('🔴 Admin verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    console.log('🔵 Quote ID:', id);

    const body = await request.json();
    console.log('🔵 Request body:', body);

    if (!body.status) {
      console.log('🔴 Missing status');
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    // Fetch previous status
    console.log('🔵 Fetching previous status...');
    const { data: previous, error: prevError } = await adminSupabase
      .from('quotes')
      .select('status')
      .eq('id', id)
      .maybeSingle();

    if (prevError) console.error('🔴 Error fetching previous:', prevError);
    console.log('🔵 Previous status:', previous?.status);

    // Update
    console.log('🔵 Updating quote...');
    const { data: quote, error } = await adminSupabase
      .from('quotes')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('🔴 Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Quote updated:', quote.id, '→', quote.status);

    // Email — fully isolated
    if (
      quote &&
      previous?.status !== quote.status &&
      quote.email &&
      quote.full_name
    ) {
      console.log('📧 Sending email to:', quote.email);
      try {
        await sendQuoteStatusUpdate({
          email: quote.email,
          full_name: quote.full_name,
          insurance_type: quote.insurance_type,
          new_status: quote.status,
          quote_id: quote.id,
        });
        console.log('✅ Email sent successfully');
      } catch (emailError: any) {
        console.error('❌ EMAIL FAILED — status was still updated');
        console.error('❌ Error name:', emailError?.name);
        console.error('❌ Error message:', emailError?.message);
        console.error('❌ Error details:', JSON.stringify(emailError?.response?.body || {}, null, 2));
      }
    } else {
      console.log('ℹ️ Skipped email. Reasons:');
      console.log('   hasQuote:', !!quote);
      console.log('   statusChanged:', previous?.status !== quote?.status);
      console.log('   hasEmail:', !!quote?.email);
      console.log('   hasName:', !!quote?.full_name);
    }

    console.log('✅ PUT completed successfully');
    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error('🔴 UNCAUGHT ERROR in PUT:');
    console.error('🔴 Error name:', error?.name);
    console.error('🔴 Error message:', error?.message);
    console.error('🔴 Error stack:', error?.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/quotes/:id
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

    const { error } = await adminSupabase
      .from('quotes')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}