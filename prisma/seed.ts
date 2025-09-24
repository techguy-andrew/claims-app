import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      clerkId: 'demo_clerk_id',
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  // Create the demo claim matching current page data
  const claim = await prisma.claim.upsert({
    where: { id: 'CLAIM-001' },
    update: {},
    create: {
      id: 'CLAIM-001',
      title: 'CLAIM-001',
      description: 'Acme Restoration Co.',
      status: 'PENDING',
      claimantId: user.id,
      items: {
        create: [
          {
            title: 'Water Damaged Carpet',
            description: 'Commercial carpet in main lobby - 500 sq ft',
          }
        ]
      }
    },
  })

  console.log(`Created user: ${user.email}`)
  console.log(`Created claim: ${claim.id}`)
  console.log('Database seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })