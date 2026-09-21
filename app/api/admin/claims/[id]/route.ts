// app/api/admin/claims/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { sendClaimStatusUpdate } from '@/lib/email';

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
 * GET /api/admin/claims/:id
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

    const { data: claim, error } = await adminSupabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    return NextResponse.json({ claim });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/claims/:id
 * Update claim status + notify client by email.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔵 PUT /api/admin/claims/[id] — starting');

  try {
    const admin = await verifyAdmin();
    if (!admin) {
      console.log('🔴 Admin verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    console.log('🔵 Claim ID:', id);

    const body = await request.json();
    console.log('🔵 Request body:', body);

    if (!body.status) {
      console.log('🔴 Missing status');
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    // Fetch previous status
    console.log('🔵 Fetching previous status...');
    const { data: previous, error: prevError } = await adminSupabase
      .from('claims')
      .select('status')
      .eq('id', id)
      .maybeSingle();

    if (prevError) console.error('🔴 Error fetching previous:', prevError);
    console.log('🔵 Previous status:', previous?.status);

    // Update
    console.log('🔵 Updating claim...');
    const { data: claim, error } = await adminSupabase
      .from('claims')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('🔴 Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Claim updated:', claim.tracking_number, '→', claim.status);

    // Email — fully isolated so it never breaks the response
    if (
      claim &&
      previous?.status !== claim.status &&
      claim.email &&
      claim.full_name
    ) {
      console.log('📧 Sending email to:', claim.email);
      try {
        await sendClaimStatusUpdate({
          email: claim.email,
          full_name: claim.full_name,
          tracking_number: claim.tracking_number,
          claim_type: claim.claim_type,
          new_status: claim.status,
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
      console.log('   hasClaim:', !!claim);
      console.log('   statusChanged:', previous?.status !== claim?.status);
      console.log('   hasEmail:', !!claim?.email);
      console.log('   hasName:', !!claim?.full_name);
    }

    console.log('✅ PUT completed successfully');
    return NextResponse.json({ success: true, claim });
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
 * DELETE /api/admin/claims/:id
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
      .from('claims')
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