// scripts/migrate-agents.ts
/**
 * One-time migration script: migrates agents from `agents` table
 * into `user_profiles` with team member data + admin flags.
 *
 * Run with: npx tsx scripts/migrate-agents.ts
 *
 * Prerequisites:
 *   - PHASE 1 schema migration already applied
 *   - `agents` table still exists
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY');
  process.exit(1);
}

const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

// Which agents get which placeholder emails
// (Otuko already handled via SQL — we skip him)
const AGENT_EMAIL_MAP: Record<string, string> = {
  'otuko-philemon': 'otukophilemon88@gmail.com',
  'sarah-wanjiku': 'sarah@mimainsure.local',
  'david-kiprop': 'david@mimainsure.local',
  'grace-achieng': 'grace@mimainsure.local',
};

async function migrate() {
  console.log('🚀 Starting agent migration...\n');

  // 1. Fetch all agents
  const { data: agents, error: agentsError } = await adminSupabase
    .from('agents')
    .select('*')
    .order('display_order', { ascending: true });

  if (agentsError || !agents) {
    console.error('❌ Failed to fetch agents:', agentsError);
    process.exit(1);
  }

  console.log(`📋 Found ${agents.length} agents\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const agent of agents) {
    const email = AGENT_EMAIL_MAP[agent.slug];

    if (!email) {
      console.log(`⚠️  Skipping ${agent.name} — no email mapping`);
      skipped++;
      continue;
    }

    console.log(`\n👤 Processing ${agent.name} (${email})`);

    // 2. Check if user already exists in user_profiles
    const { data: existing } = await adminSupabase
      .from('user_profiles')
      .select('id, is_team_member')
      .eq('email', email)
      .maybeSingle();

    const teamData = {
      is_team_member: true,
      is_admin: true, // All team members are admins
      team_slug: agent.slug,
      team_title: agent.title,
      team_bio: agent.bio,
      team_email: agent.email || email,
      team_phone: agent.phone || null,
      team_whatsapp: agent.whatsapp || null,
      team_photo: agent.photo || null,
      team_specialties: agent.specialties || [],
      team_experience_years: agent.experience_years || null,
      team_certifications: agent.certifications || [],
      team_display_order: agent.display_order || 0,
      team_active: agent.active !== false,
    };

    if (existing) {
      // 3a. User exists — just update with team data
      console.log(`   ↳ User already exists, updating team data...`);
      const { error: updateError } = await adminSupabase
        .from('user_profiles')
        .update(teamData)
        .eq('id', existing.id);

      if (updateError) {
        console.error(`   ❌ Update failed: ${updateError.message}`);
        failed++;
      } else {
        console.log(`   ✅ Updated`);
        updated++;
      }
      continue;
    }

    // 3b. User doesn't exist — create auth account + profile
    console.log(`   ↳ Creating new auth account...`);

    // Generate a random temporary password (user resets it later)
    const tempPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12).toUpperCase() +
      '!9A';

    const { data: authData, error: authError } =
      await adminSupabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: agent.name,
          phone: agent.phone || null,
        },
      });

    if (authError || !authData?.user) {
      console.error(`   ❌ Auth creation failed: ${authError?.message}`);
      failed++;
      continue;
    }

    console.log(`   ↳ Auth account created (ID: ${authData.user.id})`);

    // Upsert into user_profiles (in case Supabase auto-created a row)
    const { error: profileError } = await adminSupabase
      .from('user_profiles')
      .upsert(
        {
          id: authData.user.id,
          email,
          full_name: agent.name,
          phone: agent.phone || null,
          ...teamData,
        },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.error(`   ❌ Profile upsert failed: ${profileError.message}`);
      failed++;
      continue;
    }

    console.log(`   ✅ Profile created`);

    // Try sending password reset email
    // NOTE: .local domains cannot receive emails. Reset will fail silently.
    // When MIMA gets real emails, we'll resend resets manually.
    if (!email.endsWith('.local')) {
      try {
        await adminSupabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mima-insurance-perfect-website-ashen.vercel.app'}/reset-password`,
        });
        console.log(`   📧 Password reset email sent`);
      } catch (err) {
        console.warn(`   ⚠️  Reset email failed:`, err);
      }
    } else {
      console.log(`   ℹ️  Skipping reset email (.local placeholder domain)`);
    }

    created++;
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`   Total agents processed: ${agents.length}`);
  console.log(`   ✅ Created:  ${created}`);
  console.log(`   ✅ Updated:  ${updated}`);
  console.log(`   ⏭️  Skipped:  ${skipped}`);
  console.log(`   ❌ Failed:   ${failed}`);
  console.log('='.repeat(50) + '\n');

  if (failed > 0) {
    console.log('⚠️  Some agents failed. Fix issues and re-run the script.\n');
    process.exit(1);
  }

  console.log('✅ Migration complete!\n');
  console.log('Next steps:');
  console.log('  1. Verify data in Supabase → Table Editor → user_profiles');
  console.log('  2. Proceed to Phase 3 (code refactor)\n');
}

migrate().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});