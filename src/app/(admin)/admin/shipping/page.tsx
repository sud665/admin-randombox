"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Delivery, DeliveryStatus } from "@/types";

const statusLabels: Record<DeliveryStatus, string> = {
  PENDING: "대기중",
  PICKED_UP: "집화",
  IN_TRANSIT: "배송중",
  DELIVERED: "배송완료",
};

const statusColors: Record<DeliveryStatus, string> = {
  PENDING: "bg-gray-100 text-gray-600",
  PICKED_UP: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
};

const carriers = ["CJ대한통운", "한진택배", "롯데택배", "우체국택배", "로젠택배"];

// 배송 mock 데이터 (orders.json에서 SHIPPING/DELIVERED 상태인 것들)
const mockDeliveries: Delivery[] = [
  {
    id: "del-1",
    orderId: "order-1",
    userId: "user-1",
    address: "서울시 강남구 테헤란로 123, 456호",
    trackingNo: "1234567890",
    carrier: "CJ대한통운",
    shippingFee: 3000,
    status: "DELIVERED",
    paidAt: "2026-02-05T10:00:00.000Z",
    createdAt: "2026-02-05T10:00:00.000Z",
    updatedAt: "2026-02-10T15:00:00.000Z",
  },
  {
    id: "del-2",
    orderId: "order-4",
    userId: "user-2",
    address: "서울시 마포구 홍대입구로 45, 201호",
    trackingNo: "9876543210",
    carrier: "한진택배",
    shippingFee: 3000,
    status: "IN_TRANSIT",
    paidAt: "2026-02-18T10:00:00.000Z",
    createdAt: "2026-02-18T10:00:00.000Z",
    updatedAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "del-3",
    orderId: "order-7",
    userId: "user-1",
    address: "서울시 강남구 테헤란로 123, 456호",
    trackingNo: "5555555555",
    carrier: "롯데택배",
    shippingFee: 3000,
    status: "DELIVERED",
    paidAt: "2026-03-04T09:00:00.000Z",
    createdAt: "2026-03-04T09:00:00.000Z",
    updatedAt: "2026-03-08T14:00:00.000Z",
  },
  {
    id: "del-4",
    orderId: "order-8",
    userId: "user-2",
    address: "서울시 마포구 홍대입구로 45, 201호",
    trackingNo: null,
    carrier: null,
    shippingFee: 3000,
    status: "PENDING",
    paidAt: "2026-03-05T09:00:00.000Z",
    createdAt: "2026-03-05T09:00:00.000Z",
    updatedAt: "2026-03-06T09:00:00.000Z",
  },
  {
    id: "del-5",
    orderId: "order-10",
    userId: "user-2",
    address: "서울시 마포구 홍대입구로 45, 201호",
    trackingNo: "1111222233",
    carrier: "우체국택배",
    shippingFee: 3000,
    status: "DELIVERED",
    paidAt: "2026-03-08T09:00:00.000Z",
    createdAt: "2026-03-08T09:00:00.000Z",
    updatedAt: "2026-03-10T16:00:00.000Z",
  },
];

export default function ShippingPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [selected, setSelected] = useState<Delivery | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTrackingNo, setEditTrackingNo] = useState("");
  const [editCarrier, setEditCarrier] = useState("");
  const [editStatus, setEditStatus] = useState<DeliveryStatus>("PENDING");

  const columns: Column<Delivery>[] = [
    {
      key: "orderId",
      label: "주문번호",
      render: (row) => (
        <span className="font-mono text-xs">{row.orderId}</span>
      ),
    },
    {
      key: "userId",
      label: "수령인",
      render: (row) => row.userId,
    },
    {
      key: "address",
      label: "주소",
      render: (row) => {
        const addr = row.address;
        return (
          <span className="max-w-[200px] truncate block" title={addr}>
            {addr}
          </span>
        );
      },
    },
    {
      key: "trackingNo",
      label: "운송장번호",
      render: (row) => {
        const d = row;
        return d.trackingNo ? (
          <span className="font-mono text-xs">{d.trackingNo}</span>
        ) : (
          <span className="text-xs text-muted-foreground">미등록</span>
        );
      },
    },
    {
      key: "carrier",
      label: "택배사",
      render: (row) => row.carrier ?? "-",
    },
    {
      key: "status",
      label: "상태",
      render: (row) => {
        const d = row;
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[d.status]}`}>
            {statusLabels[d.status]}
          </span>
        );
      },
    },
  ];

  function openDetail(delivery: Delivery) {
    setSelected(delivery);
    setEditTrackingNo(delivery.trackingNo ?? "");
    setEditCarrier(delivery.carrier ?? "");
    setEditStatus(delivery.status);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">배송 관리</h2>

      <DataTable
        columns={columns}
        data={deliveries}
        searchField="orderId"
        searchPlaceholder="주문번호 검색..."
        onRowClick={(row) => openDetail(row)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>배송 상세</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono font-medium">{selected.orderId}</span>
                <span className="text-muted-foreground">주소</span>
                <span className="font-medium text-xs">{selected.address}</span>
              </div>

              <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
                <div className="grid gap-2">
                  <Label className="text-xs">운송장 번호</Label>
                  <Input
                    value={editTrackingNo}
                    onChange={(e) => setEditTrackingNo(e.target.value)}
                    placeholder="운송장 번호 입력"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">택배사</Label>
                  <Select value={editCarrier} onValueChange={(val) => val && setEditCarrier(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="택배사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">배송 상태</Label>
                  <Select
                    value={editStatus}
                    onValueChange={(v) => setEditStatus(v as DeliveryStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(statusLabels) as DeliveryStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {statusLabels[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setDeliveries((prev) =>
                      prev.map((d) =>
                        d.id === selected.id
                          ? {
                              ...d,
                              trackingNo: editTrackingNo || null,
                              carrier: editCarrier || null,
                              status: editStatus,
                            }
                          : d
                      )
                    );
                    setSelected({
                      ...selected,
                      trackingNo: editTrackingNo || null,
                      carrier: editCarrier || null,
                      status: editStatus,
                    });
                  }}
                >
                  저장
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
