'use client'
const EXPENSES_KEY = 'ph_expenses_v1'
const HABITS_KEY = 'ph_habits_v1'

export function listExpenses() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [] } catch { return [] }
}
export function addExpense(e) {
  const cur = listExpenses()
  const next = { ...e, id: crypto.randomUUID() }
  localStorage.setItem(EXPENSES_KEY, JSON.stringify([next, ...cur]))
  return next
}
export function deleteExpense(id) {
  const cur = listExpenses().filter(e => e.id !== id)
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(cur))
}
export function listHabits() {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(HABITS_KEY)) || [] } catch { return [] }
}
export function addHabit(name) {
  const cur = listHabits()
  const next = { id: crypto.randomUUID(), name, entries: [] }
  localStorage.setItem(HABITS_KEY, JSON.stringify([next, ...cur]))
  return next
}
export function toggleHabit(id, dateISO) {
  const cur = listHabits()
  const h = cur.find(x => x.id === id)
  if (!h) return
  const existing = h.entries.find(e => e.date === dateISO)
  if (existing) existing.done = !existing.done
  else h.entries.push({ date: dateISO, done: true })
  localStorage.setItem(HABITS_KEY, JSON.stringify(cur))
}
