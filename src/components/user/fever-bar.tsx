"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface FeverBarProps {
  percentage: number;
  currentAmount: number;
  targetAmount: number;
}

export function FeverBar({ percentage, currentAmount, targetAmount }: FeverBarProps) {
  const isHot = percentage >= 80;
  const clampedPercentage = Math.min(percentage, 100);

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Flame
            className={`h-4 w-4 ${
              isHot ? "text-red-500" : "text-orange-400"
            }`}
          />
          <span className="text-xs font-semibold text-foreground">
            피버 게이지
          </span>
        </div>
        <span
          className={`text-xs font-bold ${
            isHot ? "text-red-500" : "text-muted-foreground"
          }`}
        >
          {clampedPercentage.toFixed(1)}%
        </span>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            isHot ? "animate-pulse" : ""
          }`}
          style={{
            background: isHot
              ? "linear-gradient(90deg, #f97316, #ef4444, #dc2626)"
              : "linear-gradient(90deg, #8b5cf6, #3b82f6, #6366f1)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {currentAmount.toLocaleString()}원
        </span>
        <span className="text-[10px] text-muted-foreground">
          {targetAmount.toLocaleString()}원
        </span>
      </div>
    </div>
  );
}
