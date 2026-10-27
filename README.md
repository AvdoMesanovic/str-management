# STL Shadow Command Center

**Professional-Grade Asset Management for the Modern St. Louis STR Market.**

The Shadow Compliance Dashboard is a proprietary, tech-forward co-hosting platform designed to bridge the gap between St. Louis short-term rental regulations and professional property operations. By leveraging a hardware-integrated "Shadow" auditing system, we provide owners with absolute peace of mind and maximized ROI without the overhead of traditional brokerage.

> **Current Status:** The dashboard is a working visual prototype with mock data. Hardware integrations (Seam, Alertify, Phyn, Ecobee) and backend persistence are on the roadmap but not yet wired.

## The "Shadow Compliance" Philosophy

In a shifting regulatory landscape (Ordinance 72095), "good enough" hosting is a liability. This platform treats compliance as a data-engineering problem. We don't just respond to issues; we predict and prevent them through:

- **Pre-emptive Nuisance Defense:** 24/7 noise and occupancy monitoring.
- **Financial Precision:** Real-time 3% city fee accrual and audit-ready reporting.
- **Asset Protection:** Automated environmental monitoring to prevent structural damage.

## Core Modules

### Financial Auditor (Tax Engine)

- **Real-Time Accrual:** Automatic calculation of the 3% St. Louis City License Fee per booking.
- **Remittance Tracking:** Quarterly filing countdowns and CPA-ready CSV exports.

### Security & Access Command

- **Seam API Integration:** Unified management for Schlage Encode Plus locks.
- **1-Hour Response Log:** Automated audit trail of physical responses to meet city "Local Contact" requirements.

### Peace & Safety Suite

- **Alertify Webhooks:** Real-time decibel tracking with automated guest outreach before neighbors complain.
- **Safety Heartbeat:** Remote health checks for First Alert SC5 smoke/CO detectors.

### Environmental Protection

- **Flood Defense:** Instant leak alerts via Phyn Smart Water Sensors.
- **HVAC Optimization:** Utility savings through Ecobee SmartBuildings occupancy-based climate control.

## Technical Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| UI Primitives | shadcn/ui (Radix UI) |
| Charts | Recharts |
| Animation | Motion (Framer Motion) |
| Validation | Zod |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Manager-facing with "Client Mode" toggle) |
| Hardware (planned) | Seam API, Alertify API, Phyn, Ecobee |

## Project Structure

```
src/
  app/              # Next.js App Router pages, layouts, and route handlers
  components/
    ui/             # Primitive, reusable UI components (Button, Input, etc.)
  lib/
    supabase/       # Supabase client factories (client.ts, server.ts, middleware.ts)
  hooks/            # Custom React hooks (client-side only)
  types/            # Shared TypeScript type definitions
  data/             # Mock data for prototype development
```

## Getting Started

### Prerequisites

- Node.js (v18.18+)
- Supabase Account & Project

### Installation

```bash
# Clone the repository
git clone https://github.com/AvdoMesanovic/str-management.git

# Install dependencies
npm install

# Set up local environment variables
cp .env.local
```

### Environment Variables

Configure your `.env.local` with the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

## Legal & Compliance

This platform is designed to operate within the "Safe Harbor" of Missouri RSMo 339.010. It serves strictly as an Administrative and Technical Support tool.

- **No Brokerage:** The system does not negotiate leases or handle owner funds.
- **Transparency:** All platform-level data is mirrored in the "Client Mode" view for owner oversight.

## License

All Rights Reserved.

Copyright (c) 2026 Avdo Mesanovic.

Proprietary software. Unauthorized copying, modification, or distribution of this code via any medium is strictly prohibited.
