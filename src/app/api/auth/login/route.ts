import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('email, password는 필수입니다.')
    }

    const useMock = isMockMode()

    if (useMock) {
      const { default: users } = await import('@/mocks/users.json')
      const user = users.find(u => u.email === email)
      if (!user) return errorResponse('사용자를 찾을 수 없습니다.', 401)
      return jsonResponse(user)
    }

    // TODO: Supabase Auth login + Prisma user query
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
