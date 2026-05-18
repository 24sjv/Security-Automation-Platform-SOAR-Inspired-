'use client';

import Topbar from '@/components/topbar';
import { mockAlertTrend, mockThreatTypes, mockIncidentTrend, mockDashboardStats } from '@/lib/mock-data';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1'];

const mttrData = [
  { day: 'Mon', mttr: 285, mttd: 42 },
  { day: 'Tue', mttr: 310, mttd: 38 },
  { day: 'Wed', mttr: 256, mttd: 51 },
  { day: 'Thu', mttr: 422, mttd: 33 },
  { day: 'Fri', mttr: 198, mttd: 28 },
  { day: 'Sat', mttr: 145, mttd: 21 },
  { day: 'Sun', mttr: 220, mttd: 35 },
];

const geographicData = [
  { country: 'Russia', attacks: 234, color: '#ef4444' },
  { country: 'China', attacks: 189, color: '#f97316' },
  { country: 'North Korea', attacks: 98, color: '#eab308' },
  { country: 'Iran', attacks: 76, color: '#22c55e' },
  { country: 'Netherlands', attacks: 54, color: '#06b6d4' },
  { country: 'USA', attacks: 43, color: '#6366f1' },
];

const playbookPerf = [
  { name: 'IP Enrichment', runs: 342, success: 338, failed: 4 },
  { name: 'Brute Force', runs: 89, success: 87, failed: 2 },
  { name: 'Phishing Triage', runs: 214, success: 210, failed: 4 },
  { name: 'Malware Contain', runs: 12, success: 12, failed: 0 },
  { name: 'Intel Sync', runs: 47, success: 45, failed: 2 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Topbar title="Security Analytics" subtitle="Performance metrics and threat intelligence insights" />

      <div className="p-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Mean Time to Detect', value: '4.2 min', change: '-18%', positive: true },
            { label: 'Mean Time to Respond', value: '23.5 min', change: '-12%', positive: true },
            { label: 'False Positive Rate', value: '3.2%', change: '+0.4%', positive: false },
            { label: 'Alert Automation Rate', value: '78%', change: '+5%', positive: true },
          ].map(({ label, value, change, positive }) => (
            <div key={label} className="bg-card border border-border/40 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              <div className="flex items-center gap-1 mt-1">
                {positive ? (
                  <TrendingDown className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
                <span className="text-xs text-slate-600">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* MTTR/MTTD + Threat types */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">MTTR vs MTTD — 7 Days</h3>
              <p className="text-xs text-slate-500 mt-0.5">Mean Time to Respond and Mean Time to Detect (minutes)</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mttrData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="mttr" stroke="#06b6d4" strokeWidth={2} dot={false} name="MTTR (min)" />
                <Line type="monotone" dataKey="mttd" stroke="#22c55e" strokeWidth={2} dot={false} name="MTTD (min)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Attack Origins</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top source countries</p>
            </div>
            <div className="space-y-3">
              {geographicData.map(({ country, attacks, color }) => {
                const max = geographicData[0].attacks;
                return (
                  <div key={country}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{country}</span>
                      <span className="text-xs font-semibold text-slate-300">{attacks}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(attacks / max) * 100}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alert volume + Playbook performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Alert Volume — 24h</h3>
              <p className="text-xs text-slate-500 mt-0.5">By severity level</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={mockAlertTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  {['critical', 'high', 'medium', 'low'].map((key, i) => (
                    <linearGradient key={key} id={`ag-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                {['critical', 'high', 'medium', 'low'].map((key, i) => (
                  <Area key={key} type="monotone" dataKey={key} stackId="1"
                    stroke={COLORS[i]} strokeWidth={1.5} fill={`url(#ag-${key})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Playbook Performance</h3>
              <p className="text-xs text-slate-500 mt-0.5">Success vs failure rate</p>
            </div>
            <div className="space-y-3">
              {playbookPerf.map(({ name, runs, success, failed }) => {
                const rate = Math.round((success / runs) * 100);
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400 truncate">{name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-600">{runs} runs</span>
                        <span className={`text-xs font-semibold ${rate >= 95 ? 'text-green-400' : rate >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>{rate}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-green-500 rounded-l-full" style={{ width: `${(success / runs) * 100}%` }} />
                      {failed > 0 && <div className="h-full bg-red-500 rounded-r-full" style={{ width: `${(failed / runs) * 100}%` }} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Threat type breakdown + incident trend */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Threat Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">This week</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={mockThreatTypes} cx="50%" cy="50%" outerRadius={60} dataKey="value" strokeWidth={0}>
                  {mockThreatTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
              {mockThreatTypes.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-slate-500 truncate">{name}</span>
                  <span className="text-slate-400 font-medium ml-auto">{value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Incident Trends — 7 Days</h3>
              <p className="text-xs text-slate-500 mt-0.5">Opened vs resolved incidents</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockIncidentTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
                <Bar dataKey="opened" fill="#ef4444" radius={[3, 3, 0, 0]} name="Opened" fillOpacity={0.8} />
                <Bar dataKey="resolved" fill="#22c55e" radius={[3, 3, 0, 0]} name="Resolved" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
