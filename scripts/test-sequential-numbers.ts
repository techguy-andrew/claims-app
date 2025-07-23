#!/usr/bin/env tsx

import { prisma } from '../src/lib/prisma'
import { getNextSequentialNumber, validateSequentialNumber, reserveSequentialNumber } from '../src/lib/sequential-numbers'

async function testSequentialNumbers() {
  console.log('Testing sequential number system...\n')

  try {
    // Get existing organization and user
    const organization = await prisma.organization.findFirst()
    const user = await prisma.user.findFirst()

    if (!organization || !user) {
      console.log('Need at least one organization and user for testing')
      return
    }

    // Test 1: Auto-generated claim number
    console.log('Test 1: Auto-generated claim number')
    const nextClaimNumber = await getNextSequentialNumber('CLAIM')
    console.log(`Next claim number: ${nextClaimNumber}`)

    const claim1 = await prisma.claim.create({
      data: {
        sequentialNumber: nextClaimNumber,
        clientName: 'Test Client 1',
        clientEmail: 'test1@example.com',
        itemDescription: 'Test Item 1',
        damageDetails: 'Test damage description',
        organizationId: organization.id,
        createdById: user.id
      }
    })
    console.log(`Created claim #${claim1.sequentialNumber}: ${claim1.clientName}`)

    // Test 2: Manual claim number validation (valid)
    console.log('\nTest 2: Manual claim number validation (valid)')
    const manualNumber = nextClaimNumber + 5 // Skip a few numbers
    const validation1 = await validateSequentialNumber('CLAIM', manualNumber)
    console.log(`Validating claim #${manualNumber}: ${validation1.isValid ? 'Valid' : validation1.message}`)

    if (validation1.isValid) {
      await reserveSequentialNumber('CLAIM', manualNumber)
      const claim2 = await prisma.claim.create({
        data: {
          sequentialNumber: manualNumber,
          clientName: 'Test Client 2',
          clientEmail: 'test2@example.com',
          itemDescription: 'Test Item 2',
          damageDetails: 'Test damage description',
          organizationId: organization.id,
          createdById: user.id
        }
      })
      console.log(`Created claim #${claim2.sequentialNumber}: ${claim2.clientName}`)
    }

    // Test 3: Manual claim number validation (invalid - duplicate)
    console.log('\nTest 3: Manual claim number validation (invalid - duplicate)')
    const validation2 = await validateSequentialNumber('CLAIM', manualNumber)
    console.log(`Validating duplicate claim #${manualNumber}: ${validation2.isValid ? 'Valid' : validation2.message}`)

    // Test 4: Auto-generated after manual reservation
    console.log('\nTest 4: Auto-generated after manual reservation')
    const nextClaimNumber2 = await getNextSequentialNumber('CLAIM')
    console.log(`Next claim number after manual reservation: ${nextClaimNumber2}`)

    // Test 5: Auto-generated inspection numbers
    console.log('\nTest 5: Auto-generated inspection numbers')
    const nextInspectionNumber = await getNextSequentialNumber('INSPECTION')
    console.log(`Next inspection number: ${nextInspectionNumber}`)

    const inspection1 = await prisma.inspection.create({
      data: {
        sequentialNumber: nextInspectionNumber,
        inspectorNotes: 'Test inspection notes',
        damageAssessment: 'Test assessment',
        photos: ['test-photo.jpg'],
        claimId: claim1.id,
        inspectorId: user.id
      }
    })
    console.log(`Created inspection #${inspection1.sequentialNumber} for claim #${claim1.sequentialNumber}`)

    // Test 6: View current counters
    console.log('\nTest 6: Current counter values')
    const counters = await prisma.numberCounter.findMany()
    counters.forEach(counter => {
      console.log(`${counter.entityType} counter: ${counter.currentValue}`)
    })

    // Test 7: Search functionality
    console.log('\nTest 7: Search by sequential number')
    const searchResult = await prisma.claim.findMany({
      where: {
        OR: [
          { sequentialNumber: claim1.sequentialNumber }
        ]
      },
      select: {
        sequentialNumber: true,
        clientName: true,
        itemDescription: true
      }
    })
    console.log('Search results:', searchResult)

    console.log('\n✅ All tests completed successfully!')

  } catch (error) {
    console.error('❌ Error during testing:', error)
  }
}

testSequentialNumbers()
  .finally(async () => {
    await prisma.$disconnect()
  })