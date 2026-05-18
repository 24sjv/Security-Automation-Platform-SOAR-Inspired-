import type { Alert, Incident, Playbook, AuditLog, ThreatIntel } from './supabase';

export const mockAlerts: Alert[] = [
  {
    id: '1', title: 'Brute Force Attack Detected', description: 'Multiple failed login attempts from 185.220.101.47 targeting admin accounts. 847 attempts in 4 minutes.',
    severity: 'critical', status: 'open', threat_type: 'Brute Force', source_ip: '185.220.101.47', destination_ip: '10.0.0.1',
    risk_score: 94, enrichment_data: { country: 'Russia', isp: 'Tor Exit Node', virustotal: { malicious: 12 } }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['brute-force', 'tor', 'admin-target'], created_at: new Date(Date.now() - 5 * 60000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '2', title: 'Suspicious Port Scan', description: 'Systematic port scan detected from 92.118.160.12. Scanning ports 1-65535.',
    severity: 'high', status: 'investigating', threat_type: 'Port Scan', source_ip: '92.118.160.12', destination_ip: '10.0.0.0/24',
    risk_score: 72, enrichment_data: { country: 'Netherlands', isp: 'Hosting Provider' }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['port-scan', 'recon'], created_at: new Date(Date.now() - 18 * 60000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '3', title: 'Malware Indicator Found', description: 'Known malware hash SHA256: a3f5bc89... detected in file upload endpoint.',
    severity: 'critical', status: 'open', threat_type: 'Malware', source_ip: '203.0.113.45', destination_ip: '10.0.1.22',
    risk_score: 98, enrichment_data: { hash: 'a3f5bc89d1e2...', virustotal: { malicious: 67, total: 70 } }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['malware', 'file-upload', 'critical'], created_at: new Date(Date.now() - 32 * 60000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '4', title: 'Geographic Anomaly - Login from High-Risk Region', description: 'User account logged in from North Korea (unusual activity for this account).',
    severity: 'high', status: 'acknowledged', threat_type: 'Geo Anomaly', source_ip: '175.45.176.3', destination_ip: '10.0.0.1',
    risk_score: 81, enrichment_data: { country: 'North Korea', city: 'Pyongyang' }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['geo-anomaly', 'account-compromise'], created_at: new Date(Date.now() - 1 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '5', title: 'API Rate Limit Exceeded', description: 'API endpoint /api/v1/auth hit 10,000 requests in 60 seconds from single source.',
    severity: 'medium', status: 'open', threat_type: 'API Abuse', source_ip: '45.142.212.18', destination_ip: '10.0.2.10',
    risk_score: 55, enrichment_data: { country: 'Germany', requests_per_min: 10000 }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['api-abuse', 'rate-limit'], created_at: new Date(Date.now() - 2 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '6', title: 'Credential Stuffing Attempt', description: '2,300 credential pairs tested against login endpoint using leaked database credentials.',
    severity: 'high', status: 'investigating', threat_type: 'Credential Stuffing', source_ip: '198.98.51.189', destination_ip: '10.0.0.1',
    risk_score: 79, enrichment_data: { country: 'USA', isp: 'Hosting', successful_logins: 3 }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['credential-stuffing', 'account-takeover'], created_at: new Date(Date.now() - 3 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '7', title: 'Outbound Data Exfiltration Suspected', description: 'Unusual outbound traffic volume from internal server: 4.7GB transferred to unknown external IP.',
    severity: 'critical', status: 'open', threat_type: 'Data Exfiltration', source_ip: '10.0.1.55', destination_ip: '91.108.4.15',
    risk_score: 96, enrichment_data: { bytes_transferred: 4831838208, destination_country: 'China' }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['exfiltration', 'insider-threat'], created_at: new Date(Date.now() - 4 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '8', title: 'SQL Injection Attempt', description: 'SQL injection payload detected in HTTP request parameter: \' OR \'1\'=\'1',
    severity: 'medium', status: 'resolved', threat_type: 'SQL Injection', source_ip: '103.21.244.0', destination_ip: '10.0.2.5',
    risk_score: 48, enrichment_data: { country: 'India', payload: '\' OR \'1\'=\'1' }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['sqli', 'web-attack'], created_at: new Date(Date.now() - 6 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '9', title: 'SSH Brute Force on Port 22', description: 'Dictionary attack on SSH service. 1,200 attempts using common username/password combinations.',
    severity: 'high', status: 'open', threat_type: 'Brute Force', source_ip: '194.165.16.72', destination_ip: '10.0.0.5',
    risk_score: 76, enrichment_data: { country: 'Romania', protocol: 'SSH', port: 22 }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['ssh', 'brute-force'], created_at: new Date(Date.now() - 7 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '10', title: 'Suspicious DNS Query Pattern', description: 'High-frequency DNS queries to newly registered domains — possible C2 communication.',
    severity: 'medium', status: 'acknowledged', threat_type: 'C2 Communication', source_ip: '10.0.1.88', destination_ip: '8.8.8.8',
    risk_score: 63, enrichment_data: { queries_per_minute: 450, domain_age_days: 3 }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['dns', 'c2', 'lateral-movement'], created_at: new Date(Date.now() - 9 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '11', title: 'Privilege Escalation Attempt', description: 'User account attempted to run commands with elevated privileges using exploit CVE-2023-4911.',
    severity: 'critical', status: 'investigating', threat_type: 'Privilege Escalation', source_ip: '10.0.1.42', destination_ip: '10.0.0.1',
    risk_score: 91, enrichment_data: { cve: 'CVE-2023-4911', user: 'svc_backup', attempted_command: 'sudo su' }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['privilege-escalation', 'insider', 'cve'], created_at: new Date(Date.now() - 12 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: null,
  },
  {
    id: '12', title: 'Phishing URL Detected in Email', description: 'Email gateway blocked message containing known phishing URL targeting corporate credentials.',
    severity: 'low', status: 'resolved', threat_type: 'Phishing', source_ip: '209.85.128.0', destination_ip: '10.0.3.12',
    risk_score: 28, enrichment_data: { url: 'http://payp4l-secure.xyz/login', virustotal: { malicious: 8 } }, assigned_to: null, event_id: null, incident_id: null,
    tags: ['phishing', 'email'], created_at: new Date(Date.now() - 14 * 3600000).toISOString(), updated_at: new Date().toISOString(), resolved_at: new Date(Date.now() - 13 * 3600000).toISOString(),
  },
];

export const mockIncidents: Incident[] = [
  {
    id: 'inc-1', incident_number: 1042, title: 'Active Ransomware Campaign — Finance Department',
    description: 'Multiple endpoints in finance department showing ransomware indicators. Files being encrypted on shared drives. Possible LockBit 3.0 variant.',
    severity: 'critical', status: 'investigating', assigned_to: null, created_by: null,
    threat_type: 'Ransomware', affected_assets: ['FIN-WS-01', 'FIN-WS-02', 'FIN-FS-01', '10.0.5.0/24'],
    tags: ['ransomware', 'lockbit', 'finance'], risk_score: 98,
    resolution_notes: '',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), updated_at: new Date().toISOString(),
    resolved_at: null, closed_at: null,
  },
  {
    id: 'inc-2', incident_number: 1041, title: 'Coordinated Brute Force — Multiple Accounts',
    description: 'Organized brute force campaign targeting 127 user accounts across 3 IP ranges. 12 accounts compromised.',
    severity: 'high', status: 'contained', assigned_to: null, created_by: null,
    threat_type: 'Brute Force', affected_assets: ['auth-server-01', '10.0.0.1'],
    tags: ['brute-force', 'account-takeover'], risk_score: 81,
    resolution_notes: 'Affected accounts locked. IPs blocked at firewall. Passwords reset.',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(), updated_at: new Date(Date.now() - 1 * 3600000).toISOString(),
    resolved_at: null, closed_at: null,
  },
  {
    id: 'inc-3', incident_number: 1040, title: 'Data Exfiltration via Compromised VPN Account',
    description: 'Threat actor used compromised VPN credentials to access internal network and exfiltrate 12GB of sensitive documents.',
    severity: 'critical', status: 'resolved', assigned_to: null, created_by: null,
    threat_type: 'Data Exfiltration', affected_assets: ['vpn-gateway', 'file-server-02', '10.0.2.0/24'],
    tags: ['data-exfiltration', 'vpn', 'credential-compromise'], risk_score: 95,
    resolution_notes: 'VPN account revoked. Affected data classified and reported to DPO. Forensic image taken.',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(), updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 24 * 3600000).toISOString(), closed_at: null,
  },
  {
    id: 'inc-4', incident_number: 1039, title: 'Supply Chain Compromise — Third-party Library',
    description: 'npm package lodash-utils@2.1.0 found to contain backdoor. Package used in 3 production services.',
    severity: 'high', status: 'resolved', assigned_to: null, created_by: null,
    threat_type: 'Supply Chain', affected_assets: ['api-service', 'user-service', 'billing-service'],
    tags: ['supply-chain', 'npm', 'backdoor'], risk_score: 87,
    resolution_notes: 'Package removed and replaced. Services redeployed. No evidence of exploitation.',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(), updated_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 48 * 3600000).toISOString(), closed_at: null,
  },
  {
    id: 'inc-5', incident_number: 1038, title: 'Unauthorized Access to AWS S3 Buckets',
    description: 'Exposed IAM credentials found in public GitHub repository. Attacker accessed 3 S3 buckets containing PII.',
    severity: 'critical', status: 'closed', assigned_to: null, created_by: null,
    threat_type: 'Cloud Misconfiguration', affected_assets: ['s3://prod-user-data', 's3://prod-backups', 's3://prod-logs'],
    tags: ['aws', 's3', 'iam', 'pii'], risk_score: 92,
    resolution_notes: 'Credentials rotated. Buckets secured. Incident report filed with legal.',
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), updated_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), closed_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
];

export const mockPlaybooks: Playbook[] = [
  {
    id: 'pb-1', name: 'IP Threat Enrichment', description: 'Automatically enriches suspicious IPs with VirusTotal, AbuseIPDB, and geolocation data then calculates risk score.',
    trigger_type: 'alert', trigger_conditions: { severity: ['high', 'critical'], threat_type: 'any' },
    actions: [
      { id: 'a1', type: 'threat_intel', name: 'Query VirusTotal', config: { source: 'virustotal' }, order: 1 },
      { id: 'a2', type: 'threat_intel', name: 'Query AbuseIPDB', config: { source: 'abuseipdb' }, order: 2 },
      { id: 'a3', type: 'risk_score', name: 'Calculate Risk Score', config: {}, order: 3 },
      { id: 'a4', type: 'create_incident', name: 'Create Incident if Score > 80', config: { threshold: 80 }, order: 4 },
      { id: 'a5', type: 'notify', name: 'Slack Notification', config: { channel: '#soc-alerts' }, order: 5 },
    ],
    is_active: true, created_by: null, execution_count: 342, last_executed_at: new Date(Date.now() - 5 * 60000).toISOString(),
    created_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'pb-2', name: 'Brute Force Response', description: 'Detects brute force patterns and automatically blocks the source IP, resets targeted accounts, and notifies on-call analyst.',
    trigger_type: 'alert', trigger_conditions: { threat_type: 'Brute Force', failed_attempts: 100 },
    actions: [
      { id: 'a1', type: 'block_ip', name: 'Block Source IP', config: { duration: '24h', firewall: 'pfsense' }, order: 1 },
      { id: 'a2', type: 'reset_accounts', name: 'Lock Targeted Accounts', config: {}, order: 2 },
      { id: 'a3', type: 'create_incident', name: 'Create Incident', config: {}, order: 3 },
      { id: 'a4', type: 'notify', name: 'PagerDuty Alert', config: { escalation: 'on-call' }, order: 4 },
    ],
    is_active: true, created_by: null, execution_count: 89, last_executed_at: new Date(Date.now() - 18 * 60000).toISOString(),
    created_at: new Date(Date.now() - 25 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'pb-3', name: 'Malware Containment', description: 'Isolates infected endpoints, captures memory dump, collects IOCs, and initiates forensic analysis workflow.',
    trigger_type: 'alert', trigger_conditions: { threat_type: 'Malware', severity: ['critical'] },
    actions: [
      { id: 'a1', type: 'isolate_endpoint', name: 'Network Isolate Endpoint', config: {}, order: 1 },
      { id: 'a2', type: 'memory_dump', name: 'Capture Memory Dump', config: {}, order: 2 },
      { id: 'a3', type: 'threat_intel', name: 'Hash Lookup — VirusTotal', config: { source: 'virustotal', type: 'hash' }, order: 3 },
      { id: 'a4', type: 'create_incident', name: 'Create P1 Incident', config: { priority: 1 }, order: 4 },
      { id: 'a5', type: 'notify', name: 'Notify CISO + SOC Lead', config: { contacts: ['ciso', 'soc-lead'] }, order: 5 },
    ],
    is_active: true, created_by: null, execution_count: 12, last_executed_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'pb-4', name: 'Phishing Triage', description: 'Automated analysis of suspected phishing emails and URLs using threat intelligence feeds.',
    trigger_type: 'alert', trigger_conditions: { threat_type: 'Phishing' },
    actions: [
      { id: 'a1', type: 'url_scan', name: 'Scan URLs — VirusTotal', config: { source: 'virustotal' }, order: 1 },
      { id: 'a2', type: 'email_analysis', name: 'Analyze Email Headers', config: {}, order: 2 },
      { id: 'a3', type: 'update_alert', name: 'Update Alert Severity', config: {}, order: 3 },
      { id: 'a4', type: 'notify', name: 'User Awareness Alert', config: { target: 'affected_user' }, order: 4 },
    ],
    is_active: true, created_by: null, execution_count: 214, last_executed_at: new Date(Date.now() - 45 * 60000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'pb-5', name: 'Daily Threat Intelligence Sync', description: 'Scheduled daily sync of threat intelligence feeds from AlienVault OTX, MISP, and internal feeds.',
    trigger_type: 'scheduled', trigger_conditions: { schedule: '0 6 * * *' },
    actions: [
      { id: 'a1', type: 'fetch_intel', name: 'Sync AlienVault OTX', config: { source: 'otx' }, order: 1 },
      { id: 'a2', type: 'fetch_intel', name: 'Sync MISP Feed', config: { source: 'misp' }, order: 2 },
      { id: 'a3', type: 'update_blocklist', name: 'Update IP Blocklist', config: {}, order: 3 },
      { id: 'a4', type: 'report', name: 'Generate Daily Brief', config: { recipients: ['soc-team'] }, order: 4 },
    ],
    is_active: true, created_by: null, execution_count: 47, last_executed_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 60 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: 'pb-6', name: 'Incident Escalation — SLA Breach', description: 'Monitors open incidents for SLA breaches and auto-escalates to senior analysts after threshold.',
    trigger_type: 'scheduled', trigger_conditions: { schedule: '*/15 * * * *', check_sla: true },
    actions: [
      { id: 'a1', type: 'check_sla', name: 'Check Open Incident SLAs', config: { threshold_hours: 4 }, order: 1 },
      { id: 'a2', type: 'escalate', name: 'Escalate Breached Incidents', config: {}, order: 2 },
      { id: 'a3', type: 'notify', name: 'Notify SOC Manager', config: { channel: 'soc-manager' }, order: 3 },
    ],
    is_active: false, created_by: null, execution_count: 0, last_executed_at: null,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(), updated_at: new Date().toISOString(),
  },
];

export const mockThreatIntel: ThreatIntel[] = [
  {
    id: 'ti-1', indicator: '185.220.101.47', indicator_type: 'ip', reputation_score: 95,
    threat_categories: ['Tor Exit Node', 'Brute Force', 'Spam'], country: 'Russia', asn: 'AS209650',
    is_tor: true, is_vpn: false, virustotal_data: { malicious: 12, total: 89 },
    abuseipdb_data: { abuse_score: 100, total_reports: 347 },
    last_seen_at: new Date(Date.now() - 5 * 60000).toISOString(), created_at: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  },
  {
    id: 'ti-2', indicator: '92.118.160.12', indicator_type: 'ip', reputation_score: 72,
    threat_categories: ['Scanner', 'Reconnaissance'], country: 'Netherlands', asn: 'AS206264',
    is_tor: false, is_vpn: true, virustotal_data: { malicious: 5, total: 89 },
    abuseipdb_data: { abuse_score: 72, total_reports: 89 },
    last_seen_at: new Date(Date.now() - 18 * 60000).toISOString(), created_at: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
  },
  {
    id: 'ti-3', indicator: 'malware-c2.darkweb.onion', indicator_type: 'domain', reputation_score: 98,
    threat_categories: ['C2', 'Malware', 'Ransomware'], country: 'Unknown', asn: 'Tor',
    is_tor: true, is_vpn: false, virustotal_data: { malicious: 45, total: 70 },
    abuseipdb_data: {},
    last_seen_at: new Date(Date.now() - 2 * 3600000).toISOString(), created_at: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'al-1', user_id: 'u1', action: 'ALERT_ACKNOWLEDGED', resource_type: 'alert', resource_id: '2', details: { alert: 'Suspicious Port Scan' }, ip_address: '10.0.0.100', user_agent: '', created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'al-2', user_id: 'u1', action: 'PLAYBOOK_EXECUTED', resource_type: 'playbook', resource_id: 'pb-1', details: { playbook: 'IP Threat Enrichment', trigger: 'auto' }, ip_address: '10.0.0.100', user_agent: '', created_at: new Date(Date.now() - 6 * 60000).toISOString() },
  { id: 'al-3', user_id: 'u2', action: 'INCIDENT_CREATED', resource_type: 'incident', resource_id: 'inc-1', details: { incident: 'Active Ransomware Campaign' }, ip_address: '10.0.0.101', user_agent: '', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 'al-4', user_id: 'u1', action: 'IP_BLOCKED', resource_type: 'alert', resource_id: '1', details: { ip: '185.220.101.47', duration: '24h' }, ip_address: '10.0.0.100', user_agent: '', created_at: new Date(Date.now() - 3 * 3600000).toISOString() },
  { id: 'al-5', user_id: 'u3', action: 'INCIDENT_STATUS_CHANGED', resource_type: 'incident', resource_id: 'inc-2', details: { from: 'investigating', to: 'contained' }, ip_address: '10.0.0.102', user_agent: '', created_at: new Date(Date.now() - 1 * 3600000).toISOString() },
];

export const mockDashboardStats = {
  totalAlerts: 847,
  criticalAlerts: 23,
  openIncidents: 8,
  resolvedToday: 41,
  avgResponseTime: '4.2 min',
  blockedIPs: 1247,
  playbooksRun: 342,
  threatsEnriched: 2891,
};

export const mockAlertTrend = [
  { time: '00:00', critical: 2, high: 4, medium: 8, low: 12 },
  { time: '02:00', critical: 1, high: 2, medium: 5, low: 9 },
  { time: '04:00', critical: 0, high: 1, medium: 3, low: 6 },
  { time: '06:00', critical: 3, high: 5, medium: 10, low: 15 },
  { time: '08:00', critical: 8, high: 12, medium: 22, low: 31 },
  { time: '10:00', critical: 14, high: 18, medium: 35, low: 44 },
  { time: '12:00', critical: 11, high: 16, medium: 28, low: 38 },
  { time: '14:00', critical: 9, high: 14, medium: 24, low: 35 },
  { time: '16:00', critical: 7, high: 11, medium: 19, low: 29 },
  { time: '18:00', critical: 5, high: 8, medium: 14, low: 22 },
  { time: '20:00', critical: 4, high: 7, medium: 12, low: 18 },
  { time: '22:00', critical: 3, high: 5, medium: 9, low: 14 },
];

export const mockThreatTypes = [
  { name: 'Brute Force', value: 28, color: '#ef4444' },
  { name: 'Malware', value: 22, color: '#f97316' },
  { name: 'Phishing', value: 18, color: '#eab308' },
  { name: 'Port Scan', value: 14, color: '#22c55e' },
  { name: 'API Abuse', value: 10, color: '#06b6d4' },
  { name: 'Other', value: 8, color: '#6366f1' },
];

export const mockIncidentTrend = [
  { day: 'Mon', opened: 5, resolved: 3 },
  { day: 'Tue', opened: 8, resolved: 6 },
  { day: 'Wed', opened: 12, resolved: 9 },
  { day: 'Thu', opened: 7, resolved: 11 },
  { day: 'Fri', opened: 9, resolved: 7 },
  { day: 'Sat', opened: 4, resolved: 5 },
  { day: 'Sun', opened: 3, resolved: 4 },
];
