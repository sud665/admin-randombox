"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Gift, Mail, Lock, MessageCircle } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, user } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // 이미 로그인 상태면 메인으로
  if (user) {
    router.replace("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.")
      return
    }

    try {
      await login(email, password)
      // 튜토리얼 미완료 시 튜토리얼로, 아니면 메인으로
      const authUser = useAuthStore.getState().user
      if (authUser && !authUser.tutorialDone) {
        router.push("/tutorial")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.")
    }
  }

  const handleSocialLogin = async () => {
    // 소셜 로그인은 데모용으로 기본 계정으로 바로 로그인
    try {
      await login("test@example.com", "1234")
      const authUser = useAuthStore.getState().user
      if (authUser && !authUser.tutorialDone) {
        router.push("/tutorial")
      } else {
        router.push("/")
      }
    } catch {
      setError("로그인에 실패했습니다.")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem-4rem)] flex-col items-center justify-center px-6 py-8">
      {/* 로고 & 타이틀 */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/30">
          <Gift className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <Logo size="lg" />
          <p className="mt-1 text-sm text-muted-foreground">
            두근두근 랜덤 캡슐을 열어보세요
          </p>
        </div>
      </div>

      {/* 로그인 폼 */}
      <Card className="w-full border-0 shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="h-11 w-full text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              또는
            </span>
          </div>

          {/* 소셜 로그인 */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-2 font-medium"
              onClick={handleSocialLogin}
              disabled={isLoading}
            >
              <MessageCircle className="h-4 w-4" />
              카카오
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 gap-2 font-medium"
              onClick={handleSocialLogin}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              구글
            </Button>
          </div>

          {/* 회원가입 링크 */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:underline"
            >
              회원가입
            </Link>
          </p>

          {/* 테스트 계정 안내 */}
          <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">
              테스트 계정: <span className="font-medium">test@example.com</span>{" "}
              / <span className="font-medium">1234</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
