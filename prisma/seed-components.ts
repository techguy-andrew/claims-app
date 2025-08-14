#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'
import { getNextSequentialNumber } from '../src/lib/sequential-numbers'

// Sample data specifically for the components showcase
const componentClaimData = {
  client: {
    name: 'Heritage Furniture Gallery',
    phone: '(555) 123-4567',
    address: '2847 Design District Boulevard, Suite 200, San Francisco, CA 94103'
  },
  insurance: {
    company: 'Antique & Fine Arts Insurance Co.',
    adjustorName: 'Victoria Sterling',
    adjustorEmail: 'victoria.sterling@afaic.com'
  }
}

const furnitureItems = [
  {
    itemName: 'Victorian Mahogany Writing Desk',
    details: 'Antique writing desk with brass inlays and leather writing surface. Water damage to left side panel, brass hardware tarnished. Estimated restoration required for finish and structural repairs.'
  },
  {
    itemName: 'Chippendale Style Dining Chairs (Set of 6)',
    details: 'Hand-carved mahogany dining chairs with original horsehair upholstery. Three chairs show significant scratches on legs, one chair has loose joint requiring re-gluing, upholstery needs professional cleaning.'
  },
  {
    itemName: 'Louis XVI Marble Top Console Table',
    details: 'French provincial console table with Carrara marble top and gilded bronze mounts. Crack in marble surface approximately 8 inches, one bronze mount loose, minor chips on table legs.'
  },
  {
    itemName: 'Edwardian Bookcase with Glass Doors',
    details: 'Oak bookcase with leaded glass panel doors and adjustable shelving. Right glass panel cracked, two shelf supports missing, minor water staining on bottom shelf.'
  },
  {
    itemName: 'Persian Hand-Knotted Area Rug',
    details: 'Vintage Tabriz rug, 9x12 feet, wool with silk highlights. Staining in high-traffic areas, fringe damage on one end, professional cleaning and restoration required.'
  }
]

async function main() {
  console.log('🎨 Starting components showcase database seed...')

  // Check if we already have an organization and users
  let organization = await prisma.organization.findFirst()
  let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })

  if (!organization) {
    console.log('❌ No organization found. Please run organization setup first.')
    console.log('💡 Tip: You may need to sign up through the Clerk authentication system first.')
    return
  }

  if (!adminUser) {
    console.log('❌ No admin user found. Please create an admin user first.')
    console.log('💡 Tip: You may need to sign up through the Clerk authentication system first.')
    return
  }

  console.log(`✅ Found organization: ${organization.name}`)
  console.log(`✅ Found admin user: ${adminUser.firstName} ${adminUser.lastName}`)

  // Check if components showcase claim already exists
  const existingClaim = await prisma.claim.findFirst({
    where: {
      clientName: componentClaimData.client.name
    },
    include: {
      items: true
    }
  })

  let showcaseClaim

  if (existingClaim) {
    console.log(`📋 Found existing showcase claim: ${existingClaim.claimNumber}`)
    showcaseClaim = existingClaim
    
    // Clear existing items to recreate fresh ones
    if (existingClaim.items.length > 0) {
      console.log('🧹 Clearing existing items...')
      await prisma.claimItem.deleteMany({
        where: { claimId: existingClaim.id }
      })
    }
  } else {
    // Create new showcase claim
    console.log('📋 Creating new showcase claim...')
    
    const claimNumber = `CLM-${String(await getNextSequentialNumber('CLAIM')).padStart(6, '0')}`
    
    // Set claim date to 5 days ago for realistic timeline
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - 5)

    showcaseClaim = await prisma.claim.create({
      data: {
        claimNumber,
        status: 'IN_PROGRESS',
        // Insurance Information
        insuranceCompany: componentClaimData.insurance.company,
        adjustorName: componentClaimData.insurance.adjustorName,
        adjustorEmail: componentClaimData.insurance.adjustorEmail,
        // Client Information
        clientName: componentClaimData.client.name,
        clientPhone: componentClaimData.client.phone,
        clientAddress: componentClaimData.client.address,
        // System fields
        claimDate,
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })

    console.log(`✅ Created showcase claim: ${claimNumber}`)
  }

  // Create furniture items for the showcase
  console.log('🪑 Creating furniture items for showcase...')
  
  const createdItems = []
  
  for (const itemData of furnitureItems) {
    const item = await prisma.claimItem.create({
      data: {
        claimId: showcaseClaim.id,
        itemName: itemData.itemName,
        details: itemData.details
      }
    })
    
    createdItems.push(item)
    console.log(`✅ Created item: ${itemData.itemName}`)
  }

  // Create some sample file placeholders (for demonstration purposes)
  console.log('📁 Creating sample file placeholders...')
  
  const sampleFiles = [
    {
      itemId: createdItems[0].id, // Victorian Desk
      fileName: 'victorian-desk-damage-assessment.jpg',
      fileType: 'image',
      mimeType: 'image/jpeg',
      fileSize: 2048576, // 2MB
      fileUrl: '/placeholder-images/victorian-desk-damage.jpg'
    },
    {
      itemId: createdItems[1].id, // Dining Chairs
      fileName: 'chippendale-chairs-inspection.pdf', 
      fileType: 'pdf',
      mimeType: 'application/pdf',
      fileSize: 1024000, // 1MB
      fileUrl: '/placeholder-files/chairs-inspection-report.pdf'
    },
    {
      itemId: createdItems[2].id, // Console Table
      fileName: 'console-table-marble-crack.jpg',
      fileType: 'image', 
      mimeType: 'image/jpeg',
      fileSize: 1536000, // 1.5MB
      fileUrl: '/placeholder-images/marble-crack-detail.jpg'
    }
  ]

  for (const fileData of sampleFiles) {
    await prisma.claimFile.create({
      data: {
        claimId: showcaseClaim.id,
        itemId: fileData.itemId,
        fileName: fileData.fileName,
        fileType: fileData.fileType,
        mimeType: fileData.mimeType,
        fileSize: fileData.fileSize,
        fileUrl: fileData.fileUrl
      }
    })
    
    console.log(`✅ Created sample file: ${fileData.fileName}`)
  }

  // Create an audit log entry
  await prisma.auditLog.create({
    data: {
      action: 'COMPONENTS_SHOWCASE_SETUP',
      details: `Components showcase initialized with claim ${showcaseClaim.claimNumber} containing ${createdItems.length} furniture items`,
      userId: adminUser.id,
      claimId: showcaseClaim.id
    }
  })

  console.log('')
  console.log('🎉 Components showcase seed completed successfully!')
  console.log(`📋 Showcase Claim ID: ${showcaseClaim.id}`)
  console.log(`📋 Claim Number: ${showcaseClaim.claimNumber}`)
  console.log(`🪑 Created ${createdItems.length} furniture items`)
  console.log(`📁 Created ${sampleFiles.length} sample files`)
  console.log('')
  console.log('🚀 Your components page is now ready with realistic data!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding components database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })