"use client";

import { FeverGauge } from "@/components/user/fever-gauge";
import { FeverWinnerModal } from "@/components/user/fever-winner-modal";
import type { Product } from "@/types";

interface FeverGaugeSectionProps {
  initialData: {
    currentAmount: number;
    targetAmount: number;
    percentage: number;
    isActive: boolean;
  };
  rewardProduct: Product | null;
}

export function FeverGaugeSection({
  initialData,
  rewardProduct,
}: FeverGaugeSectionProps) {
  return (
    <>
      <FeverGauge initialData={initialData} rewardProduct={rewardProduct} />
      <FeverWinnerModal />
    </>
  );
}
