// app/api/admin/quotes/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { sendQuoteStatusUpdate } from '@/lib/email';
import { logAdminAction } from '@/lib/audit';

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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔵 PUT /api/admin/quotes/[id] — starting');

  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const { data: previous, error: prevError } = await adminSupabase
      .from('quotes')
      .select('status')
      .eq('id', id)
      .maybeSingle();

    if (prevError) console.error('🔴 Error fetching previous:', prevError);

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

    // 📝 Audit log
    await logAdminAction({
      action: 'update_quote_status',
      entity_type: 'quote',
      entity_id: quote.id,
      details: {
        insurance_type: quote.insurance_type,
        full_name: quote.full_name,
        old_status: previous?.status || 'unknown',
        new_status: quote.status,
      },
    });

    // Email — isolated
    if (
      quote &&
      previous?.status !== quote.status &&
      quote.email &&
      quote.full_name
    ) {
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
        console.error('❌ Error details:', JSON.stringify(emailError?.response?.body || {}, null, 2));
      }
    }

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error('🔴 UNCAUGHT ERROR in PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

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

    // 📝 Audit log
    await logAdminAction({
      action: 'delete_quote',
      entity_type: 'quote',
      entity_id: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}