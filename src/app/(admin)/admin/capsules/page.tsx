"use client";

import { useState, useEffect, useMemo } from "react";
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
import type { Capsule, Product, CapsuleItem, CapsuleStatus } from "@/types";

const statusLabels: Record<CapsuleStatus, string> = {
  ACTIVE: "활성",
  SOLD_OUT: "품절",
  INACTIVE: "비활성",
};

const statusColors: Record<CapsuleStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SOLD_OUT: "bg-red-100 text-red-700",
  INACTIVE: "bg-gray-100 text-gray-600",
};

interface FormItem {
  productId: string;
  probability: number;
  stock: number;
}

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Capsule | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formItems, setFormItems] = useState<FormItem[]>([]);

  useEffect(() => {
    import("@/mocks/capsules.json").then((m) => setCapsules(m.default as Capsule[]));
    import("@/mocks/products.json").then((m) => setProducts(m.default as Product[]));
  }, []);

  const productMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [products]);

  const probabilitySum = useMemo(
    () => formItems.reduce((sum, item) => sum + item.probability, 0),
    [formItems]
  );

  const columns: Column<Capsule>[] = [
    { key: "name", label: "이름", sortable: true },
    {
      key: "price",
      label: "가격",
      sortable: true,
      render: (row) => `₩${row.price.toLocaleString()}`,
    },
    {
      key: "status",
      label: "상태",
      render: (row) => {
        const capsule = row;
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[capsule.status]}`}>
            {statusLabels[capsule.status]}
          </span>
        );
      },
    },
    {
      key: "items",
      label: "상품 수",
      render: (row) => `${row.items?.length ?? 0}개`,
    },
  ];

  function openEdit(capsule: Capsule) {
    setSelected({ ...capsule });
    setFormItems(
      (capsule.items ?? []).map((item) => ({
        productId: item.productId,
        probability: item.probability,
        stock: item.stock,
      }))
    );
    setDialogOpen(true);
  }

  function openCreate() {
    setSelected({
      id: "",
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
    });
    setFormItems([]);
    setDialogOpen(true);
  }

  function addItem() {
    setFormItems((prev) => [...prev, { productId: "", probability: 0, stock: 0 }]);
  }

  function removeItem(index: number) {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof FormItem, value: string | number) {
    setFormItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">캡슐 관리</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          캡슐 등록
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={capsules}
        searchField="name"
        searchPlaceholder="캡슐명 검색..."
        onRowClick={(row) => openEdit(row)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.id ? "캡슐 수정" : "캡슐 등록"}</DialogTitle>
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
                  <Label>가격</Label>
                  <Input
                    type="number"
                    value={selected.price}
                    onChange={(e) => setSelected({ ...selected, price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>상태</Label>
                  <Select
                    value={selected.status}
                    onValueChange={(val) => setSelected({ ...selected, status: val as CapsuleStatus })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["ACTIVE", "SOLD_OUT", "INACTIVE"] as CapsuleStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 상품 배정 섹션 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">상품 배정</Label>
                  <span
                    className={`text-xs font-medium ${
                      probabilitySum === 100
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    합계: {probabilitySum}% / 100%
                  </span>
                </div>

                {formItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-end gap-2 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="grid flex-1 gap-1">
                      <span className="text-xs text-muted-foreground">상품</span>
                      <Select
                        value={item.productId}
                        onValueChange={(val) => val && updateItem(index, "productId", val)}
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              [{p.grade}] {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid w-20 gap-1">
                      <span className="text-xs text-muted-foreground">확률(%)</span>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={item.probability}
                        onChange={(e) => updateItem(index, "probability", Number(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <div className="grid w-20 gap-1">
                      <span className="text-xs text-muted-foreground">재고</span>
                      <Input
                        type="number"
                        min={0}
                        value={item.stock}
                        onChange={(e) => updateItem(index, "stock", Number(e.target.value))}
                        className="text-xs"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  상품 추가
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>
              취소
            </DialogClose>
            <Button
              size="sm"
              disabled={probabilitySum !== 100 && formItems.length > 0}
              onClick={() => {
                // mock 저장
                setDialogOpen(false);
              }}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
