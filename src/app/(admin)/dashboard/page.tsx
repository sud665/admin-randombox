import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
        <LayoutDashboard className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold">관리자 대시보드</h2>
      <p className="text-center text-sm text-muted-foreground">
        이 페이지는 곧 통계 카드와 차트로 교체됩니다.
      </p>
    </div>
  );
}
