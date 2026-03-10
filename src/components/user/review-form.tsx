"use client"

import { useState, useCallback } from "react"
import { Star, ImagePlus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  orderId: string
  onSuccess?: () => void
}

export function ReviewForm({ open, onOpenChange, productName, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [content, setContent] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = useCallback(() => {
    // Mock: simulate image upload with a placeholder
    setPreviewImage("/images/reviews/mock-upload.webp")
    toast.info("이미지가 추가되었습니다 (미리보기)")
  }, [])

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("별점을 선택해 주세요.")
      return
    }
    if (!content.trim()) {
      toast.error("리뷰 내용을 입력해 주세요.")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
    setRating(0)
    setContent("")
    setPreviewImage(null)
    onOpenChange(false)
    toast.success("리뷰가 등록되었습니다!", {
      description: "소중한 후기 감사합니다.",
    })
    onSuccess?.()
  }

  const displayRating = hoveredRating || rating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">리뷰 작성</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">{productName}</p>
        </DialogHeader>

        <div className="space-y-5">
          {/* Star rating */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">별점을 선택해 주세요</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-muted-foreground">
                {rating === 5 ? "최고예요!" : rating === 4 ? "좋아요!" : rating === 3 ? "괜찮아요" : rating === 2 ? "아쉬워요" : "별로예요"}
              </p>
            )}
          </div>

          {/* Text input */}
          <Textarea
            placeholder="상품에 대한 솔직한 리뷰를 남겨주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          {/* Image upload area */}
          <div>
            {previewImage ? (
              <div className="relative inline-block">
                <div className="h-20 w-20 rounded-lg bg-muted" />
                <button
                  type="button"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow-sm"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground/50 transition-colors hover:border-primary/40 hover:text-primary/60"
                onClick={handleImageUpload}
              >
                <div className="flex flex-col items-center gap-1">
                  <ImagePlus className="h-5 w-5" />
                  <span className="text-[10px]">사진 추가</span>
                </div>
              </button>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !content.trim()}
          >
            {isSubmitting ? "등록 중..." : "리뷰 등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
