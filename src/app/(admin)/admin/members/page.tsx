"use client";

import { useState, useEffect } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import type { User } from "@/types";

export default function MembersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pointAdjust, setPointAdjust] = useState(0);

  useEffect(() => {
    import("@/mocks/users.json").then((m) => setUsers(m.default as User[]));
  }, []);

  const columns: Column<User>[] = [
    { key: "nickname", label: "닉네임", sortable: true },
    { key: "email", label: "이메일", sortable: true },
    {
      key: "point",
      label: "포인트",
      sortable: true,
      render: (row) => `${row.point.toLocaleString()}P`,
    },
    {
      key: "role",
      label: "역할",
      render: (row) => {
        const user = row;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              user.role === "ADMIN"
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.role === "ADMIN" ? "관리자" : "일반"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "가입일",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  function openDetail(user: User) {
    setSelected(user);
    setPointAdjust(0);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">회원 관리</h2>

      <DataTable
        columns={columns}
        data={users}
        searchField="nickname"
        searchPlaceholder="닉네임 검색..."
        onRowClick={(row) => openDetail(row)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>회원 상세</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">닉네임</span>
                <span className="font-medium">{selected.nickname}</span>
                <span className="text-muted-foreground">이메일</span>
                <span className="font-medium">{selected.email}</span>
                <span className="text-muted-foreground">역할</span>
                <span className="font-medium">{selected.role === "ADMIN" ? "관리자" : "일반"}</span>
                <span className="text-muted-foreground">연락처</span>
                <span className="font-medium">{selected.phone ?? "-"}</span>
                <span className="text-muted-foreground">현재 포인트</span>
                <span className="font-bold text-primary">{selected.point.toLocaleString()}P</span>
                <span className="text-muted-foreground">가입일</span>
                <span className="font-medium">{new Date(selected.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <Label className="text-xs font-medium">포인트 수동 조정</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={pointAdjust}
                    onChange={(e) => setPointAdjust(Number(e.target.value))}
                    placeholder="양수: 증가 / 음수: 감소"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === selected.id
                            ? { ...u, point: Math.max(0, u.point + pointAdjust) }
                            : u
                        )
                      );
                      setSelected({
                        ...selected,
                        point: Math.max(0, selected.point + pointAdjust),
                      });
                      setPointAdjust(0);
                    }}
                  >
                    적용
                  </Button>
                </div>
                {pointAdjust !== 0 && (
                  <p className="text-xs text-muted-foreground">
                    적용 후 포인트:{" "}
                    <strong>{Math.max(0, selected.point + pointAdjust).toLocaleString()}P</strong>
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>
              닫기
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
