# Sentinal-Flow


# SentinelFlow( scroll down for how to install)

**Enterprise Security Operations Center (SOC) automation platform** for threat detection, incident response, security orchestration, and threat intelligence management.

SentinelFlow provides a modern, dark-themed web console where security analysts monitor live alerts, manage incidents through their full lifecycle, run automation playbooks, query threat intelligence indicators, and review security analytics—all backed by **Supabase** (PostgreSQL + Auth) with role-based access control.

![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Install on Your Computer (New Users)](#install-on-your-computer-new-users)
- [Getting Started (Quick Reference)](#getting-started-quick-reference)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Application Modules](#application-modules)
- [Mock Data vs. Live Data](#mock-data-vs-live-data)
- [UI & Design System](#ui--design-system)
- [Deployment](#deployment)
- [Development Scripts](#development-scripts)
- [Roadmap & Extension Points](#roadmap--extension-points)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Overview

SentinelFlow is designed to simulate and demonstrate a production-grade **cybersecurity automation platform** suitable for Security Operations Centers (SOCs). It consolidates the core workflows analysts use daily:

| Capability | Description |
|------------|-------------|
| **Alert triage** | View, filter, search, and update security alerts with severity, status, risk scores, and enrichment metadata |
| **Incident management** | Track incidents from creation through resolution with lifecycle states, comments, and affected assets |
| **SOAR playbooks** | Define and execute automation workflows triggered by alerts, incidents, or schedules |
| **Threat intelligence** | Maintain an IOC database (IPs, domains, hashes, URLs, emails) with reputation scoring |
| **Analytics** | MTTD/MTTR, alert trends, geographic attack distribution, playbook performance |
| **User management** | Supabase Auth with extended profiles and role-based permissions |

The application ships with rich **mock/demo data** so the UI is fully functional without a populated database. Authentication is **live** via Supabase—users can register, sign in, or use a demo account.

---

## Key Features

### Security Operations Dashboard (`/dashboard`)

- Real-time SOC clock and threat level indicator
- KPI stat cards: active alerts, critical alerts, open incidents, average response time, blocked IPs, playbook runs
- **24-hour alert trend** area chart (critical / high / medium / low)
- **Threat type distribution** pie chart
- **Weekly incident trend** bar chart (opened vs. resolved)
- Live feed of recent critical alerts with risk scores and geographic enrichment
- Quick links to filtered alert views

### Alert Management (`/alerts`)

- Master list with search (title, IP, threat type) and filters (severity, status)
- Summary strip: total, critical, open, investigating counts
- Split-pane detail view: enrichment data, tags, risk score, status workflow actions
- Client-side status updates: acknowledge, investigate, resolve, mark false positive
- Threat types covered in demo data: brute force, port scan, malware, geo anomaly, API abuse, credential stuffing, data exfiltration, SQLi, SSH attacks, DNS/C2, privilege escalation, phishing

### Incident Management (`/incidents`, `/incidents/[id]`)

- Filterable incident list with severity and status badges
- Auto-incrementing incident numbers (`INC-1042`, etc.)
- **Incident detail page** with:
  - Lifecycle timeline (open → investigating → contained → resolved → closed)
  - Risk score visualization
  - Affected assets and tags
  - Comment timeline (note, action, escalation, update, resolution types)
  - Add new analyst comments
- Demo scenarios: ransomware campaigns, brute force waves, data exfiltration, supply chain compromise, cloud misconfiguration

### Automation Playbooks (`/playbooks`)

- Playbook catalog with trigger types: `manual`, `alert`, `incident`, `scheduled`
- Multi-step action chains (threat intel lookup, IP block, incident creation, notifications, endpoint isolation, etc.)
- Toggle active/inactive, manual run with simulated execution delay
- Execution count and last-run timestamps
- Built-in playbooks:
  - **IP Threat Enrichment** — VirusTotal, AbuseIPDB, risk scoring, auto-incident
  - **Brute Force Response** — IP block, account lock, PagerDuty
  - **Malware Containment** — network isolation, memory dump, P1 incident
  - **Phishing Triage** — URL scan, email header analysis
  - **Daily Threat Intel Sync** — OTX/MISP feed sync (scheduled)
  - **SLA Breach Escalation** — incident SLA monitoring (inactive by default)

### Threat Intelligence (`/threat-intel`)

- IOC table with indicator type badges (IP, domain, hash, URL, email)
- Reputation scores (0–100) with malicious/suspicious/moderate/clean labels
- Tor/VPN flags, country, ASN, VirusTotal and AbuseIPDB enrichment fields
- **Live lookup** UI (simulated async search)
- Stats: total IOCs, malicious count, Tor nodes, intel sources

### Security Analytics (`/analytics`)

- KPIs: Mean Time to Detect (MTTD), Mean Time to Respond (MTTR), false positive rate, automation rate
- MTTD/MTTR trend charts by day
- Geographic attack distribution
- Playbook success/failure performance bars
- Alert volume and threat category breakdowns

### Settings (`/settings`)

- Tabbed configuration: Profile, Notifications, API Keys, Integrations, Security
- Profile editing (name, email, department, role display)
- Notification preferences (email, Slack, Discord, Telegram; severity thresholds)
- Integration placeholders (Slack, email, webhooks)
- API key management UI (masked display)

### Authentication (`/login`)

- Sign in / Register tabs
- Supabase email/password authentication
- Auto-creates `profiles` row on registration (default role: `analyst`)
- **Demo account** quick login (`demo@sentinelflow.io`)
- Protected dashboard routes—unauthenticated users redirect to `/login`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser (React Client)                       │
│  Next.js 13 App Router · Client Components · Tailwind/shadcn    │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌───────────────┐ ┌─────────────────────┐
│  AuthContext    │ │  Mock Data    │ │  Supabase Client    │
│  (session,      │ │  (alerts,     │ │  (auth + profiles;  │
│   profile)      │ │   incidents,  │ │   future: live CRUD) │
│                 │ │   playbooks)  │ │                     │
└────────┬────────┘ └───────────────┘ └──────────┬──────────┘
         │                                        │
         └────────────────┬───────────────────────┘
                          ▼
              ┌───────────────────────┐
              │   Supabase Backend     │
              │  · Auth (JWT)          │
              │  · PostgreSQL + RLS    │
              │  · 10 core tables      │
              └───────────────────────┘
```

**Routing model (Next.js App Router):**

| Route | Layout | Auth |
|-------|--------|------|
| `/` | Root | Redirects to `/dashboard` or `/login` |
| `/login` | Root | Public |
| `/dashboard`, `/alerts`, `/incidents`, etc. | `(dashboard)` group | Protected |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 13.5](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5.2 (strict mode) |
| **UI** | React 18, [Tailwind CSS 3.3](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts 2](https://recharts.org/) |
| **Forms** | React Hook Form + Zod + `@hookform/resolvers` |
| **Backend** | [Supabase](https://supabase.com/) — Auth, PostgreSQL, Row Level Security |
| **Deployment** | [Netlify](https://www.netlify.com/) with `@netlify/plugin-nextjs` |
| **Scaffolding** | Bolt.new template (`.bolt/` config) |

---

## Project Structure

```
sb1-xf8vqnya/
├── app/
│   ├── layout.tsx              # Root layout, AuthProvider, dark theme
│   ├── page.tsx                # Entry redirect (auth-aware)
│   ├── globals.css             # Tailwind + custom SOC theme
│   ├── login/
│   │   └── page.tsx            # Login / register / demo
│   └── (dashboard)/            # Protected route group
│       ├── layout.tsx          # Sidebar + auth guard
│       ├── dashboard/page.tsx  # SOC overview
│       ├── alerts/page.tsx     # Alert management
│       ├── incidents/
│       │   ├── page.tsx        # Incident list
│       │   └── [id]/page.tsx   # Incident detail
│       ├── playbooks/page.tsx  # SOAR automation
│       ├── threat-intel/page.tsx
│       ├── analytics/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── sidebar.tsx             # Main navigation
│   ├── topbar.tsx              # Page header + refresh
│   └── ui/                     # shadcn/ui component library
├── contexts/
│   └── auth-context.tsx        # Supabase auth state + profile
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── supabase.ts             # Client + TypeScript types
│   ├── mock-data.ts            # Demo alerts, incidents, playbooks, etc.
│   └── utils.ts                # Severity/status helpers, formatters
├── supabase/
│   └── migrations/
│       └── 20260518062916_sentinelflow_schema.sql
├── netlify.toml                # Netlify build config
├── next.config.js
├── tailwind.config.ts
├── components.json             # shadcn/ui config
└── package.json
```

---

## Install on Your Computer (New Users)

This guide assumes you are setting up SentinelFlow **for the first time** on your own machine. No prior Next.js experience is required—follow each step in order.

**Estimated time:** 20–40 minutes (mostly waiting for downloads).

### What you will install

| Tool | Why you need it |
|------|-----------------|
| **Node.js** (v18 or newer) | Runs the app and installs JavaScript packages |
| **npm** | Comes with Node.js; downloads project dependencies |
| **A code editor** (optional) | VS Code, Cursor, etc.—to edit `.env` and view files |
| **A Supabase account** (free) | Handles login/sign-up and the database in the cloud |
| **A web browser** | Chrome, Firefox, or Edge to use the app at `http://localhost:3000` |

You do **not** need to install PostgreSQL locally—Supabase hosts the database online.

---

### Step 1: Install Node.js

Node.js is required to run SentinelFlow on your computer.

#### Windows

1. Open [https://nodejs.org](https://nodejs.org) in your browser.
2. Download the **LTS** version (recommended for most users).
3. Run the installer (`.msi`). Accept defaults; ensure **“Add to PATH”** is checked.
4. Close and reopen **PowerShell** or **Command Prompt**.
5. Verify installation:

```powershell
node --version
npm --version
```

You should see versions like `v20.x.x` and `10.x.x`. If you see “command not found,” restart your computer and try again.

#### macOS

**Option A — Official installer**

1. Download LTS from [https://nodejs.org](https://nodejs.org).
2. Run the `.pkg` installer.
3. Open **Terminal** and run:

```bash
node --version
npm --version
```

**Option B — Homebrew** (if you use Homebrew)

```bash
brew install node
node --version
```

#### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install -y nodejs npm
node --version
```

If `node` is older than v18, install from [NodeSource](https://github.com/nodesource/distributions) or use [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Restart terminal, then:
nvm install 20
nvm use 20
```

---

### Step 2: Get the project on your computer

Choose **one** of these methods:

#### Option A — Download ZIP

1. Download or copy the project folder (e.g. `sb1-xf8vqnya`) to a simple path, such as:
   - Windows: `C:\Projects\sb1-xf8vqnya`
   - macOS/Linux: `~/Projects/sb1-xf8vqnya`
2. **Avoid** paths with special characters or very long names if possible.

#### Option B — Git clone

If the project is in a Git repository:

```bash
git clone <repository-url>
cd sb1-xf8vqnya
```

---

### Step 3: Open a terminal in the project folder

You must run all commands **inside** the project directory (where `package.json` lives).

#### Windows

1. Open File Explorer and go to your project folder.
2. Click the address bar, type `powershell`, press Enter  
   **or** right-click the folder → **Open in Terminal**.
3. Confirm you are in the right place:

```powershell
dir package.json
```

#### macOS / Linux

```bash
cd ~/Projects/sb1-xf8vqnya
ls package.json
```

---

### Step 4: Install project dependencies

In the project folder, run:

```bash
npm install
```

This downloads all required packages into `node_modules/`. It may take **2–5 minutes** depending on your internet speed.

**Success looks like:** no red `ERR!` lines; a `node_modules` folder appears.

**If you see errors:**

- **EACCES / permission denied** — Do not use `sudo npm install` on macOS/Linux unless you know why; fix folder permissions instead.
- **Network timeout** — Retry: `npm install`
- **Unsupported engine** — Upgrade Node.js to v18+ (Step 1).

---

### Step 5: Create a Supabase project (backend)

SentinelFlow uses [Supabase](https://supabase.com) for authentication and the database.

1. Go to [https://supabase.com](https://supabase.com) and **Sign up** (free tier is enough).
2. Click **New project**.
3. Choose an organization, set a **project name** (e.g. `sentinelflow`), set a **database password** (save it somewhere safe), and pick a region close to you.
4. Wait until the project status is **Active** (1–2 minutes).

#### Run the database migration

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. On your computer, open this file in a text editor:

   `supabase/migrations/20260518062916_sentinelflow_schema.sql`

4. Copy **all** contents and paste into the Supabase SQL Editor.
5. Click **Run** (or press Ctrl+Enter).
6. You should see a success message; tables like `profiles`, `alerts`, `incidents` are created.

#### Get your API keys

1. In Supabase, go to **Project Settings** (gear icon) → **API**.
2. Copy:
   - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   (Use the **anon** key, not the `service_role` key.)

#### (Optional) Create a demo login user

For the **Continue with Demo Account** button on the login page:

1. Go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `demo@sentinelflow.io`
3. Password: `Demo@12345`
4. Check **Auto Confirm User** if available, then create.
5. After first login, the app creates a `profiles` row automatically on register; for a manually created user, you may need to insert a profile row in SQL Editor:

```sql
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Demo Analyst', 'analyst'
FROM auth.users
WHERE email = 'demo@sentinelflow.io';
```

---

### Step 6: Configure environment variables

The app needs your Supabase URL and key in a `.env` file at the project root.

#### Windows (PowerShell)

```powershell
copy .env.example .env
notepad .env
```

#### macOS / Linux

```bash
cp .env.example .env
nano .env
```

Edit `.env` so it contains **your** values (no quotes needed):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Save the file and close the editor.

> **Important:** After changing `.env`, **stop and restart** the dev server (`npm run dev`) so Next.js picks up the new values.

---

### Step 7: Start the application

In the same terminal (project folder):

```bash
npm run dev
```

**Success looks like:**

```text
▲ Next.js 13.5.1
- Local:        http://localhost:3000
```

1. Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**
2. You should be redirected to the **login** page.
3. Either:
   - Click **Continue with Demo Account** (if you created the demo user), or
   - Open the **Register** tab and create your own account.

After login, you land on the **Security Operations Center** dashboard.

#### Stop the server

In the terminal, press **Ctrl + C**.

#### Run again later

Every time you want to use SentinelFlow:

```bash
cd path/to/sb1-xf8vqnya
npm run dev
```

You only need `npm install` again if `package.json` changes or you delete `node_modules`.

---

### Step 8: First-time checklist

Use this checklist to confirm everything works:

- [ ] `node --version` shows v18 or higher  
- [ ] `npm install` completed without errors  
- [ ] Supabase SQL migration ran successfully  
- [ ] `.env` file exists with correct URL and anon key  
- [ ] `npm run dev` starts without errors  
- [ ] Browser opens `http://localhost:3000` and shows the login page  
- [ ] You can register or sign in and see the dashboard  

**Note:** Alerts, incidents, and playbooks use **demo mock data** in the UI by default—they will appear even if your database tables are empty. Login and user profiles use **live Supabase** data.

---

## Getting Started (Quick Reference)

For experienced developers who already have Node.js and Supabase:

```bash
cd sb1-xf8vqnya
npm install
cp .env.example .env    # Windows: copy .env.example .env
# Edit .env with Supabase URL + anon key
# Run supabase/migrations/20260518062916_sentinelflow_schema.sql in Supabase SQL Editor
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo account

| Field | Value |
|-------|--------|
| Email | `demo@sentinelflow.io` |
| Password | `Demo@12345` |

The demo user must exist in Supabase Auth (see [Step 5](#step-5-create-a-supabase-project-backend)).

### Register a new account

1. Go to `/login` → **Register**
2. Enter full name, email, password (min. 8 characters)
3. A `profiles` row is created with role `analyst`
4. You are redirected to `/dashboard`

---

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous (public) API key |

> Never commit service role keys to the frontend. Only the **anon** key is used client-side; RLS policies enforce access control.

---

## Database Schema

Apply the migration at `supabase/migrations/20260518062916_sentinelflow_schema.sql`.

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to `auth.users` (role, department, avatar) |
| `events` | Raw security events from detection engine |
| `alerts` | Security alerts with severity, status, risk score, enrichment |
| `incidents` | Incident records with lifecycle and affected assets |
| `incident_comments` | Analyst notes and timeline on incidents |
| `playbooks` | Automation workflow definitions (JSON actions) |
| `playbook_executions` | Execution logs for playbook runs |
| `threat_intel` | IOC database with reputation and feed data |
| `audit_logs` | Immutable activity audit trail |
| `notifications` | *(referenced in schema comments)* notification queue |

### Entity Relationships

```
auth.users ──► profiles
events ──► alerts ──► incidents
                    └── incident_comments
playbooks ──► playbook_executions
alerts / incidents linked to playbook_executions
threat_intel (standalone IOC store)
audit_logs ──► profiles
```

### Indexes

Optimized queries on: `alerts(severity, status, created_at, source_ip)`, `incidents(status, severity, created_at)`, `events(created_at)`, `audit_logs(created_at)`, `threat_intel(indicator)`.

---

## Authentication & Authorization

### Auth Flow

1. `AuthProvider` wraps the app in `app/layout.tsx`
2. On mount: `supabase.auth.getSession()` + `onAuthStateChange` listener
3. Authenticated users fetch `profiles` row by `auth.uid()`
4. Dashboard layout redirects unauthenticated users to `/login`

### Roles (`profiles.role`)

| Role | Permissions (via RLS) |
|------|------------------------|
| **admin** | Full access; view all audit logs |
| **analyst** | Read all; write alerts, incidents, comments, playbooks, threat intel, events |
| **viewer** | Read-only (SELECT policies only) |

### Row Level Security

All tables have RLS enabled. Policies check `profiles.role` for INSERT/UPDATE operations. Audit logs restrict full visibility to admins; analysts see only their own entries.

---

## Application Modules

### `lib/supabase.ts`

Exports the Supabase browser client and TypeScript interfaces: `Profile`, `Alert`, `Incident`, `IncidentComment`, `Playbook`, `PlaybookAction`, `ThreatIntel`, `AuditLog`.

### `lib/mock-data.ts`

Contains production-quality demo datasets:

- 12 alerts, 5 incidents, 6 playbooks, 3 threat intel records, 5 audit logs
- Dashboard stats, alert/incident trends, threat type breakdown

### `lib/utils.ts`

Shared helpers: `severityBg`, `statusBg`, `riskScoreColor`, `riskScoreBg`, `timeAgo`, `truncate`, `formatDate`, `cn` (class merge).

### `contexts/auth-context.tsx`

Provides: `user`, `session`, `profile`, `loading`, `signIn`, `signUp`, `signOut`.

---

## Mock Data vs. Live Data

| Module | Data Source | Notes |
|--------|-------------|-------|
| Auth / Profiles | **Live Supabase** | Registration creates real users |
| Dashboard, Alerts, Incidents, Playbooks, Threat Intel, Analytics | **Mock data** | `lib/mock-data.ts`; UI mutations are client-side only |
| Settings save | **Simulated** | Local state + timeout; not persisted to Supabase |

To connect live data, replace `mockAlerts` / `mockIncidents` imports with Supabase queries, e.g.:

```typescript
const { data } = await supabase.from('alerts').select('*, profiles(*)').order('created_at', { ascending: false });
```

---

## UI & Design System

- **Theme:** Dark mode by default (`className="dark"` on `<html>`)
- **Accent:** Cyan (`cyan-400` / `cyan-500`) for primary actions and active nav
- **Severity colors:** Critical (red), High (orange), Medium (yellow), Low (green)
- **Typography:** Inter (Google Fonts)
- **Components:** Full shadcn/ui library under `components/ui/`
- **Patterns:** Sticky topbar, fixed sidebar (224px), card-based layouts, live pulse dots, grid background on login

Custom CSS utilities in `globals.css` include `grid-pattern`, `live-dot` animation, and SOC-specific semantic colors.

---

## Deployment

### Netlify (configured)

`netlify.toml`:

```toml
[build]
command = "npx next build"
publish = ".next"

[[plugins]]
package = "@netlify/plugin-nextjs"
```

1. Connect repository to Netlify
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in site environment variables
3. Deploy

### Vercel / Other

Works on any Next.js 13-compatible host. Ensure environment variables are set and run `npm run build`.

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (Next.js config) |
| `npm run typecheck` | TypeScript check without emit |

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| **`node` or `npm` is not recognized** | Reinstall Node.js from [nodejs.org](https://nodejs.org). Restart terminal (or PC). On Windows, confirm Node was added to PATH during install. |
| **`npm install` fails with ENOENT or path errors** | Move the project to a shorter path (e.g. `C:\Projects\sentinelflow`). Avoid spaces or special characters in folder names. |
| **Port 3000 already in use** | Stop the other app using port 3000, or run: `npm run dev -- -p 3001` and open `http://localhost:3001`. |
| **Blank page or “Initializing SentinelFlow…” forever** | Check browser console (F12). Verify `.env` values. Restart `npm run dev` after editing `.env`. |
| **Login fails / “Invalid API key”** | Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` match Supabase → Settings → API. Use the **anon** key only. |
| **Register works but dashboard is empty / errors** | Run the SQL migration (Step 5). Ensure `profiles` table exists and RLS policies were created. |
| **“Demo account unavailable”** | Create user `demo@sentinelflow.io` in Supabase Auth, or use **Register** to make your own account. |
| **Email confirmation required** | In Supabase: **Authentication** → **Providers** → **Email** → disable “Confirm email” for local testing, or confirm via the email link Supabase sends. |
| **Changes to `.env` not applied** | Stop the dev server (Ctrl+C) and run `npm run dev` again. |
| **`npm run build` fails** | Run `npm run typecheck` for TypeScript errors. Ensure Node.js is v18+. Delete `node_modules` and `.next`, then `npm install` and retry. |

If you are still stuck, note the **exact error message** from the terminal or browser console when asking for help.

---

## Roadmap & Extension Points

Suggested enhancements for production use:

1. **Wire Supabase CRUD** — Replace mock data with real-time subscriptions (`supabase.channel`)
2. **Playbook execution engine** — Server-side Edge Functions to run playbook actions
3. **Threat feed integrations** — VirusTotal, AbuseIPDB, AlienVault OTX API keys in settings
4. **Event ingestion API** — REST/webhook endpoint to insert into `events` table
5. **Notifications table** — Implement delivery for Slack/PagerDuty/email
6. **Command palette** — Wire sidebar `⌘K` search to global navigation
7. **Audit logging** — Insert into `audit_logs` on user actions
8. **Admin user management** — CRUD for profiles and role assignment

---

## Security Considerations

- All database access goes through Supabase RLS—never bypass with service role keys in the browser
- Use strong passwords; enable Supabase email confirmation in production
- Rotate anon keys if exposed; restrict Supabase API with additional policies as needed
- Mock data includes realistic attack scenarios—do not use real PII or production credentials in demos
- The `.env` file is gitignored; do not commit secrets

---

## License

This project was generated as a demonstration/template application. Specify your license terms before production or public distribution.

---

## Acknowledgments

- Built with [Bolt.new](https://bolt.new/) scaffolding
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)



What you need — Node.js, npm, browser, Supabase (no local PostgreSQL).

Step 1: Install Node.js — Windows (installer + PowerShell checks), macOS (installer or Homebrew), Linux (apt + nvm).

Step 2: Get the project — ZIP download or git clone, with sensible folder paths.

Step 3: Open a terminal in the project — Windows (Explorer → PowerShell) and macOS/Linux (cd + verify package.json).

Step 4: npm install — What success looks like and common errors.

Step 5: Supabase setup — Create project, run SQL migration, copy API keys, optional demo user + SQL for profiles.

Step 6: .env file — Copy from .env.example, edit on Windows (copy + Notepad) and macOS/Linux (cp + nano).

Step 7: npm run dev — Open http://localhost:3000, login/register, how to stop and restart later.

Step 8: First-time checklist — Checkbox list to confirm the install.

Troubleshooting table — Node not found, port 3000, bad API keys, email confirmation, etc.
