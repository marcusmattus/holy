# Holy Database Setup - COMPLETED ✅

## Overview

The Holy platform database has been successfully configured using **Prisma 7** with **libSQL adapter** for SQLite. This provides a production-ready foundation for all Holy-specific data while HolyOS handles platform-level features (analytics, rewards, ads).

---

## 📊 Database Schema

### Models Implemented

#### **User**

- `id` - Unique identifier (cuid)
- `email` - Unique email address
- `name` - Display name (optional)
- `avatarUrl` - Profile picture URL (optional)
- `walletAddress` - Connected crypto wallet (optional)
- `holyosUserId` - Link to HolyOS identity (unique)
- `plan` - Subscription tier (FREE | PRO | TEAMS)
- Relations: `projects[]`, `reviews[]`

#### **Project**

- `id` - Unique identifier (cuid)
- `name` - Project name
- `slug` - URL-friendly identifier (unique)
- `description` - Project description (optional)
- `thumbnail` - Preview image URL (optional)
- `published` - Publication status (boolean)
- `storePrice` - Price in USD (optional, default: 0)
- `category` - Project category (optional)
- `techStack` - Technologies used (optional)
- `deployUrl` - Live deployment URL (optional)
- `holyosProjectId` - Link to HolyOS project (unique)
- `userId` - Owner reference
- Relations: `user`, `versions[]`, `storeEntry`

#### **ProjectVersion**

- `id` - Unique identifier (cuid)
- `projectId` - Parent project reference
- `snapshot` - Serialized editor state (JSON string)
- `label` - Version label (e.g., "v1.2", "before hero change")
- `createdAt` - Timestamp
- Relations: `project`

#### **StoreEntry**

- `id` - Unique identifier (cuid)
- `projectId` - Associated project (unique)
- `status` - Review status (DRAFT | IN_REVIEW | PUBLISHED | REJECTED)
- `screenshots` - Gallery images (JSON string array)
- `longDescription` - Detailed description (optional)
- `demoUrl` - Live demo link (optional)
- `installs` - Install count (default: 0)
- `avgRating` - Average rating (default: 0.0)
- `reviewCount` - Number of reviews (default: 0)
- `submittedAt` - Submission timestamp (optional)
- `publishedAt` - Publication timestamp (optional)
- Relations: `project`, `reviews[]`

#### **Review**

- `id` - Unique identifier (cuid)
- `storeEntryId` - Store entry reference
- `userId` - Reviewer reference
- `rating` - 1-5 stars (integer)
- `comment` - Review text (optional)
- `createdAt` - Timestamp
- Relations: `storeEntry`, `user`

---

## 🗂️ Seeded Data

The database has been populated with realistic mock data:

### Users (2)

- **Alice Johnson** (`alice@holysticlabs.com`)
  - Plan: PRO
  - Wallet: `0x1234567890abcdef1234567890abcdef12345678`
  - Avatar: Dicebear avatar
- **Bob Smith** (`bob@example.com`)
  - Plan: FREE
  - Avatar: Dicebear avatar

### Projects (3)

1. **Holy Commerce** (Alice)
   - Category: E-commerce
   - Status: Published
   - Price: $49.99
   - Tech: Next.js, Stripe, Tailwind
   - Deploy URL: `https://holy-commerce.holy.app`
2. **Neon Dashboard** (Alice)
   - Category: SaaS
   - Status: Draft
   - Tech: React, Recharts, Tailwind
3. **Launch Page v2** (Bob)
   - Category: Portfolio
   - Status: Published
   - Price: $29.99
   - Tech: Next.js, Framer Motion
   - Deploy URL: `https://launch-v2.holy.app`

### Project Versions (3)

- Holy Commerce v1.0 ("Initial release")
- Holy Commerce v1.1 ("Added checkout flow")
- Neon Dashboard v0.1 ("Work in progress")

### Store Entries (2)

- **Holy Commerce**
  - Status: PUBLISHED
  - Installs: 127
  - Rating: 4.8 ⭐ (23 reviews)
  - Published: March 15, 2026
- **Launch Page v2**
  - Status: PUBLISHED
  - Installs: 84
  - Rating: 4.6 ⭐ (15 reviews)
  - Published: April 1, 2026

