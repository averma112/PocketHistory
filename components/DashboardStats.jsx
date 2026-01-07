export default function DashboardStats({ total, avgPerDay, safeToSpend }) {
  const card = "rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
  const label = "text-xs text-white/60"
  const value = "text-2xl font-semibold text-white"

  return (
    <div className="grid sm:grid-cols-3 gap-3 mb-4">
      <div className={card}>
        <div className={label}>Total this month</div>
        <div className={value}>${total.toFixed(2)}</div>
      </div>

      <div className={card}>
        <div className={label}>Average / day</div>
        <div className={value}>${avgPerDay.toFixed(2)}</div>
      </div>

      <div className={card}>
        <div className={label}>Safe to spend</div>
        <div className={value}>
          {safeToSpend != null ? `$${safeToSpend.toFixed(2)}` : '—'}
        </div>
      </div>
    </div>
  )
}
