"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import type { CapsuleItem, Product } from "@/types";

const gradeConfig: Record<string, { label: string; className: string }> = {
  S: { label: "S", className: "bg-yellow-500 text-white" },
  A: { label: "A", className: "bg-purple-500 text-white" },
  B: { label: "B", className: "bg-blue-500 text-white" },
  C: { label: "C", className: "bg-green-500 text-white" },
  D: { label: "D", className: "bg-gray-400 text-white" },
};

const gradeBarColor: Record<string, string> = {
  S: "bg-yellow-500",
  A: "bg-purple-500",
  B: "bg-blue-500",
  C: "bg-green-500",
  D: "bg-gray-400",
};

export interface ItemWithProduct extends CapsuleItem {
  product: Product;
}

interface ProductProbabilityListProps {
  items: ItemWithProduct[];
}

export function ProductProbabilityList({ items }: ProductProbabilityListProps) {
  const sorted = [...items].sort((a, b) => b.probability - a.probability);

  return (
    <div className="space-y-2">
      {sorted.map((item) => {
        const grade = gradeConfig[item.product.grade] ?? gradeConfig.D;
        const barColor = gradeBarColor[item.product.grade] ?? gradeBarColor.D;

        return (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl bg-muted/50 p-3 ring-1 ring-foreground/5"
          >
            {/* Thumbnail */}
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded text-[10px] font-bold ${grade.className}`}
                >
                  {grade.label}
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {item.product.name}
                </span>
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                시장가 ₩{item.product.marketPrice.toLocaleString()}
              </div>
              {/* Probability Bar */}
              <div className="mt-1.5 flex items-center gap-2">
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${barColor}`}
                    style={{ width: `${item.probability}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-bold text-foreground">
                  {item.probability}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
