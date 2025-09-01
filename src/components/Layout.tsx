// src/components/Layout.tsx
import { useEffect, useState } from 'react'
import { pullFromCloud, getSyncState } from '../lib/sync'
import { formatRelative } from '../lib/format'
import BottomNav from './BottomNav'
import { Outlet } from 'react-router-dom'
import { pullShopping } from '../lib/shopping'

export default function Layout() {
  const [syncState, setSyncState] = useState(getSyncState())

 useEffect(() => {
  async function doPull() {
    const s = await pullFromCloud() // Expenses
    await pullShopping()            // Shopping-Liste
    setSyncState(s)
  }
  doPull()
  const iv = setInterval(doPull, 60000)
  const onVis = () => { if (document.visibilityState === 'visible') doPull() }
  document.addEventListener('visibilitychange', onVis)
  const onOnline = () => doPull()
  window.addEventListener('online', onOnline)
  return () => {
    clearInterval(iv)
    document.removeEventListener('visibilitychange', onVis)
    window.removeEventListener('online', onOnline)
  }
}, [])

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="mx-auto max-w-[var(--app-max)] px-4 py-4">
        <h1 className="text-xl font-semibold">Einkaufsapp Birgit & Stefan 🛒</h1>
        
        {/* Sync-Stempel unter der Überschrift */}
        <div className="mt-1 text-xs">
          {syncState.syncing ? (
            <span className="rounded-full border border-slate-300 px-3 py-1 text-slate-600">
              Synchronisiere…
            </span>
          ) : syncState.lastError ? (
            <span className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-rose-700">
              Offline / {syncState.lastError}
            </span>
          ) : (
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-emerald-700">
              {syncState.lastSyncAt
                ? `Synchronisiert: ${formatRelative(syncState.lastSyncAt)}`
                : 'Synchronisiert'}
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
