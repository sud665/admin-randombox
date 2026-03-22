"use client";

import { useAuthStore } from "@/stores/auth-store";
import { LandingPage } from "@/components/user/landing-page";
import type { Capsule } from "@/types";

interface HomePageClientProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
  children: React.ReactNode;
}

export function HomePageClient({
  capsules,
  feverPercentage,
  feverTarget,
  feverCurrent,
  reviews,
  children,
}: HomePageClientProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <LandingPage
        capsules={capsules}
        feverPercentage={feverPercentage}
        feverTarget={feverTarget}
        feverCurrent={feverCurrent}
        reviews={reviews}
      />
    );
  }

  return <>{children}</>;
}
