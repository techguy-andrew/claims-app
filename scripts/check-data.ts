#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const [orgs, users, claims, inspections, counters] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.claim.count(),
      prisma.inspection.count(),
      prisma.numberCounter.findMany()
    ])

    console.log('Database contents:')
    console.log(`Organizations: ${orgs}`)
    console.log(`Users: ${users}`)
    console.log(`Claims: ${claims}`)
    console.log(`Inspections: ${inspections}`)
    console.log(`Number Counters:`, counters)

    if (claims > 0) {
      const sampleClaims = await prisma.claim.findMany({
        take: 3,
        select: {
          id: true,
          sequentialNumber: true,
          clientName: true,
          itemDescription: true
        }
      })
      console.log('\nSample claims:')
      sampleClaims.forEach(claim => {
        console.log(`  Claim #${claim.sequentialNumber}: ${claim.clientName} - ${claim.itemDescription}`)
      })
    }

    if (inspections > 0) {
      const sampleInspections = await prisma.inspection.findMany({
        take: 3,
        select: {
          id: true,
          sequentialNumber: true,
          claim: {
            select: { sequentialNumber: true, clientName: true }
          }
        }
      })
      console.log('\nSample inspections:')
      sampleInspections.forEach(inspection => {
        console.log(`  Inspection #${inspection.sequentialNumber}: for Claim #${inspection.claim.sequentialNumber} (${inspection.claim.clientName})`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()