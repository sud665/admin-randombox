"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Play, Square, RotateCcw } from "lucide-react";
import { useFeverStore } from "@/stores/fever-store";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import Image from "next/image";

interface FeverGaugeProps {
  initialData: {
    currentAmount: number;
    targetAmount: number;
    percentage: number;
    isActive: boolean;
  };
  rewardProduct: Product | null;
}

export function FeverGauge({ initialData, rewardProduct }: FeverGaugeProps) {
  const {
    currentAmount,
    targetAmount,
    percentage,
    isSimulating,
    startSimulation,
    stopSimulation,
    reset,
    setInitial,
  } = useFeverStore();

  useEffect(() => {
    setInitial({
      currentAmount: initialData.currentAmount,
      targetAmount: initialData.targetAmount,
      percentage: initialData.percentage,
      isActive: initialData.isActive,
      rewardProduct,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clampedPercentage = Math.min(percentage, 100);
  const isHot = clampedPercentage >= 80;
  const isOnFire = clampedPercentage >= 90;

  const getGradient = () => {
    if (clampedPercentage >= 80) {
      return "linear-gradient(90deg, #f97316, #ef4444, #dc2626)";
    }
    if (clampedPercentage >= 50) {
      return "linear-gradient(90deg, #8b5cf6, #f97316)";
    }
    return "linear-gradient(90deg, #3b82f6, #8b5cf6)";
  };

  return (
    <div className="px-4 py-4">
      <div className="rounded-2xl border bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={
                isOnFire
                  ? {
                      rotate: [-5, 5, -5],
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: isOnFire ? Infinity : 0,
                repeatType: "reverse",
              }}
            >
              <Flame
                className={`h-5 w-5 ${
                  isOnFire
                    ? "text-red-500"
                    : isHot
                      ? "text-orange-500"
                      : "text-violet-500"
                }`}
              />
            </motion.div>
            <span className="text-sm font-bold text-foreground">
              피버 게이지
            </span>
            {isOnFire && (
              <motion.span
                className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                FEVER SOON!
              </motion.span>
            )}
          </div>
          <span
            className={`text-sm font-bold ${
              isOnFire
                ? "text-red-500"
                : isHot
                  ? "text-orange-500"
                  : "text-violet-600"
            }`}
          >
            {clampedPercentage.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isHot ? "animate-pulse" : ""
            }`}
            style={{ background: getGradient() }}
            initial={{ width: 0 }}
            animate={{ width: `${clampedPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          {isOnFire && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white/20"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Amount Info */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ₩{currentAmount.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            목표 ₩{targetAmount.toLocaleString()}
          </span>
        </div>

        {/* Reward Product Preview */}
        {rewardProduct && (
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-2.5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
              {rewardProduct.imageUrl ? (
                <Image
                  src={rewardProduct.imageUrl}
                  alt={rewardProduct.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  🎁
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-orange-600/80">피버 보상 상품</p>
              <p className="truncate text-xs font-semibold text-foreground">
                {rewardProduct.name}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              {rewardProduct.grade}급
            </span>
          </div>
        )}

        {/* Simulation Controls (Demo) */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {!isSimulating ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 rounded-full px-3 text-[10px]"
              onClick={startSimulation}
              disabled={clampedPercentage >= 100}
            >
              <Play className="h-3 w-3" />
              시뮬레이션 시작
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 rounded-full border-red-200 px-3 text-[10px] text-red-500"
              onClick={stopSimulation}
            >
              <Square className="h-3 w-3" />
              중지
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 rounded-full px-3 text-[10px] text-muted-foreground"
            onClick={reset}
          >
            <RotateCcw className="h-3 w-3" />
            리셋
          </Button>
        </div>
      </div>
    </div>
  );
}
