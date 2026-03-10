import type { CapsuleItem } from '@/types'

export function drawProduct(items: CapsuleItem[]): CapsuleItem {
  const available = items.filter(item => item.stock > 0)
  if (available.length === 0) throw new Error('No stock available')

  const totalWeight = available.reduce((sum, item) => sum + item.probability, 0)
  let random = Math.random() * totalWeight

  for (const item of available) {
    random -= item.probability
    if (random <= 0) return item
  }
  return available[available.length - 1]
}
