import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function GET() {
  try {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      const { default: data } = await import('@/mocks/fever.json')
      return jsonResponse({ config: data.config, progress: data.progress })
    }

    // TODO: Prisma query - fever config + progress
    return jsonResponse({ config: null, progress: null })
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
