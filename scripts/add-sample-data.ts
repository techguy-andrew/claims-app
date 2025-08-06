#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'
import { getNextSequentialNumber } from '../src/lib/sequential-numbers'
import { ClaimStatus } from '@prisma/client'

const sampleClients = [
  { name: 'John Smith', phone: '(555) 123-4567', address: '123 Main Street, New York, NY 10001' },
  { name: 'Sarah Johnson', phone: '(555) 234-5678', address: '456 Oak Avenue, Los Angeles, CA 90210' },
  { name: 'Michael Brown', phone: '(555) 345-6789', address: '789 Pine Street, Chicago, IL 60601' },
  { name: 'Emily Davis', phone: '(555) 456-7890', address: '321 Elm Drive, Miami, FL 33101' },
  { name: 'David Wilson', phone: '(555) 567-8901', address: '654 Maple Lane, Denver, CO 80202' },
  { name: 'Lisa Anderson', phone: '(555) 678-9012', address: '987 Cedar Court, Austin, TX 73301' },
  { name: 'Robert Taylor', phone: '(555) 789-0123', address: '147 Birch Boulevard, Seattle, WA 98101' },
  { name: 'Jennifer Martinez', phone: '(555) 890-1234', address: '258 Spruce Street, Phoenix, AZ 85001' },
  { name: 'William Garcia', phone: '(555) 901-2345', address: '369 Willow Way, Boston, MA 02101' },
  { name: 'Jessica Rodriguez', phone: '(555) 012-3456', address: '741 Aspen Avenue, Portland, OR 97201' }
]

const sampleInsurance = [
  { company: 'State Farm Insurance', adjustorName: 'Sarah Mitchell', adjustorEmail: 'sarah.mitchell@statefarm.com' },
  { company: 'Allstate Insurance', adjustorName: 'Michael Rodriguez', adjustorEmail: 'michael.rodriguez@allstate.com' },
  { company: 'Progressive Insurance', adjustorName: 'Emily Chen', adjustorEmail: 'emily.chen@progressive.com' },
  { company: 'Geico Insurance', adjustorName: 'David Thompson', adjustorEmail: 'david.thompson@geico.com' },
  { company: 'Liberty Mutual', adjustorName: 'Lisa Anderson', adjustorEmail: 'lisa.anderson@libertymutual.com' },
  { company: 'Farmers Insurance', adjustorName: 'Robert Kim', adjustorEmail: 'robert.kim@farmers.com' },
  { company: 'USAA Insurance', adjustorName: 'Jennifer Walsh', adjustorEmail: 'jennifer.walsh@usaa.com' },
  { company: 'Nationwide Insurance', adjustorName: 'William Brooks', adjustorEmail: 'william.brooks@nationwide.com' },
  { company: 'American Family Insurance', adjustorName: 'Maria Santos', adjustorEmail: 'maria.santos@amfam.com' },
  { company: 'Travelers Insurance', adjustorName: 'James Parker', adjustorEmail: 'james.parker@travelers.com' }
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
    const insurance = sampleInsurance[i]
    const claimNumber = `CLM-${String(await getNextSequentialNumber('CLAIM')).padStart(6, '0')}`
    
    // Create claim date between 1-30 days ago for variety
    const claimDate = new Date()
    claimDate.setDate(claimDate.getDate() - Math.floor(Math.random() * 30) - 1)

    // Random status
    const statuses: ClaimStatus[] = ['OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'APPROVED', 'DENIED', 'CLOSED']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

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
        createdById: user.id
      }
    })

    claims.push(claim)
    console.log(`Created Claim #${claimNumber}: ${client.name} - ${insurance.company}`)
  }

  console.log('Inspection creation skipped - inspection functionality removed')

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