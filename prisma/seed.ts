import { getNextSequentialNumber, initializeCounters } from '../src/lib/sequential-numbers'
import { prisma } from '../src/lib/prisma'

const premiumInsuranceData = [
  {
    company: 'State Farm Insurance',
    adjustorName: 'Sarah Mitchell',
    adjustorEmail: 'sarah.mitchell@statefarm.com'
  },
  {
    company: 'Allstate Insurance',
    adjustorName: 'Michael Rodriguez',
    adjustorEmail: 'michael.rodriguez@allstate.com'
  },
  {
    company: 'Progressive Insurance',
    adjustorName: 'Emily Chen',
    adjustorEmail: 'emily.chen@progressive.com'
  },
  {
    company: 'Geico Insurance',
    adjustorName: 'David Thompson',
    adjustorEmail: 'david.thompson@geico.com'
  },
  {
    company: 'Liberty Mutual',
    adjustorName: 'Lisa Anderson',
    adjustorEmail: 'lisa.anderson@libertymutual.com'
  },
  {
    company: 'Farmers Insurance',
    adjustorName: 'Robert Kim',
    adjustorEmail: 'robert.kim@farmers.com'
  },
  {
    company: 'USAA Insurance',
    adjustorName: 'Jennifer Walsh',
    adjustorEmail: 'jennifer.walsh@usaa.com'
  },
  {
    company: 'Nationwide Insurance',
    adjustorName: 'William Brooks',
    adjustorEmail: 'william.brooks@nationwide.com'
  },
  {
    company: 'American Family Insurance',
    adjustorName: 'Maria Santos',
    adjustorEmail: 'maria.santos@amfam.com'
  },
  {
    company: 'Travelers Insurance',
    adjustorName: 'James Parker',
    adjustorEmail: 'james.parker@travelers.com'
  }
]

const premiumClientData = [
  {
    name: 'John Anderson',
    phone: '(555) 123-4567',
    address: '123 Main Street, Apt 4B, New York, NY 10001'
  },
  {
    name: 'Sarah Johnson',
    phone: '(555) 234-5678',
    address: '456 Oak Avenue, Suite 12, Los Angeles, CA 90210'
  },
  {
    name: 'Michael Brown',
    phone: '(555) 345-6789',
    address: '789 Pine Street, Unit 3A, Chicago, IL 60601'
  },
  {
    name: 'Emily Davis',
    phone: '(555) 456-7890',
    address: '321 Elm Drive, Miami, FL 33101'
  },
  {
    name: 'David Wilson',
    phone: '(555) 567-8901',
    address: '654 Maple Lane, Denver, CO 80202'
  },
  {
    name: 'Lisa Martinez',
    phone: '(555) 678-9012',
    address: '987 Cedar Court, Austin, TX 73301'
  },
  {
    name: 'Robert Taylor',
    phone: '(555) 789-0123',
    address: '147 Birch Boulevard, Seattle, WA 98101'
  },
  {
    name: 'Jennifer Garcia',
    phone: '(555) 890-1234',
    address: '258 Spruce Street, Phoenix, AZ 85001'
  },
  {
    name: 'William Rodriguez',
    phone: '(555) 901-2345',
    address: '369 Willow Way, Boston, MA 02101'
  },
  {
    name: 'Jessica Thompson',
    phone: '(555) 012-3456',
    address: '741 Aspen Avenue, Portland, OR 97201'
  }
]

async function main() {
  console.log('Starting database seed...')

  // Initialize counters first
  await initializeCounters()

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

  // Create premium sample claims
  console.log('Creating premium sample claims...')
  const claims = []

  for (let i = 0; i < premiumClientData.length; i++) {
    const client = premiumClientData[i]
    const insurance = premiumInsuranceData[i]
    const claimNumber = `CLM-${String(await getNextSequentialNumber('CLAIM')).padStart(6, '0')}`
    
    // Create claim date between 1-30 days ago for variety
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - Math.floor(Math.random() * 30) - 1)

    // Assign status based on randomization with good distribution
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
    console.log(`Created premium claim #${claimNumber}: ${client.name} - ${insurance.company}`)
  }


  // Create some audit log entries
  console.log('Creating audit log entries...')
  
  const recentClaims = claims.slice(-5) // Last 5 claims
  
  for (const claim of recentClaims) {
    await prisma.auditLog.create({
      data: {
        action: 'CLAIM_CREATED',
        details: `Claim #${claim.claimNumber} created for ${claim.clientName}`,
        userId: adminUser.id,
        claimId: claim.id
      }
    })

    if (claim.status !== 'OPEN') {
      await prisma.auditLog.create({
        data: {
          action: 'CLAIM_STATUS_UPDATED',
          details: `Claim #${claim.claimNumber} status changed to ${claim.status}`,
          userId: adminUser.id,
          claimId: claim.id
        }
      })
    }
  }

  console.log('Database seed completed successfully!')
  console.log(`Created ${claims.length} claims`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })