'use client';

import { useState } from 'react';
import Topbar from '@/components/topbar';
import { mockPlaybooks } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import type { Playbook } from '@/lib/supabase';
import { BookOpen, Zap, Play, Pause, Clock, CircleCheck as CheckCircle, Circle as XCircle, Plus, ChevronRight, ArrowRight, Search, Filter, Shield, Bell, Calendar } from 'lucide-react';

const actionTypeIcons: Record<string, React.ElementType> = {
  threat_intel: Shield,
  block_ip: XCircle,
  notify: Bell,
  create_incident: Zap,
  risk_score: CheckCircle,
  isolate_endpoint: XCircle,
  memory_dump: Clock,
  url_scan: Search,
  email_analysis: Search,
  update_alert: Zap,
  fetch_intel: Shield,
  update_blocklist: XCircle,
  report: BookOpen,
  check_sla: Clock,
  escalate: Bell,
  reset_accounts: Shield,
};

const triggerColors: Record<string, string> = {
  manual: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  alert: 'bg-red-500/10 border-red-500/20 text-red-400',
  incident: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  scheduled: 'bg-green-500/10 border-green-500/20 text-green-400',
};

export default function PlaybooksPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [playbooks, setPlaybooks] = useState(mockPlaybooks);
  const [running, setRunning] = useState<string | null>(null);

  const filtered = playbooks.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'active' && p.is_active) || (filter === 'inactive' && !p.is_active) || p.trigger_type === filter;
    return matchSearch && matchFilter;
  });

  function togglePlaybook(id: string) {
    setPlaybooks(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  async function runPlaybook(id: string) {
    setRunning(id);
    await new Promise(r => setTimeout(r, 2000));
    setPlaybooks(prev => prev.map(p => p.id === id ? { ...p, execution_count: p.execution_count + 1, last_executed_at: new Date().toISOString() } : p));
    setRunning(null);
  }

  const stats = {
    total: playbooks.length,
    active: playbooks.filter(p => p.is_active).length,
    totalRuns: playbooks.reduce((acc, p) => acc + p.execution_count, 0),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar
        title="Automation Playbooks"
        subtitle={`${stats.active} active · ${stats.totalRuns.toLocaleString()} total executions`}
        actions={
          <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/25 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Playbook
          </button>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left - list */}
        <div className={`flex flex-col ${selectedPlaybook ? 'w-5/12' : 'w-full'} transition-all duration-300`}>
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-0 border-b border-border/40">
            {[
              { label: 'Total Playbooks', value: stats.total, color: 'text-slate-300' },
              { label: 'Active', value: stats.active, color: 'text-green-400' },
              { label: 'Executions', value: stats.totalRuns, color: 'text-cyan-400' },
            ].map(({ label, value, color }, i) => (
              <div key={label} className={`px-5 py-3 ${i !== 2 ? 'border-r border-border/40' : ''}`}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search playbooks..."
                className="w-full bg-input border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
              />
            </div>
            <div className="flex rounded-lg overflow-hidden border border-border/50">
              {['all', 'active', 'alert', 'scheduled'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 text-xs capitalize transition-colors ${filter === f ? 'bg-cyan-500/15 text-cyan-400' : 'text-slate-500 hover:text-slate-300 bg-transparent'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(playbook => (
              <div
                key={playbook.id}
                onClick={() => setSelectedPlaybook(selectedPlaybook?.id === playbook.id ? null : playbook)}
                className={`group px-4 py-4 border-b border-border/20 cursor-pointer transition-colors ${selectedPlaybook?.id === playbook.id ? 'bg-cyan-500/5' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${playbook.is_active ? 'bg-cyan-500/10' : 'bg-muted/60'}`}>
                    <Zap className={`w-4.5 h-4.5 ${playbook.is_active ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-slate-200 truncate">{playbook.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${triggerColors[playbook.trigger_type]}`}>{playbook.trigger_type}</span>
                      {!playbook.is_active && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border bg-muted/60 border-border/40 text-slate-500">paused</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{playbook.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span>{playbook.actions.length} actions</span>
                      <span>·</span>
                      <span>{playbook.execution_count.toLocaleString()} runs</span>
                      {playbook.last_executed_at && (
                        <>
                          <span>·</span>
                          <span>Last: {timeAgo(playbook.last_executed_at)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedPlaybook && (
          <div className="flex-1 border-l border-border/40 flex flex-col overflow-y-auto">
            <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">{selectedPlaybook.name}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runPlaybook(selectedPlaybook.id)}
                  disabled={!selectedPlaybook.is_active || running === selectedPlaybook.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {running === selectedPlaybook.id ? (
                    <><span className="w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin" /> Running...</>
                  ) : (
                    <><Play className="w-3 h-3" /> Run Now</>
                  )}
                </button>
                <button
                  onClick={() => togglePlaybook(selectedPlaybook.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedPlaybook.is_active ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20' : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'}`}
                >
                  {selectedPlaybook.is_active ? <><Pause className="w-3 h-3" /> Pause</> : <><Play className="w-3 h-3" /> Enable</>}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Description */}
              <div>
                <p className="text-sm text-slate-400 leading-relaxed">{selectedPlaybook.description}</p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Trigger', value: selectedPlaybook.trigger_type, icon: Zap },
                  { label: 'Executions', value: selectedPlaybook.execution_count.toLocaleString(), icon: CheckCircle },
                  { label: 'Actions', value: selectedPlaybook.actions.length.toString(), icon: ArrowRight },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3 flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
                      <p className="text-sm font-semibold text-slate-200 capitalize">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions flow */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Workflow Actions</p>
                <div className="space-y-2">
                  {selectedPlaybook.actions.map((action, i) => {
                    const Icon = actionTypeIcons[action.type] ?? Zap;
                    return (
                      <div key={action.id} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                          {i < selectedPlaybook.actions.length - 1 && (
                            <div className="w-px h-3 bg-border/50 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-600 font-mono">{String(i + 1).padStart(2, '0')}</span>
                            <p className="text-sm text-slate-300 font-medium">{action.name}</p>
                          </div>
                          {Object.keys(action.config).length > 0 && (
                            <p className="text-xs text-slate-600 mt-0.5 font-mono">
                              {Object.entries(action.config).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trigger conditions */}
              {Object.keys(selectedPlaybook.trigger_conditions).length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Trigger Conditions</p>
                  <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs text-slate-400 space-y-1">
                    {Object.entries(selectedPlaybook.trigger_conditions).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-slate-600">{k}:</span>
                        <span className="text-cyan-400">{JSON.stringify(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
