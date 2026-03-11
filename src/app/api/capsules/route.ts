import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET() {
  try {
    const useMock = isMockMode()

    if (useMock) {
      const { default: data } = await import('@/mocks/capsules.json')
      return jsonResponse(data)
    }

    // TODO: Prisma query - capsules with items
    return jsonResponse([])
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
