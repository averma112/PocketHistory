import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ ok: true, dbReady: true })
  } catch (e) {
    console.error('Health check failed:', e)
    return NextResponse.json({ ok: false, dbReady: false }, { status: 503 })
  }
}
