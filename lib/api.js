// lib/api.js
export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

// ---- Expenses ----
export const getExpenses = () => fetchJSON('/api/expenses')           // { items: [...] }

export const createExpense = (payload) =>
  fetchJSON('/api/expenses', { method: 'POST', body: JSON.stringify(payload) })

export const deleteExpenseById = (id) =>
  fetchJSON(`/api/expenses/${id}`, { method: 'DELETE' })

// (You can add habits endpoints later similarly)
