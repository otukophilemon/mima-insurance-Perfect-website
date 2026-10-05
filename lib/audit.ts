// lib/audit.ts
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export type AuditAction =
  // Claims
  | 'update_claim_status'
  | 'delete_claim'
  // Quotes
  | 'update_quote_status'
  | 'delete_quote'
  | 'convert_quote_to_policy'
  // Policies
  | 'create_policy'
  | 'delete_policy'
  // Payments
  | 'create_payment'
  | 'update_payment'
  | 'delete_payment'
  // Contacts
  | 'update_contact_status'
  | 'delete_contact'
  // Admin management
  | 'promote_admin'
  | 'demote_admin'
  // Blog / Team (future)
  | 'create_blog_post'
  | 'delete_blog_post'
  | 'create_team_member'
  | 'delete_team_member';

export type AuditEntityType =
  | 'claim'
  | 'quote'
  | 'policy'
  | 'payment'
  | 'contact'
  | 'admin'
  | 'blog_post'
  | 'team_member';

interface LogAuditParams {
  action: AuditAction;
  entity_type: AuditEntityType;
  entity_id?: string | number | null;
  details?: Record<string, any>;
}

/**
 * Log an admin action to the audit table.
 *
 * Fire-and-forget — never throws. If logging fails, we log to console
 * and continue. The original admin action should never be blocked by
 * an audit failure.
 *
 * Usage from an admin API route:
 *   await logAdminAction({
 *     action: 'update_claim_status',
 *     entity_type: 'claim',
 *     entity_id: claim.id,
 *     details: { old_status: 'submitted', new_status: 'under_review' }
 *   });
 */
export async function logAdminAction(params: LogAuditParams): Promise<void> {
  try {
    // 1. Get current admin's identity
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('⚠️ Audit log skipped — no authenticated user');
      return;
    }

    // 2. Insert the audit record
    const { error } = await adminSupabase.from('admin_audit_log').insert([
      {
        admin_id: user.id,
        admin_email: user.email || 'unknown',
        action: params.action,
        entity_type: params.entity_type,
        entity_id: params.entity_id ? String(params.entity_id) : null,
        details: params.details || null,
      },
    ]);

    if (error) {
      console.error('❌ Audit log insert error:', error);
      return;
    }

    // Dev-only visibility
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `📝 Audit: ${params.action} on ${params.entity_type}${params.entity_id ? ` #${params.entity_id}` : ''}`
      );
    }
  } catch (error) {
    // Never throw — audit failures should never break the actual action
    console.error('❌ Audit log unexpected error:', error);
  }
}