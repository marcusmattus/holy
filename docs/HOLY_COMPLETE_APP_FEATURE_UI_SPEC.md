# Holy by Holystic Labs — Complete App Feature and UI Build Spec

## 1. Product Vision

Holy is an AI-native vibe-coding platform that helps users turn an idea into a live, monetizable Next.js web app. The platform should feel like a mix of Vercel, v0, Replit, CodeSandbox, Stripe dashboard, and an app marketplace, but branded as a single product operating system for builders.

The complete product flow is:

```txt
Idea → AI-generated MVP → Live preview → Code editing → Project saving → Monetization setup → Publish to Holy Store → Track performance → Reward contributors
```

Holy should preserve existing working modules such as auth, UI primitives, layouts, database utilities, plugin infrastructure, runtime services, compliance dashboards, and existing admin surfaces. New features should be added as modular feature layers rather than duplicate logic.

---

## 2. Core Product Modules

### 2.1 Holy Studio

Holy Studio is the main builder experience.

#### Purpose

Allow users to generate a Next.js MVP from a prompt, preview it live, edit code, save versions, and prepare it for publishing.

#### Key Features

- Prompt-to-app generation
- App type selector: SaaS, marketplace, dashboard, landing page, agent app, fintech, community, AI tool
- AI model selector: OpenAI, Anthropic, Google, fallback mock generator
- Generated file manifest
- Sandpack live preview
- Monaco code editor
- File tree explorer
- Multi-file editing
- Save project
- Save version
- AI edit prompt inside editor
- Component-level edit mode
- Regenerate selected file
- Export project ZIP later
- Deploy handoff later

#### Main Screens

##### Studio Home

Route:

```txt
/app/(platform)/studio/page.tsx
```

UI layout:

- Header: `Holy Studio`
- Subtitle: `Turn an idea into a working Next.js MVP.`
- Prompt card
- App category chips
- Model selector
- Generate button
- Recent drafts panel
- Example prompts panel

Prompt card components:

- Large textarea
- `Generate App` button
- `Use template` button
- `Advanced options` dropdown

Example prompt cards:

- `Build a SaaS analytics dashboard for indie hackers`
- `Build a crypto rewards marketplace`
- `Build a booking platform for music studios`
- `Build a landing page with pricing and waitlist`

##### Generated App Workspace

Route:

```txt
/app/(platform)/projects/[id]/page.tsx
```

Three-column layout:

```txt
[ File Tree ] [ Monaco Editor ] [ Live Preview ]
```

Left panel:

- Project name
- Status badge
- File tree
- Version selector
- Add file button
- AI actions

Center panel:

- Monaco editor
- File tabs
- Save button
- Format button
- AI edit input

Right panel:

- Sandpack preview
- Device toggle: desktop / tablet / mobile
- Console panel
- Preview refresh button

---

### 2.2 Projects

Projects are saved generated apps.

#### Purpose

Users need a persistent workspace for every app they generate.

#### Key Features

- Project list
- Project cards
- Search projects
- Filter by status
- Open editor
- Rename project
- Archive project
- Duplicate project
- Version history
- Publish status
- Store listing status
- Analytics preview

#### Main Screens

##### Projects Dashboard

Route:

```txt
/app/(platform)/projects/page.tsx
```

UI layout:

- Page header
- `New project` button
- Search bar
- Status filters
- Project grid

Project card includes:

- App thumbnail
- Name
- Description
- Status badge
- Last edited date
- Stack chips
- Actions: Open, Duplicate, Publish

##### Project Settings

Route:

```txt
/app/(platform)/projects/[id]/settings/page.tsx
```

Sections:

- Project identity
- App metadata
- Environment variables
- Deployment settings
- Monetization settings
- Danger zone

---

### 2.3 Holy Store

Holy Store is the marketplace and distribution layer.

#### Purpose

Allow builders to publish generated apps, templates, plugins, and paid tools.

#### Key Features

- Store homepage
- Featured apps
- Categories
- Search
- App detail pages
- Creator profiles
- Install flow
- Buy flow
- Publish from project
- Draft listing editor
- Pricing setup
- Revenue split setup
- Reviews and ratings
- Plugin marketplace compatibility

