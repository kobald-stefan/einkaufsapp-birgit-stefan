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
