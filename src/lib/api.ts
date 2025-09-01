import type { Expense } from '../types'

// In Dev über `netlify dev` läuft die Function unter :8888
const base = import.meta.env.DEV ? 'http://localhost:8888' : ''
const ENDPOINT = `${base}/.netlify/functions/expenses`

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiGetAll(): Promise<Expense[]> {
  const res = await fetch(ENDPOINT, { method: 'GET' })
  return j<Expense[]>(res)
}

export async function apiPost(exp: Expense | Omit<Expense,'createdAt'|'updatedAt'>) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(exp),
  })
  return j<{ok:true}>(res)
}

export async function apiPut(exp: Expense) {
  const res = await fetch(ENDPOINT, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(exp),
  })
  return j<{ok:true}>(res)
}

import type { ShoppingItem } from '../types'

const shoppingURL = `${base}/.netlify/functions/shopping`

export async function apiShoppingGetAll(): Promise<ShoppingItem[]> {
  const res = await fetch(shoppingURL, { method: 'GET' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiShoppingAdd(item: ShoppingItem) {
  const res = await fetch(shoppingURL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiShoppingDelete(id: string) {
  const url = `${shoppingURL}?id=${encodeURIComponent(id)}`
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}