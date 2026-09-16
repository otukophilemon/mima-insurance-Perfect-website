// app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/blog
 * Returns all published blog posts (public, no auth needed).
 */
export async function GET() {
  try {
    const { data: posts, error } = await publicSupabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, featured_image, category, author_name, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Blog fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