#### Main Screens

##### Store Home

Route:

```txt
/app/(platform)/store/page.tsx
```

UI layout:

- Hero search bar
- Featured apps carousel
- Category chips
- Trending apps grid
- New launches
- Verified creators

Categories:

- AI tools
- SaaS dashboards
- Web3 apps
- Fintech
- Marketplaces
- Creator tools
- Landing pages
- Internal tools
- Plugins

##### Store Listing Page

Route:

```txt
/app/(platform)/store/[slug]/page.tsx
```

Sections:

- App hero
- Screenshot gallery
- Description
- Features
- Pricing
- Creator
- Install / Buy button
- Reviews
- Related apps

##### Publish Flow

Route:

```txt
/app/(platform)/projects/[id]/publish/page.tsx
```

Steps:

1. Listing basics
2. Screenshots
3. Pricing
4. Revenue sharing
5. Compliance checks
6. Publish

---

### 2.4 Holystic Protocol

Holystic Protocol is the reward, revenue, and incentive layer.

#### Purpose

Track revenue shares, creator payouts, app installs, referrals, contributors, and onchain reward events.

#### Key Features

- Reward ledger
- Revenue split rules
- Contributor incentives
- Referral rewards
- Install rewards
- App sale rewards
- Protocol fee tracking
- Onchain event hooks
- Payout status
- Settlement dashboard

#### Main Screens

##### Protocol Dashboard

Route:

```txt
/app/(platform)/protocol/page.tsx
```

UI layout:

- Total rewards issued
- Pending payouts
- Active revenue splits
- Protocol volume
- Reward ledger table

Cards:

- Creator earnings
- Referral rewards
- Store revenue
- Protocol fees

##### Revenue Split Setup

Route:

```txt
/app/(platform)/projects/[id]/monetization/page.tsx
```

UI:

- Pricing model selector
- Subscription / one-time / free / usage-based
- Contributor split table
- Protocol fee preview
- Creator payout preview
- Save monetization setup

---

### 2.5 Holy Insights

Holy Insights is the analytics, finance, and growth optimization layer.

#### Purpose

Help builders understand project performance, revenue potential, store conversion, traffic, installs, and monetization opportunities.

#### Key Features

- Project analytics
- Store listing analytics
- Revenue scenario modeling
- Funnel analytics
- Install tracking
- Conversion tracking
- Growth recommendations
- Pricing simulation
- Ad strategy suggestions
- Cohort retention later

#### Main Screens

##### Insights Home

Route:

```txt
/app/(platform)/insights/page.tsx
```

UI layout:

- KPI cards
- Revenue chart
- Install chart
- Conversion funnel
- Top projects table
- AI growth recommendations

KPI cards:

- Total projects
- Published apps
- Store installs
- Revenue
- Conversion rate
- Reward payouts

##### Revenue Scenario Builder

Route:

```txt
/app/(platform)/insights/revenue-scenarios/page.tsx
```

Inputs:

- Monthly visitors
- Conversion rate
- Price
- Churn
- Store fee
- Protocol reward allocation

Outputs:

- Monthly revenue
- Annual revenue
- Creator earnings
- Protocol rewards
- Break-even estimate

---

## 3. Platform Shell UI

The app should use a persistent platform shell similar to Vercel dashboard.

### Layout

```txt
┌──────────────────────────────────────────────┐
│ Top Bar                                      │
├──────────────┬───────────────────────────────┤
│ Sidebar      │ Page Content                  │
│              │                               │
│ Studio       │                               │
│ Projects     │                               │
│ Store        │                               │
│ Protocol     │                               │
│ Insights     │                               │
│ Plugins      │                               │
│ Admin        │                               │
└──────────────┴───────────────────────────────┘
```

### Sidebar Navigation

Primary items:

- Studio
- Projects
- Store
- Protocol
- Insights
- Plugins
- Infrastructure
- Compliance
- Settings

### Top Bar

Elements:

- Workspace switcher
- Search / command palette
- `New app` button
- Notifications
- User menu

### Command Palette

Shortcut: `Cmd + K`

Actions:

