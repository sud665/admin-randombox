import { NextResponse } from 'next/server'

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

// DATABASE_URL이 없으면 자동으로 mock 모드
export function isMockMode(): boolean {
  return !process.env.DATABASE_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true'
}
