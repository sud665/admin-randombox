import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      const { default: data } = await import('@/mocks/reviews.json')
      const hallOfFame = data.filter(r => r.isHallOfFame)
      return jsonResponse(hallOfFame)
    }

    // TODO: Prisma query - reviews where isHallOfFame = true
    return jsonResponse([])
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
