import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'user-1'
    const useMock = isMockMode()

    if (useMock) {
      const { default: orders } = await import('@/mocks/orders.json')
      const { default: products } = await import('@/mocks/products.json')
      const stored = orders
        .filter(o => o.userId === userId && o.status === 'STORED')
        .map(o => ({
          ...o,
          product: products.find(p => p.id === o.productId) || null,
        }))
      return jsonResponse(stored)
    }

    // TODO: Prisma query - orders with status STORED + product
    return jsonResponse([])
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
