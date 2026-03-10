"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HallOfFameCard } from "@/components/user/hall-of-fame-card";
import type { Review, Product, User } from "@/types";

type FilterTab = "all" | "S" | "A";

export default function HallOfFamePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [reviewsData, productsData, usersData] = await Promise.all([
          import("@/mocks/reviews.json").then((m) => m.default),
          import("@/mocks/products.json").then((m) => m.default),
          import("@/mocks/users.json").then((m) => m.default),
        ]);
        setReviews(
          (reviewsData as Review[]).filter((r) => r.isHallOfFame)
        );
        setProducts(productsData as Product[]);
        setUsers(usersData as User[]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getProduct = (productId: string) =>
    products.find((p) => p.id === productId) || null;

  const getUser = (userId: string) =>
    users.find((u) => u.id === userId) || null;

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "all") return true;
    const product = getProduct(review.productId);
    return product?.grade === activeTab;
  });

  return (
    <div className="px-4 py-4">
      {/* Title */}
      <motion.div
        className="mb-5 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy className="h-6 w-6 text-amber-500" />
        <h1 className="text-xl font-bold text-foreground">명예의 전당</h1>
      </motion.div>

      {/* Filter Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as FilterTab)}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="S">S급</TabsTrigger>
          <TabsTrigger value="A">A급</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* Cards Grid */}
      {!isLoading && filteredReviews.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filteredReviews.map((review, index) => (
            <HallOfFameCard
              key={review.id}
              review={review}
              product={getProduct(review.productId)}
              user={getUser(review.userId)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredReviews.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Trophy className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm font-medium text-muted-foreground">
            아직 명예의 전당에 등록된 리뷰가 없어요
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            S급, A급 상품을 뽑고 리뷰를 남겨보세요!
          </p>
        </motion.div>
      )}
    </div>
  );
}
