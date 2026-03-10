"use client"

import { useState } from "react"
import { Truck, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Product } from "@/types"

interface DeliveryRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  orderId: string
  onSuccess?: () => void
}

export function DeliveryRequestModal({ open, onOpenChange, product, orderId, onSuccess }: DeliveryRequestModalProps) {
  const [address, setAddress] = useState("")
  const [addressDetail, setAddressDetail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const shippingFee = 3000

  const handleSubmit = async () => {
    if (!address.trim()) {
      toast.error("주소를 입력해 주세요.")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsProcessing(false)
    setAddress("")
    setAddressDetail("")
    onOpenChange(false)
    toast.success("배송이 신청되었습니다!", {
      description: `${product.name} 상품이 곧 배송됩니다.`,
    })
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">배송 신청</DialogTitle>
          <DialogDescription className="text-center">
            {product.name} 상품의 배송지를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5" />
              주소
            </Label>
            <Input
              id="address"
              placeholder="예) 서울시 강남구 테헤란로 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-detail" className="text-sm">
              상세주소
            </Label>
            <Input
              id="address-detail"
              placeholder="예) 101동 1201호"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
            />
          </div>

          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">상품</span>
              <span className="text-sm font-medium">{product.name}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium">배송비</span>
              <span className="text-base font-bold text-primary">
                ₩{shippingFee.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isProcessing || !address.trim()}
          >
            {isProcessing ? "처리 중..." : `배송비 ${shippingFee.toLocaleString()}원 결제 후 신청`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
