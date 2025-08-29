import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Add your seed data here
  console.log('Seeding database...')
  
  // Example: Create a test user
  // const user = await prisma.user.create({
  //   data: {
  //     clerkId: 'test_clerk_id',
  //     email: 'test@example.com',
  //     name: 'Test User',
  //   },
  // })
  
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