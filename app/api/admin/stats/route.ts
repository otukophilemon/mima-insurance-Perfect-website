// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase-server';

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
 * GET /api/admin/stats
 * Returns all dashboard stats + recent activity + unread counts.
 */
export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // Fetch everything in parallel for speed
    const [
      policiesRes,
      claimsRes,
      quotesRes,
      contactsRes,
      profilesRes,
    ] = await Promise.all([
      adminSupabase.from('policies').select('id, status, expiry_date, user_id'),
      adminSupabase
        .from('claims')
        .select('id, tracking_number, full_name, claim_type, status, created_at')
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('quotes')
        .select('id, full_name, insurance_type, status, created_at')
        .order('created_at', { ascending: false }),
      adminSupabase
        .from('contacts')
        .select('id, name, subject, status, created_at')
        .order('created_at', { ascending: false }),
      adminSupabase.from('user_profiles').select('id, is_admin'),
    ]);

    const policies = policiesRes.data || [];
    const claims = claimsRes.data || [];
    const quotes = quotesRes.data || [];
    const contacts = contactsRes.data || [];
    const profiles = profilesRes.data || [];

    // Policies stats
    const activePolicies = policies.filter((p) => p.status === 'active');
    const expiringSoon = activePolicies.filter((p) => {
      const expiry = new Date(p.expiry_date);
      return expiry >= now && expiry <= thirtyDaysFromNow;
    });

    // Clients stats (non-admin users)
    const totalClients = profiles.filter((p) => !p.is_admin).length;

    // Claims stats
    const newClaims = claims.filter((c) => c.status === 'submitted').length;
    const reviewingClaims = claims.filter(
      (c) => c.status === 'under_review' || c.status === 'reviewing'
    ).length;

    // Quotes stats
    const newQuotes = quotes.filter((q) => q.status === 'new' || !q.status).length;

    // Contacts stats
    const unreadContacts = contacts.filter((c) => c.status === 'new').length;

    // Recent activity — merge the latest 3 from each source
    const activity = [
      ...claims.slice(0, 3).map((c) => ({
        type: 'claim' as const,
        id: c.id,
        title: `${c.claim_type} claim from ${c.full_name}`,
        subtitle: c.tracking_number,
        status: c.status,
        created_at: c.created_at,
      })),
      ...quotes.slice(0, 3).map((q) => ({
        type: 'quote' as const,
        id: q.id,
        title: `${q.insurance_type} quote from ${q.full_name}`,
        subtitle: `Quote #${q.id}`,
        status: q.status || 'new',
        created_at: q.created_at,
      })),
      ...contacts.slice(0, 3).map((c) => ({
        type: 'contact' as const,
        id: c.id,
        title: `Message from ${c.name}`,
        subtitle: c.subject,
        status: c.status,
        created_at: c.created_at,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 8);

    return NextResponse.json({
      policies: {
        total: policies.length,
        active: activePolicies.length,
        expiringSoon: expiringSoon.length,
      },
      clients: {
        total: totalClients,
      },
      claims: {
        total: claims.length,
        new: newClaims,
        reviewing: reviewingClaims,
      },
      quotes: {
        total: quotes.length,
        new: newQuotes,
      },
      contacts: {
        total: contacts.length,
        unread: unreadContacts,
      },
      activity,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}