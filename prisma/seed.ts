import { getNextSequentialNumber, initializeCounters } from '../src/lib/sequential-numbers'
import { prisma } from '../src/lib/prisma'

const sampleClients = [
  { name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
  { name: 'Sarah Johnson', email: 'sarah.johnson@email.com', phone: '(555) 234-5678' },
  { name: 'Michael Brown', email: 'michael.brown@email.com', phone: '(555) 345-6789' },
  { name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 456-7890' },
  { name: 'David Wilson', email: 'david.wilson@email.com', phone: '(555) 567-8901' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@email.com', phone: '(555) 678-9012' },
  { name: 'Robert Taylor', email: 'robert.taylor@email.com', phone: '(555) 789-0123' },
  { name: 'Jennifer Martinez', email: 'jennifer.martinez@email.com', phone: '(555) 890-1234' },
  { name: 'William Garcia', email: 'william.garcia@email.com', phone: '(555) 901-2345' },
  { name: 'Jessica Rodriguez', email: 'jessica.rodriguez@email.com', phone: '(555) 012-3456' }
]

const sampleDamageScenarios = [
  {
    item: 'Laptop Computer - Dell XPS 13',
    damage: 'Screen cracked after dropping from desk. Display still functional but has visible crack lines.',
    incident: 'Device fell from desk onto concrete floor during office move'
  },
  {
    item: 'iPhone 14 Pro',
    damage: 'Water damage - device was submerged in coffee. Phone turns on but screen flickers.',
    incident: 'Coffee spilled on device during meeting, phone fell into large puddle'
  },
  {
    item: 'Wedding Ring - 14k Gold with Diamond',
    damage: 'Diamond missing from setting, likely lost during yard work. Setting intact.',
    incident: 'Ring caught on fence while gardening, diamond dislodged'
  },
  {
    item: 'Toyota Camry 2020 - Front Bumper',
    damage: 'Front bumper scratched and dented from parking incident. Paint damage visible.',
    incident: 'Vehicle backed into concrete pillar in parking garage'
  },
  {
    item: 'Canon EOS R5 Camera',
    damage: 'Lens mount damaged, unable to attach lenses properly. Body appears intact.',
    incident: 'Camera dropped while changing lenses at photo shoot'
  },
  {
    item: 'Samsung 65" QLED TV',
    damage: 'Screen shattered, display completely non-functional. Audio still works.',
    incident: 'TV fell from wall mount during earthquake'
  },
  {
    item: 'MacBook Pro 16" 2023',
    damage: 'Keyboard keys sticky and unresponsive after liquid spill. Trackpad affected.',
    incident: 'Red wine spilled across keyboard during dinner meeting'
  },
  {
    item: 'Rolex Submariner Watch',
    damage: 'Crystal face scratched, bezel rotation impaired. Water resistance compromised.',
    incident: 'Watch scraped against rocks during hiking accident'
  },
  {
    item: 'Persian Area Rug - 8x10',
    damage: 'Large stain from pet accident, odor present. Some color bleeding noticed.',
    incident: 'Dog had accident on rug, stain set before cleaning attempt'
  },
  {
    item: 'Gaming PC - Custom Build',
    damage: 'Graphics card damaged, artifacting on display. Other components seem functional.',
    incident: 'Power surge during storm damaged graphics card'
  },
  {
    item: 'Bicycle - Trek Mountain Bike',
    damage: 'Frame bent, rear wheel misaligned. Brakes and gears still operational.',
    incident: 'Bike hit by car while parked, vehicle left scene'
  },
  {
    item: 'Kitchen Island - Granite Countertop',
    damage: 'Large chip in granite surface, approximately 3 inches. Surface integrity affected.',
    incident: 'Heavy pot dropped from height onto counter surface'
  },
  {
    item: 'Sony PlayStation 5',
    damage: 'Console overheating, frequent shutdowns during gameplay. Fan noise excessive.',
    incident: 'Console exposed to excessive heat from faulty HVAC system'
  },
  {
    item: 'Leather Sofa - Italian Designer',
    damage: 'Multiple tears in leather from pet claws. Foam padding exposed in places.',
    incident: 'Cat scratched sofa extensively over several months'
  },
  {
    item: 'Nikon D850 Camera Lens',
    damage: 'Internal elements loose, focusing mechanism jammed. Visible dust inside.',
    incident: 'Lens dropped on rocky surface during nature photography'
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

  // Create sample claims
  console.log('Creating sample claims...')
  const claims = []

  for (let i = 0; i < sampleClients.length; i++) {
    const client = sampleClients[i]
    const scenario = sampleDamageScenarios[i]
    const claimNumber = `CLM-${String(await getNextSequentialNumber('CLAIM')).padStart(6, '0')}`
    
    // Create incident date between 1-30 days ago
    const incidentDate = new Date()
    incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 30) - 1)
    
    // Create claim date between incident date and now
    const claimDate = new Date(incidentDate)
    claimDate.setDate(claimDate.getDate() + Math.floor(Math.random() * 5) + 1)

    // Assign status based on claim age and randomization
    const daysSinceClaim = Math.floor((Date.now() - claimDate.getTime()) / (1000 * 60 * 60 * 24))
    let status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
    
    if (daysSinceClaim < 2) {
      status = 'OPEN'
    } else if (daysSinceClaim < 5) {
      status = Math.random() > 0.5 ? 'IN_PROGRESS' : 'OPEN'
    } else if (daysSinceClaim < 10) {
      status = ['IN_PROGRESS', 'UNDER_REVIEW'][Math.floor(Math.random() * 2)] as 'IN_PROGRESS' | 'UNDER_REVIEW'
    } else if (daysSinceClaim < 15) {
      status = ['UNDER_REVIEW', 'APPROVED', 'DENIED'][Math.floor(Math.random() * 3)] as 'UNDER_REVIEW' | 'APPROVED' | 'DENIED'
    } else {
      status = ['APPROVED', 'DENIED', 'CLOSED'][Math.floor(Math.random() * 3)] as 'APPROVED' | 'DENIED' | 'CLOSED'
    }

    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        itemDescription: scenario.item,
        damageDetails: scenario.damage,
        status,
        incidentDate,
        claimDate,
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })

    claims.push(claim)
    console.log(`Created claim #${claimNumber}: ${client.name} - ${scenario.item}`)
  }

  // Create additional claims for variety
  for (let i = 10; i < 15; i++) {
    const client = sampleClients[i % sampleClients.length]
    const scenario = sampleDamageScenarios[i % sampleDamageScenarios.length]
    const claimNumber = `CLM-${String(await getNextSequentialNumber('CLAIM')).padStart(6, '0')}`
    
    const incidentDate = new Date()
    incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 60) - 1)
    
    const claimDate = new Date(incidentDate)
    claimDate.setDate(claimDate.getDate() + Math.floor(Math.random() * 7) + 1)

    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        clientName: `${client.name} (Business)`,
        clientEmail: client.email,
        clientPhone: client.phone,
        itemDescription: `Commercial ${scenario.item}`,
        damageDetails: scenario.damage,
        status: ['OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'CLOSED'][Math.floor(Math.random() * 5)] as 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'CLOSED',
        incidentDate,
        claimDate,
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })

    claims.push(claim)
    console.log(`Created claim #${claimNumber}: ${client.name} (Business) - Commercial ${scenario.item}`)
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