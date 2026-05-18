'use client';

import { useState } from 'react';
import Topbar from '@/components/topbar';
import { mockThreatIntel } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import { Database, Globe, Shield, Search, Plus, MapPin, TriangleAlert as AlertTriangle, Check, X } from 'lucide-react';

const indicatorColors: Record<string, string> = {
  ip: 'bg-red-500/10 border-red-500/20 text-red-400',
  domain: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  hash: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  url: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  email: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
};

function reputationColor(score: number) {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 30) return 'text-yellow-400';
  return 'text-green-400';
}

function reputationLabel(score: number) {
  if (score >= 80) return 'Malicious';
  if (score >= 60) return 'Suspicious';
  if (score >= 30) return 'Moderate';
  return 'Clean';
}

export default function ThreatIntelPage() {
  const [search, setSearch] = useState('');
  const [lookup, setLookup] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const intel = mockThreatIntel.filter(t =>
    !search || t.indicator.toLowerCase().includes(search.toLowerCase()) || t.threat_categories.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleLookup() {
    if (!lookup.trim()) return;
    setLookupLoading(true);
    setLookupResult(null);
    await new Promise(r => setTimeout(r, 1500));
    setLookupResult(`Lookup complete for "${lookup}". Result: No matching records found in threat intelligence database. IP appears clean based on current feeds.`);
    setLookupLoading(false);
  }

  const stats = {
    total: mockThreatIntel.length,
    malicious: mockThreatIntel.filter(t => t.reputation_score >= 80).length,
    tor: mockThreatIntel.filter(t => t.is_tor).length,
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Threat Intelligence"
        subtitle="IOC database and reputation lookups"
        actions={
          <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/25 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add IOC
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total IOCs', value: stats.total, icon: Database, color: 'text-cyan-400' },
            { label: 'Malicious', value: stats.malicious, icon: AlertTriangle, color: 'text-red-400' },
            { label: 'Tor Nodes', value: stats.tor, icon: Globe, color: 'text-orange-400' },
            { label: 'Intel Sources', value: 3, icon: Shield, color: 'text-green-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xl font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lookup tool */}
        <div className="bg-card border border-border/40 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Threat Indicator Lookup</h3>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                value={lookup}
                onChange={e => setLookup(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                placeholder="Enter IP, domain, hash, or URL to lookup..."
                className="w-full bg-input border border-border/50 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40 font-mono"
              />
            </div>
            <button
              onClick={handleLookup}
              disabled={lookupLoading || !lookup.trim()}
              className="px-4 py-2.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {lookupLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-current/30 border-t-current rounded-full animate-spin" />
                  Querying...
                </span>
              ) : 'Lookup'}
            </button>
          </div>
          <div className="flex gap-2 mt-2.5">
            {['VirusTotal', 'AbuseIPDB', 'AlienVault OTX'].map(source => (
              <span key={source} className="text-xs px-2 py-1 rounded bg-white/[0.04] border border-border/30 text-slate-500">{source}</span>
            ))}
          </div>
          {lookupResult && (
            <div className="mt-3 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-slate-400">{lookupResult}</p>
            </div>
          )}
        </div>

        {/* IOC table */}
        <div className="bg-card border border-border/40 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
            <h3 className="text-sm font-semibold text-white">IOC Database</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter IOCs..."
                className="bg-input border border-border/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/30">
                  {['Indicator', 'Type', 'Reputation', 'Categories', 'Country', 'Tor', 'VPN', 'Last Seen'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {intel.map(item => (
                  <tr key={item.id} className="border-b border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">{item.indicator}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-bold ${indicatorColors[item.indicator_type]}`}>
                        {item.indicator_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${reputationColor(item.reputation_score)}`}>{item.reputation_score}</span>
                        <span className={`text-[10px] ${reputationColor(item.reputation_score)}`}>{reputationLabel(item.reputation_score)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.threat_categories.slice(0, 2).map(cat => (
                          <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-border/40 text-slate-500">{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3" />{item.country || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.is_tor ? <Check className="w-3.5 h-3.5 text-red-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    </td>
                    <td className="px-4 py-3">
                      {item.is_vpn ? <Check className="w-3.5 h-3.5 text-orange-400" /> : <X className="w-3.5 h-3.5 text-slate-600" />}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{timeAgo(item.last_seen_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
