"use client"

import Image from "next/image"
import { Package, Truck, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product, Grade } from "@/types"

interface InventoryCardProps {
  product: Product
  orderId: string
  onDeliveryRequest: () => void
  onDecompose: () => void
}

const gradeBadgeStyle: Record<Grade, string> = {
  S: "bg-gradient-to-r from-amber-400 to-yellow-300 text-white border-0",
  A: "bg-gradient-to-r from-purple-500 to-violet-400 text-white border-0",
  B: "bg-gradient-to-r from-blue-500 to-sky-400 text-white border-0",
  C: "bg-gradient-to-r from-emerald-500 to-green-400 text-white border-0",
  D: "bg-gradient-to-r from-gray-400 to-slate-300 text-white border-0",
}

const gradeGradient: Record<Grade, string> = {
  S: "from-amber-100 to-yellow-50",
  A: "from-purple-100 to-violet-50",
  B: "from-blue-100 to-sky-50",
  C: "from-emerald-100 to-green-50",
  D: "from-gray-100 to-slate-50",
}

export function InventoryCard({ product, onDeliveryRequest, onDecompose }: InventoryCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className={`relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${gradeGradient[product.grade]}`}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold">{product.name}</h3>
              <Badge className={`shrink-0 text-[10px] font-bold ${gradeBadgeStyle[product.grade]}`}>
                {product.grade}등급
              </Badge>
            </div>
            <p className="mt-1 text-sm font-semibold text-primary">
              ₩{product.marketPrice.toLocaleString()}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="h-8 flex-1 text-xs"
              onClick={onDeliveryRequest}
            >
              <Truck className="mr-1 h-3.5 w-3.5" />
              배송 신청
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 flex-1 text-xs"
              onClick={onDecompose}
            >
              <Wrench className="mr-1 h-3.5 w-3.5" />
              분해
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
