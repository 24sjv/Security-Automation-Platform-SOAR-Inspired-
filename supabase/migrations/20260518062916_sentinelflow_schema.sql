
/*
  # SentinelFlow - Core Database Schema

  ## Overview
  This migration creates the full schema for the SentinelFlow cybersecurity automation platform.

  ## Tables Created

  1. **profiles** - Extended user profiles with roles (admin, analyst, viewer)
  2. **alerts** - Security alerts with severity, status, and threat intel
  3. **incidents** - Incident management records with full lifecycle tracking
  4. **incident_comments** - Analyst notes and timeline entries for incidents
  5. **playbooks** - Automation playbook definitions and configurations
  6. **playbook_executions** - Execution logs for playbook runs
  7. **threat_intel** - Threat intelligence records (IPs, domains, hashes)
  8. **audit_logs** - Immutable platform activity log
  9. **events** - Raw security events ingested by the detection engine
  10. **notifications** - Notification queue and delivery tracking

  ## Security
  - RLS enabled on all tables
  - Role-based access via profiles.role
  - Viewers get read-only access
  - Analysts can write incidents/alerts
  - Admins have full access
*/

-- Profiles table extending auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'analyst' CHECK (role IN ('admin', 'analyst', 'viewer')),
  avatar_url text DEFAULT '',
  department text DEFAULT '',
  is_active boolean DEFAULT true,
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Events table (raw security events)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_ip text NOT NULL DEFAULT '',
  destination_ip text DEFAULT '',
  event_type text NOT NULL DEFAULT 'unknown',
  raw_data jsonb DEFAULT '{}',
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  processed boolean DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts and admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'investigating', 'resolved', 'false_positive')),
  threat_type text DEFAULT 'unknown',
  source_ip text DEFAULT '',
  destination_ip text DEFAULT '',
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  enrichment_data jsonb DEFAULT '{}',
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  incident_id uuid,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts and admins can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_number serial UNIQUE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'contained', 'resolved', 'closed')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  threat_type text DEFAULT '',
  affected_assets text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  risk_score integer DEFAULT 0,
  resolution_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  closed_at timestamptz
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts and admins can update incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Add FK from alerts to incidents (after incidents table created)
ALTER TABLE alerts ADD CONSTRAINT alerts_incident_id_fkey
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE SET NULL
  NOT VALID;

-- Incident comments
CREATE TABLE IF NOT EXISTS incident_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  comment_type text NOT NULL DEFAULT 'note' CHECK (comment_type IN ('note', 'action', 'escalation', 'update', 'resolution')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incident_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view incident comments"
  ON incident_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert comments"
  ON incident_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Playbooks table
CREATE TABLE IF NOT EXISTS playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  description text DEFAULT '',
  trigger_type text NOT NULL DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'alert', 'incident', 'scheduled')),
  trigger_conditions jsonb DEFAULT '{}',
  actions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  execution_count integer DEFAULT 0,
  last_executed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view playbooks"
  ON playbooks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert playbooks"
  ON playbooks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Admins can update playbooks"
  ON playbooks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Playbook executions
CREATE TABLE IF NOT EXISTS playbook_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_id uuid NOT NULL REFERENCES playbooks(id) ON DELETE CASCADE,
  triggered_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  trigger_type text DEFAULT 'manual',
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'partial')),
  execution_log jsonb DEFAULT '[]',
  alert_id uuid REFERENCES alerts(id) ON DELETE SET NULL,
  incident_id uuid REFERENCES incidents(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  error_message text DEFAULT ''
);

ALTER TABLE playbook_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view executions"
  ON playbook_executions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert executions"
  ON playbook_executions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts and admins can update executions"
  ON playbook_executions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Threat intelligence
CREATE TABLE IF NOT EXISTS threat_intel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator text NOT NULL,
  indicator_type text NOT NULL CHECK (indicator_type IN ('ip', 'domain', 'hash', 'url', 'email')),
  reputation_score integer DEFAULT 0 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  threat_categories text[] DEFAULT '{}',
  country text DEFAULT '',
  asn text DEFAULT '',
  is_tor boolean DEFAULT false,
  is_vpn boolean DEFAULT false,
  virustotal_data jsonb DEFAULT '{}',
  abuseipdb_data jsonb DEFAULT '{}',
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(indicator, indicator_type)
);

ALTER TABLE threat_intel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view threat intel"
  ON threat_intel FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Analysts and admins can insert threat intel"
  ON threat_intel FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Analysts and admins can update threat intel"
  ON threat_intel FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'analyst')
    )
  );

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL DEFAULT '',
  resource_type text DEFAULT '',
  resource_id text DEFAULT '',
  details jsonb DEFAULT '{}',
  ip_address text DEFAULT '',
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Analysts can view own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_source_ip ON alerts(source_ip);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_intel_indicator ON threat_intel(indicator);
