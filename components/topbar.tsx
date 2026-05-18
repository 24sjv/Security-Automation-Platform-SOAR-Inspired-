'use client';

import { Bell, RefreshCw, Filter } from 'lucide-react';
import { useState } from 'react';

type TopbarProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function Topbar({ title, subtitle, actions }: TopbarProps) {
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-border/40 bg-background/90 backdrop-blur-sm">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button
          onClick={handleRefresh}
          className="p-2 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <div className="relative">
          <button className="p-2 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-background" />
        </div>
      </div>
    </header>
  );
}
