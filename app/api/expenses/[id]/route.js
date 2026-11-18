// app/api/expenses/[id]/route.js
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/current-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(_req, { params }) {
  const user = await getCurrentUser()
  if (!user) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const deleted = await prisma.expense.deleteMany({
    where: {
      id: params.id,
      userId: user.id,
    },
  })

  if (!deleted.count) {
    return Response.json({ ok: false, error: 'Expense not found' }, { status: 404 })
  }

  return Response.json({ ok: true })
}
