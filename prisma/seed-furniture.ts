import { generateUniqueId } from '../src/lib/random-ids'
import { prisma } from '../src/lib/prisma'

const furnitureClients = [
  { name: 'Margaret Thompson', email: 'margaret.thompson@email.com', phone: '(555) 123-4567' },
  { name: 'Robert Chen', email: 'robert.chen@email.com', phone: '(555) 234-5678' },
  { name: 'Eleanor Whitfield', email: 'eleanor.whitfield@email.com', phone: '(555) 345-6789' },
  { name: 'James Martinez', email: 'james.martinez@email.com', phone: '(555) 456-7890' },
  { name: 'Victoria Sterling', email: 'victoria.sterling@email.com', phone: '(555) 567-8901' },
  { name: 'William Brooks', email: 'william.brooks@email.com', phone: '(555) 678-9012' },
  { name: 'Catherine Davis', email: 'catherine.davis@email.com', phone: '(555) 789-0123' },
  { name: 'Harrison Lodge', email: 'harrison.lodge@email.com', phone: '(555) 890-1234' },
  { name: 'Isabella Rodriguez', email: 'isabella.rodriguez@email.com', phone: '(555) 901-2345' },
  { name: 'Theodore Walsh', email: 'theodore.walsh@email.com', phone: '(555) 012-3456' },
  { name: 'Pemberton Antiques', email: 'contact@pembertonantiques.com', phone: '(555) 123-5678' },
  { name: 'Heritage Interior Design', email: 'info@heritagedesign.com', phone: '(555) 234-6789' },
  { name: 'Grandview Estate Services', email: 'estates@grandviewservices.com', phone: '(555) 345-7890' },
  { name: 'Classical Restorations LLC', email: 'service@classicalrest.com', phone: '(555) 456-8901' },
  { name: 'Vintage Collections Inc', email: 'collections@vintageinc.com', phone: '(555) 567-9012' }
]

