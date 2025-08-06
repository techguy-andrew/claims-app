#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'

async function main() {
  try {
    const [orgs, users, claims] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.claim.count()
    ])

    console.log('Database contents:')
    console.log(`Organizations: ${orgs}`)
    console.log(`Users: ${users}`)
    console.log(`Claims: ${claims}`)

    if (claims > 0) {
      const sampleClaims = await prisma.claim.findMany({
        take: 3,
        select: {
          id: true,
          claimNumber: true,
          clientName: true,
          insuranceCompany: true,
          adjustorName: true,
          clientPhone: true
        }
      })
      console.log('\nSample claims:')
      sampleClaims.forEach(claim => {
        console.log(`  Claim #${claim.claimNumber}: ${claim.clientName} - ${claim.insuranceCompany} (${claim.adjustorName})`)
      })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()