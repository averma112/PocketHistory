// lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import ws from 'ws'

const globalForPrisma = globalThis

// Configure WebSocket for local development
if (process.env.NODE_ENV !== 'production') {
  global.WebSocket = ws
}

let prismaInstance

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  prismaInstance = new PrismaClient({
    adapter,
    log: ['error', 'warn'],
  })
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
} else {
  prismaInstance = globalForPrisma.prisma
}

export const prisma = prismaInstance