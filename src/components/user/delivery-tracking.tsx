"use client"

import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TrackingStep } from "@/lib/mock-delivery"

interface DeliveryTrackingProps {
  steps: TrackingStep[]
}

export function DeliveryTracking({ steps }: DeliveryTrackingProps) {
  return (
    <div className="relative pl-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isActive = step.done

        return (
          <div key={step.status} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={cn(
                  "absolute left-[11px] top-6 h-full w-0.5",
                  isActive && steps[index + 1]?.done
                    ? "bg-primary"
                    : isActive
                      ? "bg-gradient-to-b from-primary to-muted"
                      : "bg-muted"
                )}
              />
            )}

            {/* Dot */}
            <div className="relative z-10 shrink-0">
              {isActive ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/30">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted bg-white">
                  <Circle className="h-2.5 w-2.5 text-muted-foreground/40" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5">
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="mt-0.5 text-xs text-muted-foreground">{step.time}</p>
              )}
              {!step.time && !isActive && (
                <p className="mt-0.5 text-xs text-muted-foreground/60">대기 중</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
