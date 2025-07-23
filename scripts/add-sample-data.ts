#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'
import { getNextSequentialNumber } from '../src/lib/sequential-numbers'
import { ClaimStatus } from '@prisma/client'

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

const sampleItems = [
  { item: 'Laptop Computer - Dell XPS 13', damage: 'Screen cracked after dropping from desk' },
  { item: 'iPhone 14 Pro', damage: 'Water damage from coffee spill' },
  { item: 'Wedding Ring - 14k Gold', damage: 'Diamond missing from setting' },
  { item: 'Toyota Camry 2020 - Bumper', damage: 'Front bumper dented in parking lot' },
  { item: 'Canon EOS R5 Camera', damage: 'Lens mount damaged from drop' },
  { item: 'Samsung 65" TV', damage: 'Screen shattered during move' },
  { item: 'MacBook Pro 16"', damage: 'Keyboard damaged by liquid spill' },
  { item: 'Rolex Submariner', damage: 'Crystal scratched, bezel damaged' },
  { item: 'Persian Area Rug', damage: 'Large stain from pet accident' },
  { item: 'Gaming PC Setup', damage: 'Graphics card damaged in power surge' }
]

const inspectionNotes = [
  'Initial assessment complete. Damage consistent with reported incident.',
  'Extensive damage observed. Recommend professional evaluation.',
  'Minor damage noted. Repair appears feasible.',
  'Total loss assessment. Replacement recommended.',
  'Partial damage with potential for restoration.',
  'Pre-existing wear noted in addition to claim damage.',
  'Professional restoration consultation recommended.',
  'Damage matches timeline and incident description.',
  'Secondary damage potential requires monitoring.',
  'Assessment complete. Documentation submitted.'
]

async function main() {
  console.log('Adding sample data...')

  // Get existing organization and user
  const organization = await prisma.organization.findFirst()
  const user = await prisma.user.findFirst()

  if (!organization || !user) {
    console.log('Need at least one organization and user to create sample data')
    return
  }

  console.log(`Using organization: ${organization.name}`)
  console.log(`Using user: ${user.firstName} ${user.lastName}`)

  // Create 10 sample claims
  console.log('Creating sample claims...')
  const claims = []

  for (let i = 0; i < 10; i++) {
    const client = sampleClients[i]
    const itemInfo = sampleItems[i]
    const sequentialNumber = await getNextSequentialNumber('CLAIM')
    
    // Create dates
    const incidentDate = new Date()
    incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 30) - 1)
    
    const claimDate = new Date(incidentDate)
    claimDate.setDate(claimDate.getDate() + Math.floor(Math.random() * 5) + 1)

    // Random status
    const statuses: ClaimStatus[] = ['OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'CLOSED']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    const claim = await prisma.claim.create({
      data: {
        sequentialNumber,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        itemDescription: itemInfo.item,
        damageDetails: itemInfo.damage,
        status,
        incidentDate,
        claimDate,
        organizationId: organization.id,
        createdById: user.id
      }
    })

    claims.push(claim)
    console.log(`Created Claim #${sequentialNumber}: ${client.name} - ${itemInfo.item}`)
  }

  // Create 15 sample inspections
  console.log('Creating sample inspections...')
  
  for (let i = 0; i < 15; i++) {
    const claim = claims[Math.floor(Math.random() * claims.length)]
    const sequentialNumber = await getNextSequentialNumber('INSPECTION')
    
    const inspectionDate = new Date(claim.claimDate)
    inspectionDate.setDate(inspectionDate.getDate() + Math.floor(Math.random() * 10) + 1)
    
    if (inspectionDate > new Date()) {
      inspectionDate.setDate(new Date().getDate() - Math.floor(Math.random() * 5))
    }

    await prisma.inspection.create({
      data: {
        sequentialNumber,
        inspectionDate,
        inspectorNotes: inspectionNotes[Math.floor(Math.random() * inspectionNotes.length)],
        damageAssessment: `Assessment ${i + 1}: ${Math.random() > 0.5 ? 'Repairable' : 'Total loss'}`,
        photos: [`sample-photo-${i}-1.jpg`, `sample-photo-${i}-2.jpg`],
        claimId: claim.id,
        inspectorId: user.id
      }
    })

    console.log(`Created Inspection #${sequentialNumber} for Claim #${claim.sequentialNumber}`)
  }

  console.log('Sample data creation completed!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })