"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Package, Truck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DeliveryTracking } from "@/components/user/delivery-tracking"
import { useAuthStore } from "@/stores/auth-store"
import { getMockTrackingInfo, generateTrackingNo } from "@/lib/mock-delivery"
import ordersData from "@/mocks/orders.json"
import productsData from "@/mocks/products.json"
import type { Product } from "@/types"

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  SHIPPING: { label: "배송중", variant: "default" },
  DELIVERED: { label: "배송완료", variant: "secondary" },
}

export default function DeliveryPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const deliveryOrders = useMemo(() => {
    if (!user) return []
    return ordersData
      .filter(
        (order) =>
          order.userId === user.id &&
          (order.status === "SHIPPING" || order.status === "DELIVERED")
      )
      .map((order) => {
        const product = productsData.find((p) => p.id === order.productId) as Product | undefined
        const trackingNo = generateTrackingNo(order.id)
        const tracking = getMockTrackingInfo(trackingNo, order.status)
        return { ...order, product, tracking, trackingNo }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [user])

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="sticky top-14 z-30 border-b bg-white/90 backdrop-blur-sm">
        <div className="flex h-12 items-center gap-3 px-4">
          <button
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base font-bold">주문·배송</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {deliveryOrders.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Truck className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-muted-foreground">
              배송 내역이 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveryOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                {/* Product info */}
                <div className="flex items-center gap-3 border-b p-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {order.product?.imageUrl ? (
                      <Image
                        src={order.product.imageUrl}
                        alt={order.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-bold">
                        {order.product?.name ?? "알 수 없는 상품"}
                      </h3>
                      <Badge variant={statusBadge[order.status]?.variant ?? "outline"} className="shrink-0 text-[10px]">
                        {statusBadge[order.status]?.label ?? order.status}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{order.tracking.carrier}</span>
                      <span className="font-mono">{order.trackingNo}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking timeline */}
                <div className="p-4">
                  <DeliveryTracking steps={order.tracking.steps} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
