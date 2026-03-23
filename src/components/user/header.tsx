"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { useFeverStore } from "@/stores/fever-store";
import { Logo } from "@/components/ui/logo";

export function UserHeader() {
  const { percentage } = useFeverStore();
  const clampedPercentage = Math.min(percentage, 100);
  const isHot = clampedPercentage >= 80;

  const getGradient = () => {
    if (clampedPercentage >= 80) return "from-orange-500 to-red-500";
    if (clampedPercentage >= 50) return "from-violet-500 to-orange-500";
    return "from-primary to-violet-400";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Logo size="md" />

        <div className="flex items-center gap-2">
          <Flame
            className={`h-3.5 w-3.5 ${isHot ? "text-red-500" : "text-violet-400"}`}
          />
          <div className="h-3 w-28 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${getGradient()} ${isHot ? "animate-pulse" : ""}`}
              initial={{ width: 0 }}
              animate={{ width: `${clampedPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <span
            className={`text-xs font-medium ${isHot ? "text-red-500" : "text-muted-foreground"}`}
          >
            피버 {clampedPercentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </header>
  );
}
