export default function Settings() {
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
          {['Spar','Hofer','DM','Lidl','Sonstiges'].map(k=>(
            <span key={k} className="rounded-full border border-slate-300 px-3 py-1 text-sm">{k}</span>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Kategorien sind fest vorgegeben und können hier nicht geändert werden.
        </p>
      </div>

      {/* NEUER BLOCK für Reset */}
      <div>
        <h2 className="mb-2 text-base font-medium">Daten</h2>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-red-500 px-3 py-2 text-red-600"
        >
          Datenbank zurücksetzen
        </button>
        <p className="mt-1 text-sm text-slate-500">
          Alle Einträge löschen, neue Defaults laden.
        </p>
      </div>

      <p className="text-sm text-slate-500">
        Aufteilung ist fix 50/50. Weitere Einstellungen nicht erforderlich.
      </p>
    </section>
  )
}
import { resetDB } from '../lib/db'

async function handleReset() {
  if (confirm("Datenbank wirklich löschen? Alle Einträge gehen verloren.")) {
    await resetDB()
    location.reload()
  }
}