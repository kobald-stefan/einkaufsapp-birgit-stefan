import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addExpense } from '../lib/expenses'
import { parseAmount } from '../lib/parse'

export default function AddExpense() {
  const nav = useNavigate()

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState<'stefan' | 'birgit'>('stefan')

  // Letzte Kategorie merken, Standard SPAR
  const lastCat = (localStorage.getItem('lastCategory') || 'SPAR').toUpperCase()
  const [category, setCategory] = useState(lastCat)

  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    amountRef.current?.focus()
  }, [])

  async function handleSave(andReset: boolean) {
    setMsg(null)
    const val = parseAmount(amount)
    if (isNaN(val) || val <= 0) {
      setMsg('Bitte einen gültigen Betrag eingeben.')
      return
    }

    setBusy(true)
    try {
      // Zuletzt gewählte Kategorie merken
      localStorage.setItem('lastCategory', category)

      await addExpense({
        date,
        amount: val,
        payerId: payer,
        category,
      })

      if (andReset) {
        setAmount('')
        setMsg('Gespeichert.')
      } else {
        nav('/') // zurück zum Dashboard
      }
    } catch (err: any) {
      setMsg(err?.message ?? 'Fehler beim Speichern.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="py-2">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm text-slate-600">Datum</label>
          <div className="mt-1 flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setDate(new Date().toISOString().slice(0, 10))}
              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600"
            >
              Heute
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600">Betrag (€)</label>
          <input
            ref={amountRef}
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">Zahler</label>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setPayer('stefan')}
              className={`flex-1 rounded-lg border px-3 py-2 bg-green-100 ${
                payer === 'stefan' ? 'border-slate-900' : 'border-slate-300'
              }`}
            >
              Stefan
            </button>
            <button
              type="button"
              onClick={() => setPayer('birgit')}
              className={`flex-1 rounded-lg border px-3 py-2 bg-green-100 ${
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
            onChange={(e) => setCategory(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option>Spar</option>
            <option>Hofer</option>
            <option>DM</option>
            <option>Lidl</option>
            <option>Sonstiges</option>
          </select>
        </div>

        <p className="text-sm text-slate-500">Aufteilung: fix 50/50</p>

        {msg && (
          <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm">
            {msg}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => handleSave(false)}
            className="flex-1 rounded-lg px-3 py-2 bg-red-900 hover:bg-red-800 text-white disabled:opacity-60"
          >
            {busy ? 'Speichern…' : 'Speichern'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => handleSave(true)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-60"
          >
            {busy ? 'Speichern…' : 'Speichern & Neu'}
          </button>
        </div>
      </form>
    </section>
  )
}
