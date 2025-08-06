#!/usr/bin/env tsx

// Test API validation for sequential numbers
import { prisma } from '../src/lib/prisma'

async function testAPIValidation() {
  console.log('Testing API validation...\n')

  try {
    // Get existing data for testing
    const organization = await prisma.organization.findFirst()
    const user = await prisma.user.findFirst()
    const existingClaim = await prisma.claim.findFirst()

    if (!organization || !user || !existingClaim) {
      console.log('Need existing data for API testing')
      return
    }

    const baseURL = 'http://localhost:3000' // Adjust if needed
    
    // Test 1: Create claim with duplicate sequential number (should fail)
    console.log('Test 1: Create claim with duplicate sequential number')
    try {
      const response = await fetch(`${baseURL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimNumber: existingClaim.claimNumber,
          clientName: 'Test Duplicate',
          clientPhone: '(555) 999-0000',
          clientAddress: '999 Test Street, Test City, TC 99999',
          insuranceCompany: 'Test Insurance Co',
          adjustorName: 'Test Adjustor',
          adjustorEmail: 'test.adjustor@testinsurance.com',
          organizationId: organization.id,
          createdById: user.id
        })
      })
      
      const data = await response.json()
      console.log(`Status: ${response.status}`)
      console.log(`Response: ${data.error || 'Success'}`)
    } catch (error) {
      console.log('Network error (API might not be running):', (error as Error).message)
    }

    // Test 2: Create claim with invalid sequential number (negative)
    console.log('\nTest 2: Create claim with invalid sequential number (negative)')
    try {
      const response = await fetch(`${baseURL}/api/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequentialNumber: -1,
          clientName: 'Test Invalid',
          clientPhone: '(555) 999-0001',
          clientAddress: '998 Invalid Street, Invalid City, IC 99998',
          insuranceCompany: 'Invalid Insurance Co',
          adjustorName: 'Invalid Adjustor',
          adjustorEmail: 'invalid.adjustor@invalidinsurance.com',
          organizationId: organization.id,
          createdById: user.id
        })
      })
      
      const data = await response.json()
      console.log(`Status: ${response.status}`)
      console.log(`Response: ${data.error || 'Success'}`)
    } catch (error) {
      console.log('Network error (API might not be running):', (error as Error).message)
    }

    // Test 3: Update claim with duplicate sequential number (should fail)
    console.log('\nTest 3: Update claim with duplicate sequential number')
    const anotherClaim = await prisma.claim.findFirst({
      where: { id: { not: existingClaim.id } }
    })
    
    if (anotherClaim) {
      try {
        const response = await fetch(`${baseURL}/api/claims/${anotherClaim.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            claimNumber: existingClaim.claimNumber,
            clientName: anotherClaim.clientName,
            clientPhone: anotherClaim.clientPhone,
            clientAddress: anotherClaim.clientAddress,
            insuranceCompany: anotherClaim.insuranceCompany,
            adjustorName: anotherClaim.adjustorName,
            adjustorEmail: anotherClaim.adjustorEmail,
            status: anotherClaim.status
          })
        })
        
        const data = await response.json()
        console.log(`Status: ${response.status}`)
        console.log(`Response: ${data.error || 'Success'}`)
      } catch (error) {
        console.log('Network error (API might not be running):', (error as Error).message)
      }
    } else {
      console.log('Need at least 2 claims for this test')
    }

    console.log('\n✅ API validation tests completed!')

  } catch (error) {
    console.error('❌ Error during API testing:', error)
  }
}

testAPIValidation()
  .finally(async () => {
    await prisma.$disconnect()
  })