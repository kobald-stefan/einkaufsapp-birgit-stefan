import { useState } from 'react'
import { pullFromCloud } from '../lib/sync'
import { resetDB } from '../lib/db'
import { pullShopping } from '../lib/shopping'

export default function Settings() {
  const [busy, setBusy] = useState(false)

  async function handleReset() {
    const confirmed = confirm("Datenbank wirklich löschen? Alle Einträge gehen verloren.")
    if (!confirmed) return

    const password = prompt("Bitte Passwort eingeben:")
    if (password !== "8a7y*Y~XRY£[t2L") {
      alert("Falsches Passwort – Datenbank wird nicht zurückgesetzt.")
      return
    }

    await resetDB()
    location.reload()
  }

  async function handleSyncNow() {
    if (busy) return
    setBusy(true)
    try {
      await pullFromCloud()
      await pullShopping()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="py-2 space-y-6">
      <div>
        <h2 className="mb-2 text-base font-medium">Daten</h2>
        <button
          type="button"
          onClick={handleReset}
          className="mb-2 w-full rounded-lg border border-red-500 px-3 py-2 text-red-600"
        >
          Datenbank zurücksetzen (Passwort erforderlich)
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
