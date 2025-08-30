import type { Expense } from '../types';

export function calcBalance(expenses: Expense[]): number {
  let balance = 0;
  for (const e of expenses) {
    const half = round2(e.amount / 2);
    balance += (e.payerId === 'stefan') ? half : -half;
  }
  return round2(balance);
}

export function monthlyTotals(expenses: Expense[]) {
  // Rückgabe: { 'YYYY-MM': { stefan:number; birgit:number; total:number } }
  const out: Record<string, {stefan:number; birgit:number; total:number}> = {};
  for (const e of expenses) {
    const ym = e.date.slice(0,7);
    if (!out[ym]) out[ym] = { stefan: 0, birgit: 0, total: 0 };
    out[ym][e.payerId] = round2(out[ym][e.payerId] + e.amount);
    out[ym].total = round2(out[ym].total + e.amount);
  }
  return out;
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(n);
}

function round2(n: number) { return Math.round(n * 100) / 100; }
