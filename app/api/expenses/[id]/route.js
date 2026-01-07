// app/api/expenses/[id]/route.js
import { prisma } from '@/lib/prisma'

export async function DELETE(_req, { params }) {
  await prisma.expense.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}
