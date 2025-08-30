import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllExpenses, updateExpense } from '../lib/expenses'
import type { Expense } from '../types'
import { parseAmount } from '../lib/parse'

export default function EditExpense() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [exp, setExp] = useState<Expense | null>(null)
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState<'stefan' | 'birgit'>('stefan')
  const [category, setCategory] = useState('SONSTIGES')
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (exp) amountRef.current?.focus()
  }, [exp])

  useEffect(() => {
    (async () => {
      const all = await getAllExpenses()
      const found = all.find(e => e.id === id)
      if (found) {
        setExp(found)
        setDate(found.date)
        setAmount(found.amount.toString())
        setPayer(found.payerId)
        setCategory((found.category || 'SONSTIGES').toUpperCase())
      }
    })()
  }, [id])

  async function handleSave() {
    setMsg(null)
    const val = parseAmount(amount)
    if (!exp || isNaN(val) || val <= 0) {
      setMsg('Bitte gültigen Betrag eingeben.')
      return
    }
    setBusy(true)
    try {
      await updateExpense(exp.id, {
        date,
        amount: val,
        payerId: payer,
        category,
      })
      nav('/expenses')
    } catch (err: any) {
      setMsg(err?.message ?? 'Fehler beim Speichern.')
    } finally {
      setBusy(false)
    }
  }

  if (!exp) return <div className="p-4">Lade…</div>

  return (
    <section className="py-2">
      <h2 className="mb-4 text-base font-medium">Eintrag bearbeiten</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600">Datum</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">Betrag (€)</label>
          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            placeholder="z. B. 12,34"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">Zahler</label>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setPayer('stefan')}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                payer === 'stefan' ? 'border-slate-900' : 'border-slate-300'
              }`}
            >
              Stefan
            </button>
            <button
              type="button"
              onClick={() => setPayer('birgit')}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                payer === 'birgit' ? 'border-slate-900' : 'border-slate-300'
              }`}
            >
              Birgit
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600">Kategorie</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option>SPAR</option>
            <option>HOFER</option>
            <option>DM</option>
            <option>LIDL</option>
            <option>SONSTIGES</option>
          </select>
        </div>

        {msg && (
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
            {msg}
          </div>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={handleSave}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
        >
          {busy ? 'Speichern…' : 'Änderungen speichern'}
        </button>
      </div>
    </section>
  )
}
