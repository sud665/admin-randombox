"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Package, Truck } from "lucide-react"
import type { Product, Grade } from "@/types"

interface ResultCardProps {
  product: Product
}

const gradeConfig: Record<Grade, { label: string; color: string; bg: string; border: string; glow: string }> = {
  S: {
    label: "S",
    color: "text-amber-300",
    bg: "bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500",
    border: "border-amber-400/60",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.5)]",
  },
  A: {
    label: "A",
    color: "text-purple-300",
    bg: "bg-gradient-to-br from-purple-500 via-violet-400 to-purple-600",
    border: "border-purple-400/60",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
  },
  B: {
    label: "B",
    color: "text-blue-300",
    bg: "bg-gradient-to-br from-blue-500 via-sky-400 to-blue-600",
    border: "border-blue-400/60",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  },
  C: {
    label: "C",
    color: "text-emerald-300",
    bg: "bg-gradient-to-br from-emerald-500 via-green-400 to-emerald-600",
    border: "border-emerald-400/60",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
  D: {
    label: "D",
    color: "text-gray-300",
    bg: "bg-gradient-to-br from-gray-400 via-slate-300 to-gray-500",
    border: "border-gray-400/60",
    glow: "shadow-[0_0_10px_rgba(148,163,184,0.3)]",
  },
}

export function ResultCard({ product }: ResultCardProps) {
  const router = useRouter()
  const grade = gradeConfig[product.grade]
  const isHighGrade = product.grade === "S" || product.grade === "A"

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
      className="relative w-full max-w-[300px]"
    >
      {/* Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 bg-white/10 backdrop-blur-md ${grade.border} ${grade.glow}`}
      >
        {/* Shimmer effect for high grades */}
        {isHighGrade && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            <div className="absolute -inset-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        )}

        {/* Grade Badge */}
        <div className="absolute right-3 top-3 z-20">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${grade.bg} text-lg font-black text-white shadow-lg`}
          >
            {grade.label}
          </div>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="300px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-16 w-16 text-white/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-lg font-extrabold text-white">{product.name}</h3>
          <p className="mt-1 text-sm text-white/60">
            시장가:{" "}
            <span className={`font-bold ${grade.color}`}>
              ₩{product.marketPrice.toLocaleString()}
            </span>
          </p>

          {/* Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => router.push("/mypage")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/20 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              <Package className="h-4 w-4" />
              보관함에 저장
            </button>
            <button
              onClick={() => router.push("/mypage")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold text-white transition-colors ${grade.bg} hover:opacity-90`}
            >
              <Truck className="h-4 w-4" />
              바로 배송
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
