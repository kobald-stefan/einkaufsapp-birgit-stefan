// wandelt Eingaben wie "12,34", "12.34", "12 " in Zahl (2 Nachkommastellen)
export function parseAmount(input: string): number {
  const normalized = input.replace(/\s/g, '').replace(',', '.')
  const n = Number(normalized)
  if (!isFinite(n)) return NaN
  return Math.round(n * 100) / 100
}