- New project
- Generate app
- Open project
- Publish app
- View analytics
- Manage rewards
- Open settings

---

## 4. Visual Design System

### Brand Direction

Holy should feel premium, dark, technical, and monetization-native.

Design keywords:

- AI-native
- Builder OS
- Dark luxury
- Vercel-like clarity
- Gold protocol energy
- Clean developer dashboard
- Futuristic but usable

### Colors

```txt
Background: #0A0A0A
Surface: #111111
Surface elevated: #171717
Border: rgba(255,255,255,0.10)
Primary gold: #C9A24A
Gold hover: #E0B85C
Text primary: #F8F2E5
Text secondary: rgba(248,242,229,0.70)
Muted: rgba(255,255,255,0.45)
Success: #3DDC97
Warning: #F4B740
Danger: #FF5A5F
Info: #70A7FF
```

### Typography

Use:

- Geist Sans
- Space Grotesk for large headings if available
- Mono font for code, IDs, logs, and protocol data

### UI Components

Required components:

- Button
- Input
- Textarea
- Select
- Tabs
- Badge
- Card
- StatCard
- DataTable
- EmptyState
- Modal
- Sheet
- Toast
- CommandMenu
- FileTree
- CodeEditorShell
- PreviewFrame
- RevenueChart
- ProjectCard
- StoreListingCard
- RewardLedgerTable

### UI Style Rules

- Use rounded-xl for cards
- Use subtle white borders
- Use gold only for primary actions and status highlights
- Avoid too many gradients
- Keep dashboards clean and readable
- Use dense layouts only for editor and admin views
- Use empty states everywhere
- Use loading skeletons on async pages

---

## 5. Data Model Requirements

### Core Models

```prisma
model Project {
  id          String   @id @default(cuid())
  userId      String
  name        String
  slug        String
  prompt      String
  description String?
  status      ProjectStatus @default(DRAFT)
  manifest    Json
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ProjectVersion {
  id        String   @id @default(cuid())
  projectId String
  label     String
  manifest  Json
  createdAt DateTime @default(now())
}

model StoreListing {
  id          String   @id @default(cuid())
  projectId   String
  creatorId   String
  title       String
  slug        String   @unique
  description String
  category    String?
  priceType   PriceType @default(FREE)
  priceCents  Int      @default(0)
  status      ListingStatus @default(DRAFT)
  screenshots Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model RewardLedger {
  id          String   @id @default(cuid())
  userId      String
  projectId   String?
  listingId   String?
  amount      Decimal
  currency    String
  source      RewardSource
  status      RewardStatus @default(PENDING)
  metadata    Json?
  createdAt   DateTime @default(now())
}

model RevenueScenario {
  id              String   @id @default(cuid())
  projectId        String?
  name             String
  monthlyVisitors  Int
  conversionRate   Float
  priceCents       Int
  churnRate        Float
  platformFeeRate  Float
  rewardRate       Float
  result           Json
  createdAt        DateTime @default(now())
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  projectId String?
  listingId String?
  type      String
  payload   Json?
  createdAt DateTime @default(now())
}
```

### Enums

```prisma
enum ProjectStatus {
  DRAFT
  GENERATED
  EDITING
  PUBLISHED
  ARCHIVED
}

enum PriceType {
  FREE
  PAID
  SUBSCRIPTION
  USAGE_BASED
}

enum ListingStatus {
  DRAFT
  REVIEW
  PUBLISHED
  UNLISTED
  SUSPENDED
}

enum RewardSource {
  STORE_SALE
  INSTALL
  REFERRAL
  CONTRIBUTOR_SPLIT
  PROTOCOL_INCENTIVE
}

enum RewardStatus {
  PENDING
  APPROVED
  PAID
  FAILED
}
```

---

## 6. API Routes

### Studio

```txt
POST /api/studio/generate
POST /api/studio/edit
POST /api/studio/explain
```

### Projects

```txt
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/version
```

### Store

```txt
GET   /api/store/listings
POST  /api/store/listings
GET   /api/store/listings/:slug
PATCH /api/store/listings/:id
POST  /api/store/listings/:id/publish
POST  /api/store/listings/:id/install
```

