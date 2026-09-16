// app/api/team/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data: agents, error } = await publicSupabase
      .from('agents')
      .select('id, slug, name, title, bio, email, phone, whatsapp, photo, specialties, experience_years, certifications')
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Agents fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: agents || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}