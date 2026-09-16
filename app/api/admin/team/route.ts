// app/api/admin/team/route.ts
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

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();

    if (!body.name || !body.slug || !body.title || !body.bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: agent, error } = await adminSupabase
      .from('agents')
      .insert([{
        slug: body.slug.toLowerCase().trim(),
        name: body.name,
        title: body.title,
        bio: body.bio,
        email: body.email || null,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        photo: body.photo || null,
        specialties: body.specialties || [],
        experience_years: body.experience_years || null,
        certifications: body.certifications || [],
        display_order: body.display_order || 0,
        active: body.active !== false,
      }])
      .select()
      .single();

    if (error) {
      console.error('Agent insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, agent }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: agents, error } = await adminSupabase
      .from('agents')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ agents: agents || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}