### Protocol

```txt
GET  /api/rewards/ledger
POST /api/rewards/issue
GET  /api/revenue/splits
POST /api/revenue/splits
POST /api/revenue/settle
```

### Insights

```txt
GET  /api/analytics/overview
POST /api/analytics/events
GET  /api/analytics/projects/:id
POST /api/insights/revenue-scenarios
GET  /api/insights/revenue-scenarios
```

---

## 7. Vercel/v0 Build Prompt

Use this prompt when building from a Vercel/v0-style example:

```txt
Build Holy by Holystic Labs as a complete AI-native app generation platform using Next.js App Router, TypeScript, Tailwind, shadcn/ui-style components, Prisma/Postgres, Redis-ready queues, AI SDK, Sandpack, Monaco Editor, Stripe, and modular feature folders.

Use a Vercel dashboard-inspired UI with a dark premium theme, gold primary accent (#C9A24A), clean cards, sidebar navigation, top command bar, and a professional developer-product feel.

Implement these major modules:

1. Holy Studio: prompt-to-app generation, generated file manifest, Sandpack live preview, Monaco editor, file tree, save project, versioning, and AI edit actions.
2. Projects: project dashboard, project detail editor, project settings, status badges, version history, and publish actions.
3. Holy Store: marketplace homepage, listing cards, app detail pages, publish flow, pricing setup, and creator profiles.
4. Holystic Protocol: reward ledger, revenue split setup, contributor incentives, payout status, and protocol dashboard.
5. Holy Insights: analytics dashboard, revenue scenario builder, project metrics, conversion funnel, and growth recommendations.

Preserve existing auth, UI primitives, database utilities, layouts, plugin system, compliance screens, runtime services, and admin infrastructure. Do not duplicate existing logic. Put feature-specific code in /features, shared UI in /components, server business logic in /server, provider adapters in /lib, and routes in /app.

Make the app production-ready with loading states, empty states, typed API payloads, service/repository separation, reusable UI components, and clear data model boundaries.

Core user journey:
Idea → generate Next.js MVP → live preview → edit code → save project → configure monetization → publish to Holy Store → track analytics → reward contributors.
```

---

## 8. Implementation Phases

### Phase 1 — Stabilize Build

- Fix package manifest
- Run install
- Run lint
- Run type-check
- Confirm existing routes build

### Phase 2 — Studio MVP

- Prompt form
- AI generation service
- Generated manifest format
- Sandpack preview
- Save project

### Phase 3 — Project IDE

- Project list
- Project detail
- Monaco editor
- File tree
- Save edits
- Version history

### Phase 4 — Persistence

- Add Prisma models
- Add migrations
- Replace in-memory repositories
- Add user/workspace ownership

### Phase 5 — Store

- Listing model
- Store homepage
- Listing detail
- Publish flow
- Install/buy flow

### Phase 6 — Monetization + Protocol

- Stripe product/price setup
- Reward ledger
- Revenue splits
- Payout status
- Protocol event hooks

### Phase 7 — Insights

- Analytics events
- Dashboard cards
- Charts
- Revenue scenarios
- AI growth recommendations

### Phase 8 — Production Readiness

- Auth guards
- Rate limits
- Queue workers
- Error boundaries
- Monitoring
- Audit logs
- Security checks

---

## 9. Acceptance Criteria

The app is complete when a user can:

1. Sign in
2. Create a new app from a prompt
3. See generated files
4. Preview the app live
5. Edit code in the browser
6. Save the project
7. Reopen the project later
8. Publish it to Holy Store
9. Configure pricing and revenue sharing
10. Track analytics
11. See reward ledger events
12. Manage project settings
13. Use the platform without breaking existing modules

---

## 10. Product Positioning

Holy is not just a website builder. It is a creation-to-revenue platform.

One-liner:

```txt
Holy helps builders generate, launch, distribute, and monetize Next.js apps with AI-native workflows and onchain reward infrastructure.
```

Tagline options:

```txt
Build fast. Launch beautifully. Monetize intelligently.
```

```txt
From idea to income-generating app.
```

```txt
The AI-native product OS for modern builders.
```
