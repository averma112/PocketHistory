// lib/fx.js
const FX_BASE = 'https://api.frankfurter.app'

export async function getFrankfurterCurrencies() {
  const res = await fetch(`${FX_BASE}/currencies`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`FX currencies failed: ${res.status}`)
  return res.json() // { "USD": "United States Dollar", ... }
}

export async function getFxRate({ from, to }) {
  // Frankfurter uses ECB rates (daily) and supports many (not all) currencies.
  // Example: /latest?from=USD&to=CAD -> { rates: { CAD: 1.36... } }
  const url = `${FX_BASE}/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  const res = await fetch(url, { cache: 'no-store' })
  const json = await res.json()

  if (!res.ok) throw new Error(`FX fetch failed: ${res.status}`)
  if (json?.rates?.[to] == null) throw new Error(`FX rate not available for ${from} -> ${to}`)

  return Number(json.rates[to])
}
