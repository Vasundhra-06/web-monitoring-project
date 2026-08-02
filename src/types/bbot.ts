/**
 * TypeScript type definitions for the BBOT Web Monitoring dashboard.
 * Mirrors the Pydantic models from the Python backend.
 */

// ── Enums ──────────────────────────────────────────────────────────────────────

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type ScanPreset =
  | 'subdomain-enum'
  | 'web-basic'
  | 'web-thorough'
  | 'cloud-enum'
  | 'email-enum'
  | 'kitchen-sink';

export type EventType =
  | 'DNS_NAME'
  | 'IP_ADDRESS'
  | 'OPEN_TCP_PORT'
  | 'URL'
  | 'URL_HINT'
  | 'TECHNOLOGY'
  | 'VULNERABILITY'
  | 'FINDING'
  | 'EMAIL_ADDRESS'
  | 'HTTP_RESPONSE'
  | 'STORAGE_BUCKET'
  | 'PROTOCOL'
  | 'WAF'
  | 'SOCIAL'
  | 'ORG_STUB'
  | 'ASN'
  | 'GEOLOCATION'
  | 'SCAN';

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// ── Data Models ────────────────────────────────────────────────────────────────

export interface Target {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  last_scan_at: string | null;
  findings_count: number;
}

export interface ScanEvent {
  id?: number;
  scan_id: string;
  event_type: EventType | string;
  data: string;
  source?: string;
  tags: string[];
  severity?: Severity | string | null;
  timestamp: string;
}

export interface Scan {
  id: string;
  target_id: number;
  target_name: string;
  preset: string;
  status: ScanStatus;
  started_at: string;
  finished_at: string | null;
  event_count: number;
  events: ScanEvent[];
}

export interface Stats {
  total_targets: number;
  active_scans: number;
  total_scans: number;
  subdomains_found: number;
  open_ports: number;
  vulnerabilities_found: number;
  technologies_found: number;
  emails_found: number;
  urls_found: number;
}

export interface RecentActivity {
  scan_id: string;
  target_name: string;
  preset: string;
  status: string;
  event_type: string | null;
  event_data: string | null;
  timestamp: string;
}

// ── Request Types ──────────────────────────────────────────────────────────────

export interface CreateTargetRequest {
  name: string;
  description?: string;
}

export interface CreateScanRequest {
  target_id: number;
  preset: ScanPreset;
  modules?: string[];
}

export interface QuickScanRequest {
  target: string;
  preset: ScanPreset;
}

// ── Preset metadata for UI ─────────────────────────────────────────────────────

export interface PresetInfo {
  id: ScanPreset;
  name: string;
  description: string;
  icon: string;
  intensity: 'light' | 'medium' | 'heavy';
}

export const SCAN_PRESETS: PresetInfo[] = [
  {
    id: 'subdomain-enum',
    name: 'Subdomain Enumeration',
    description: 'Discover subdomains using passive & active techniques',
    icon: '🌐',
    intensity: 'light',
  },
  {
    id: 'web-basic',
    name: 'Web Basic',
    description: 'Light web reconnaissance with technology fingerprinting',
    icon: '🔍',
    intensity: 'light',
  },
  {
    id: 'web-thorough',
    name: 'Web Thorough',
    description: 'Deep web scanning with spidering & vulnerability detection',
    icon: '🕷️',
    intensity: 'heavy',
  },
  {
    id: 'cloud-enum',
    name: 'Cloud Enumeration',
    description: 'Discover cloud resources, buckets & storage assets',
    icon: '☁️',
    intensity: 'medium',
  },
  {
    id: 'email-enum',
    name: 'Email Enumeration',
    description: 'Find email addresses associated with the target',
    icon: '📧',
    intensity: 'light',
  },
  {
    id: 'kitchen-sink',
    name: 'Kitchen Sink',
    description: 'Everything — full reconnaissance with all modules enabled',
    icon: '🚀',
    intensity: 'heavy',
  },
];

// ── Event type display config ──────────────────────────────────────────────────

export const EVENT_TYPE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  DNS_NAME:        { label: 'Subdomain',     icon: '🌐', color: '#60a5fa' },
  IP_ADDRESS:      { label: 'IP Address',    icon: '📡', color: '#a78bfa' },
  OPEN_TCP_PORT:   { label: 'Open Port',     icon: '🔓', color: '#f97316' },
  URL:             { label: 'URL',           icon: '🔗', color: '#34d399' },
  URL_HINT:        { label: 'URL Hint',      icon: '💡', color: '#6ee7b7' },
  TECHNOLOGY:      { label: 'Technology',    icon: '⚙️',  color: '#38bdf8' },
  VULNERABILITY:   { label: 'Vulnerability', icon: '⚠️',  color: '#ef4444' },
  FINDING:         { label: 'Finding',       icon: '🔎', color: '#eab308' },
  EMAIL_ADDRESS:   { label: 'Email',         icon: '📧', color: '#c084fc' },
  HTTP_RESPONSE:   { label: 'HTTP Response', icon: '📄', color: '#94a3b8' },
  STORAGE_BUCKET:  { label: 'Storage',       icon: '🗄️',  color: '#fb923c' },
  WAF:             { label: 'WAF',           icon: '🛡️',  color: '#22d3ee' },
  SOCIAL:          { label: 'Social',        icon: '👥', color: '#e879f9' },
  PROTOCOL:        { label: 'Protocol',      icon: '📶', color: '#a3e635' },
};

export const SEVERITY_CONFIG: Record<string, { color: string; bg: string }> = {
  INFO:     { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' },
  LOW:      { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)' },
  MEDIUM:   { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  HIGH:     { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
  CRITICAL: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
};
