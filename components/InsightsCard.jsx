'use client'
import dayjs from 'dayjs'

export default function InsightsCard({ items = [] }) {
  // keep your insight logic if you already have it
  // this is just styling + safe text colors
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="font-semibold mb-2">Insights</div>

      {items.length === 0 ? (
        <div className="text-sm text-white/50">Add expenses to generate insights.</div>
      ) : (
        <ul className="space-y-2 text-sm text-white/70">
          <li>• You spent most on <span className="text-white">Food</span>.</li>
          <li>• Your spending is <span className="text-white">higher</span> than last week.</li>
          <li>• Weekend avg is trending <span className="text-white">down</span>.</li>
        </ul>
      )}

      <div className="mt-3 text-xs text-white/40">
        Updated {dayjs().format('MMM D, h:mm A')}
      </div>
    </div>
  )
}
