export type UserId = 'stefan' | 'birgit'

export type Expense = {
  id: string
  date: string
  amount: number
  payerId: UserId
  category: string
  createdAt: string
  updatedAt: string
  note?: string        // NEU: nur bei SONSTIGES genutzt
}

// (Optional – belassen, falls in deinem Projekt verwendet)
export type Settings = {
  users: { id: UserId; name: string }[]
  categories: string[]
}

// (Optional – belassen, falls in deinem Projekt verwendet)
export type ShoppingItem = {
  id: string            // z.B. "s_20250901_abcd12"
  text: string          // "Brot"
  createdAt: string     // ISO
}
