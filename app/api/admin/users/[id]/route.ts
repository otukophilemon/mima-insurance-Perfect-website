// app/api/admin/users/[id]/route.ts
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

    // Fetch the user profile
    const { data: profile, error: profileError } = await adminSupabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch their policies
    const { data: policies } = await adminSupabase
      .from('policies')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    // Fetch their claims (matching by email)
    const { data: claims } = await adminSupabase
      .from('claims')
      .select('*')
      .eq('email', profile.email)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      user: profile,
      policies: policies || [],
      claims: claims || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}