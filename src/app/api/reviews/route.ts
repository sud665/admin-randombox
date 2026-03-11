import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET() {
  try {
    const useMock = isMockMode()

    if (useMock) {
      const { default: data } = await import('@/mocks/reviews.json')
      return jsonResponse(data)
    }

    // TODO: Prisma query - reviews with user + product
    return jsonResponse([])
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, rating, content } = body

    if (!orderId || !rating || !content) {
      return errorResponse('orderId, rating, content는 필수입니다.')
    }

    const useMock = isMockMode()

    if (useMock) {
      return jsonResponse({
        id: `review-mock-${Date.now()}`,
        orderId,
        userId: 'user-1',
        productId: 'prod-1',
        rating,
        content,
        imageUrl: null,
        isHallOfFame: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, 201)
    }

    // TODO: Prisma create review
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
