"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, PackageOpen, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InventoryCard } from "@/components/user/inventory-card"
import { DecomposeModal } from "@/components/user/decompose-modal"
import { DeliveryRequestModal } from "@/components/user/delivery-request-modal"
import { useAuthStore } from "@/stores/auth-store"
import ordersData from "@/mocks/orders.json"
import productsData from "@/mocks/products.json"
import type { Product } from "@/types"

interface SelectedItem {
  product: Product
  orderId: string
}

export default function InventoryPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [decomposeItem, setDecomposeItem] = useState<SelectedItem | null>(null)
  const [deliveryItem, setDeliveryItem] = useState<SelectedItem | null>(null)
  const [decomposedOrders, setDecomposedOrders] = useState<Set<string>>(new Set())
  const [shippedOrders, setShippedOrders] = useState<Set<string>>(new Set())

  const storedItems = useMemo(() => {
    if (!user) return []
    return ordersData
      .filter(
        (order) =>
          order.userId === user.id &&
          order.status === "STORED" &&
          !decomposedOrders.has(order.id) &&
          !shippedOrders.has(order.id)
      )
      .map((order) => {
        const product = productsData.find((p) => p.id === order.productId)
        return product ? { orderId: order.id, product: product as Product } : null
      })
      .filter(Boolean) as { orderId: string; product: Product }[]
  }, [user, decomposedOrders, shippedOrders])

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
          <h2 className="text-base font-bold">보관함</h2>
          {storedItems.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {storedItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {storedItems.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <PackageOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-muted-foreground">
                보관 중인 상품이 없습니다
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                캡슐을 구매하고 상품을 획득해 보세요!
              </p>
            </div>
            <Button
              variant="default"
              className="gap-2"
              onClick={() => router.push("/")}
            >
              <ShoppingBag className="h-4 w-4" />
              캡슐 구매하러 가기
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {storedItems.map((item) => (
              <InventoryCard
                key={item.orderId}
                product={item.product}
                orderId={item.orderId}
                onDeliveryRequest={() =>
                  setDeliveryItem({ product: item.product, orderId: item.orderId })
                }
                onDecompose={() =>
                  setDecomposeItem({ product: item.product, orderId: item.orderId })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {decomposeItem && (
        <DecomposeModal
          open={!!decomposeItem}
          onOpenChange={(open) => {
            if (!open) setDecomposeItem(null)
          }}
          product={decomposeItem.product}
          orderId={decomposeItem.orderId}
          onSuccess={() => {
            setDecomposedOrders((prev) => new Set(prev).add(decomposeItem.orderId))
            setDecomposeItem(null)
          }}
        />
      )}

      {deliveryItem && (
        <DeliveryRequestModal
          open={!!deliveryItem}
          onOpenChange={(open) => {
            if (!open) setDeliveryItem(null)
          }}
          product={deliveryItem.product}
          orderId={deliveryItem.orderId}
          onSuccess={() => {
            setShippedOrders((prev) => new Set(prev).add(deliveryItem.orderId))
            setDeliveryItem(null)
          }}
        />
      )}
    </div>
  )
}
