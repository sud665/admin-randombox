import { NextRequest } from 'next/server'
import { jsonResponse, errorResponse, isMockMode } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'user-1'
    const useMock = isMockMode()

    if (useMock) {
      const { default: users } = await import('@/mocks/users.json')
      const user = users.find(u => u.id === userId)
      if (!user) return errorResponse('사용자를 찾을 수 없습니다.', 404)
      return jsonResponse(user)
    }

    // TODO: Prisma query - user by auth session
    return jsonResponse(null, 404)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'user-1'
    const body = await request.json()
    const useMock = isMockMode()

    if (useMock) {
      const { default: users } = await import('@/mocks/users.json')
      const user = users.find(u => u.id === userId)
      if (!user) return errorResponse('사용자를 찾을 수 없습니다.', 404)
      return jsonResponse({ ...user, ...body, updatedAt: new Date().toISOString() })
    }

    // TODO: Prisma update user
    return jsonResponse({ message: 'Not implemented' }, 501)
  } catch {
    return errorResponse('Internal Server Error', 500)
  }
}
