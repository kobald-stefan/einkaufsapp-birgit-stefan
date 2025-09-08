import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllExpenses } from '../lib/expenses'
import { calcBalance, formatCurrency } from '../lib/calc'
import type { Expense } from '../types'
import { formatDate } from '../lib/format'
import { on } from '../lib/bus'

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let stop: () => void = () => {}

    ;(async () => {
      async function refresh() {
        const list = await getAllExpenses()
        setExpenses(list)
        setBalance(calcBalance(list))
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

  const last5 = expenses.slice(0, 5)

  function balanceText(n: number) {
    if (n > 0) return `Birgit schuldet Stefan ${formatCurrency(n)}`
    if (n < 0) return `Stefan schuldet Birgit ${formatCurrency(Math.abs(n))}`
    return 'Ausgeglichen'
  }

  return (
    <section className="py-2">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="text-sm text-slate-500">Aktueller Stand</div>
        <div className="mt-1 text-2xl font-semibold">
          {loading ? 'Lade…' : balanceText(balance)}
        </div>
      </div>

      <div className="mt-4">
        <Link
          to="/add"
          className="inline-block rounded-lg bg-red-800 px-4 py-2 text-white hover:bg-red-600"
        >
          + EINKAUF
        </Link>
      </div>

      <h2 className="mb-2 mt-6 text-base font-medium">Letzte Einkäufe</h2>

      {last5.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">
          Noch keine Daten. Lege über „+ EINKAUF“ den ersten Eintrag an.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {last5.map((e) => (
            <li key={e.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="text-sm text-slate-500">
                  {formatDate(e.date)} · {e.category}
                  {e.note ? ` · ${e.note}` : ''}
                </div>
                <div className="mt-0.5 inline-flex items-center gap-2">
                  <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs">
                    {e.payerId === 'stefan' ? 'Stefan' : 'Birgit'}
                  </span>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(e.amount)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
