import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, address } = body

    if (!orderId || !address) {
      return errorResponse('orderId, address는 필수입니다.')
    }

    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      return jsonResponse({
        id: `delivery-mock-${Date.now()}`,
        orderId,
        userId: 'user-1',
        address,
        trackingNo: null,
        carrier: null,
        shippingFee: 3000,
        status: 'PENDING',
        paidAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, 201)
    }

    // TODO: Prisma create delivery
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
