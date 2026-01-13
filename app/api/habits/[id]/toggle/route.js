import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req, { params }) {
  const { date } = await req.json()
  const { id } = params
  
  const existing = await prisma.habitEntry.findUnique({
    where: {
      habitId_date: {
        habitId: id,
        date: date
      }
    }
  })
  
  if (existing) {
    await prisma.habitEntry.update({
      where: { id: existing.id },
      data: { done: !existing.done }
    })
  } else {
    await prisma.habitEntry.create({
      data: {
        habitId: id,
        date: date,
        done: true
      }
    })
  }
  
  return NextResponse.json({ ok: true })
}
