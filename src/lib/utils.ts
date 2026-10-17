// ============================================================
// Mediko Bazaar — Utility Functions
// ============================================================

/** Format number as Nepalese Rupees */
export function formatNPR(amount: number): string {
  // Nepal uses the Indian numbering system (lakhs/crores)
  const formatted = amount.toLocaleString('en-IN')
  return `Rs. ${formatted}`
}

/** Format price or show "Ask for Price" */
export function formatPrice(price: number | null | undefined): string {
  if (!price || price === 0) return 'Ask for Price'
  return formatNPR(price)
}

/** Format date in Nepal-friendly format */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Format relative time */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

/** Merge class names (simple cn utility) */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Get status badge color classes */
export function getStatusColor(status: string): { bg: string; text: string } {
  const normalized = status.toLowerCase()
  if (['delivered', 'completed', 'approved', 'published', 'active', 'verified', 'available'].some(s => normalized.includes(s))) {
    return { bg: 'bg-success-bg', text: 'text-success' }
  }
  if (['processing', 'assigned', 'in progress', 'review', 'booked', 'reserved'].some(s => normalized.includes(s))) {
    return { bg: 'bg-info-bg', text: 'text-info' }
  }
  if (['pending', 'submitted', 'new', 'draft', 'sent', 'scheduled'].some(s => normalized.includes(s))) {
    return { bg: 'bg-warning-bg', text: 'text-warning' }
  }
  if (['cancelled', 'rejected', 'failed', 'suspended', 'overdue', 'error'].some(s => normalized.includes(s))) {
    return { bg: 'bg-error-bg', text: 'text-error' }
  }
  return { bg: 'bg-bg-section', text: 'text-text-muted' }
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

/** Generate a mock ID */
export function mockId(prefix = 'MB'): string {
  return `${prefix}-${String(Math.floor(10000 + Math.random() * 90000))}`
}

/** Calculate discount percentage */
export function calcDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/** Star rating array helper */
export function getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full')
    else if (rating >= i - 0.5) stars.push('half')
    else stars.push('empty')
  }
  return stars
}
