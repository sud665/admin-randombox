"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import type { Review, User, Product } from "@/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Review | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    import("@/mocks/reviews.json").then((m) => setReviews(m.default as Review[]));
    import("@/mocks/users.json").then((m) => setUsers(m.default as User[]));
    import("@/mocks/products.json").then((m) => setProducts(m.default as Product[]));
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

  function toggleHallOfFame(reviewId: string) {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, isHallOfFame: !r.isHallOfFame } : r
      )
    );
  }

  const columns: Column<Review>[] = [
    {
      key: "userId",
      label: "유저",
      render: (row) => userMap.get(row.userId) ?? "-",
    },
    {
      key: "productId",
      label: "상품",
      render: (row) => productMap.get(row.productId) ?? "-",
    },
    {
      key: "rating",
      label: "별점",
      sortable: true,
      render: (row) => {
        const review = row;
        return (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
        );
      },
    },
    {
      key: "content",
      label: "내용",
      render: (row) => {
        const content = row.content;
        return (
          <span className="max-w-[250px] truncate block text-muted-foreground">
            {content}
          </span>
        );
      },
    },
    {
      key: "isHallOfFame",
      label: "명예의전당",
      render: (row) => {
        const review = row;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Checkbox
              checked={review.isHallOfFame}
              onCheckedChange={() => toggleHallOfFame(review.id)}
            />
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "날짜",
      sortable: true,
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("ko-KR"),
    },
  ];

  function openDetail(review: Review) {
    setSelected(review);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">리뷰 관리</h2>

      <DataTable
        columns={columns}
        data={reviews}
        searchField="content"
        searchPlaceholder="리뷰 내용 검색..."
        onRowClick={(row) => openDetail(row)}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>리뷰 상세</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">유저</span>
                <span className="font-medium">{userMap.get(selected.userId) ?? "-"}</span>
                <span className="text-muted-foreground">상품</span>
                <span className="font-medium">{productMap.get(selected.productId) ?? "-"}</span>
                <span className="text-muted-foreground">별점</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < selected.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">날짜</span>
                <span className="font-medium">
                  {new Date(selected.createdAt).toLocaleDateString("ko-KR")}
                </span>
                <span className="text-muted-foreground">명예의전당</span>
                <span className="font-medium">
                  {selected.isHallOfFame ? "선정됨" : "미선정"}
                </span>
              </div>

              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-sm leading-relaxed">{selected.content}</p>
              </div>

              {selected.imageUrl && (
                <div className="overflow-hidden rounded-lg border">
                  <img
                    src={selected.imageUrl}
                    alt="리뷰 이미지"
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}
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
