"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Capsule } from "@/types";
import {
  CapsuleIllustration,
  getCapsuleVariant,
} from "@/components/user/capsule-illustration";

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "판매중",
    className: "bg-emerald-500 text-white",
  },
  SOLD_OUT: {
    label: "품절",
    className: "bg-red-500 text-white",
  },
  INACTIVE: {
    label: "비활성",
    className: "bg-gray-400 text-white",
  },
};

interface CapsuleCardProps {
  capsule: Capsule;
}

export function CapsuleCard({ capsule }: CapsuleCardProps) {
  const totalStock =
    capsule.items?.reduce((sum, item) => sum + item.stock, 0) ?? 0;
  const isSoldOut = capsule.status === "SOLD_OUT";
  const status = statusMap[capsule.status] ?? statusMap.INACTIVE;
  const variant = getCapsuleVariant(capsule.id);

  return (
    <Link href={`/capsule/${capsule.id}`}>
      <motion.div
        className={`group relative overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/5 ${
          isSoldOut ? "opacity-60" : ""
        }`}
        whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Capsule Illustration */}
        <div className="relative aspect-square w-full overflow-hidden">
          <CapsuleIllustration variant={variant} />

          {/* Status Badge */}
          <div className="absolute right-2 top-2 z-20">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3">
          <h3 className="truncate text-sm font-bold text-foreground">
            {capsule.name}
          </h3>
          <p className="mt-1 text-base font-extrabold text-primary">
            ₩{capsule.price.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            남은 수량 {totalStock.toLocaleString()}개
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
