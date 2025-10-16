export function formatDate(iso?: string) {
  if (!iso) return 'Date TBA'
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return 'Invalid date'
    return d.toLocaleString()
  } catch {
    return 'Invalid date'
  }
}
