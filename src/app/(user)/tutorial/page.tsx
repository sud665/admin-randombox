"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, CreditCard, Package, Truck, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { cn } from "@/lib/utils"

const slides = [
  {
    icon: Gift,
    title: "랜덤박스에 오신 걸\n환영합니다",
    description:
      "다양한 캡슐 속 숨겨진 상품을 만나보세요.\n두근두근 설레는 언박싱 경험이 기다립니다!",
    gradient: "from-violet-500 to-purple-600",
    bgAccent: "bg-violet-50",
  },
  {
    icon: CreditCard,
    title: "캡슐을 구매하세요",
    description:
      "원하는 캡슐을 골라 구매하면\n어떤 상품이 들어있는지는 열어봐야 알 수 있어요!",
    gradient: "from-blue-500 to-cyan-500",
    bgAccent: "bg-blue-50",
  },
  {
    icon: Package,
    title: "캡슐을 열어보세요",
    description:
      "두근거리는 순간! 캡슐을 열면\nS~D등급의 다양한 상품이 나옵니다.",
    gradient: "from-amber-500 to-orange-500",
    bgAccent: "bg-amber-50",
  },
  {
    icon: Truck,
    title: "상품을 배송받거나\n분해하세요",
    description:
      "마음에 드는 상품은 배송 신청!\n아니라면 분해하여 포인트로 전환하세요.",
    gradient: "from-emerald-500 to-teal-500",
    bgAccent: "bg-emerald-50",
  },
]

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export default function TutorialPage() {
  const router = useRouter()
  const markTutorialDone = useAuthStore((s) => s.markTutorialDone)
  const [[currentSlide, direction], setSlide] = useState([0, 0])

  const paginate = useCallback(
    (newDirection: number) => {
      const nextSlide = currentSlide + newDirection
      if (nextSlide >= 0 && nextSlide < slides.length) {
        setSlide([nextSlide, newDirection])
      }
    },
    [currentSlide]
  )

  const handleComplete = useCallback(() => {
    markTutorialDone()
    router.push("/")
  }, [markTutorialDone, router])

  const handleSkip = useCallback(() => {
    markTutorialDone()
    router.push("/")
  }, [markTutorialDone, router])

  const isLast = currentSlide === slides.length - 1
  const slide = slides[currentSlide]

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem-4rem)] flex-col overflow-hidden">
      {/* 건너뛰기 */}
      <div className="absolute right-4 top-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          건너뛰기
        </Button>
      </div>

      {/* 슬라이드 내용 */}
      <div className="relative flex flex-1 items-center justify-center px-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="flex w-full flex-col items-center text-center"
          >
            {/* 아이콘 */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className={cn(
                "mb-8 flex h-28 w-28 items-center justify-center rounded-3xl shadow-xl",
                slide.bgAccent
              )}
            >
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg",
                  slide.gradient
                )}
              >
                <slide.icon className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* 텍스트 */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="whitespace-pre-line text-2xl font-bold leading-tight tracking-tight"
            >
              {slide.title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground"
            >
              {slide.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 하단 컨트롤 */}
      <div className="px-8 pb-8">
        {/* 도트 인디케이터 */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                width: index === currentSlide ? 24 : 8,
                backgroundColor:
                  index === currentSlide
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted))",
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* 버튼 */}
        <Button
          onClick={isLast ? handleComplete : () => paginate(1)}
          className="h-12 w-full gap-2 text-base font-semibold"
        >
          {isLast ? "시작하기" : "다음"}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
