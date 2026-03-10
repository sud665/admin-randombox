import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, nickname } = body

    if (!email || !password || !nickname) {
      return errorResponse('email, password, nickname은 필수입니다.')
    }

    const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

    if (useMock) {
      return jsonResponse({
        id: 'user-new',
        supabaseUid: 'sb-uid-new',
        email,
        nickname,
        phone: null,
        role: 'USER',
        point: 0,
        tutorialDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, 201)
    }

    // TODO: Supabase Auth + Prisma user create
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
