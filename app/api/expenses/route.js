import { prisma } from '@/lib/prisma'
import { getFxRate } from '@/lib/fx'
import { getServerSession } from 'next-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return Response.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    const items = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: 200,
    })
    return Response.json({ items })
  } catch (e) {
    return Response.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return Response.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()

    const amount = Number(body.amount)
    const category = body.category
    const note = body.note || null
    const date = new Date(body.date)

    const baseCurrency = (process.env.BASE_CURRENCY || 'CAD').toUpperCase()
    const enteredCurrency = (body.currency || baseCurrency).toUpperCase()

    if (!amount || amount <= 0) {
      return Response.json({ ok: false, error: 'Invalid amount' }, { status: 400 })
    }
    if (!category) {
      return Response.json({ ok: false, error: 'Category required' }, { status: 400 })
    }

    let amountBase = amount
    let originalAmount = null
    let originalCurrency = null
    let fxRate = null
    let fxDate = null

    // Convert only if foreign currency was used
    if (enteredCurrency !== baseCurrency) {
      const rate = await getFxRate({ from: enteredCurrency, to: baseCurrency })
      fxRate = rate
      fxDate = new Date()

      originalAmount = amount
      originalCurrency = enteredCurrency
      amountBase = Number((amount * rate).toFixed(4))
    }

    const created = await prisma.expense.create({
      data: {
        userId: user.id,
        category,
        note,
        date,

        baseCurrency,
        amountBase,

        originalAmount,
        originalCurrency,
        fxRate,
        fxDate,
      },
    })

    return Response.json({ ok: true, id: created.id })
  } catch (e) {
    return Response.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
