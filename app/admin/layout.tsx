// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Home,
  Menu,
  X,
  Bell,
  BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-browser';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/policies', label: 'Policies', icon: FileText },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/users', label: 'Clients', icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser({ email: user.email || '' });
    };
    load();
  }, []);

    const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mima_user_info');
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0f172a] text-white">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-lg p-1">
              <Image
                src="/images/mima-logo.png"
                alt="MIMA Insurance"
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <div className="font-bold text-sm">MIMA Insurance</div>
              <div className="text-[10px] text-gray-400 tracking-widest">
                ADMIN PANEL
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#dc2626] text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors text-sm"
          >
            <Home size={16} />
            <span>Back to Site</span>
          </Link>

          {user && (
            <div className="px-4 py-2 text-xs text-gray-400 truncate">
              {user.email}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f172a] text-white flex items-center justify-between p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <div className="font-bold text-sm">Admin Panel</div>
        <div className="w-10" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-[#0f172a] text-white flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="font-bold">MIMA Admin</div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
                  >
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}