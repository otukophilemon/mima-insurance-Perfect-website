// app/sitemap.ts
import { MetadataRoute } from 'next';
import { SERVICES } from '@/data/services';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://mima-insurance-perfect-website-ashen.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/team', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/calculators', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/calculators/motor', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/calculators/health', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/calculators/travel', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/contact', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/quote', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/claim', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/dashboard', priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  // Service detail pages
  const servicePages = SERVICES.map((service) => ({
    url: `/services/${service.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
  }));

  // Fetch blog posts and team members from Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Blog posts
  let blogPages: { url: string; priority: number; changeFrequency: 'weekly' }[] = [];
  try {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false });

    blogPages = (posts || []).map((post) => ({
      url: `/blog/${post.slug}`,
      priority: 0.7,
      changeFrequency: 'weekly' as const,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Team members
  let teamPages: { url: string; priority: number; changeFrequency: 'monthly' }[] = [];
  try {
    const { data: members } = await supabase
      .from('user_profiles')
      .select('team_slug')
      .eq('is_team_member', true)
      .eq('team_active', true)
      .not('team_slug', 'is', null)
      .order('team_display_order', { ascending: true });

    teamPages = (members || []).map((member) => ({
      url: `/team/${member.team_slug}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    }));
  } catch (error) {
    console.error('Error fetching team members for sitemap:', error);
  }

  return [
    ...staticPages,
    ...servicePages,
    ...blogPages,
    ...teamPages,
  ].map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}