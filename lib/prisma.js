// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

function getPrismaClient() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  const connectionString = process.env.DATABASE_URL
  
  console.log('=== CREATING PRISMA CLIENT ===')
  console.log('DATABASE_URL exists:', !!connectionString)
  console.log('DATABASE_URL length:', connectionString?.length)
  console.log('===============================')
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client
  }

  return client
}

// Export the client instance directly, not through a Proxy
export const prisma = getPrismaClient()