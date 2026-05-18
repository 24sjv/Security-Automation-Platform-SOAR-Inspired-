'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { LayoutDashboard, Bell, TriangleAlert as AlertTriangle, BookOpen, Shield, Settings, LogOut, ChevronRight, Activity, Database, Users, Search } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/alerts', label: 'Alerts', icon: Bell, badge: 'live' },
  { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { href: '/playbooks', label: 'Playbooks', icon: BookOpen },
  { href: '/threat-intel', label: 'Threat Intel', icon: Database },
  { href: '/analytics', label: 'Analytics', icon: Activity },
];

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r border-border/50 bg-[hsl(222,47%,5%)] z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border/40">
        <div className="relative w-7 h-7">
          <div className="absolute inset-0 rounded-md bg-cyan-500/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 live-dot" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight text-white">SentinelFlow</span>
          <div className="flex items-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 live-dot" />
            <span className="text-[10px] text-cyan-400/80 font-medium uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <span className="ml-auto text-[10px] text-slate-600 border border-slate-700 rounded px-1">⌘K</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Operations</p>
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400')} />
              <span>{label}</span>
              {badge === 'live' && (
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 live-dot" />
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-cyan-500" />}
            </Link>
          );
        })}

        <p className="px-3 py-1.5 mt-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">System</p>
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border/40 p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-white/[0.04] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? profile?.email?.charAt(0)?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{profile?.full_name || 'Analyst'}</p>
            <p className="text-[10px] text-slate-500 truncate capitalize">{profile?.role ?? 'analyst'}</p>
          </div>
          <button
            onClick={signOut}
            className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
