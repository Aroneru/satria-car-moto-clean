'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Briefcase, MessageSquare, Image, Users, Phone, Globe, LogOut, ClipboardList, Wallet, FileText, Activity } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
const logo = '/images/logo.png';

export function Dashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
      setIsLoggingOut(false);
      return;
    }

    router.replace('/auth/login');
    router.refresh();
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/dashboard/queue', label: 'Queue Management', icon: <ClipboardList className="w-5 h-5" /> },
    { path: '/dashboard/financial', label: 'Financial', icon: <Wallet className="w-5 h-5" /> },
    { path: '/dashboard/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { path: '/dashboard/services', label: 'Services', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/dashboard/testimonials', label: 'Testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/dashboard/gallery', label: 'Gallery', icon: <Image className="w-5 h-5" /> },
    { path: '/dashboard/team', label: 'Team', icon: <Users className="w-5 h-5" /> },
    { path: '/dashboard/contact', label: 'Contact Info', icon: <Phone className="w-5 h-5" /> },
    { path: '/dashboard/audit-logs', label: 'Audit Logs', icon: <Activity className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D1D1D] text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Satria Logo" className="h-10 w-10" />
            <div>
              <h1 className="font-bold text-lg text-[#FCDE04]">Satria Admin</h1>
              <p className="text-xs text-gray-400">Management Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#FCDE04] text-[#1D1D1D]'
                        : 'text-gray-300 hover:bg-[#2D2D2D] hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <Link
             href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[#2D2D2D] hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">View Website</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b">
          <div className="px-8 py-6">
            <h2 className="text-2xl font-bold text-[#1D1D1D]">
              {menuItems.find((item) => item.path === pathname)?.label || 'Dashboard'}
            </h2>
            <p className="text-gray-600 mt-1">Manage your website content</p>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}