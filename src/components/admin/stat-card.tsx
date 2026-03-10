"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; label?: string };
  className?: string;
}

export function StatCard({ icon: Icon, label, value, change, className }: StatCardProps) {
  const formatted = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardContent className="flex items-center gap-4 py-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xl font-bold tracking-tight">{formatted}</span>
          {change && (
            <span
              className={cn(
                "text-xs font-medium",
                change.value >= 0 ? "text-emerald-600" : "text-red-500"
              )}
            >
              {change.value >= 0 ? "▲" : "▼"} {Math.abs(change.value)}%
              {change.label && ` ${change.label}`}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
