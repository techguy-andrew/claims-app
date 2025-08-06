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

  // Create additional admin users if they don't exist
  const existingAdmins = await prisma.user.findMany({ where: { role: 'ADMIN' } })
  
  if (existingAdmins.length === 1) {
    const additionalAdmins = [
      {
        clerkId: 'user_demo_admin2',
        email: 'james.carpenter@furniturerestoration.com',
        firstName: 'James',
        lastName: 'Carpenter',
        role: 'ADMIN' as const,
        organizationId: organization.id
      },
      {
        clerkId: 'user_demo_admin3', 
        email: 'maria.santos@furniturerestoration.com',
        firstName: 'Maria',
        lastName: 'Santos',
        role: 'ADMIN' as const,
        organizationId: organization.id
      }
    ]

    for (const adminData of additionalAdmins) {
      const admin = await prisma.user.create({ data: adminData })
      console.log(`Created additional admin: ${admin.firstName} ${admin.lastName}`)
    }
  } else {
    console.log(`Found ${existingAdmins.length} existing admin users`)
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