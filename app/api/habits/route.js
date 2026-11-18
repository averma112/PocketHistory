import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const items = await prisma.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { entries: true }
  })
  return NextResponse.json({ items })
}

export async function POST(req) {
  const body = await req.json()
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const name = String(body?.name || '').trim()
  if (!name) {
    return NextResponse.json({ ok: false, error: 'Habit name required' }, { status: 400 })
  }

  const habit = await prisma.habit.create({
    data: {
      name,
      userId: user.id
    }
  })
  return NextResponse.json({ ok: true, id: habit.id })
}
