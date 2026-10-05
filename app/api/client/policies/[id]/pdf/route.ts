// app/api/client/policies/[id]/pdf/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
import { generatePolicyPdf } from '@/lib/pdf';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

/**
 * GET /api/client/policies/:id/pdf
 *
 * Generates and streams a policy certificate PDF.
 * Only the owner of the policy (or an admin) can download.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Auth ──────────────────────────────────────────────
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const policyId = parseInt(id, 10);
    if (isNaN(policyId)) {
      return NextResponse.json({ error: 'Invalid policy ID' }, { status: 400 });
    }

    // ── Fetch policy ──────────────────────────────────────
    const { data: policy, error: policyError } = await adminSupabase
      .from('policies')
      .select(
        'id, user_id, policy_number, policy_type, coverage_description, annual_premium, start_date, expiry_date, status, notes, created_at'
      )
      .eq('id', policyId)
      .single();

    if (policyError || !policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
    }

    // ── Authorization: must be owner OR admin ─────────────
    const isOwner = policy.user_id === user.id;

    let isAdmin = false;
    if (!isOwner) {
      const { data: profile } = await adminSupabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      isAdmin = profile?.is_admin === true;
    }

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Fetch client profile ──────────────────────────────
    const { data: clientProfile } = await adminSupabase
      .from('user_profiles')
      .select('full_name, email, phone')
      .eq('id', policy.user_id)
      .single();

    if (!clientProfile) {
      return NextResponse.json(
        { error: 'Client profile not found' },
        { status: 404 }
      );
    }

    // ── Generate PDF ──────────────────────────────────────
    const pdfBuffer = await generatePolicyPdf({
      policy: {
        policy_number: policy.policy_number,
        policy_type: policy.policy_type,
        coverage_description: policy.coverage_description,
        annual_premium: Number(policy.annual_premium),
        start_date: policy.start_date,
        expiry_date: policy.expiry_date,
        status: policy.status,
        notes: policy.notes,
        created_at: policy.created_at,
      },
      client: {
        full_name: clientProfile.full_name || 'Valued Client',
        email: clientProfile.email,
        phone: clientProfile.phone,
      },
    });

        // ── Stream as downloadable PDF ────────────────────────
    const safeFileName = `${policy.policy_number.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`;

    // Convert Node Buffer → Uint8Array for BodyInit compatibility
    const pdfBytes = new Uint8Array(pdfBuffer);

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/client/policies/[id]/pdf error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}