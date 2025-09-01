import { getDB } from './db'
import type { ShoppingItem } from '../types'
import { emit } from './bus'
import { apiShoppingGetAll, apiShoppingAdd, apiShoppingDelete } from './api'

export async function getAllShopping(): Promise<ShoppingItem[]> {
  const db = await getDB()
  const all = await db.getAll('shopping')
  return all.sort((a,b) => a.createdAt.localeCompare(b.createdAt))
}

export async function addShopping(text: string) {
  const now = new Date().toISOString()
  const id = `s_${now.slice(0,10).replaceAll('-','')}_${Math.random().toString(36).slice(2,8)}`
  const item: ShoppingItem = { id, text, createdAt: now }
  const db = await getDB()
  await db.add('shopping', item)
  emit('db-changed')
  apiShoppingAdd(item).catch(err => console.warn('shopping POST failed', err))
  return item
}

export async function deleteShopping(id: string) {
  const db = await getDB()
  await db.delete('shopping', id)
  emit('db-changed')
  apiShoppingDelete(id).catch(err => console.warn('shopping DELETE failed', err))
}

// NEU: replace statt upsertMany
async function replaceShopping(list: ShoppingItem[]) {
  const db = await getDB()
  const tx = db.transaction('shopping', 'readwrite')
  await tx.store.clear()
  for (const it of list) await tx.store.put(it)
  await tx.done
  emit('db-changed')
}

export async function pullShopping() {
  try {
    const remote = await apiShoppingGetAll()
    await replaceShopping(remote) // <— wichtig
  } catch (e) {
    console.warn('shopping pull failed', e)
  }
}