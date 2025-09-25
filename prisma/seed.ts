import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate random 8-character claim numbers
function generateClaimNumber(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

async function main() {
  console.log('Seeding database...')

  // Create realistic demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@email.com' },
    update: {},
    create: {
      clerkId: 'user_sarah_johnson',
      email: 'sarah.johnson@email.com',
      name: 'Sarah Johnson',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'michael.chen@email.com' },
    update: {},
    create: {
      clerkId: 'user_michael_chen',
      email: 'michael.chen@email.com',
      name: 'Michael Chen',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'emma.rodriguez@email.com' },
    update: {},
    create: {
      clerkId: 'user_emma_rodriguez',
      email: 'emma.rodriguez@email.com',
      name: 'Emma Rodriguez',
    },
  })

  // Create realistic demo claims with random 8-character numbers
  const claim1 = await prisma.claim.upsert({
    where: { claimNumber: generateClaimNumber() },
    update: {},
    create: {
      title: 'Kitchen Fire Damage',
      description: 'Residential kitchen fire damage with smoke throughout home',
      status: 'UNDER_REVIEW',
      claimNumber: 'H7K2M9P4',
      insuranceCompany: 'State Farm Insurance',
      adjustor: 'Jennifer Martinez',
      clientPhone: '(555) 234-7890',
      clientAddress: '2847 Oak Ridge Drive, Springfield, IL 62704',
      claimantId: user1.id,
      items: {
        create: [
          {
            title: 'Kitchen Cabinets',
            description: 'Upper and lower cabinets damaged by fire and heat - complete replacement needed',
          },
          {
            title: 'Appliances',
            description: 'Refrigerator, stove, and dishwasher damaged beyond repair',
          },
          {
            title: 'Flooring',
            description: 'Hardwood flooring warped from water damage during firefighting efforts',
          }
        ]
      }
    },
  })

  const claim2 = await prisma.claim.upsert({
    where: { claimNumber: generateClaimNumber() },
    update: {},
    create: {
      title: 'Water Damage - Burst Pipe',
      description: 'Commercial office water damage from burst pipe in ceiling',
      status: 'APPROVED',
      claimNumber: 'B3N8Q1R6',
      insuranceCompany: 'Allstate Commercial',
      adjustor: 'David Thompson',
      clientPhone: '(555) 987-6543',
      clientAddress: '1250 Business Park Boulevard, Suite 300, Austin, TX 78759',
      claimantId: user2.id,
      items: {
        create: [
          {
            title: 'Office Carpet',
            description: 'Water-damaged commercial carpet throughout 1,200 sq ft office space',
          },
          {
            title: 'Computer Equipment',
            description: 'Three desktop computers and one server damaged by water intrusion',
          },
          {
            title: 'Office Furniture',
            description: 'Reception desk and filing cabinets with water damage and warping',
          },
          {
            title: 'Ceiling Tiles',
            description: 'Acoustic ceiling tiles damaged and need replacement in affected area',
          }
        ]
      }
    },
  })

  const claim3 = await prisma.claim.upsert({
    where: { claimNumber: generateClaimNumber() },
    update: {},
    create: {
      title: 'Storm Damage - Hail and Wind',
      description: 'Residential property damage from severe thunderstorm with hail',
      status: 'PENDING',
      claimNumber: 'Z5W9X2Y7',
      insuranceCompany: 'Liberty Mutual',
      adjustor: 'Rebecca Wilson',
      clientPhone: '(555) 456-7823',
      clientAddress: '3695 Maple Street, Denver, CO 80211',
      claimantId: user3.id,
      items: {
        create: [
          {
            title: 'Roof Shingles',
            description: 'Asphalt shingles damaged by hail impact - approximately 40% of roof affected',
          },
          {
            title: 'Windows',
            description: 'Two bedroom windows cracked by hail, need replacement',
          },
          {
            title: 'Gutters',
            description: 'Aluminum gutters dented and pulled away from house by wind',
          },
          {
            title: 'Siding',
            description: 'Vinyl siding on north side of house damaged by wind and hail impact',
          },
          {
            title: 'HVAC Unit',
            description: 'Exterior AC unit condenser damaged by large hail stones',
          }
        ]
      }
    },
  })

  console.log(`Created user: ${user1.email}`)
  console.log(`Created user: ${user2.email}`)
  console.log(`Created user: ${user3.email}`)
  console.log(`Created claim: ${claim1.claimNumber}`)
  console.log(`Created claim: ${claim2.claimNumber}`)
  console.log(`Created claim: ${claim3.claimNumber}`)
  console.log('Database seeded successfully with realistic demo data')
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