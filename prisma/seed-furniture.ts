import { generateUniqueId } from '../src/lib/random-ids'
import { prisma } from '../src/lib/prisma'

const furnitureClients = [
  { name: 'Margaret Thompson', phone: '(555) 123-4567', address: '1425 Oak Street, San Francisco, CA 94102' },
  { name: 'Robert Chen', phone: '(555) 234-5678', address: '892 Pine Avenue, Los Angeles, CA 90210' },
  { name: 'Eleanor Whitfield', phone: '(555) 345-6789', address: '3456 Elm Drive, New York, NY 10001' },
  { name: 'James Martinez', phone: '(555) 456-7890', address: '789 Maple Lane, Chicago, IL 60601' },
  { name: 'Victoria Sterling', phone: '(555) 567-8901', address: '2134 Cedar Court, Miami, FL 33101' },
  { name: 'William Brooks', phone: '(555) 678-9012', address: '567 Birch Boulevard, Denver, CO 80202' },
  { name: 'Catherine Davis', phone: '(555) 789-0123', address: '4321 Spruce Street, Austin, TX 73301' },
  { name: 'Harrison Lodge', phone: '(555) 890-1234', address: '876 Willow Way, Seattle, WA 98101' },
  { name: 'Isabella Rodriguez', phone: '(555) 901-2345', address: '1098 Aspen Avenue, Phoenix, AZ 85001' },
  { name: 'Theodore Walsh', phone: '(555) 012-3456', address: '5432 Redwood Road, Boston, MA 02101' },
  { name: 'Pemberton Antiques', phone: '(555) 123-5678', address: '789 Heritage Lane, Portland, OR 97201' },
  { name: 'Heritage Interior Design', phone: '(555) 234-6789', address: '321 Design District, Dallas, TX 75201' },
  { name: 'Grandview Estate Services', phone: '(555) 345-7890', address: '654 Estate Avenue, Atlanta, GA 30301' },
  { name: 'Classical Restorations LLC', phone: '(555) 456-8901', address: '987 Restoration Row, Nashville, TN 37201' },
  { name: 'Vintage Collections Inc', phone: '(555) 567-9012', address: '147 Antique Alley, Charleston, SC 29401' }
]

const furnitureInsuranceData = [
  { company: 'Heritage Fine Arts Insurance', adjustorName: 'Sarah Mitchell', adjustorEmail: 'sarah.mitchell@heritagefinearts.com' },
  { company: 'Antique & Restoration Coverage', adjustorName: 'Michael Chen', adjustorEmail: 'michael.chen@antiquerestoration.com' },
  { company: 'Premium Collectibles Insurance', adjustorName: 'Eleanor Davis', adjustorEmail: 'eleanor.davis@premiumcollectibles.com' },
  { company: 'Fine Furniture Protection Co', adjustorName: 'James Rodriguez', adjustorEmail: 'james.rodriguez@finefurniture.com' },
  { company: 'Estate & Heirloom Insurance', adjustorName: 'Victoria Thompson', adjustorEmail: 'victoria.thompson@estateheirloom.com' },
  { company: 'Classical Arts Coverage', adjustorName: 'William Martinez', adjustorEmail: 'william.martinez@classicalarts.com' },
  { company: 'Vintage Valuables Insurance', adjustorName: 'Catherine Brooks', adjustorEmail: 'catherine.brooks@vintagevaluables.com' },
  { company: 'Restoration Specialists Inc', adjustorName: 'Harrison Lodge', adjustorEmail: 'harrison.lodge@restorationspec.com' },
  { company: 'Antique Collection Coverage', adjustorName: 'Isabella Sterling', adjustorEmail: 'isabella.sterling@antiquecollection.com' },
  { company: 'Heritage Home Insurance', adjustorName: 'Theodore Walsh', adjustorEmail: 'theodore.walsh@heritagehome.com' },
  { company: 'Fine Arts & Antiques Co', adjustorName: 'Margaret Whitfield', adjustorEmail: 'margaret.whitfield@fineartsantiques.com' },
  { company: 'Precious Items Protection', adjustorName: 'Robert Davis', adjustorEmail: 'robert.davis@preciousitems.com' },
  { company: 'Museum Quality Insurance', adjustorName: 'Eleanor Chen', adjustorEmail: 'eleanor.chen@museumquality.com' },
  { company: 'Historic Preservation Cover', adjustorName: 'James Thompson', adjustorEmail: 'james.thompson@historicpreservation.com' },
  { company: 'Collectible Treasures Inc', adjustorName: 'Victoria Rodriguez', adjustorEmail: 'victoria.rodriguez@collectibletreasures.com' }
]

// Furniture restoration seed data - simplified for premium insurance claims system


async function main() {
  console.log('Starting furniture restoration database seed...')

  // Check if we already have an organization and users
  let organization = await prisma.organization.findFirst()
  let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  let adminUsers = await prisma.user.findMany({ where: { role: 'ADMIN' } })

  if (!organization) {
    console.log('No organization found. Please create an organization first.')
    return
  }

  if (!adminUser) {
    console.log('No admin user found. Please create an admin user first.')
    return
  }

  if (adminUsers.length === 0) {
    console.log('No admin users found. Please create admin users first.')
    return
  }

  console.log(`Found organization: ${organization.name}`)
  console.log(`Found admin user: ${adminUser.firstName} ${adminUser.lastName}`)
  console.log(`Found ${adminUsers.length} admin users`)

  // Clear existing claims and audit logs
  console.log('Clearing existing sample data...')
  await prisma.auditLog.deleteMany({})
  await prisma.claim.deleteMany({})

  // Create furniture restoration claims
  console.log('Creating furniture restoration claims...')
  const claims = []

  for (let i = 0; i < furnitureClients.length; i++) {
    const client = furnitureClients[i]
    const insurance = furnitureInsuranceData[i % furnitureInsuranceData.length]
    const claimNumber = await generateUniqueId('CLAIM')
    
    // Create claim date between 1-60 days ago for variety
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - Math.floor(Math.random() * 60) - 1)

    // Assign realistic status based on randomization
    const statusOptions: ('OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED')[] = 
      ['OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'CLOSED']
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)]

    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        status,
        // Insurance Information
        insuranceCompany: insurance.company,
        adjustorName: insurance.adjustorName,
        adjustorEmail: insurance.adjustorEmail,
        // Client Information
        clientName: client.name,
        clientPhone: client.phone,
        clientAddress: client.address,
        // System fields
        claimDate,
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })

    claims.push(claim)
    console.log(`Created furniture claim ${claimNumber}: ${client.name} - ${insurance.company}`)
  }


  // Create audit log entries for recent activity
  console.log('Creating audit log entries...')
  
  const recentClaims = claims.slice(-8) // Last 8 claims
  
  for (const claim of recentClaims) {
    await prisma.auditLog.create({
      data: {
        action: 'CLAIM_CREATED',
        details: `Insurance claim ${claim.claimNumber} created for ${claim.clientName}`,
        userId: adminUser.id,
        claimId: claim.id
      }
    })

    if (claim.status !== 'OPEN') {
      await prisma.auditLog.create({
        data: {
          action: 'CLAIM_STATUS_UPDATED',
          details: `Claim ${claim.claimNumber} status changed to ${claim.status}`,
          userId: adminUser.id,
          claimId: claim.id
        }
      })
    }
  }

  console.log('Furniture restoration insurance claims seed completed successfully!')
  console.log(`Created ${claims.length} premium furniture insurance claims`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })