'use client';

import { useState } from 'react';
import Topbar from '@/components/topbar';
import { mockAlerts } from '@/lib/mock-data';
import { severityBg, statusBg, timeAgo, riskScoreColor, riskScoreBg } from '@/lib/utils';
import type { Alert } from '@/lib/supabase';
import { Search, Filter, Bell, MapPin, Tag, ChevronDown, X, Eye, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, RefreshCw, Shield, Clock, TrendingUp } from 'lucide-react';

const severities = ['all', 'critical', 'high', 'medium', 'low'];
const statuses = ['all', 'open', 'acknowledged', 'investigating', 'resolved', 'false_positive'];

export default function AlertsPage() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState(mockAlerts);

  const filtered = alerts.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.source_ip.includes(search) || a.threat_type.toLowerCase().includes(search.toLowerCase());
    const matchSev = severity === 'all' || a.severity === severity;
    const matchStatus = status === 'all' || a.status === status;
    return matchSearch && matchSev && matchStatus;
  });

  const counts = {
    total: alerts.length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    open: alerts.filter(a => a.status === 'open').length,
    investigating: alerts.filter(a => a.status === 'investigating').length,
  };

  function handleStatusUpdate(alertId: string, newStatus: Alert['status']) {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
    if (selectedAlert?.id === alertId) setSelectedAlert(prev => prev ? { ...prev, status: newStatus } : null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar
        title="Alert Management"
        subtitle={`${counts.open} open · ${counts.critical} critical · ${counts.investigating} investigating`}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className={`flex flex-col ${selectedAlert ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
          {/* Summary strip */}
          <div className="grid grid-cols-4 gap-0 border-b border-border/40">
            {[
              { label: 'Total Alerts', value: counts.total, color: 'text-slate-300' },
              { label: 'Critical', value: counts.critical, color: 'text-red-400' },
              { label: 'Open', value: counts.open, color: 'text-sky-400' },
              { label: 'Investigating', value: counts.investigating, color: 'text-orange-400' },
            ].map(({ label, value, color }, i) => (
              <div key={label} className={`px-5 py-3 ${i !== 3 ? 'border-r border-border/40' : ''}`}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search alerts, IPs, threat types..."
                className="w-full bg-input border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40"
              />
            </div>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value)}
              className="bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 capitalize"
            >
              {severities.map(s => <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Severities' : s}</option>)}
            </select>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ')}</option>)}
            </select>
            {(search || severity !== 'all' || status !== 'all') && (
              <button onClick={() => { setSearch(''); setSeverity('all'); setStatus('all'); }} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
            <span className="text-xs text-slate-600">{filtered.length} results</span>
          </div>

          {/* Alert list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <Bell className="w-8 h-8 mb-2" />
                <p className="text-sm">No alerts match your filters</p>
              </div>
            ) : (
              filtered.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(selectedAlert?.id === alert.id ? null : alert)}
                  className={`group flex items-start gap-3 px-4 py-3.5 border-b border-border/20 cursor-pointer transition-colors alert-row-${alert.severity} ${selectedAlert?.id === alert.id ? 'bg-cyan-500/5 border-l-cyan-500' : 'hover:bg-white/[0.02]'}`}
                >
                  {/* Severity indicator */}
                  <div className={`shrink-0 mt-0.5 text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wide ${severityBg(alert.severity)}`}>
                    {alert.severity.slice(0, 4)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{alert.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold ${riskScoreColor(alert.risk_score)}`}>{alert.risk_score}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusBg(alert.status)}`}>{alert.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{alert.source_ip}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />{alert.threat_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{timeAgo(alert.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedAlert && (
          <div className="w-1/2 border-l border-border/40 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
              <h2 className="text-sm font-semibold text-white">Alert Detail</h2>
              <button onClick={() => setSelectedAlert(null)} className="p-1.5 rounded hover:bg-white/[0.06] text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Title + severity */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityBg(selectedAlert.severity)}`}>{selectedAlert.severity}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${statusBg(selectedAlert.status)}`}>{selectedAlert.status.replace('_', ' ')}</span>
                </div>
                <h3 className="text-base font-semibold text-white leading-tight">{selectedAlert.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{selectedAlert.description}</p>
              </div>

              {/* Risk score bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500">Risk Score</span>
                  <span className={`text-sm font-bold ${riskScoreColor(selectedAlert.risk_score)}`}>{selectedAlert.risk_score}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${riskScoreBg(selectedAlert.risk_score)}`}
                    style={{ width: `${selectedAlert.risk_score}%` }}
                  />
                </div>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Source IP', value: selectedAlert.source_ip },
                  { label: 'Destination', value: selectedAlert.destination_ip || 'N/A' },
                  { label: 'Threat Type', value: selectedAlert.threat_type },
                  { label: 'Created', value: timeAgo(selectedAlert.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-sm text-slate-300 font-mono">{value}</p>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {selectedAlert.tags.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAlert.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/[0.06] border border-border/50 text-slate-400">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enrichment */}
              {Object.keys(selectedAlert.enrichment_data).length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Threat Intelligence</p>
                  <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs text-slate-400 space-y-1">
                    {Object.entries(selectedAlert.enrichment_data).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-slate-600 shrink-0">{k}:</span>
                        <span className="text-cyan-400">{JSON.stringify(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <p className="text-xs text-slate-500 mb-2">Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, 'acknowledged')}
                    disabled={selectedAlert.status !== 'open'}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> Acknowledge
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, 'investigating')}
                    disabled={selectedAlert.status === 'investigating' || selectedAlert.status === 'resolved'}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Investigate
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, 'resolved')}
                    disabled={selectedAlert.status === 'resolved'}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAlert.id, 'false_positive')}
                    disabled={selectedAlert.status === 'false_positive'}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium bg-muted border border-border/50 text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> False Positive
                  </button>
                </div>
              </div>

              {/* Run playbook CTA */}
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-cyan-300">Automation Available</p>
                    <p className="text-xs text-slate-500 mt-0.5">Run &ldquo;IP Threat Enrichment&rdquo; playbook to auto-analyze this alert</p>
                  </div>
                  <button className="shrink-0 text-xs px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30 transition-colors font-medium">
                    Run
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
