import type { Capsule, Product, Order, Review, FeverProgress, FeverConfig, User } from '@/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getCapsules(): Promise<Capsule[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/capsules.json')
    return data as Capsule[]
  }
  // TODO: Prisma query
  return []
}

export async function getCapsuleById(id: string): Promise<Capsule | null> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/capsules.json')
    return (data as Capsule[]).find(c => c.id === id) || null
  }
  return null
}

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/products.json')
    return data as Product[]
  }
  return []
}

export async function getProductById(id: string): Promise<Product | null> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/products.json')
    return (data as Product[]).find(p => p.id === id) || null
  }
  return null
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/orders.json')
    return (data as Order[]).filter(o => o.userId === userId)
  }
  return []
}

export async function getReviews(): Promise<Review[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/reviews.json')
    return data as Review[]
  }
  return []
}

export async function getHallOfFameReviews(): Promise<Review[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/reviews.json')
    return (data as Review[]).filter(r => r.isHallOfFame)
  }
  return []
}

export async function getFeverStatus(): Promise<{ config: FeverConfig; progress: FeverProgress }> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/fever.json')
    return data as { config: FeverConfig; progress: FeverProgress }
  }
  return { config: {} as FeverConfig, progress: {} as FeverProgress }
}

export async function getUserById(id: string): Promise<User | null> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/users.json')
    return (data as User[]).find(u => u.id === id) || null
  }
  return null
}
