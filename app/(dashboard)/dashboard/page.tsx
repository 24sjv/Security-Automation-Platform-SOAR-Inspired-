'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Topbar from '@/components/topbar';
import { mockAlerts, mockIncidents, mockDashboardStats, mockAlertTrend, mockThreatTypes, mockIncidentTrend } from '@/lib/mock-data';
import { severityBg, statusBg, timeAgo, riskScoreColor, truncate } from '@/lib/utils';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TriangleAlert as AlertTriangle, Shield, Bell, TrendingUp, Activity, Clock, Ban, Zap, ArrowUpRight, ArrowDownRight, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1'];

export default function DashboardPage() {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openAlerts = mockAlerts.filter(a => a.status === 'open' || a.status === 'investigating');
  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical');
  const openIncidents = mockIncidents.filter(i => i.status === 'open' || i.status === 'investigating');

  const greeting = currentTime.getHours() < 12 ? 'Good morning' : currentTime.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen">
      <Topbar
        title="Security Operations Center"
        subtitle={`${greeting}, ${profile?.full_name || 'Analyst'} — ${currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
      />

      <div className="p-6 space-y-6">
        {/* Live clock + threat level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
              <span className="text-xs font-medium text-red-400">THREAT LEVEL: HIGH</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-border/40">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs text-slate-400 font-mono">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 live-dot" />
            <span>All systems operational</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Active Alerts"
            value={openAlerts.length.toString()}
            change="+3 in last hour"
            trend="up"
            icon={Bell}
            iconColor="text-orange-400"
            iconBg="bg-orange-500/10"
            href="/alerts"
          />
          <StatCard
            title="Critical Alerts"
            value={criticalAlerts.length.toString()}
            change="Requires immediate action"
            trend="up"
            icon={AlertTriangle}
            iconColor="text-red-400"
            iconBg="bg-red-500/10"
            href="/alerts?filter=critical"
            glow
          />
          <StatCard
            title="Open Incidents"
            value={openIncidents.length.toString()}
            change="2 escalated today"
            trend="neutral"
            icon={Shield}
            iconColor="text-cyan-400"
            iconBg="bg-cyan-500/10"
            href="/incidents"
          />
          <StatCard
            title="Blocked IPs"
            value={mockDashboardStats.blockedIPs.toLocaleString()}
            change="+47 today"
            trend="up"
            icon={Ban}
            iconColor="text-green-400"
            iconBg="bg-green-500/10"
            href="/threat-intel"
          />
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Avg Response Time', value: mockDashboardStats.avgResponseTime, icon: Clock, color: 'text-cyan-400' },
            { label: 'Playbooks Executed', value: mockDashboardStats.playbooksRun.toString(), icon: Zap, color: 'text-yellow-400' },
            { label: 'Threats Enriched', value: mockDashboardStats.threatsEnriched.toLocaleString(), icon: TrendingUp, color: 'text-green-400' },
            { label: 'Resolved Today', value: mockDashboardStats.resolvedToday.toString(), icon: Shield, color: 'text-blue-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border/40 rounded-lg px-4 py-3 flex items-center gap-3">
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Alert trend - spans 2 cols */}
          <div className="col-span-2 bg-card border border-border/40 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Alert Volume — 24h</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time threat detection activity</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {[
                  { color: '#ef4444', label: 'Critical' },
                  { color: '#f97316', label: 'High' },
                  { color: '#eab308', label: 'Medium' },
                  { color: '#22c55e', label: 'Low' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={mockAlertTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  {['critical', 'high', 'medium', 'low'].map((key, i) => (
                    <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                {['critical', 'high', 'medium', 'low'].map((key, i) => (
                  <Area key={key} type="monotone" dataKey={key} stackId="1"
                    stroke={COLORS[i]} strokeWidth={1.5} fill={`url(#g-${key})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Threat distribution */}
          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Threat Types</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution this week</p>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={mockThreatTypes} cx="50%" cy="50%" innerRadius={35} outerRadius={55}
                  dataKey="value" strokeWidth={0}>
                  {mockThreatTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {mockThreatTypes.slice(0, 4).map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-slate-400">{name}</span>
                  </div>
                  <span className="text-slate-300 font-medium">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents trend + recent alerts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Weekly incidents */}
          <div className="bg-card border border-border/40 rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Incident Trend — 7d</h3>
              <p className="text-xs text-slate-500 mt-0.5">Opened vs resolved</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockIncidentTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(222,47%,8%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="opened" fill="#ef4444" radius={[3, 3, 0, 0]} name="Opened" fillOpacity={0.8} />
                <Bar dataKey="resolved" fill="#22c55e" radius={[3, 3, 0, 0]} name="Resolved" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent critical alerts */}
          <div className="col-span-2 bg-card border border-border/40 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Recent Critical Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Requiring immediate attention</p>
              </div>
              <Link href="/alerts" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {mockAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').slice(0, 5).map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors alert-row-${alert.severity}`}>
                  <div className={`shrink-0 text-xs px-2 py-0.5 rounded border font-medium uppercase tracking-wide mt-0.5 ${severityBg(alert.severity)}`}>
                    {alert.severity}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{alert.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3" />{alert.source_ip}
                      </span>
                      <span className="text-[11px] text-slate-600">{timeAgo(alert.created_at)}</span>
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${riskScoreColor(alert.risk_score)}`}>
                    {alert.risk_score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active incidents */}
        <div className="bg-card border border-border/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Active Incidents</h3>
              <p className="text-xs text-slate-500 mt-0.5">Open and under investigation</p>
            </div>
            <Link href="/incidents" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Manage all <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {openIncidents.map(incident => (
              <Link key={incident.id} href={`/incidents/${incident.id}`}>
                <div className="group p-4 rounded-lg border border-border/40 hover:border-cyan-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-slate-500 font-mono">INC-{incident.incident_number}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded border ${severityBg(incident.severity)}`}>{incident.severity}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${statusBg(incident.status)}`}>{incident.status}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{truncate(incident.title, 60)}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{incident.threat_type}</span>
                    <span>·</span>
                    <span>{timeAgo(incident.created_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  href: string;
  glow?: boolean;
};

function StatCard({ title, value, change, trend, icon: Icon, iconColor, iconBg, href, glow }: StatCardProps) {
  return (
    <Link href={href}>
      <div className={`metric-card bg-card border border-border/40 rounded-xl p-4 cursor-pointer ${glow ? 'ring-1 ring-red-500/20' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-500 font-medium">{title}</p>
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <div className="flex items-center gap-1 mt-1.5">
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3 text-red-400" />
          ) : trend === 'down' ? (
            <ArrowDownRight className="w-3 h-3 text-green-400" />
          ) : null}
          <span className="text-xs text-slate-500">{change}</span>
        </div>
      </div>
    </Link>
  );
}
