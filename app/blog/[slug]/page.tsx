// app/blog/[slug]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category: string;
  author_name: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found | MIMA Insurance Brokers' };
  }

  return {
    title: `${post.title} | MIMA Insurance Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// Simple markdown-to-HTML renderer for headings, bold, and lists
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-bold text-gray-900 mt-10 mb-4">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-3xl md:text-4xl font-bold text-gray-900 mt-10 mb-4">
          {trimmed.replace('# ', '')}
        </h1>
      );
    } else if (trimmed.startsWith('- ')) {
      listItems.push(trimmed.replace('- ', ''));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      const html = trimmed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      elements.push(
        <p
          key={i}
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
  });

  flushList();
  return elements;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Estimate reading time
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero with featured image */}
      <section className="relative">
        {post.featured_image ? (
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e3a8a]/70 to-[#1e3a8a]/40" />
          </div>
        ) : (
          <div className="h-[300px] bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]" />
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-4xl mx-auto px-6 pb-12 text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white mb-4 transition"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#dc2626] text-xs font-semibold text-white">
                <Tag size={12} />
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <User size={16} />
                {post.author_name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {readingTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <article className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Article footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#dc2626] hover:text-[#b91c1c] font-semibold transition"
            >
              <ArrowLeft size={18} />
              Back to All Articles
            </Link>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Covered?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Our team is here to help you find the right insurance solution for
            your needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/60 hover:bg-white/10 text-white font-semibold rounded-full transition-all"
            >
              Talk to a Broker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}