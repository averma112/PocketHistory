import dayjs from 'dayjs'
export function generateInsights(expenses) {
  if (!expenses.length) return ['Add your first expense to see insights.']
  const byCat = {}
  for (const e of expenses) byCat[e.category] = (byCat[e.category] ?? 0) + e.amount
  const topCat = Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0][0]
  const end = dayjs()
  const last14 = expenses.filter(e => dayjs(e.date).isAfter(end.subtract(14, 'day')))
  const recent7 = last14.filter(e => dayjs(e.date).isAfter(end.subtract(7,'day')))
  const prev7 = last14.filter(e => dayjs(e.date).isBefore(end.subtract(7,'day')))
  const sum = xs => xs.reduce((a,x)=>a+x.amount,0)
  const r = sum(recent7), p = sum(prev7)
  const delta = p === 0 ? 100 : Math.round(((r - p) / p) * 100)
  const weekend = expenses.filter(e => [0,6].includes(dayjs(e.date).day()))
  const weekday = expenses.filter(e => { const d = dayjs(e.date).day(); return d>=1 && d<=5 })
  const wAvg = weekend.length ? sum(weekend)/weekend.length : 0
  const wdAvg = weekday.length ? sum(weekday)/weekday.length : 0
  const moreOnWeekend = wAvg > wdAvg
  const pct = wdAvg === 0 ? 100 : Math.round(((wAvg - wdAvg) / wdAvg) * 100)
  return [
    `You spent most on ${topCat}.`,
    `Your spending is ${Math.abs(delta)}% ${delta>=0?'higher':'lower'} than the previous week.`,
    `You spend ${Math.abs(pct)}% ${moreOnWeekend?'more':'less'} per transaction on weekends.`,
  ]
}
