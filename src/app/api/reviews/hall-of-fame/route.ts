import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET() {
  try {
    const useMock = isMockMode()

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
