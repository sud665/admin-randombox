import type { User } from '@/types'

const TEST_ACCOUNTS: User[] = [
  {
    id: 'user-1',
    supabaseUid: 'sb-uid-001',
    email: 'test@example.com',
    nickname: '테스트유저',
    phone: null,
    role: 'USER',
    point: 3500,
    tutorialDone: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

async function getMockUsers(): Promise<User[]> {
  const { default: data } = await import('@/mocks/users.json')
  return data as User[]
}

export async function mockLogin(email: string, password: string): Promise<User> {
  // 로그인 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 기본 테스트 계정 확인
  if (email === 'test@example.com' && password === '1234') {
    return TEST_ACCOUNTS[0]
  }

  // mock 유저 데이터에서 이메일로 조회
  const users = await getMockUsers()
  const user = users.find((u) => u.email === email)

  if (user) {
    return user
  }

  // 데모용: 아무 이메일/비번이든 성공
  return {
    id: `user-${Date.now()}`,
    supabaseUid: `sb-uid-${Date.now()}`,
    email,
    nickname: email.split('@')[0],
    phone: null,
    role: 'USER',
    point: 0,
    tutorialDone: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function mockSignup(
  email: string,
  password: string,
  nickname: string
): Promise<User> {
  // 회원가입 시뮬레이션 딜레이
  await new Promise((resolve) => setTimeout(resolve, 700))

  // 데모용: 항상 성공
  return {
    id: `user-${Date.now()}`,
    supabaseUid: `sb-uid-${Date.now()}`,
    email,
    nickname,
    phone: null,
    role: 'USER',
    point: 0,
    tutorialDone: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// 쿠키 기반 mock auth 상태 관리 (미들웨어 호환)
export function setMockAuthCookie(user: User) {
  if (typeof document === 'undefined') return
  document.cookie = `mock-auth-user=${encodeURIComponent(JSON.stringify({ id: user.id, role: user.role }))};path=/;max-age=${60 * 60 * 24 * 30}`
}

export function clearMockAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'mock-auth-user=;path=/;max-age=0'
}

// 비사용 password 경고 방지용 (eslint)
void (mockLogin as unknown)
void (mockSignup as unknown)
