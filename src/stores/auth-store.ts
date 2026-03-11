import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'
import { mockLogin, mockSignup, setMockAuthCookie, clearMockAuthCookie } from '@/lib/mock-auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  markTutorialDone: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const user = await mockLogin(email, password)
          setMockAuthCookie(user)
          set({ user, isLoading: false })
        } catch {
          set({ isLoading: false })
          throw new Error('로그인에 실패했습니다.')
        }
      },

      signup: async (email: string, password: string, nickname: string) => {
        set({ isLoading: true })
        try {
          const user = await mockSignup(email, password, nickname)
          setMockAuthCookie(user)
          set({ user, isLoading: false })
        } catch {
          set({ isLoading: false })
          throw new Error('회원가입에 실패했습니다.')
        }
      },

      logout: () => {
        clearMockAuthCookie()
        set({ user: null })
      },

      setUser: (user: User | null) => {
        if (user) {
          setMockAuthCookie(user)
        } else {
          clearMockAuthCookie()
        }
        set({ user })
      },

      markTutorialDone: () => {
        const { user } = get()
        if (user) {
          const updatedUser = { ...user, tutorialDone: true }
          setMockAuthCookie(updatedUser)
          set({ user: updatedUser })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
      partialize: (state) => ({ user: state.user }),
    }
  )
)
