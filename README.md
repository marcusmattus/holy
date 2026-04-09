# Holy by Holystic Labs

> **The vibecoding platform.** Build, publish, and monetize web apps using AI — powered by HolyOS.

---

## What is Holy?

**Holy** is a vibecoding platform where builders create production-ready web apps through natural language prompts. Write what you want, let Holy AI generate the code, then publish to the **Holy Web App Store** and earn revenue.

### Brand Architecture

| Layer | What it is |
|-------|-----------|
| **Holy** | The product — vibecoding platform, editor, store, dashboard |
| **HolyOS** | The platform OS — runtime, analytics, rewards, API layer |
| **Holystic Labs** | The company building Holy and HolyOS |

---

## Monorepo Structure

```
holy-monorepo/
├── apps/
│   ├── holy/              # Next.js 16 app — main Holy platform UI
│   └── playground/        # API playground (legacy)
├── packages/
│   ├── holyos-sdk/        # TypeScript SDK for HolyOS API
│   ├── holyos-react/      # React hooks & components for HolyOS
│   ├── holyos-ai/         # AI tools: vibecoding, scaffolding, insights
│   └── create-holy-app/   # CLI: `npx create-holy-app`
├── brand/
│   ├── tokens/            # Design tokens (CSS & JSON)
│   └── README.md          # Brand guidelines
└── examples/              # Usage examples
```

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Run the Holy app in dev mode
pnpm --filter holy dev

# Build all packages
pnpm build:packages

# Create a new Holy app
npx create-holy-app my-app
```

---

## Packages

### `holyos-sdk`

Core TypeScript SDK for the HolyOS Platform API.

```ts
import { createClient } from 'holyos-sdk'

const holyos = createClient({ apiKey: process.env.HOLYOS_API_KEY })

const projects = await holyos.projects.list()
const metrics = await holyos.analytics.getMetrics(projectId)
const earnings = await holyos.rewards.getEarnings()
```

### `@holyos/react`

React hooks and components for HolyOS integration.

```tsx
import { HolyOSProvider, useAnalytics, useProjects } from '@holyos/react'

function App() {
  return (
    <HolyOSProvider config={{ apiKey: '...' }}>
      <Dashboard />
    </HolyOSProvider>
  )
}

function Dashboard() {
  const { projects } = useProjects()
  const { metrics } = useAnalytics('project-id')
  // ...
}
```

### `@holyos/ai-tools`

AI utilities for vibecoding, scaffolding, and analytics insights.

```ts
import { vibecode, scaffoldProject, analyzeMetrics } from '@holyos/ai-tools'

const result = await vibecode({ prompt: 'A pricing page with three tiers' })
console.log(result.code) // Generated TSX component

const insights = await analyzeMetrics({ metrics, period: 'January 2025' })
console.log(insights.recommendations)
```

### `create-holy-app`

CLI scaffolding tool.

```bash
npx create-holy-app my-dashboard
# or
pnpm create holy-app
```

---

## Tech Stack

- **Framework**: Next.js 16 + React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (new-york) + Radix UI
- **State**: Jotai
- **Charts**: Recharts
- **Fonts**: Geist Sans + Geist Mono
- **Build**: Turborepo + bunchee
- **Package manager**: pnpm

---

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Holy Purple | `#7C3AED` | Primary brand, CTAs |
| Cosmic Blue | `#2563EB` | Secondary, HolyOS layer |
| Neon Emerald | `#10B981` | Success, revenue |
| Deep Void | `#0A0A0F` | Dark background |

---

## License

Apache 2.0 — © 2025 Holystic Labs
