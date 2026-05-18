import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-green-400';
    default: return 'text-slate-400';
  }
}

export function severityBg(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-green-500/15 text-green-400 border-green-500/30';
    default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function statusBg(status: string): string {
  switch (status) {
    case 'open': return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    case 'acknowledged': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'investigating': return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    case 'contained': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
    case 'resolved': return 'bg-green-500/15 text-green-400 border-green-500/30';
    case 'closed': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    case 'false_positive': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function riskScoreColor(score: number): string {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 30) return 'text-yellow-400';
  return 'text-green-400';
}

export function riskScoreBg(score: number): string {
  if (score >= 80) return 'bg-red-500';
  if (score >= 60) return 'bg-orange-500';
  if (score >= 30) return 'bg-yellow-500';
  return 'bg-green-500';
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '…';
}
