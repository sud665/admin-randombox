"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Star, Award, MessageSquare, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth-store"
import reviewsData from "@/mocks/reviews.json"
import productsData from "@/mocks/products.json"
import type { Product } from "@/types"

export default function ReviewsPage() {
  const router = useRouter()
  const { user } = useAuthStore()

  const myReviews = useMemo(() => {
    if (!user) return []
    return reviewsData
      .filter((review) => review.userId === user.id)
      .map((review) => {
        const product = productsData.find((p) => p.id === review.productId) as Product | undefined
        return { ...review, product }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [user])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`
  }

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
          <h2 className="text-base font-bold">내 리뷰</h2>
          {myReviews.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {myReviews.length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {myReviews.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-muted-foreground">
              작성한 리뷰가 없습니다
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myReviews.map((review) => (
              <Card key={review.id} className="overflow-hidden">
                <div className="p-4">
                  {/* Product info row */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {review.product?.imageUrl ? (
                        <Image
                          src={review.product.imageUrl}
                          alt={review.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-bold">
                          {review.product?.name ?? "알 수 없는 상품"}
                        </h3>
                        {review.isHallOfFame && (
                          <Badge className="shrink-0 gap-1 border-0 bg-gradient-to-r from-amber-400 to-yellow-300 text-[10px] text-white">
                            <Award className="h-3 w-3" />
                            명예의 전당
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review content */}
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {review.content}
                  </p>

                  {/* Review image */}
                  {review.imageUrl && (
                    <div className="mt-3 relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={review.imageUrl}
                        alt="리뷰 이미지"
                        fill
                        className="object-cover"
                        sizes="(max-width: 480px) 100vw"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
