// lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  // Throw error if DATABASE_URL is not set at runtime (not build time)
  if (!connectionString && process.env.NODE_ENV !== 'production') {
    console.error('DATABASE_URL is not set!')
  }
  
  // For Vercel/serverless environments, use Neon adapter
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ 
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
  }
  
  // For local development, use standard PrismaClient
  return new PrismaClient({ 
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
}

// Don't cache in production to ensure fresh connection with env vars
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

