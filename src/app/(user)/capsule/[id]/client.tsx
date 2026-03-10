"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CapsuleDetailClientProps {
  children: React.ReactNode;
}

export function CapsuleDetailClient({ children }: CapsuleDetailClientProps) {
  const router = useRouter();

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute left-3 top-3 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </button>

      {children}
    </div>
  );
}
