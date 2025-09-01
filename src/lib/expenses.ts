import { getDB } from './db'
import type { Expense } from '../types'
import { emit } from './bus'
import { apiPost, apiPut } from './api'

export async function addExpense(input: Omit<Expense, 'id'|'createdAt'|'updatedAt'>) {
  const db = await getDB()
  const now = new Date().toISOString()
  const id = makeId(input.date)
  const e: Expense = { id, createdAt: now, updatedAt: now, ...input }
  await db.add('expenses', e)
  emit('db-changed')
  // Cloud (best effort)
  apiPost(e).catch(err => console.warn('Cloud POST failed:', err))
  return e
}

export async function updateExpense(id: string, patch: Partial<Omit<Expense,'id'|'createdAt'>>) {
  const db = await getDB()
  const current = await db.get('expenses', id)
  if (!current) throw new Error('Expense not found: ' + id)
  const updated: Expense = { ...current, ...patch, updatedAt: new Date().toISOString() }
  await db.put('expenses', updated)
  emit('db-changed')
  // Cloud (best effort)
  apiPut(updated).catch(err => console.warn('Cloud PUT failed:', err))
  return updated
}

export async function upsertMany(list: Expense[]) {
  const db = await getDB()
  const tx = db.transaction('expenses', 'readwrite')
  for (const e of list) {
    await tx.store.put(e) // put = upsert
  }
  await tx.done
  emit('db-changed')
}

export async function getAllExpenses(): Promise<Expense[]> {
  const db = await getDB()
  const all = await db.getAll('expenses')
  return all.sort((a,b) =>
    a.date < b.date ? 1 :
    a.date > b.date ? -1 :
    b.createdAt.localeCompare(a.createdAt)
  )
}

export async function getExpensesByMonth(ym: string) { // 'YYYY-MM'
  const all = await getAllExpenses()
  return all.filter(e => e.date.startsWith(ym))
}

function makeId(date: string) {
  const rnd = Math.random().toString(36).slice(2,8)
  return `e_${date.replaceAll('-','')}_${rnd}`
}
