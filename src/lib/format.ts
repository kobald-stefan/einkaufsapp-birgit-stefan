export function formatDate(iso: string) {
  // iso ist "YYYY-MM-DD"
  const [y,m,d] = iso.split('-')
  return `${d}.${m}.${y}`
}
