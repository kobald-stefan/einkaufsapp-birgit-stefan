export function formatDate(iso: string) {
  const [y,m,d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function formatRelative(iso?: string | null) {
  if (!iso) return 'nie'
  const diff = Date.now() - new Date(iso).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 10) return 'gerade eben'
  if (s < 60) return `vor ${s} s`
  const m = Math.floor(s / 60)
  if (m < 60) return `vor ${m} min`
  const h = Math.floor(m / 60)
  return `vor ${h} h`
}
