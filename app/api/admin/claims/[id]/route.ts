// app/api/admin/claims/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { sendClaimStatusUpdate } from '@/lib/email';
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

    const { data: claim, error } = await adminSupabase
      .from('claims')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // Fetch linked documents
    const { data: documents } = await adminSupabase
      .from('claim_documents')
      .select('id, file_name, file_path, file_size, file_type, uploaded_at')
      .eq('claim_id', id)
      .order('uploaded_at', { ascending: true });

    // Generate signed URLs (1 hour)
    const documentsWithUrls = await Promise.all(
      (documents || []).map(async (doc) => {
        try {
          const { data: signed } = await adminSupabase.storage
            .from('claim-documents')
            .createSignedUrl(doc.file_path, 3600);
          return { ...doc, signed_url: signed?.signedUrl || null };
        } catch (err) {
          console.error('Signed URL error for', doc.file_path, err);
          return { ...doc, signed_url: null };
        }
      })
    );

    return NextResponse.json({ claim, documents: documentsWithUrls });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const { data: previous, error: prevError } = await adminSupabase
      .from('claims')
      .select('status')
      .eq('id', id)
      .maybeSingle();

    if (prevError) console.error('🔴 Error fetching previous:', prevError);

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

    // 📝 Audit log
    await logAdminAction({
      action: 'update_claim_status',
      entity_type: 'claim',
      entity_id: claim.id,
      details: {
        tracking_number: claim.tracking_number,
        old_status: previous?.status || 'unknown',
        new_status: claim.status,
      },
    });

    // Email — isolated
    if (
      claim &&
      previous?.status !== claim.status &&
      claim.email &&
      claim.full_name
    ) {
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
        console.error('❌ Error details:', JSON.stringify(emailError?.response?.body || {}, null, 2));
      }
    }

    return NextResponse.json({ success: true, claim });
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
      .from('claims')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 📝 Audit log
    await logAdminAction({
      action: 'delete_claim',
      entity_type: 'claim',
      entity_id: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}