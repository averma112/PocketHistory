// lib/prisma.js
export const runtime = "nodejs"
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  
  // For serverless/edge environments (Vercel), use Neon adapter
  if (process.env.VERCEL) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ 
      adapter, 
      log: ['error', 'warn'],
      datasourceUrl: connectionString 
    })
  }
  
  // For local development, use standard PrismaClient
  return new PrismaClient({ 
    log: ['error', 'warn'],
    datasourceUrl: connectionString 
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }