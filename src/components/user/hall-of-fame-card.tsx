"use client";

import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import Image from "next/image";
import type { Review, Product, User as UserType } from "@/types";

interface HallOfFameCardProps {
  review: Review;
  product: Product | null;
  user: UserType | null;
  index: number;
}

export function HallOfFameCard({
  review,
  product,
  user,
  index,
}: HallOfFameCardProps) {
  const gradeStyle = (grade: string) => {
    switch (grade) {
      case "S":
        return "bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 shadow-[0_0_12px_rgba(251,191,36,0.5)]";
      case "A":
        return "bg-gradient-to-r from-violet-500 to-purple-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white";
    }
  };

  return (
    <motion.div
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {review.imageUrl || product?.imageUrl ? (
          <Image
            src={review.imageUrl || product?.imageUrl || ""}
            alt={product?.name || "상품"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">
            📦
          </div>
        )}

        {/* Grade Badge */}
        {product && (
          <div
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black ${gradeStyle(product.grade)}`}
          >
            {product.grade}급
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Product Name */}
        {product && (
          <h3 className="text-sm font-bold text-foreground">{product.name}</h3>
        )}

        {/* Star Rating */}
        <div className="mt-1 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < review.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Review Content */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {review.content}
        </p>

        {/* User & Date */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
              <User className="h-3 w-3 text-slate-400" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {user?.nickname || "익명"}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
