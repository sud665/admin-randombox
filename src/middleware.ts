import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요한 보호 라우트
const protectedRoutes = ['/mypage', '/open']

// 로그인 상태에서 접근 불가 (로그인/회원가입 페이지)
const authRoutes = ['/login', '/signup']

// 어드민 라우트
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // mock-auth-user 쿠키에서 인증 상태 확인
  const authCookie = request.cookies.get('mock-auth-user')?.value
  let authUser: { id: string; role: string } | null = null

  if (authCookie) {
    try {
      authUser = JSON.parse(decodeURIComponent(authCookie))
    } catch {
      // 잘못된 쿠키는 무시
    }
  }

  const isAuthenticated = !!authUser

  // 보호 라우트: 미인증 시 로그인으로 리다이렉트
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 어드민 라우트: ADMIN role 확인
  const isAdminRoute = adminRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (authUser?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 인증 페이지: 이미 로그인 시 메인으로 리다이렉트
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 보호 라우트
    '/mypage/:path*',
    '/open/:path*',
    // 어드민 라우트
    '/admin/:path*',
    // 인증 라우트
    '/login',
    '/signup',
  ],
}
