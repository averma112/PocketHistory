'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useSWR from 'swr'
import { getExpenses } from '@/lib/api'

const COLORS = ['#10B981', '#60A5FA', '#F59E0B', '#EF4444', '#8B5CF6', '#22C55E', '#A78BFA']

function buildCategoryData(expenses = []) {
  const map = new Map()

  for (const e of expenses) {
    const name = e?.category || 'Other'
    const v = Number(e?.amountBase ?? e?.amount ?? 0)
    if (!Number.isFinite(v) || v <= 0) continue
    map.set(name, (map.get(name) ?? 0) + v)
  }

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
}

export default function ExpensePieChart() {
  const { data: res } = useSWR('/api/expenses', getExpenses)
  const expenses = res?.items || []
  const data = buildCategoryData(expenses)

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="font-semibold mb-3 text-white">By Category</div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="text-sm text-white/50">No category data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                innerRadius={55}
                paddingAngle={2}
                stroke="rgba(255,255,255,0.10)"
                labelLine={false}
                label={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 12, 20, 0.92)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  color: 'white',
                }}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="square"
                wrapperStyle={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, paddingTop: 6 }}
                />

            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
