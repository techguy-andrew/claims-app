import { prisma } from '../src/lib/prisma'

async function main() {
  console.log('Setting up basic organization and users...')

  // Create organization if it doesn't exist
  let organization = await prisma.organization.findFirst()
  
  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: 'Furniture Restoration Co.',
        clerkId: 'org_demo_furniture_restoration'
      }
    })
    console.log(`Created organization: ${organization.name}`)
  } else {
    console.log(`Found existing organization: ${organization.name}`)
  }

  // Create admin user if doesn't exist
  let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        clerkId: 'user_demo_admin',
        email: 'admin@furniturerestoration.com',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        role: 'ADMIN',
        organizationId: organization.id
      }
    })
    console.log(`Created admin user: ${adminUser.firstName} ${adminUser.lastName}`)
  } else {
    console.log(`Found existing admin user: ${adminUser.firstName} ${adminUser.lastName}`)
  }

  // Create inspector users if they don't exist
  const existingInspectors = await prisma.user.findMany({ where: { role: 'INSPECTOR' } })
  
  if (existingInspectors.length === 0) {
    const inspectors = [
      {
        clerkId: 'user_demo_inspector1',
        email: 'james.carpenter@furniturerestoration.com',
        firstName: 'James',
        lastName: 'Carpenter',
        role: 'INSPECTOR' as const,
        organizationId: organization.id
      },
      {
        clerkId: 'user_demo_inspector2', 
        email: 'maria.santos@furniturerestoration.com',
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'INSPECTOR' as const,
        organizationId: organization.id
      },
      {
        clerkId: 'user_demo_inspector3',
        email: 'david.woodworth@furniturerestoration.com', 
        firstName: 'David',
        lastName: 'Woodworth',
        role: 'INSPECTOR' as const,
        organizationId: organization.id
      }
    ]

    for (const inspectorData of inspectors) {
      const inspector = await prisma.user.create({ data: inspectorData })
      console.log(`Created inspector: ${inspector.firstName} ${inspector.lastName}`)
    }
  } else {
    console.log(`Found ${existingInspectors.length} existing inspector users`)
  }

  console.log('Basic setup completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error setting up basic data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })