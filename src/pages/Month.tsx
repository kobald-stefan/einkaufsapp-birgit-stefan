import { useEffect, useMemo, useState } from 'react'
import { getAllExpenses } from '../lib/expenses'
import { monthlyTotals, formatCurrency } from '../lib/calc'
import type { Expense } from '../types'
import { on } from '../lib/bus'

export default function Month() {
  const [all, setAll] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  let stop = () => {};
  (async () => {
    async function refresh() {
      const list = await getAllExpenses()
      setAll(list)
      setLoading(false)
    }
    await refresh();
    stop = on('db-changed', () => { refresh() });
  })();
  return () => { stop(); };
}, [])

  const rows = useMemo(() => {
    const map = monthlyTotals(all)
    const entries = Object.entries(map) // [ [ 'YYYY-MM', {stefan, birgit, total} ], ... ]
    entries.sort((a,b) => a[0] < b[0] ? 1 : -1)
    return entries
  }, [all])

  return (
    <section className="py-2">
      <h2 className="mb-2 text-base font-medium">Monatsübersicht (Summen)</h2>

      {loading ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">Lade…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">Noch keine Daten.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Monat</th>
                <th className="px-3 py-2 text-left">Stefan</th>
                <th className="px-3 py-2 text-left">Birgit</th>
                <th className="px-3 py-2 text-left">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([ym, s]) => (
                <tr key={ym} className="border-t">
                  <td className="px-3 py-2">{ym}</td>
                  <td className="px-3 py-2">{formatCurrency(s.stefan)}</td>
                  <td className="px-3 py-2">{formatCurrency(s.birgit)}</td>
                  <td className="px-3 py-2 font-medium">{formatCurrency(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
