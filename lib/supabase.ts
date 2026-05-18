import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar_url: string;
  department: string;
  is_active: boolean;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  threat_type: string;
  source_ip: string;
  destination_ip: string;
  risk_score: number;
  enrichment_data: Record<string, unknown>;
  assigned_to: string | null;
  event_id: string | null;
  incident_id: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  profiles?: Profile;
};

export type Incident = {
  id: string;
  incident_number: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  assigned_to: string | null;
  created_by: string | null;
  threat_type: string;
  affected_assets: string[];
  tags: string[];
  risk_score: number;
  resolution_notes: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
  assignee?: Profile;
  creator?: Profile;
};

export type IncidentComment = {
  id: string;
  incident_id: string;
  author_id: string;
  content: string;
  comment_type: 'note' | 'action' | 'escalation' | 'update' | 'resolution';
  created_at: string;
  author?: Profile;
};

export type Playbook = {
  id: string;
  name: string;
  description: string;
  trigger_type: 'manual' | 'alert' | 'incident' | 'scheduled';
  trigger_conditions: Record<string, unknown>;
  actions: PlaybookAction[];
  is_active: boolean;
  created_by: string | null;
  execution_count: number;
  last_executed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PlaybookAction = {
  id: string;
  type: string;
  name: string;
  config: Record<string, unknown>;
  order: number;
};

export type ThreatIntel = {
  id: string;
  indicator: string;
  indicator_type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  reputation_score: number;
  threat_categories: string[];
  country: string;
  asn: string;
  is_tor: boolean;
  is_vpn: boolean;
  virustotal_data: Record<string, unknown>;
  abuseipdb_data: Record<string, unknown>;
  last_seen_at: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, unknown>;
  ip_address: string;
  user_agent?: string;
  created_at: string;
  profiles?: Profile;
};
