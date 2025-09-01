import { apiGetAll } from './api'
import { upsertMany } from './expenses'
import { emit } from './bus'

let syncing = false
let lastSyncAt: string | null = null
let lastError: string | null = null

export function getSyncState() {
  return { syncing, lastSyncAt, lastError }
}

export async function pullFromCloud() {
  if (syncing) return
  syncing = true
  lastError = null
  emit('db-changed')              // UI darf „lädt…“ zeigen, wenn gewünscht
  try {
    const remote = await apiGetAll()
    const clean = remote.filter(e =>
      e && typeof e.id==='string' && typeof e.amount==='number' && typeof e.date==='string'
    )
    await upsertMany(clean)
    lastSyncAt = new Date().toISOString()
  } catch (err: any) {
    lastError = err?.message ?? 'Sync fehlgeschlagen'
    console.warn('Pull failed:', err)
  } finally {
    syncing = false
    emit('db-changed')            // Status aktualisieren
  }
}
