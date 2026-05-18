'use client';

import { useState } from 'react';
import Topbar from '@/components/topbar';
import { mockIncidents } from '@/lib/mock-data';
import { severityBg, statusBg, timeAgo, riskScoreColor } from '@/lib/utils';
import type { Incident } from '@/lib/supabase';
import { Search, Plus, Shield, Clock, Tag, ChevronRight, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, X, Users, Activity } from 'lucide-react';
import Link from 'next/link';

const statuses = ['all', 'open', 'investigating', 'contained', 'resolved', 'closed'];
const severities = ['all', 'critical', 'high', 'medium', 'low'];

export default function IncidentsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [incidents] = useState(mockIncidents);

  const filtered = incidents.filter(inc => {
    const matchSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.threat_type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || inc.status === status;
    const matchSev = severity === 'all' || inc.severity === severity;
    return matchSearch && matchStatus && matchSev;
  });

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === 'open').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    contained: incidents.filter(i => i.status === 'contained').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Incident Management"
        subtitle={`${stats.open} open · ${stats.investigating} investigating · ${stats.contained} contained`}
        actions={
          <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/25 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Incident
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-300', bg: 'bg-white/[0.04]', border: 'border-border/40' },
            { label: 'Open', value: stats.open, color: 'text-sky-400', bg: 'bg-sky-500/5', border: 'border-sky-500/20' },
            { label: 'Investigating', value: stats.investigating, color: 'text-orange-400', bg: 'bg-orange-500/5', border: 'border-orange-500/20' },
            { label: 'Contained', value: stats.contained, color: 'text-yellow-400', bg: 'bg-yellow-500/5', border: 'border-yellow-500/20' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-400', bg: 'bg-green-500/5', border: 'border-green-500/20' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl px-4 py-3 text-center`}>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="w-full bg-input border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)} className="bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none capitalize">
            {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
          </select>
          <select value={severity} onChange={e => setSeverity(e.target.value)} className="bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none capitalize">
            {severities.map(s => <option key={s} value={s}>{s === 'all' ? 'All Severities' : s}</option>)}
          </select>
          <span className="ml-auto text-xs text-slate-600">{filtered.length} incidents</span>
        </div>

        {/* Incident cards */}
        <div className="space-y-3">
          {filtered.map(incident => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-600">
              <Shield className="w-8 h-8 mb-2" />
              <p className="text-sm">No incidents match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <Link href={`/incidents/${incident.id}`}>
      <div className={`group bg-card border border-border/40 hover:border-cyan-500/25 rounded-xl p-5 transition-all cursor-pointer alert-row-${incident.severity}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-mono text-slate-600">INC-{incident.incident_number}</span>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityBg(incident.severity)}`}>{incident.severity}</span>
              <span className={`text-xs px-2 py-0.5 rounded border ${statusBg(incident.status)}`}>{incident.status}</span>
              {incident.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/[0.05] border border-border/40 text-slate-500">{tag}</span>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{incident.title}</h3>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{incident.description}</p>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                {incident.threat_type}
              </span>
              {incident.affected_assets.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {incident.affected_assets.length} affected assets
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo(incident.created_at)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-600">Risk Score</p>
              <p className={`text-lg font-bold ${riskScoreColor(incident.risk_score)}`}>{incident.risk_score}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
