#!/usr/bin/env tsx

import { initializeCounters, backfillSequentialNumbers } from '../src/lib/sequential-numbers'

/**
 * Script to backfill sequential numbers for existing claims and inspections
 */
async function main() {
  try {
    console.log('Starting sequential number backfill...')
    
    console.log('Initializing counters...')
    await initializeCounters()
    
    console.log('Backfilling sequential numbers...')
    await backfillSequentialNumbers()
    
    console.log('Backfill completed successfully!')
  } catch (error) {
    console.error('Error during backfill:', error)
    process.exit(1)
  }
}

main()