import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req, { params }) {
  const { date } = await req.json()
  const { id } = params
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const habit = await prisma.habit.findFirst({
    where: { id, userId: user.id },
    select: { id: true },
  })

  if (!habit) {
    return NextResponse.json({ ok: false, error: 'Habit not found' }, { status: 404 })
  }
  
  const existing = await prisma.habitEntry.findUnique({
    where: {
      habitId_date: {
        habitId: habit.id,
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
        habitId: habit.id,
        date: date,
        done: true
      }
    })
  }
  
  return NextResponse.json({ ok: true })
}
