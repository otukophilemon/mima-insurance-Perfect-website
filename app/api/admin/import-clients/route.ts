// app/api/admin/import-clients/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';
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

interface ImportRow {
  full_name: string;
  email: string;
  phone?: string;
}

interface ImportResult {
  email: string;
  full_name: string;
  status: 'created' | 'updated' | 'skipped' | 'failed';
  reason?: string;
}

/**
 * POST /api/admin/import-clients
 *
 * Body: { rows: ImportRow[], onExisting: 'skip' | 'update' }
 *
 * For each row:
 *  1. Validate email
 *  2. Check if user exists in user_profiles (by email)
 *  3. If exists:
 *     - 'skip' → mark as skipped
 *     - 'update' → update full_name and phone
 *  4. If not exists:
 *     - Create auth user (random temp password)
 *     - Insert into user_profiles
 *     - Send password reset email so they can set their own password
 *  5. Collect results and return summary
 */
export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const rows: ImportRow[] = body.rows || [];
    const onExisting: 'skip' | 'update' = body.onExisting === 'update' ? 'update' : 'skip';

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'No rows provided' }, { status: 400 });
    }

    if (rows.length > 500) {
      return NextResponse.json(
        { error: 'Maximum 500 rows per import. Split into smaller files.' },
        { status: 400 }
      );
    }

    const results: ImportResult[] = [];

        // Pre-fetch all existing profiles to speed up lookups
    const emails = rows.map((r) => r.email?.toLowerCase().trim()).filter(Boolean);

    // user_profiles is the source of truth — plus we'll check auth if needed
    const { data: existingProfiles } = await adminSupabase
      .from('user_profiles')
      .select('id, email, full_name, phone')
      .in('email', emails);

    const existingMap = new Map(
      (existingProfiles || []).map((p) => [p.email.toLowerCase(), p])
    );

    // Get redirect base URL for reset links
    const origin =
      request.headers.get('origin') ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://mima-insurance-perfect-website-ashen.vercel.app';

    for (const row of rows) {
      const email = row.email?.toLowerCase().trim();
      const full_name = row.full_name?.trim() || '';
      const phone = row.phone?.trim() || null;

      // Validate
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.push({
          email: email || '(missing)',
          full_name,
          status: 'failed',
          reason: 'Invalid or missing email',
        });
        continue;
      }

      if (!full_name) {
        results.push({
          email,
          full_name: '',
          status: 'failed',
          reason: 'Missing full name',
        });
        continue;
      }

      // Existing user
      const existing = existingMap.get(email);
      if (existing) {
        if (onExisting === 'skip') {
          results.push({
            email,
            full_name,
            status: 'skipped',
            reason: 'Already exists (skipped)',
          });
          continue;
        }

        // Update existing profile
        const { error: updateError } = await adminSupabase
          .from('user_profiles')
          .update({ full_name, phone })
          .eq('id', existing.id);

        if (updateError) {
          results.push({
            email,
            full_name,
            status: 'failed',
            reason: `Update failed: ${updateError.message}`,
          });
        } else {
          results.push({
            email,
            full_name,
            status: 'updated',
          });
        }
        continue;
      }

      // Create new auth user
      // Generate a temporary random password (user will reset it)
      const tempPassword =
        Math.random().toString(36).slice(-12) +
        Math.random().toString(36).slice(-12).toUpperCase() +
        '!9';

      const { data: authUser, error: authError } =
        await adminSupabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name, phone },
        });

            if (authError || !authUser?.user) {
        // Handle "already registered" gracefully
        if (
          authError?.message?.toLowerCase().includes('already') ||
          authError?.message?.toLowerCase().includes('exists')
        ) {
          results.push({
            email,
            full_name,
            status: 'failed',
            reason: 'Auth account already exists but no profile found. Use "Update existing" mode or check Supabase auth manually.',
          });
        } else {
          results.push({
            email,
            full_name,
            status: 'failed',
            reason: authError?.message || 'Auth creation failed',
          });
        }
        continue;
      }
        // Upsert into user_profiles (handles Supabase's auto-created trigger row)
      const { error: profileError } = await adminSupabase
        .from('user_profiles')
        .upsert(
          {
            id: authUser.user.id,
            email,
            full_name,
            phone,
            is_admin: false,
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        results.push({
          email,
          full_name,
          status: 'failed',
          reason: `Profile upsert failed: ${profileError.message}`,
        });
        continue;
      }

      // Trigger password reset email (fire and forget)
      try {
        await adminSupabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/reset-password`,
        });
      } catch (resetErr) {
        console.warn(`Reset email failed for ${email}:`, resetErr);
        // Don't fail the import — user can still request a reset manually
      }

      results.push({
        email,
        full_name,
        status: 'created',
      });
    }

    // Build summary
    const summary = {
      total: results.length,
      created: results.filter((r) => r.status === 'created').length,
      updated: results.filter((r) => r.status === 'updated').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      failed: results.filter((r) => r.status === 'failed').length,
    };

    // Audit log
    await logAdminAction({
      action: 'create_policy' as any, // reuse closest action type — we can add 'import_clients' later
      entity_type: 'policy' as any,
      entity_id: 'bulk-import',
      details: {
        type: 'client_import',
        on_existing: onExisting,
        summary,
      },
    });

    return NextResponse.json({
      success: true,
      summary,
      results,
    });
  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}