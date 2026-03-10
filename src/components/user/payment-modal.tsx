"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CreditCard, Wallet, Smartphone, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { mockPayment } from "@/lib/mock-payment"
import type { Capsule } from "@/types"

interface PaymentModalProps {
  capsule: Capsule
  open: boolean
  onOpenChange: (open: boolean) => void
}

const paymentMethods = [
  { id: "card", label: "카드결제", icon: CreditCard },
  { id: "kakao", label: "카카오페이", icon: Wallet },
  { id: "toss", label: "토스페이", icon: Smartphone },
] as const

const USER_POINTS = 5000 // mock 보유 포인트

export function PaymentModal({ capsule, open, onOpenChange }: PaymentModalProps) {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string>("card")
  const [usePoints, setUsePoints] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pointInput, setPointInput] = useState("")

  const finalAmount = Math.max(0, capsule.price - usePoints)

  function handlePointChange(value: string) {
    const num = parseInt(value) || 0
    const clamped = Math.min(num, USER_POINTS, capsule.price)
    setPointInput(value)
    setUsePoints(clamped)
  }

  function handleUseAllPoints() {
    const max = Math.min(USER_POINTS, capsule.price)
    setPointInput(String(max))
    setUsePoints(max)
  }

  async function handlePayment() {
    setIsProcessing(true)
    try {
      await mockPayment(finalAmount)
      onOpenChange(false)
      router.push(`/open/${capsule.id}`)
    } catch {
      alert("결제에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
          <DialogDescription>캡슐 구매를 위해 결제를 진행합니다.</DialogDescription>
        </DialogHeader>

        {/* 캡슐 정보 */}
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            {capsule.imageUrl ? (
              <Image
                src={capsule.imageUrl}
                alt={capsule.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{capsule.name}</p>
            <p className="text-lg font-extrabold text-primary">
              ₩{capsule.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 결제 수단 */}
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">결제 수단</p>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedMethod === method.id
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-xs font-medium transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {method.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 포인트 사용 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-foreground">포인트 사용</p>
            <span className="text-xs text-muted-foreground">
              보유: {USER_POINTS.toLocaleString()}P
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={pointInput}
              onChange={(e) => handlePointChange(e.target.value)}
              placeholder="0"
              min={0}
              max={Math.min(USER_POINTS, capsule.price)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={handleUseAllPoints}
              className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              전액사용
            </button>
          </div>
        </div>

        {/* 최종 금액 */}
        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
          <span className="text-sm font-semibold">최종 결제 금액</span>
          <span className="text-xl font-extrabold text-primary">
            ₩{finalAmount.toLocaleString()}
          </span>
        </div>

        {/* 결제 버튼 */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-12 text-base font-bold rounded-xl"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              결제 처리 중...
            </>
          ) : (
            `₩${finalAmount.toLocaleString()} 결제하기`
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
