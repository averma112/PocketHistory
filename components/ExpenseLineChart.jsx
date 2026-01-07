'use client'

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import dayjs from 'dayjs'

function buildDaily(items = []) {
  const monthStart = dayjs().startOf('month')
  const monthEnd = dayjs().endOf('month')

  const sums = new Map()

  for (const e of items) {
    if (!e?.date) continue
    const d = dayjs(e.date)
    if (d.valueOf() < monthStart.valueOf() || d.valueOf() > monthEnd.valueOf()) continue

    const key = d.format('YYYY-MM-DD')
    const v = Number(e.amountBase ?? e.amount ?? 0)
    if (!Number.isFinite(v)) continue
    sums.set(key, (sums.get(key) ?? 0) + v)
  }

  const out = []
  for (let cur = monthStart; cur.valueOf() <= monthEnd.valueOf(); cur = cur.add(1, 'day')) {
    const key = cur.format('YYYY-MM-DD')
    const value = sums.get(key) ?? 0
    out.push({
      key,
      name: cur.format('MMM D'),
      value: Number(value.toFixed(2)),
    })
  }

  return out
}

export default function ExpenseLineChart({ items = [] }) {
  const data = buildDaily(items)

  // show fewer x labels (monthly looks crowded)
  const tickFormatter = (label) => {
    // show every ~5th day by hiding most labels
    // (recharts calls formatter for every tick)
    return label
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="font-semibold mb-3">Daily Spend</div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="value" dot={false} stroke="#34d399" strokeWidth={2} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.55)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
              interval={4} // ✅ show every 5th label
              tickFormatter={tickFormatter}
            />
            <YAxis
              stroke="rgba(255,255,255,0.55)"
              tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: '#0B1220',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'white',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.75)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {items.length === 0 && (
        <div className="text-sm text-white/50 mt-2">No data yet. Add an expense to start tracking.</div>
      )}
    </div>
  )
}
