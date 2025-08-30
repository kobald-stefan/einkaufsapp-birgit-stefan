export type UserId = 'stefan' | 'birgit';

export type Expense = {
  id: string;          // z.B. "e_20250829_001"
  date: string;        // ISO YYYY-MM-DD
  amount: number;      // Euro (z.B. 12.34)
  payerId: UserId;     // 'stefan' | 'birgit'
  category: string;    // z.B. "Lebensmittel"
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
};

export type Settings = {
  users: { id: UserId; name: string }[];
  categories: string[];
  currency: 'EUR';
};
