import { getCapsules, getFeverStatus, getProducts, getReviews } from "@/lib/data-source";
import { HomeContent } from "@/components/user/home-content";
import { HomePageClient } from "@/components/user/home-page-client";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [capsules, feverData, products, reviews] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
    getProducts(),
    getReviews(),
  ]);

  // 랜딩페이지용 리뷰 데이터 가공
  const hallOfFameReviews = reviews
    .filter((r) => r.isHallOfFame)
    .map((r) => {
      const product = products.find((p) => p.id === r.productId);
      return {
        content: r.content,
        rating: r.rating,
        productName: product?.name ?? "상품",
        nickname: r.userId === "user-1" ? "민준이" : "소연쓰",
      };
    });

  return (
    <HomePageClient
      capsules={capsules}
      feverPercentage={feverData?.progress?.percentage ?? 0}
      feverTarget={feverData?.config?.targetAmount ?? 5000000}
      feverCurrent={feverData?.progress?.currentAmount ?? 0}
      reviews={hallOfFameReviews}
    >
      <HomeContent />
    </HomePageClient>
  );
}
