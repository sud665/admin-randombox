"use client";

import { useAuthStore } from "@/stores/auth-store";
import { UserHeader } from "@/components/user/header";
import { BottomNav } from "@/components/user/bottom-nav";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  // 루트 경로에서 비로그인 시 랜딩 모드 (풀스크린, Header/BottomNav 숨김)
  const isLandingMode = pathname === "/" && !user;

  if (isLandingMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-xl">
        <UserHeader />
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
