export type UserId = 'stefan' | 'birgit'

export type Expense = {
  id: string            // z.B. "e_20250829_001"
  date: string          // ISO YYYY-MM-DD
  amount: number        // Euro (z.B. 12.34)
  payerId: UserId       // 'stefan' | 'birgit'
  category: string      // z.B. "Lebensmittel" / "Spar" / ...
  createdAt: string     // ISO
  updatedAt: string     // ISO
  note?: string         // NEU: nur bei "Sonstiges" genutzt
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
