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

  const expenses = await prisma.expense.findMany({ where: { userId: user.id } })
  
  const byCategory = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category)
    if (existing) {
      existing.value += Number(exp.amountBase ?? 0)
    } else {
      acc.push({ name: exp.category, value: Number(exp.amountBase ?? 0) })
    }
    return acc
  }, [])
  
  return NextResponse.json({ byCategory })
}
