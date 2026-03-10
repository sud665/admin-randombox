"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Gift, Mail, Lock, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading, user } = useAuthStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")

  // 이미 로그인 상태면 메인으로
  if (user) {
    router.replace("/")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword || !nickname) {
      setError("모든 항목을 입력해주세요.")
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (password.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다.")
      return
    }

    if (nickname.length < 2) {
      setError("닉네임은 2자 이상이어야 합니다.")
      return
    }

    try {
      await signup(email, password, nickname)
      router.push("/tutorial")
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
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
          <h1 className="text-2xl font-bold tracking-tight">회원가입</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            랜덤박스와 함께 시작해보세요
          </p>
        </div>
      </div>

      {/* 회원가입 폼 */}
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
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="nickname"
                  type="text"
                  placeholder="2자 이상 입력"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="pl-10"
                  autoComplete="username"
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
                  placeholder="4자 이상 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  autoComplete="new-password"
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
              {isLoading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          {/* 로그인 링크 */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
