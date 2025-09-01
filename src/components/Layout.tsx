import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import { useEffect, useState } from 'react'
import { pullFromCloud, getSyncState } from '../lib/sync'
import { formatRelative } from '../lib/format'

export default function Layout() {
  const [syncState, setSyncState] = useState(getSyncState())

  useEffect(() => {
    // sofort einmal ziehen
    pullFromCloud()

    // alle 60s ziehen
    const iv = setInterval(() => pullFromCloud(), 60000)

    // bei Tab-Fokus ziehen
    const onVis = () => {
      if (document.visibilityState === 'visible') pullFromCloud()
    }
    document.addEventListener('visibilitychange', onVis)

    // kleinen Poll laufen lassen, um Badge zu aktualisieren
    const poll = setInterval(() => setSyncState(getSyncState()), 1000)

    return () => {
      clearInterval(iv)
      clearInterval(poll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="mx-auto flex items-center justify-between max-w-[var(--app-max)] px-4 py-4">
        <h1 className="text-xl font-semibold">Einkaufsapp Birgit & Stefan 🛒</h1>
        <div className="text-xs">
          {syncState.syncing ? (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-slate-600">
              Synchronisiere…
            </span>
          ) : syncState.lastError ? (
            <span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-rose-700">
              Offline / {String(syncState.lastError)}
            </span>
          ) : (
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
              Synced {formatRelative(syncState.lastSyncAt) ?? 'gerade eben'}
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-[var(--app-max)] px-4 pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
