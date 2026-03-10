"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import type { Order, OrderStatus, Product, User, Capsule } from "@/types";

const statusLabels: Record<OrderStatus, string> = {
  OPENED: "오픈됨",
  STORED: "보관중",
  DECOMPOSED: "분해됨",
  SHIPPING: "배송중",
  DELIVERED: "배송완료",
};

const statusColors: Record<OrderStatus, string> = {
  OPENED: "bg-blue-100 text-blue-700",
  STORED: "bg-emerald-100 text-emerald-700",
  DECOMPOSED: "bg-gray-100 text-gray-600",
  SHIPPING: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-purple-100 text-purple-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>("OPENED");

  useEffect(() => {
    import("@/mocks/orders.json").then((m) => setOrders(m.default as Order[]));
    import("@/mocks/users.json").then((m) => setUsers(m.default as User[]));
    import("@/mocks/products.json").then((m) => setProducts(m.default as Product[]));
    import("@/mocks/capsules.json").then((m) => setCapsules(m.default as Capsule[]));
  }, []);

  const userMap = useMemo(() => {
    const m = new Map<string, string>();
    users.forEach((u) => m.set(u.id, u.nickname));
    return m;
  }, [users]);

  const productMap = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => m.set(p.id, p.name));
    return m;
  }, [products]);

  const capsuleMap = useMemo(() => {
    const m = new Map<string, string>();
    capsules.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [capsules]);

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "주문번호",
      render: (row) => (
        <span className="font-mono text-xs">{row.id}</span>
      ),
    },
    {
      key: "userId",
      label: "유저",
      render: (row) => userMap.get(row.userId) ?? "-",
    },
    {
      key: "capsuleId",
      label: "캡슐",
      render: (row) => capsuleMap.get(row.capsuleId) ?? "-",
    },
    {
      key: "productId",
      label: "상품",
      render: (row) => productMap.get(row.productId) ?? "-",
    },
    {
      key: "amount",
      label: "금액",
      sortable: true,
      render: (row) => `₩${row.amount.toLocaleString()}`,
    },
    {
      key: "status",
      label: "상태",
      render: (row) => {
        const order = row;
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "날짜",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  function openDetail(order: Order) {
    setSelected(order);
    setNewStatus(order.status);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">주문 관리</h2>

      <DataTable
        columns={columns}
        data={orders}
        searchField="id"
        searchPlaceholder="주문번호 검색..."
        onRowClick={(row) => openDetail(row)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>주문 상세</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono font-medium">{selected.id}</span>
                <span className="text-muted-foreground">유저</span>
                <span className="font-medium">{userMap.get(selected.userId) ?? "-"}</span>
                <span className="text-muted-foreground">캡슐</span>
                <span className="font-medium">{capsuleMap.get(selected.capsuleId) ?? "-"}</span>
                <span className="text-muted-foreground">상품</span>
                <span className="font-medium">{productMap.get(selected.productId) ?? "-"}</span>
                <span className="text-muted-foreground">금액</span>
                <span className="font-bold">₩{selected.amount.toLocaleString()}</span>
                <span className="text-muted-foreground">날짜</span>
                <span className="font-medium">{new Date(selected.createdAt).toLocaleDateString("ko-KR")}</span>
              </div>

              <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                <Label className="text-xs font-medium">상태 변경</Label>
                <Select
                  value={newStatus}
                  onValueChange={(val) => setNewStatus(val as OrderStatus)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={newStatus === selected.status}
                  onClick={() => {
                    setOrders((prev) =>
                      prev.map((o) =>
                        o.id === selected.id ? { ...o, status: newStatus } : o
                      )
                    );
                    setSelected({ ...selected, status: newStatus });
                  }}
                >
                  변경 적용
                </Button>
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