const furnitureItems = [
  {
    item: 'Victorian Chesterfield Sofa - Burgundy Leather',
    damage: 'Extensive cracking and tearing in the leather upholstery, particularly on arms and seat cushions. Several button tufts have pulled through. Frame remains structurally sound.',
    incident: 'Decades of use in sunlight-exposed room caused leather to dry out and crack. Recent move caused additional stress tears.'
  },
  {
    item: '1950s Mid-Century Modern Walnut Dining Table',
    damage: 'Large water ring stains across the surface, deep scratches, and finish has dulled significantly. One leg shows slight wobble.',
    incident: 'Water damage from plant overflow and general wear from daily use over 15+ years without proper care.'
  },
  {
    item: 'Antique Mahogany Roll-Top Desk - Late 1800s',
    damage: 'Roll-top mechanism is seized and will not open. Finish is worn and scratched. One drawer pulls out crooked. Key lock is broken.',
    incident: 'Desk stored in humid basement for years, causing wood swelling and mechanism failure. Recent attempt to force open damaged lock.'
  },
  {
    item: 'Family Heirloom China Cabinet - Oak with Glass Doors',
    damage: 'Right glass door is cracked from corner to corner. Wood has multiple deep scratches and finish is peeling in several areas.',
    incident: 'Glass door struck during household move, causing crack. Finish damage accumulated from pet claws and general wear.'
  },
  {
    item: 'Vintage Brown Leather Recliner - 1960s',
    damage: 'Seat cushion is severely compressed and torn. Reclining mechanism is stiff and makes loud creaking sounds. Armrests show extensive wear.',
    incident: 'Heavy daily use over decades. Mechanism needs lubrication and cushion requires re-stuffing and reupholstering.'
  },
  {
    item: 'Art Deco Mahogany Armoire - 1930s',
    damage: 'Left door hinge has pulled away from frame. Interior shelves sag noticeably. Decorative inlay work has several missing pieces.',
    incident: 'Overloading of shelves caused structural stress. Missing inlay pieces lost during previous attempted repair.'
  },
  {
    item: 'Set of 6 Windsor Dining Chairs - Painted Pine',
    damage: 'Paint is chipping and peeling on all chairs. Three chairs have loose spindles. Two chairs rock when sat in due to loose leg joints.',
    incident: 'Natural aging and heavy use. Paint failure from moisture exposure. Joint loosening from years of use and seasonal wood movement.'
  },
  {
    item: 'Antique Cedar Hope Chest - Hand-carved Details',
    damage: 'Lid hinge is broken and lid will not stay open. Deep scratch across the front panel mars the carved design. Interior cedar lining is cracked.',
    incident: 'Hinge failure from metal fatigue. Scratch from sharp object during storage rearrangement. Cedar lining dried and cracked from age.'
  },
  {
    item: 'Chippendale Style Mahogany Highboy - Reproduction',
    damage: 'Top section shifts when drawers are opened. Several drawer pulls are loose or missing. Finish has white heat marks and water stains.',
    incident: 'Connection between upper and lower sections has loosened. Daily use caused hardware wear. Heat marks from lamps and dishes without protection.'
  },
  {
    item: 'Antique Rocking Chair - Maple with Cane Seat',
    damage: 'Cane seat is broken through in center with multiple holes. One rocker has a crack that extends halfway through. Arms show extensive wear.',
    incident: 'Cane seat failed from age and use. Rocker crack from impact or stress. Normal wear patterns from decades of use.'
  },
  {
    item: 'French Provincial Bedroom Set - Dresser with Mirror',
    damage: 'Mirror has dark spots in silvering. Dresser top has multiple ring stains and scratches. Two drawer fronts have veneer lifting at edges.',
    incident: 'Mirror deterioration from age and humidity. Surface damage from cosmetics and perfume bottles. Veneer damage from moisture exposure.'
  },
  {
    item: 'Antique Pine Farmhouse Table - 8-foot Length',
    damage: 'Table top has deep knife cuts and burn marks. Several support brackets underneath are loose. Surface finish is completely worn away in high-use areas.',
    incident: 'Heavy kitchen use over generations. Knife cuts from food preparation. Burn marks from hot pots and pans. Natural finish wear from cleaning and use.'
  },
  {
    item: 'Victorian Walnut Bookcase - Glass Front Doors',
    damage: 'One glass pane is completely missing. Wood has several deep gouges and scratches. Interior shelves sag significantly under book weight.',
    incident: 'Glass broken during book reorganization. Wood damage from moving books and decorative items. Shelf sagging from overloading with heavy books.'
  },
  {
    item: 'Mid-Century Modern Teak Credenza - Danish Design',
    damage: 'Sliding doors stick and are difficult to open. Surface has water marks and finish appears cloudy. Interior shows some mold staining.',
    incident: 'Mechanism needs lubrication and adjustment. Water damage from plant watering and humid conditions. Mold from moisture exposure.'
  },
  {
    item: 'Antique Spindle Baby Crib - Converted to Display Piece',
    damage: 'Several spindles are cracked or loose. Paint has multiple layers that are chipping. One side rail shows significant wear and damage.',
    incident: 'Age-related wood movement caused spindle issues. Paint has been applied multiple times over decades. Normal wear from original use and handling.'
  }
]


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
    const furnitureItem = furnitureItems[i % furnitureItems.length]
    const claimNumber = await generateUniqueId('CLAIM')
    
    // Create incident date between 1-60 days ago
    const incidentDate = new Date()
    incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 60) - 1)
    
    // Create claim date between incident date and now
    const claimDate = new Date(incidentDate)
    claimDate.setDate(claimDate.getDate() + Math.floor(Math.random() * 7) + 1)

    // Assign realistic status based on claim age
    const daysSinceClaim = Math.floor((Date.now() - claimDate.getTime()) / (1000 * 60 * 60 * 24))
    let status: 'OPEN' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'DENIED' | 'CLOSED'
    
    if (daysSinceClaim < 3) {
      status = 'OPEN'
    } else if (daysSinceClaim < 10) {
      status = Math.random() > 0.6 ? 'IN_PROGRESS' : 'OPEN'
    } else if (daysSinceClaim < 20) {
      status = ['IN_PROGRESS', 'UNDER_REVIEW'][Math.floor(Math.random() * 2)] as 'IN_PROGRESS' | 'UNDER_REVIEW'
    } else if (daysSinceClaim < 30) {
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
        itemDescription: furnitureItem.item,
        damageDetails: furnitureItem.damage,
        status,
        incidentDate,
        claimDate,
        organizationId: organization.id,
        createdById: adminUser.id
      }
    })

    claims.push(claim)
    console.log(`Created claim ${claimNumber}: ${client.name} - ${furnitureItem.item.split(' - ')[0]}`)
  }


  // Create audit log entries for recent activity
  console.log('Creating audit log entries...')
  
  const recentClaims = claims.slice(-8) // Last 8 claims
  
  for (const claim of recentClaims) {
    await prisma.auditLog.create({
      data: {
        action: 'CLAIM_CREATED',
        details: `Furniture restoration claim ${claim.claimNumber} created for ${claim.clientName}`,
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

  console.log('Furniture restoration database seed completed successfully!')
  console.log(`Created ${claims.length} furniture restoration claims`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })