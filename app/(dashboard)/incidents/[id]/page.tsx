'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Topbar from '@/components/topbar';
import { mockIncidents } from '@/lib/mock-data';
import { severityBg, statusBg, timeAgo, riskScoreColor, riskScoreBg, formatDate } from '@/lib/utils';
import { ArrowLeft, Shield, Clock, Tag, Activity, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, MessageSquare, Users, Target, Send, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const statusFlow = ['open', 'investigating', 'contained', 'resolved', 'closed'];

type Comment = { id: string; content: string; type: string; time: string; author: string };

const mockComments: Comment[] = [
  { id: 'c1', content: 'Incident created automatically by brute force detection playbook.', type: 'action', time: '2h ago', author: 'SentinelFlow Bot' },
  { id: 'c2', content: 'Initial triage complete. Confirmed active attack from Russian IP range. Initiating response protocol.', type: 'note', time: '1h 45m ago', author: 'Alex Chen' },
  { id: 'c3', content: 'Firewall rule deployed to block source IP range /24. Monitoring for lateral movement.', type: 'action', time: '1h 30m ago', author: 'Alex Chen' },
  { id: 'c4', content: 'Escalated to CISO per P1 protocol. Notified legal team of potential breach.', type: 'escalation', time: '1h ago', author: 'Alex Chen' },
];

const commentColors: Record<string, string> = {
  action: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  note: 'bg-white/[0.04] border-border/40 text-slate-400',
  escalation: 'bg-red-500/10 border-red-500/20 text-red-400',
  update: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  resolution: 'bg-green-500/10 border-green-500/20 text-green-400',
};

export default function IncidentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');

  const incident = mockIncidents.find(i => i.id === id);
  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Incident not found</p>
          <Link href="/incidents" className="text-cyan-400 text-sm hover:underline">Back to incidents</Link>
        </div>
      </div>
    );
  }

  function addComment() {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { id: `c${prev.length + 1}`, content: newComment.trim(), type: 'note', time: 'just now', author: 'You' }]);
    setNewComment('');
  }

  const currentStatusIdx = statusFlow.indexOf(incident.status);

  return (
    <div className="min-h-screen">
      <Topbar
        title={`INC-${incident.incident_number}`}
        subtitle={incident.title}
        actions={
          <Link href="/incidents" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main content */}
          <div className="col-span-2 space-y-5">
            {/* Header card */}
            <div className="bg-card border border-border/40 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-600 font-mono">INC-{incident.incident_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${severityBg(incident.severity)}`}>{incident.severity}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${statusBg(incident.status)}`}>{incident.status}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white leading-tight">{incident.title}</h2>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{incident.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-600 mb-1">Risk Score</p>
                  <p className={`text-3xl font-bold ${riskScoreColor(incident.risk_score)}`}>{incident.risk_score}</p>
                  <div className="h-1.5 w-24 bg-muted rounded-full mt-1.5 ml-auto overflow-hidden">
                    <div className={`h-full ${riskScoreBg(incident.risk_score)} rounded-full`} style={{ width: `${incident.risk_score}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Status timeline */}
            <div className="bg-card border border-border/40 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Incident Lifecycle</h3>
              <div className="flex items-center gap-0">
                {statusFlow.map((s, i) => {
                  const isPast = i <= currentStatusIdx;
                  const isCurrent = i === currentStatusIdx;
                  return (
                    <div key={s} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isCurrent ? 'border-cyan-500 bg-cyan-500/20' : isPast ? 'border-green-500 bg-green-500/15' : 'border-border/50 bg-muted/50'}`}>
                          {isPast && !isCurrent ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : isCurrent ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 live-dot" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                          )}
                        </div>
                        <span className={`text-[10px] mt-1.5 capitalize ${isCurrent ? 'text-cyan-400 font-medium' : isPast ? 'text-slate-400' : 'text-slate-600'}`}>{s}</span>
                      </div>
                      {i < statusFlow.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-4 ${i < currentStatusIdx ? 'bg-green-500/50' : 'bg-border/50'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline / comments */}
            <div className="bg-card border border-border/40 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" /> Investigation Timeline
              </h3>
              <div className="space-y-3 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-300">{comment.author}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${commentColors[comment.type] ?? commentColors.note}`}>
                          {comment.type}
                        </span>
                        <span className="text-xs text-slate-600">{comment.time}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">Y</div>
                <div className="flex-1 flex gap-2">
                  <input
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addComment())}
                    placeholder="Add investigation notes..."
                    className="flex-1 bg-input border border-border/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 focus:border-cyan-500/40"
                  />
                  <button onClick={addComment} className="px-3 py-2 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/25 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Meta */}
            <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incident Details</h3>
              {[
                { icon: Shield, label: 'Threat Type', value: incident.threat_type },
                { icon: Clock, label: 'Created', value: formatDate(incident.created_at) },
                { icon: Clock, label: 'Last Updated', value: timeAgo(incident.updated_at) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-slate-300 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Affected assets */}
            <div className="bg-card border border-border/40 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Affected Assets</h3>
              <div className="space-y-1.5">
                {incident.affected_assets.map(asset => (
                  <div key={asset} className="flex items-center gap-2 text-xs">
                    <Activity className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="text-slate-300 font-mono">{asset}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-card border border-border/40 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {incident.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-white/[0.05] border border-border/50 text-slate-400">{tag}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card border border-border/40 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors">
                  <span className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Run Containment Playbook</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] border border-border/40 text-slate-400 text-xs font-medium hover:bg-white/[0.07] transition-colors">
                  <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Assign Analyst</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.04] border border-border/40 text-slate-400 text-xs font-medium hover:bg-white/[0.07] transition-colors">
                  <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Export Report</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
