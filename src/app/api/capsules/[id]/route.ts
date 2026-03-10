import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      const { default: capsules } = await import('@/mocks/capsules.json')
      const { default: products } = await import('@/mocks/products.json')
      const capsule = capsules.find(c => c.id === id)
      if (!capsule) return errorResponse('캡슐을 찾을 수 없습니다.', 404)

      const itemsWithProducts = capsule.items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId) || null,
      }))

      return jsonResponse({ ...capsule, items: itemsWithProducts })
    }

    // TODO: Prisma query - capsule with items + products
    return jsonResponse(null, 404)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
