import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

async function main() {
  const adapterFactory = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:dev.db',
  })

  const prisma = new PrismaClient({ adapter: adapterFactory })
  
  console.log('🌱 Seeding database...')

  // Create users
  const alice = await prisma.user.upsert({
    where: { email: 'alice@holysticlabs.com' },
    update: {},
    create: {
      email: 'alice@holysticlabs.com',
      name: 'Alice Johnson',
      holyosUserId: 'holyos_alice_001',
      plan: 'PRO',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    },
  })

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      holyosUserId: 'holyos_bob_002',
      plan: 'FREE',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    },
  })

  console.log(`✅ Created users: Alice (${alice.id}), Bob (${bob.id})`)

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Holy Commerce',
      slug: 'holy-commerce',
      description: 'E-commerce platform built with vibecoding',
      category: 'E-commerce',
      techStack: 'Next.js, Stripe, Tailwind',
      published: true,
      storePrice: 49.99,
      thumbnail: '/projects/commerce-thumb.jpg',
      deployUrl: 'https://holy-commerce.holy.app',
      holyosProjectId: 'prj_commerce_001',
      userId: alice.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'Neon Dashboard',
      slug: 'neon-dashboard',
      description: 'Analytics dashboard with real-time charts',
      category: 'SaaS',
      techStack: 'React, Recharts, Tailwind',
      published: false,
      thumbnail: '/projects/dashboard-thumb.jpg',
      holyosProjectId: 'prj_dashboard_002',
      userId: alice.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Launch Page v2',
      slug: 'launch-page-v2',
      description: 'Modern product launch landing page',
      category: 'Portfolio',
      techStack: 'Next.js, Framer Motion',
      published: true,
      storePrice: 29.99,
      thumbnail: '/projects/launch-thumb.jpg',
      deployUrl: 'https://launch-v2.holy.app',
      holyosProjectId: 'prj_launch_003',
      userId: bob.id,
    },
  })

  console.log(`✅ Created ${3} projects`)

  // Create project versions
  await prisma.projectVersion.createMany({
    data: [
      {
        projectId: project1.id,
        snapshot: JSON.stringify({ version: '1.0', components: [] }),
        label: 'Initial release',
      },
      {
        projectId: project1.id,
        snapshot: JSON.stringify({ version: '1.1', components: [] }),
        label: 'Added checkout flow',
      },
      {
        projectId: project2.id,
        snapshot: JSON.stringify({ version: '0.1', components: [] }),
        label: 'Work in progress',
      },
    ],
  })

  console.log(`✅ Created project versions`)

  // Create store entries
  const storeEntry1 = await prisma.storeEntry.create({
    data: {
      projectId: project1.id,
      status: 'PUBLISHED',
      screenshots: JSON.stringify([
        '/store/commerce-1.jpg',
        '/store/commerce-2.jpg',
        '/store/commerce-3.jpg',
      ]),
      longDescription:
        'A complete e-commerce solution with cart, checkout, and payment processing. Built with modern stack and optimized for performance.',
      demoUrl: 'https://holy-commerce.holy.app',
      installs: 127,
      avgRating: 4.8,
      reviewCount: 23,
      publishedAt: new Date('2026-03-15'),
    },
  })

  const storeEntry2 = await prisma.storeEntry.create({
    data: {
      projectId: project3.id,
      status: 'PUBLISHED',
      screenshots: JSON.stringify(['/store/launch-1.jpg', '/store/launch-2.jpg']),
      longDescription:
        'Eye-catching landing page template perfect for product launches. Includes hero, features, pricing, and CTA sections.',
      demoUrl: 'https://launch-v2.holy.app',
      installs: 84,
      avgRating: 4.6,
      reviewCount: 15,
      publishedAt: new Date('2026-04-01'),
    },
  })

  console.log(`✅ Created store entries`)

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        storeEntryId: storeEntry1.id,
        userId: bob.id,
        rating: 5,
        comment:
          'Amazing template! Saved me weeks of development time. Highly recommended.',
      },
      {
        storeEntryId: storeEntry2.id,
        userId: alice.id,
        rating: 4,
        comment:
          'Great starter template. Would love to see more customization options.',
      },
    ],
  })

  console.log(`✅ Created reviews`)
  console.log('✨ Database seeded successfully!')
  
  await prisma.$disconnect()
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
