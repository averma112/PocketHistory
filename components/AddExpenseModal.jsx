'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { Calendar, Plus } from 'lucide-react'
import { createExpense } from '@/lib/api'

export default function AddExpenseModal({ onAdded }) {
  const [open, setOpen] = useState(false)

  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('CAD')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const dateInputRef = useRef(null)

  const currencySymbols = useMemo(
    () => ({
      CAD: '$',
      USD: '$',
      AUD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      IRR: '﷼',
      AZN: '₼',
      TRY: '₺',
      BDT: '৳',
      RUB: '₽',
      UAH: '₴',
      PHP: '₱',
      MXN: '$',
      COP: '$',
    }),
    []
  )

  function resetForm() {
    setAmount('')
    setNote('')
    setCurrency('CAD')
    setCategory('Food')
    setDate(dayjs().format('YYYY-MM-DD'))
  }

  function close() {
    setOpen(false)
  }

  async function handleSave() {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return alert('Enter a valid amount')

    try {
      setSaving(true)

      await createExpense({
        amount: amt,
        currency,
        category,
        date: dayjs(date).toISOString(),
        note,
      })

      close()
      resetForm()
      onAdded?.()
    } catch (e) {
      // your fetchJSON throws text; surface it
      alert(String(e?.message || e))
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    close()
  }

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleCancel()
      // Enter to save (but not inside textarea)
      if (e.key === 'Enter' && e.target?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, amount, currency, category, date, note])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.65)] transition hover:brightness-110 active:scale-[0.98]"
      >
        <Plus className="size-4" />
        Add Expense
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999]">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* modal */}
          <div
            className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-2xl border border-white/10 bg-[#0B1220]/80 p-7 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Add Expense
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    Log it once. Everything updates instantly.
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Esc
                </button>
              </div>

              <div className="mt-6 space-y-5">
                {/* Amount + Currency */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/70">
                    Amount
                  </label>

                  <div className="flex h-12 items-center overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-emerald-400/30">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-full w-28 border-r border-white/10 bg-transparent px-3 text-sm text-white outline-none"
                    >
                      {Object.keys(currencySymbols).map((c) => (
                        <option key={c} value={c} className="bg-[#0B1220]">
                          {currencySymbols[c]} {c}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="h-full flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/70">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-400/30"
                  >
                    <option className="bg-[#0B1220]">Food</option>
                    <option className="bg-[#0B1220]">Transport</option>
                    <option className="bg-[#0B1220]">Groceries</option>
                    <option className="bg-[#0B1220]">Entertainment</option>
                    <option className="bg-[#0B1220]">Utilities</option>
                    <option className="bg-[#0B1220]">Other</option>
                    <option className="bg-[#0B1220]">Supplements</option>
                    <option className="bg-[#0B1220]">Concerts/Tickets</option>
                    <option className="bg-[#0B1220]">Sent Abroad</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/70">
                    Date
                  </label>

                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-400/30 [color-scheme:dark]"
                      style={{
                        // hide native icon so you only see ONE calendar
                        WebkitAppearance: 'none',
                      }}
                    />

                    {/* Hide the default webkit calendar icon */}
                    <style jsx>{`
                      input[type='date']::-webkit-calendar-picker-indicator {
                        opacity: 0;
                        display: none;
                        -webkit-appearance: none;
                      }
                    `}</style>

                    {/* Custom icon - extreme right */}
                    <button
                      type="button"
                      onClick={() => {
                        // opens native picker in modern browsers
                        if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker()
                        else dateInputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-white/70 hover:bg-white/10"
                      aria-label="Pick a date"
                    >
                      <Calendar className="size-5" />
                    </button>
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-white/70">
                    Note (optional)
                  </label>

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:ring-2 focus:ring-emerald-400/30"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleCancel}
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(16,185,129,0.65)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>

                <div className="text-xs text-white/40">
                  Tip: Press <span className="text-white/60">Enter</span> to save, <span className="text-white/60">Esc</span> to close.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
