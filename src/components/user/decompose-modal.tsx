"use client"

import { useState } from "react"
import { Wrench, Coins, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import type { Product, Grade } from "@/types"

interface DecomposeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  orderId: string
  onSuccess?: () => void
}

const decomposePoints: Record<Grade, number> = {
  S: 5000,
  A: 3000,
  B: 1500,
  C: 700,
  D: 300,
}

const gradeLabel: Record<Grade, string> = {
  S: "S등급",
  A: "A등급",
  B: "B등급",
  C: "C등급",
  D: "D등급",
}

export function DecomposeModal({ open, onOpenChange, product, orderId, onSuccess }: DecomposeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, setUser } = useAuthStore()
  const points = decomposePoints[product.grade]

  const handleDecompose = async () => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update user points
    if (user) {
      setUser({ ...user, point: user.point + points })
    }

    setIsProcessing(false)
    onOpenChange(false)
    toast.success(`${points.toLocaleString()}P가 적립되었습니다!`, {
      description: `${product.name}을(를) 분해했습니다.`,
    })
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Wrench className="h-6 w-6 text-orange-600" />
          </div>
          <DialogTitle className="text-center">정말 분해하시겠습니까?</DialogTitle>
          <DialogDescription className="text-center">
            분해하면 상품이 사라지고 포인트로 전환됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">상품</p>
              <p className="font-semibold">{product.name}</p>
            </div>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
              {gradeLabel[product.grade]}
            </span>
          </div>

          <div className="mt-3 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">시장가</span>
              <span className="text-sm line-through">₩{product.marketPrice.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm font-medium">
                <Coins className="h-4 w-4 text-amber-500" />
                전환 포인트
              </span>
              <span className="text-lg font-bold text-primary">
                {points.toLocaleString()}P
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">
            분해 후에는 복구할 수 없습니다. 신중하게 결정해 주세요.
          </p>
        </div>

        <DialogFooter className="flex-row gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            취소
          </Button>
          <Button
            className="flex-1 bg-orange-500 hover:bg-orange-600"
            onClick={handleDecompose}
            disabled={isProcessing}
          >
            {isProcessing ? "분해 중..." : "분해하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
