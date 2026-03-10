import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || request.headers.get('x-user-id')
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      const { default: orders } = await import('@/mocks/orders.json')
      if (userId) {
        return jsonResponse(orders.filter(o => o.userId === userId))
      }
      return jsonResponse(orders)
    }

    // TODO: Prisma query - orders by userId
    return jsonResponse([])
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { capsuleId, paymentId, amount } = body

    if (!capsuleId || !amount) {
      return errorResponse('capsuleId, amount는 필수입니다.')
    }

    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      return jsonResponse({
        id: `order-mock-${Date.now()}`,
        userId: 'user-1',
        capsuleId,
        productId: null,
        status: 'OPENED',
        pgPaymentId: paymentId || null,
        amount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, 201)
    }

    // TODO: Prisma create order
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
