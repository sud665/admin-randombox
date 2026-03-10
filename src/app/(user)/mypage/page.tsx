"use client"

import { useRouter } from "next/navigation"
import { Package, Truck, PenSquare, Settings, LogOut, Coins, ChevronRight, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/auth-store"

const menuItems = [
  {
    icon: Package,
    label: "보관함",
    href: "/mypage/inventory",
    emoji: "📦",
    disabled: false,
  },
  {
    icon: Truck,
    label: "주문·배송",
    href: "/mypage/delivery",
    emoji: "🚚",
    disabled: false,
  },
  {
    icon: PenSquare,
    label: "내 리뷰",
    href: "/mypage/reviews",
    emoji: "✍️",
    disabled: false,
  },
  {
    icon: Settings,
    label: "회원정보 수정",
    href: "#",
    emoji: "⚙️",
    disabled: true,
  },
] as const

export default function MyPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <User className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">로그인이 필요합니다</p>
        <Button onClick={() => router.push("/login")}>로그인</Button>
      </div>
    )
  }

  return (
    <div className="space-y-5 px-4 py-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-violet-200 text-lg font-bold text-primary">
            {user.nickname.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{user.nickname}</h2>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Point Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-violet-600 to-purple-700 p-5 shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70">보유 포인트</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {user.point.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-white/80">P</span>
            </div>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Coins className="h-8 w-8 text-amber-300" />
          </div>
        </div>
      </Card>

      {/* Menu List */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Card
            key={item.label}
            className={`cursor-pointer border transition-all hover:shadow-sm ${
              item.disabled ? "cursor-default opacity-60" : "active:scale-[0.98]"
            }`}
            onClick={() => {
              if (!item.disabled) router.push(item.href)
            }}
          >
            <div className="flex items-center gap-3 p-4">
              <span className="text-xl">{item.emoji}</span>
              <span className="flex-1 text-sm font-semibold">{item.label}</span>
              {item.disabled ? (
                <Badge variant="secondary" className="text-[10px]">
                  준비중
                </Badge>
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Logout */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </div>
  )
}
