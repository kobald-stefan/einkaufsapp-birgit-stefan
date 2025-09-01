// src/lib/sync.ts
import { apiGetAll } from './api'
import { upsertMany } from './expenses'
import { emit } from './bus'

let syncing = false
let lastSyncAt: string | null = null
let lastError: string | null = null

export function getSyncState() {
  return { syncing, lastSyncAt, lastError }
}

export async function pullFromCloud(): Promise<{ syncing: boolean; lastSyncAt: string | null; lastError: string | null }> {
  if (syncing) return getSyncState()
  syncing = true
  lastError = null
  // kein emit hier – UI soll erst bei Ergebnis umschalten

  try {
    const remote = await apiGetAll()
    const clean = remote.filter(e =>
      e && typeof e.id === 'string' && typeof e.amount === 'number' && typeof e.date === 'string'
    )
    await upsertMany(clean) // löst selbst ein db-changed aus
    lastSyncAt = new Date().toISOString()
  } catch (err: any) {
    lastError = err?.message ?? 'Sync fehlgeschlagen'
    console.warn('Pull failed:', err)
  } finally {
    syncing = false
    emit('db-changed') // damit Screens neu rendern
  }
  return getSyncState()
}
