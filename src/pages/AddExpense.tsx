import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addExpense } from '../lib/expenses'
import { parseAmount } from '../lib/parse'

type Payer = 'stefan' | 'birgit'
type Category = 'Spar' | 'Hofer' | 'DM' | 'Lidl' | 'Sonstiges'

const CATEGORIES: Category[] = ['Spar', 'Hofer', 'DM', 'Lidl', 'Sonstiges']

// Normalisiert evtl. alte/abweichende Werte (z. B. "SONSTIGES")
function normalizeCategory(v: string | null | undefined): Category {
  if (!v) return 'Spar'
  const s = v.trim().toLowerCase()
  if (s === 'spar') return 'Spar'
  if (s === 'hofer') return 'Hofer'
  if (s === 'dm') return 'DM'
  if (s === 'lidl') return 'Lidl'
  if (s === 'Sonstiges' || s === 'sonstige' || s === 'Sonstiges ') return 'Sonstiges'
  return 'Spar'
}

export default function AddExpense() {
  const nav = useNavigate()
  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState<string>(today)
  const [amount, setAmount] = useState<string>('')
  const [payer, setPayer] = useState<Payer>('stefan')

  const storedRaw =
    typeof window !== 'undefined' ? localStorage.getItem('lastCategory') : null
  const [category, setCategory] = useState<Category>(normalizeCategory(storedRaw))
  const [note, setNote] = useState<string>('') // NEU

  const [busy, setBusy] = useState<boolean>(false)
  const [msg, setMsg] = useState<string | null>(null)

  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    amountRef.current?.focus()
  }, [])

  const isSonstiges = category === 'Sonstiges'

  async function handleSave(andReset: boolean) {
    setMsg(null)

    const val = parseAmount(amount)
    if (isNaN(val) || val <= 0) {
      setMsg('Bitte einen gültigen Betrag eingeben.')
      return
    }

    setBusy(true)
    try {
      localStorage.setItem('lastCategory', category)

      await addExpense({
        date,
        amount: val,
        payerId: payer,
        category,
        note: isSonstiges ? note.trim() || undefined : undefined, // NEU
      })

      if (andReset) {
        setAmount('')
        if (isSonstiges) setNote('') // NEU
        setMsg('Gespeichert.')
      } else {
        nav('/')
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
        {/* Datum */}
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

        {/* Betrag */}
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

        {/* Zahler */}
        <div>
          <label className="block text-sm text-slate-600">Zahler</label>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setPayer('stefan')}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                payer === 'stefan'
                  ? 'border-slate-900 bg-green-100'
                  : 'border-slate-300 bg-white'
              }`}
            >
              Stefan
            </button>
            <button
              type="button"
              onClick={() => setPayer('birgit')}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                payer === 'birgit'
                  ? 'border-slate-900 bg-green-100'
                  : 'border-slate-300 bg-white'
              }`}
            >
              Birgit
            </button>
          </div>
        </div>

        {/* Kategorie */}
        <div>
          <label className="block text-sm text-slate-600">Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(normalizeCategory(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Beschreibung nur für "Sonstiges" */}
        {isSonstiges && (
          <div>
            <label className="block text-sm text-slate-600">Beschreibung</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='z. B. "Kindergarten"'
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        )}

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
            className="flex-1 rounded-lg bg-red-900 px-3 py-2 text-white hover:bg-red-800 disabled:opacity-60"
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
