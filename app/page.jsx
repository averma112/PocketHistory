'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardStats from '@/components/DashboardStats'
import AddExpenseModal from '@/components/AddExpenseModal'
import ExpensePieChart from '@/components/ExpensePieChart'
import ExpenseLineChart from '@/components/ExpenseLineChart'
import ExpenseList from '@/components/ExpenseList'
import HabitTracker from '@/components/HabitTracker'
import InsightsCard from '@/components/InsightsCard'

import useSWR from 'swr'
import { getExpenses } from '@/lib/api'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function Page() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const { data: res, mutate, isLoading, error } = useSWR('/api/expenses', getExpenses)
  const items = res?.items || []

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] text-white">
        <div>Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // ✅ derive everything from SWR response (always realtime)
  const { total, avgPerDay, safeToSpend } = useMemo(() => {
    const monthStart = dayjs().startOf('month')

    const monthItems = items
      .filter(e => dayjs(e.date).valueOf() >= monthStart.valueOf())
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())

    const sum = monthItems.reduce((a, x) => a + Number(x.amountBase ?? x.amount ?? 0), 0)

    // days = from month start -> latest expense date (inclusive)
    const latest = monthItems[0]?.date
    const days = latest
      ? dayjs(latest).startOf('day').diff(monthStart.startOf('day'), 'day') + 1
      : 0

    const avg = days ? sum / days : 0

    // optional: safeToSpend if you have budget later; keep null for now
    return { total: sum, avgPerDay: avg, safeToSpend: null }
  }, [items])

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      {/* background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-sky-500/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-140px] h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-8">
        <Header />

        {/* top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-white/60">
            {isLoading && 'Loading your dashboard…'}
            {error && 'Could not load expenses.'}
            {!isLoading && !error && 'Personal finance & habit dashboard'}
          </div>

          <AddExpenseModal
            onAdded={() => {
              // ✅ re-fetch after create
              mutate()
            }}
          />
        </div>

        {/* stats */}
        <DashboardStats total={total} avgPerDay={avgPerDay} safeToSpend={safeToSpend} />

        {/* layout */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2 space-y-4">
            <ExpenseLineChart items={items} />
            <ExpenseList items={items} onDeleted={() => mutate()} />
          </div>

          <div className="space-y-4">
            <ExpensePieChart items={items} />
            <HabitTracker />
            <InsightsCard items={items} />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  )
}
