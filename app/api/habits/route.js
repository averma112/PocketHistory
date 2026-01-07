import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.habit.findMany({
    orderBy: { createdAt: 'desc' },
    include: { entries: true }
  })
  return NextResponse.json({ items })
}

export async function POST(req) {
  const body = await req.json()
  const habit = await prisma.habit.create({
    data: {
      name: body.name
    }
  })
  return NextResponse.json({ ok: true, id: habit.id })
}
