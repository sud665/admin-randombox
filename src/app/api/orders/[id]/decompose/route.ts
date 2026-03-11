import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useMock = isMockMode()

    if (useMock) {
      const { default: orders } = await import('@/mocks/orders.json')
      const { default: products } = await import('@/mocks/products.json')
      const order = orders.find(o => o.id === id)
      if (!order) return errorResponse('주문을 찾을 수 없습니다.', 404)

      const product = products.find(p => p.id === order.productId)
      const pointsEarned = product ? Math.floor(product.marketPrice * 0.3) : 0

      return jsonResponse({
        orderId: id,
        status: 'DECOMPOSED',
        pointsEarned,
        updatedAt: new Date().toISOString(),
      })
    }

    // TODO: Prisma transaction - update order status + add points
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
