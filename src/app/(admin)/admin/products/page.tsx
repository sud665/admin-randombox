"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Product, Grade } from "@/types";

const gradeColors: Record<Grade, string> = {
  S: "bg-amber-100 text-amber-700",
  A: "bg-purple-100 text-purple-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-emerald-100 text-emerald-700",
  D: "bg-gray-100 text-gray-600",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    import("@/mocks/products.json").then((m) => setProducts(m.default as Product[]));
  }, []);

  const columns: Column<Product>[] = [
    { key: "name", label: "이름", sortable: true },
    {
      key: "grade",
      label: "등급",
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${gradeColors[row.grade]}`}>
          {row.grade}
        </span>
      ),
    },
    {
      key: "marketPrice",
      label: "시장가",
      sortable: true,
      render: (row) => `₩${row.marketPrice.toLocaleString()}`,
    },
    {
      key: "createdAt",
      label: "생성일",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  function openEdit(product: Product) {
    setSelected({ ...product });
    setDialogOpen(true);
  }

  function openCreate() {
    setSelected({
      id: "",
      name: "",
      description: "",
      imageUrl: "",
      grade: "C",
      marketPrice: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">상품 관리</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          상품 등록
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchField="name"
        searchPlaceholder="상품명 검색..."
        onRowClick={(row) => openEdit(row)}
      />

      {/* 수정/등록 Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.id ? "상품 수정" : "상품 등록"}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>이름</Label>
                <Input
                  value={selected.name}
                  onChange={(e) => setSelected({ ...selected, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>설명</Label>
                <Textarea
                  value={selected.description ?? ""}
                  onChange={(e) => setSelected({ ...selected, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>등급</Label>
                  <Select
                    value={selected.grade}
                    onValueChange={(val) => setSelected({ ...selected, grade: val as Grade })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["S", "A", "B", "C", "D"] as Grade[]).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>시장가</Label>
                  <Input
                    type="number"
                    value={selected.marketPrice}
                    onChange={(e) => setSelected({ ...selected, marketPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>이미지 URL</Label>
                <Input
                  value={selected.imageUrl ?? ""}
                  onChange={(e) => setSelected({ ...selected, imageUrl: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            {selected?.id && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setDeleteTarget(selected);
                  setDialogOpen(false);
                }}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                삭제
              </Button>
            )}
            <DialogClose render={<Button variant="outline" size="sm" />}>
              취소
            </DialogClose>
            <Button
              size="sm"
              onClick={() => {
                // mock: 저장 처리
                setDialogOpen(false);
              }}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>상품 삭제</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            &quot;{deleteTarget?.name}&quot; 상품을 정말 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없습니다.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>
              취소
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setProducts((prev) => prev.filter((p) => p.id !== deleteTarget?.id));
                setDeleteTarget(null);
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
