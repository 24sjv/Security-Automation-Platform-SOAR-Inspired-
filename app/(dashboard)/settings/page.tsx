'use client';

import { useState } from 'react';
import Topbar from '@/components/topbar';
import { useAuth } from '@/contexts/auth-context';
import {
  User, Bell, Shield, Key, Link2, Save, Check, Eye, EyeOff,
  Slack, Mail, MessageSquare, Webhook, Database, Activity,
} from 'lucide-react';

const tabs = ['Profile', 'Notifications', 'API Keys', 'Integrations', 'Security'];

export default function SettingsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [form, setForm] = useState({
    fullName: profile?.full_name ?? '',
    email: profile?.email ?? '',
    department: profile?.department ?? '',
    role: profile?.role ?? 'analyst',
  });

  const [notifSettings, setNotifSettings] = useState({
    email: true, slack: false, discord: true, telegram: false,
    critical: true, high: true, medium: false, low: false,
    playbookExec: true, incidentCreate: true, incidentUpdate: false,
  });

  async function handleSave() {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabIcons: Record<string, React.ElementType> = {
    Profile: User, Notifications: Bell, 'API Keys': Key, Integrations: Link2, Security: Shield,
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Settings" subtitle="Platform configuration and preferences" />

      <div className="flex">
        {/* Side tabs */}
        <div className="w-48 shrink-0 border-r border-border/40 min-h-[calc(100vh-56px)] p-3">
          <div className="space-y-0.5">
            {tabs.map(tab => {
              const Icon = tabIcons[tab];
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === tab ? 'text-cyan-400' : 'text-slate-600'}`} />
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 max-w-2xl">
          {activeTab === 'Profile' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Profile Settings</h2>
                <p className="text-xs text-slate-500">Manage your account details and preferences</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 p-4 bg-card border border-border/40 rounded-xl">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold text-white">
                  {form.fullName?.charAt(0)?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{form.fullName || 'Unknown Analyst'}</p>
                  <p className="text-xs text-slate-500 capitalize">{form.role} · {form.department || 'No department'}</p>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 mt-1 transition-colors">Change avatar</button>
                </div>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
                {[
                  { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Smith' },
                  { label: 'Email Address', key: 'email', type: 'email', placeholder: 'analyst@company.com' },
                  { label: 'Department', key: 'department', type: 'text', placeholder: 'Security Operations' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-input border border-border/50 rounded-lg px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/30 border border-border/40 rounded-lg">
                    <span className="text-sm text-slate-300 capitalize">{form.role}</span>
                    <span className="ml-auto text-xs text-slate-600 bg-white/[0.04] border border-border/40 px-2 py-0.5 rounded">Managed by admin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Notification Preferences</h2>
                <p className="text-xs text-slate-500">Configure how and when you receive alerts</p>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Channels</h3>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email', icon: Mail, desc: 'analyst@company.com' },
                    { key: 'slack', label: 'Slack', icon: Slack, desc: '#soc-alerts channel' },
                    { key: 'discord', label: 'Discord', icon: MessageSquare, desc: 'SentinelFlow Bot' },
                    { key: 'telegram', label: 'Telegram', icon: Webhook, desc: '@sentinelflow_bot' },
                  ].map(({ key, label, icon: Icon, desc }) => (
                    <div key={key} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-300">{label}</p>
                          <p className="text-xs text-slate-600">{desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[key as keyof typeof notifSettings] ? 'bg-cyan-500' : 'bg-muted/80'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifSettings[key as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Alert Severities</h3>
                <div className="space-y-3">
                  {[
                    { key: 'critical', label: 'Critical', color: 'text-red-400' },
                    { key: 'high', label: 'High', color: 'text-orange-400' },
                    { key: 'medium', label: 'Medium', color: 'text-yellow-400' },
                    { key: 'low', label: 'Low', color: 'text-green-400' },
                  ].map(({ key, label, color }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${color}`}>{label}</span>
                      <button
                        onClick={() => setNotifSettings(p => ({ ...p, [key]: !p[key as keyof typeof p] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors ${notifSettings[key as keyof typeof notifSettings] ? 'bg-cyan-500' : 'bg-muted/80'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifSettings[key as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'API Keys' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">API Configuration</h2>
                <p className="text-xs text-slate-500">Manage external threat intelligence API keys</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'VirusTotal API', key: 'VT_API_KEY', status: 'connected', icon: Shield, desc: 'Malware hash and URL analysis' },
                  { name: 'AbuseIPDB API', key: 'ABUSEIPDB_KEY', status: 'connected', icon: Database, desc: 'IP reputation and abuse reports' },
                  { name: 'AlienVault OTX', key: 'OTX_KEY', status: 'disconnected', icon: Activity, desc: 'Open threat exchange feeds' },
                  { name: 'Shodan API', key: 'SHODAN_KEY', status: 'disconnected', icon: Key, desc: 'Internet-connected device intelligence' },
                ].map(({ name, key, status, icon: Icon, desc }) => (
                  <div key={name} className="bg-card border border-border/40 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <Icon className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{name}</p>
                          <p className="text-xs text-slate-600">{desc}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded border ${status === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-muted/60 border-border/40 text-slate-500'}`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showKey ? 'text' : 'password'}
                          defaultValue={status === 'connected' ? '••••••••••••••••••••••••••••••••' : ''}
                          placeholder={`Enter ${name} key...`}
                          className="w-full bg-input border border-border/50 rounded-lg px-3 py-2 text-xs text-slate-400 font-mono placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                        />
                      </div>
                      <button className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg text-xs hover:bg-cyan-500/20 transition-colors">
                        {status === 'connected' ? 'Update' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Integrations' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Integrations</h2>
                <p className="text-xs text-slate-500">Connect SentinelFlow with your existing tools</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Slack', status: 'active', icon: Slack, desc: 'Real-time alert notifications' },
                  { name: 'PagerDuty', status: 'inactive', icon: Bell, desc: 'On-call escalation management' },
                  { name: 'Jira', status: 'inactive', icon: Link2, desc: 'Incident ticket synchronization' },
                  { name: 'Splunk', status: 'inactive', icon: Activity, desc: 'SIEM log forwarding' },
                  { name: 'Telegram', status: 'active', icon: MessageSquare, desc: 'Mobile alert notifications' },
                  { name: 'Webhook', status: 'active', icon: Webhook, desc: 'Custom endpoint forwarding' },
                ].map(({ name, status, icon: Icon, desc }) => (
                  <div key={name} className="bg-card border border-border/40 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-200">{name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-muted/60 border-border/40 text-slate-500'}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{desc}</p>
                      <button className={`text-xs mt-2 ${status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-cyan-400 hover:text-cyan-300'} transition-colors`}>
                        {status === 'active' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Security Settings</h2>
                <p className="text-xs text-slate-500">Manage authentication and access controls</p>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Change Password</h3>
                {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-input border border-border/50 rounded-lg px-3 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40" />
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-sm text-slate-300">TOTP Authenticator</p>
                    <p className="text-xs text-slate-600">Google Authenticator, Authy, etc.</p>
                  </div>
                  <span className="text-xs text-slate-500 bg-muted/60 border border-border/40 px-2 py-0.5 rounded">Not configured</span>
                </div>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Set up 2FA</button>
              </div>

              <div className="bg-card border border-border/40 rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active Sessions</h3>
                <div className="space-y-2">
                  {[
                    { device: 'Chrome on macOS', location: 'New York, US', time: 'Current session', current: true },
                    { device: 'Firefox on Windows', location: 'Chicago, US', time: '2 hours ago', current: false },
                  ].map(({ device, location, time, current }) => (
                    <div key={device} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                      <div>
                        <p className="text-xs text-slate-300">{device}</p>
                        <p className="text-xs text-slate-600">{location} · {time}</p>
                      </div>
                      {current ? (
                        <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Active</span>
                      ) : (
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/25 transition-all"
            >
              {saved ? (
                <><Check className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
