"use client";

import {
  CapsuleIllustration,
  getCapsuleVariant,
} from "@/components/user/capsule-illustration";

interface CapsuleDetailHeroProps {
  capsuleId: string;
  capsuleName: string;
}

export function CapsuleDetailHero({
  capsuleId,
  capsuleName,
}: CapsuleDetailHeroProps) {
  const variant = getCapsuleVariant(capsuleId);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <CapsuleIllustration variant={variant} />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
