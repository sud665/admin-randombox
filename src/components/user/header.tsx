"use client";

export function UserHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-xl font-bold text-primary">랜덤박스</h1>

        {/* 피버 게이지 바 영역 (Task 8에서 연결) */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-28 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all"
              style={{ width: "0%" }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            피버 0%
          </span>
        </div>
      </div>
    </header>
  );
}
