import { useState } from 'react'
import { pullFromCloud } from '../lib/sync'
import { resetDB } from '../lib/db'

export default function Settings() {
  const [busy, setBusy] = useState(false)

  async function handleReset() {
    if (confirm("Datenbank wirklich löschen? Alle Einträge gehen verloren.")) {
      await resetDB()
      location.reload()
    }
  }

  async function handleSyncNow() {
    if (busy) return
    setBusy(true)
    try {
      await pullFromCloud()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="py-2 space-y-6">
      <div>
        <h2 className="mb-2 text-base font-medium">Namen</h2>
        <div className="grid grid-cols-2 gap-2">
          <input defaultValue="Stefan" className="rounded-lg border border-slate-300 px-3 py-2" />
          <input defaultValue="Birgit" className="rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-base font-medium">Kategorien (fix)</h2>
        <div className="flex flex-wrap gap-2">
          {['Spar', 'Hofer', 'DM', 'Lidl', 'Sonstiges'].map(k => (
            <span
              key={k}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm"
            >
              {k}
            </span>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Kategorien sind fest vorgegeben und können hier nicht geändert werden.
        </p>
      </div>

      {/* Block für Reset + Sync */}
      <div>
        <h2 className="mb-2 text-base font-medium">Daten</h2>
        <button
          type="button"
          onClick={handleReset}
          className="mb-2 w-full rounded-lg border border-red-500 px-3 py-2 text-red-600"
        >
          Datenbank zurücksetzen
        </button>
        <button
          type="button"
          onClick={handleSyncNow}
          disabled={busy}
          className={`w-full rounded-lg border px-3 py-2 ${
            busy
              ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-300'
          }`}
        >
          {busy ? 'Synchronisiere…' : 'Jetzt synchronisieren'}
        </button>
      </div>
    </section>
  )
}
