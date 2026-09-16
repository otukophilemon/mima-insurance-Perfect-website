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
    { url: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
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

  // Fetch blog posts from Supabase
  let blogPages: { url: string; priority: number; changeFrequency: 'weekly' }[] = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

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

  return [...staticPages, ...servicePages, ...blogPages].map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}