### Reviews (2)

- Bob → Holy Commerce: 5 stars
- Alice → Launch Page v2: 4 stars

---

## 🛠️ Available Commands

```bash
# Development
pnpm db:push         # Push schema changes (no migration files)
pnpm db:migrate      # Create and apply migration
pnpm db:seed         # Populate database with mock data
pnpm db:studio       # Launch Prisma Studio (GUI)

# Production
pnpm db:generate     # Generate Prisma Client
```

---

## 📁 File Structure

```
apps/holy/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script
│   ├── migrations/            # Migration history
│   │   └── 20260412153257_init/
│   │       └── migration.sql
│   └── dev.db                 # SQLite database file (gitignored)
├── lib/
│   └── db.ts                  # Prisma Client singleton
├── types/
│   ├── project.ts             # Project type definitions
│   ├── store.ts               # Store type definitions
│   └── user.ts                # User type definitions
├── prisma.config.ts           # Prisma 7 configuration
└── .env                       # Environment variables
```

---

## 🔗 Integration with HolyOS

### Separation of Concerns

| Data Type             | Stored In | Purpose                             |
| --------------------- | --------- | ----------------------------------- |
| **User profile**      | Holy DB   | Email, name, avatar, plan           |
| **User identity**     | HolyOS    | Auth, sessions, permissions         |
| **Project metadata**  | Holy DB   | Name, slug, versions, store listing |
| **Project analytics** | HolyOS    | Views, visitors, conversions        |
| **Store listings**    | Holy DB   | Descriptions, screenshots, reviews  |
| **Revenue tracking**  | HolyOS    | Earnings, payouts, transactions     |
| **On-chain rewards**  | HolyOS    | Protocol distribution, claims       |
| **Ad campaigns**      | HolyOS    | Impressions, clicks, revenue        |

### Data Flow Example

```typescript
// Creating a new project
import { prisma } from '@/lib/db'
import { holyos } from '@/lib/holyos/client'

// 1. Create project in HolyOS (gets analytics, deploy pipeline)
const holyosProject = await holyos.projects.create({
  name: 'My Awesome App',
})

// 2. Create project in Holy DB (gets UI metadata, versioning)
const project = await prisma.project.create({
  data: {
    name: 'My Awesome App',
    slug: 'my-awesome-app',
    holyosProjectId: holyosProject.id, // 👈 Link the two
    userId: currentUser.id,
  },
})
```

---

## 🔄 Next Steps

### API Routes (Recommended Next)

Create CRUD endpoints:

- `POST /api/projects` - Create project
- `GET /api/projects` - List user projects
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/versions` - Save version
- `POST /api/store/submit` - Submit to store
- `POST /api/store/[id]/reviews` - Add review

### UI Components

Build forms and displays:

- New project wizard (`/dashboard/projects/new`)
- Project list view (`/dashboard/projects`)
- Store submission form (`/dashboard/store/submit`)
- Review system (`/dashboard/store/[appId]`)

---

## 🐛 Troubleshooting

### Regenerate Prisma Client

```bash
npx prisma generate
```

### Reset Database

```bash
rm -f dev.db
npx prisma migrate dev
pnpm db:seed
```

### View Database in Browser

```bash
pnpm db:studio
# Opens http://localhost:5555
```

### SQLite CLI

```bash
sqlite3 dev.db
sqlite> .tables
sqlite> SELECT * FROM User;
sqlite> .quit
```

---

## ✅ Completion Status

- [x] Prisma schema defined with all models
- [x] Initial migration created and applied
- [x] Database seeded with realistic mock data
- [x] TypeScript types generated for all models
- [x] Prisma Client configured with libSQL adapter
- [x] Package scripts added for common tasks
- [x] Singleton pattern for client (prevents connection leaks)
- [x] Environment configuration (.env)

**Database is production-ready!** ✨

---

## 📚 References

- [Prisma 7 Documentation](https://www.prisma.io/docs)
- [libSQL Adapter](https://www.prisma.io/docs/orm/overview/databases/turso)
- [Holy Architecture](../../../README.md)
- [HolyOS SDK](../../../packages/holyos-sdk/README.md)
