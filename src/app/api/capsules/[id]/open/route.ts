import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api-helpers'
import { drawProduct } from '@/lib/draw-logic'
import type { CapsuleItem } from '@/types'

export async function POST(
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

      const won = drawProduct(capsule.items as CapsuleItem[])
      const product = products.find(p => p.id === won.productId)

      return jsonResponse({
        capsuleItem: won,
        product: product || null,
        order: {
          id: `order-mock-${Date.now()}`,
          userId: 'user-1',
          capsuleId: id,
          productId: won.productId,
          status: 'OPENED',
          pgPaymentId: null,
          amount: capsule.price,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    }

    // TODO: Prisma transaction - draw + create order
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
