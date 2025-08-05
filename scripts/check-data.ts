#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const [orgs, users, claims, inspections] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.claim.count(),
      prisma.inspection.count()
    ])

    console.log('Database contents:')
    console.log(`Organizations: ${orgs}`)
    console.log(`Users: ${users}`)
    console.log(`Claims: ${claims}`)
    console.log(`Inspections: ${inspections}`)

    if (claims > 0) {
      const sampleClaims = await prisma.claim.findMany({
        take: 3,
        select: {
          id: true,
          claimNumber: true,
          clientName: true,
          itemDescription: true
        }
      })
      console.log('\nSample claims:')
      sampleClaims.forEach(claim => {
        console.log(`  Claim #${claim.claimNumber}: ${claim.clientName} - ${claim.itemDescription}`)
      })
    }

    if (inspections > 0) {
      const sampleInspections = await prisma.inspection.findMany({
        take: 3,
        select: {
          id: true,
          inspectionNumber: true,
          claim: {
            select: { claimNumber: true, clientName: true }
          }
        }
      })
      console.log('\nSample inspections:')
      sampleInspections.forEach(inspection => {
        console.log(`  Inspection #${inspection.inspectionNumber}: for Claim #${inspection.claim.claimNumber} (${inspection.claim.clientName})`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()