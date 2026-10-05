// app/api/cron/policy-reminders/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sendPolicyExpiryReminder30Days,
  sendPolicyExpiryReminder7Days,
} from '@/lib/email';

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

// Simple secret check so only Vercel can trigger this
const CRON_SECRET = process.env.CRON_SECRET;

/**
 * GET /api/cron/policy-reminders
 *
 * Called daily by Vercel Cron. Finds policies expiring in exactly 30 or 7 days
 * and sends branded reminder emails to their owners.
 *
 * Protection: Vercel sends an `Authorization: Bearer <CRON_SECRET>` header.
 * We reject any request without it (unless CRON_SECRET is unset — dev mode).
 */
export async function GET(request: Request) {
  try {
    // ── Auth check ────────────────────────────────────────────
    // In production, require the CRON_SECRET header from Vercel.
    // In development (CRON_SECRET unset), allow manual triggering.
    if (CRON_SECRET) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${CRON_SECRET}`) {
        console.warn('Cron: unauthorized request');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();
    console.log(`🕐 Cron policy-reminders started at ${now.toISOString()}`);

    // ── Date windows ──────────────────────────────────────────
    // We match policies whose expiry_date falls exactly N days from today.
    // Using date strings (YYYY-MM-DD) avoids timezone drift.
    const targetDate30 = daysFromNow(30);
    const targetDate7 = daysFromNow(7);

    console.log(`📅 Looking for expiries on ${targetDate30} (30d) and ${targetDate7} (7d)`);

    // ── Fetch due policies ────────────────────────────────────
    const [policies30Res, policies7Res] = await Promise.all([
      adminSupabase
        .from('policies')
        .select('id, user_id, policy_number, policy_type, expiry_date, annual_premium, status')
        .eq('expiry_date', targetDate30)
        .eq('status', 'active'),
      adminSupabase
        .from('policies')
        .select('id, user_id, policy_number, policy_type, expiry_date, annual_premium, status')
        .eq('expiry_date', targetDate7)
        .eq('status', 'active'),
    ]);

    const policies30 = policies30Res.data || [];
    const policies7 = policies7Res.data || [];

    console.log(`📋 Found ${policies30.length} policies at 30 days, ${policies7.length} at 7 days`);

    // ── Fetch user profiles for those policies ───────────────
    const allUserIds = [
      ...new Set([
        ...policies30.map((p) => p.user_id),
        ...policies7.map((p) => p.user_id),
      ]),
    ];

    let profileMap = new Map<
      string,
      { email: string | null; full_name: string | null }
    >();

    if (allUserIds.length > 0) {
      const { data: profiles } = await adminSupabase
        .from('user_profiles')
        .select('id, email, full_name')
        .in('id', allUserIds);

      profileMap = new Map(
        (profiles || []).map((p) => [
          p.id,
          { email: p.email, full_name: p.full_name },
        ])
      );
    }

    // ── Send 30-day reminders ─────────────────────────────────
    const results30 = { sent: 0, failed: 0, skipped: 0 };
    for (const policy of policies30) {
      const profile = profileMap.get(policy.user_id);
      if (!profile?.email || !profile?.full_name) {
        console.warn(`⚠️ Skipping 30d reminder for policy ${policy.policy_number} — no profile`);
        results30.skipped++;
        continue;
      }

      try {
        await sendPolicyExpiryReminder30Days({
          email: profile.email,
          full_name: profile.full_name,
          policy_number: policy.policy_number,
          policy_type: policy.policy_type,
          expiry_date: policy.expiry_date,
          annual_premium: Number(policy.annual_premium),
        });
        results30.sent++;
        console.log(`✅ 30d reminder sent: ${policy.policy_number} → ${profile.email}`);
      } catch (err) {
        console.error(`❌ 30d reminder failed for ${policy.policy_number}:`, err);
        results30.failed++;
      }
    }

    // ── Send 7-day reminders ──────────────────────────────────
    const results7 = { sent: 0, failed: 0, skipped: 0 };
    for (const policy of policies7) {
      const profile = profileMap.get(policy.user_id);
      if (!profile?.email || !profile?.full_name) {
        console.warn(`⚠️ Skipping 7d reminder for policy ${policy.policy_number} — no profile`);
        results7.skipped++;
        continue;
      }

      try {
        await sendPolicyExpiryReminder7Days({
          email: profile.email,
          full_name: profile.full_name,
          policy_number: policy.policy_number,
          policy_type: policy.policy_type,
          expiry_date: policy.expiry_date,
          annual_premium: Number(policy.annual_premium),
        });
        results7.sent++;
        console.log(`✅ 7d reminder sent: ${policy.policy_number} → ${profile.email}`);
      } catch (err) {
        console.error(`❌ 7d reminder failed for ${policy.policy_number}:`, err);
        results7.failed++;
      }
    }

    // ── Done ──────────────────────────────────────────────────
    console.log('✅ Cron policy-reminders completed');

    return NextResponse.json({
      success: true,
      ran_at: now.toISOString(),
      thirty_days: {
        target_date: targetDate30,
        found: policies30.length,
        ...results30,
      },
      seven_days: {
        target_date: targetDate7,
        found: policies7.length,
        ...results7,
      },
    });
  } catch (error) {
    console.error('❌ Cron policy-reminders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Returns YYYY-MM-DD for N days from now (UTC).
 */
function daysFromNow(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}