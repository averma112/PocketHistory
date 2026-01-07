'use client'

import dayjs from 'dayjs'
import { deleteExpenseById } from '@/lib/api'

function formatExpenseDate(date) {
  const d = dayjs(date)
  const now = dayjs()
  return d.year() === now.year() ? d.format('MMM D') : d.format('MMM D, YYYY')
}

export default function ExpenseList({ items = [], onDeleted }) {
  const baseExpenses = items.filter(e => !e.originalCurrency)
  const foreignExpenses = items.filter(e => e.originalCurrency)

  async function onDelete(id) {
    if (!confirm('Delete this expense?')) return
    await deleteExpenseById(id)
    onDeleted?.()
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md space-y-6">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Recent</div>
      </div>

      {/* Base currency */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-white/80">Expenses</h3>

        {baseExpenses.length === 0 && (
          <div className="text-sm text-white/50">No expenses yet</div>
        )}

        {baseExpenses.map(e => (
          <div
            key={e.id}
            className="flex items-center justify-between py-2 text-sm border-b border-white/5 last:border-0"
          >
            <div>
              <div className="font-medium">{e.category}</div>
              <div className="text-xs text-white/50">{formatExpenseDate(e.date)}</div>
              {e.note && <div className="text-xs text-white/60">{e.note}</div>}
            </div>

            <div className="flex items-center gap-3">
              <div className="font-semibold">
                ${Number(e.amountBase ?? e.amount ?? 0).toFixed(2)}
              </div>
              <button
                onClick={() => onDelete(e.id)}
                className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Foreign currency */}
      {foreignExpenses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2 text-white/80">Foreign currency</h3>

          {foreignExpenses.map(e => (
            <div
              key={e.id}
              className="flex items-center justify-between py-2 text-sm border-b border-white/5 last:border-0"
            >
              <div>
                <div className="font-medium">{e.category}</div>
                <div className="text-xs text-white/50">{formatExpenseDate(e.date)}</div>
                {e.note && <div className="text-xs text-white/60">{e.note}</div>}
              </div>

              <div className="flex items-center gap-3">
                <div className="font-semibold text-right">
                  {e.originalCurrency} {Number(e.originalAmount ?? 0).toFixed(2)}
                  <span className="text-white/40 mx-1">→</span>
                  ${Number(e.amountBase ?? 0).toFixed(2)}
                </div>
                <button
                  onClick={() => onDelete(e.id)}
                  className="text-xs px-2 py-1 rounded-md border border-white/10 hover:bg-white/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
