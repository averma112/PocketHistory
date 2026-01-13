// lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  // During build time, return a mock client if DATABASE_URL is not available
  if (!connectionString) {
    console.warn('DATABASE_URL is not set, using mock Prisma client')
    return null
  }
  
  // For serverless/edge environments (Vercel), use Neon adapter
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ 
      adapter,
      log: ['error', 'warn']
    })
  }
  
  // For local development, use standard PrismaClient
  return new PrismaClient({ 
    log: ['error', 'warn']
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }