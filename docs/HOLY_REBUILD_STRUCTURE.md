# Holy Platform Rebuild Structure

Holy by Holystic Labs is structured as a modular AI-native platform for generating, launching, distributing, and monetizing web apps.

## Product Flow

1. Idea capture
2. AI-generated Next.js MVP
3. Customization and component editing
4. Monetization setup
5. Publishing to Holy Store
6. Rewards and revenue distribution through Holystic Protocol
7. Performance tracking in Holy Insights

## Target Folder Architecture

```txt
/app
  /(platform)
    studio
    projects
    store
    protocol
    insights
    admin
  /api
    generate
    projects
    publish
    rewards
    analytics
/components
  /ui
  /layout
  /marketing
/features
  /holy-studio
  /holy-store
  /holystic-protocol
  /holy-insights
/lib
  /auth
  /db
  /queue
  /stripe
  /ai
/server
  /services
  /repositories
  /workers
  /schemas
/prisma
  schema.prisma
```

## Feature Layers

### Holy Studio
Prompt-to-app generation, live preview, project versions, component-level AI editing, deployment handoff, and template selection.

### Holy Store
Published app listings, app/plugin discovery, creator pages, install flows, payments, ratings, and app distribution.

### Holystic Protocol
Reward ledgers, revenue sharing, creator incentives, payout rules, protocol settlement policies, and onchain reward event hooks.

### Holy Insights
Revenue scenarios, funnel analytics, project performance dashboards, growth suggestions, and financial modeling.

## Required Data Entities

- `Project`
- `ProjectVersion`
- `StoreListing`
- `RewardLedger`
- `RevenueScenario`
- `AnalyticsEvent`
- `ProtocolPayoutRule`

## Build Priority

1. Fix `package.json` syntax so install and build work.
2. Keep existing auth, UI, DB, layouts, plugin, compliance, and infrastructure modules.
3. Add platform shell navigation around the core product flow.
4. Add service interfaces before wiring production AI/queue/payment providers.
5. Add Prisma entities and migrations.
6. Add real API routes for generate, project management, publish, rewards, and analytics.
7. Connect dashboards to database-backed services.

## Non-Negotiables

- No duplicated auth/database logic.
- Feature-specific code lives in `/features/*`.
- Shared reusable UI lives in `/components/*`.
- Server-only business logic lives in `/server/*`.
- External providers are wrapped in `/lib/*` adapters.
- All monetization/reward logic must be auditable.
