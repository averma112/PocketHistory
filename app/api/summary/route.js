import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const expenses = await prisma.expense.findMany()
  
  const byCategory = expenses.reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category)
    if (existing) {
      existing.value += exp.amount
    } else {
      acc.push({ name: exp.category, value: exp.amount })
    }
    return acc
  }, [])
  
  return NextResponse.json({ byCategory })
}
