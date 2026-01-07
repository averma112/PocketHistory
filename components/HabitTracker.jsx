'use client'
import dayjs from 'dayjs'
import { addHabit, listHabits, toggleHabit } from '@/lib/storage'
import { useEffect, useState } from 'react'

export default function HabitTracker({ refreshKey }) {
  const [habits, setHabits] = useState(listHabits())
  const [name, setName] = useState('')

  useEffect(()=>{ setHabits(listHabits()) }, [refreshKey])

  const today = dayjs().format('YYYY-MM-DD')

  function add() {
    if (!name.trim()) return
    addHabit(name.trim())
    setName('')
    setHabits(listHabits())
  }

  function toggle(id) {
    toggleHabit(id, today)
    setHabits(listHabits())
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
      <div className="font-semibold mb-3">Habits</div>
      <div className="flex gap-2 mb-3">
        <input 
        value={name} onChange={e=>setName(e.target.value)} placeholder="Add habit (e.g., No Uber Eats)" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-emerald-500/30" />
        <button onClick={add} className="rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400">Add</button>
      </div>
      <div className="space-y-2">
        {habits.length === 0 && <div className="text-sm text-gray-500">No habits yet.</div>}
        {habits.map(h => {
          const done = h.entries.find(e => e.date === today)?.done
          return (
            <div key={h.id} className="flex items-center justify-between">
              <div className="text-sm">{h.name}</div>
              <button onClick={()=>toggle(h.id)} className={"rounded-lg bg-emerald-500/90 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400" + (done? "bg-emerald-600 text-white":"border")}>
                {done ? 'Done' : 'Mark today'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
