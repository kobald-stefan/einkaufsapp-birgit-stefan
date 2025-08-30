export default function App() {
  return (
    <main className="mx-auto max-w-[var(--app-max)] px-4 py-10 font-sans">
      <h1 className="text-2xl font-semibold">Einkaufs-Split (MVP)</h1>
      <p className="mt-2 text-slate-600">
        Tailwind aktiv. Nächster Schritt: Basis-Layout & Navigation.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 p-4 bg-slate-50">
        <div className="text-sm text-slate-500">Status</div>
        <div className="text-lg">App läuft ✅</div>
      </div>
    </main>
  )
}
