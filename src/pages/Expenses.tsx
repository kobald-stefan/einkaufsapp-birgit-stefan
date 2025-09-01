import { useEffect, useMemo, useState } from 'react'
import { getAllExpenses } from '../lib/expenses'
import type { Expense } from '../types'
import { formatCurrency } from '../lib/calc'
import { on } from '../lib/bus'
import { formatDate } from '../lib/format'
import { Link } from 'react-router-dom'

function ymOf(date: string) {
  return date.slice(0, 7) // 'YYYY-MM'
}

export default function Expenses() {
  const [all, setAll] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState<string>('Alle')
  const [category, setCategory] = useState<string>('Alle')
  const [payer, setPayer] = useState<'Alle' | 'Stefan' | 'Birgit'>('Alle')

  useEffect(() => {
    let stop = () => {}
    ;(async () => {
      async function refresh() {
        const list = await getAllExpenses()
        setAll(list)
        setLoading(false)
      }
      await refresh()
      stop = on('db-changed', () => {
        refresh()
      })
    })()
    return () => {
      stop()
    }
  }, [])

  const months = useMemo(() => {
    const set = new Set(all.map(e => ymOf(e.date)))
    return Array.from(set).sort().reverse()
  }, [all])

  const categories = useMemo(() => {
    const set = new Set(all.map(e => e.category))
    return Array.from(set).sort()
  }, [all])

  const filtered = all.filter(e => {
    if (month !== 'Alle' && ymOf(e.date) !== month) return false
    if (category !== 'Alle' && e.category !== category) return false
    if (payer !== 'Alle') {
      const isStefan = e.payerId === 'stefan'
      if (payer === 'Stefan' && !isStefan) return false
      if (payer === 'Birgit' && isStefan) return false
    }
    return true
  })

  return (
    <section className="py-2">
      <div className="mb-3 flex items-center justify-between">
  <Link to="/shopping" className="rounded-lg bg-slate-900 px-3 py-2 text-white">Einkaufsliste</Link>
</div>
      <div className="mb-3 flex flex-wrap gap-2">
        <select
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option>Alle</option>
          {months.map(m => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option>Alle</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={payer}
          onChange={e => setPayer(e.target.value as any)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          <option>Alle</option>
          <option>Stefan</option>
          <option>Birgit</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">Lade…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">Keine Einträge.</div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {filtered.map(e => (
            <li key={e.id} className="grid grid-cols-5 items-center px-4 py-3 gap-2">
              <div className="col-span-2">
                <div className="text-sm text-slate-500">{formatDate(e.date)}</div>
                <div className="font-medium">{e.category}</div>
              </div>
              <div>
                <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs">
                  {e.payerId === 'stefan' ? 'Stefan' : 'Birgit'}
                </span>
              </div>
              <div className="text-right font-semibold">{formatCurrency(e.amount)}</div>
              <div className="text-right">
                <Link to={`/edit/${e.id}`} className="text-sm text-slate-500 underline">Bearbeiten</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
