"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PaymentModal } from "@/components/user/payment-modal"
import type { Capsule } from "@/types"

interface CapsuleDetailClientProps {
  children: React.ReactNode
  capsule: Capsule
  isSoldOut: boolean
}

export function CapsuleDetailClient({ children, capsule, isSoldOut }: CapsuleDetailClientProps) {
  const router = useRouter()
  const [paymentOpen, setPaymentOpen] = useState(false)

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </button>

      {children}

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-[480px] border-t bg-white/95 px-4 py-3 backdrop-blur-sm">
          <button
            disabled={isSoldOut}
            onClick={() => !isSoldOut && setPaymentOpen(true)}
            className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all ${
              isSoldOut
                ? "cursor-not-allowed bg-gray-300"
                : "bg-primary hover:bg-primary/90 active:scale-[0.98]"
            }`}
          >
            {isSoldOut
              ? "품절"
              : `₩${capsule.price.toLocaleString()} 구매하기`}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        capsule={capsule}
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
      />
    </div>
  )
}
