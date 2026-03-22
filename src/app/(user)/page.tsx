import { getCapsules, getFeverStatus, getProducts, getHallOfFameReviews, getUsers } from "@/lib/data-source";
import { HomeContent } from "@/components/user/home-content";
import { HomePageClient } from "@/components/user/home-page-client";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [capsules, feverData, hallOfFameRaw, products, users] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
    getHallOfFameReviews(),
    getProducts(),
    getUsers(),
  ]);

  // 랜딩페이지용 리뷰 데이터 가공
  const hallOfFameReviews = hallOfFameRaw.map((r) => {
    const product = products.find((p) => p.id === r.productId);
    const user = users.find((u) => u.id === r.userId);
    return {
      content: r.content,
      rating: r.rating,
      productName: product?.name ?? "상품",
      nickname: user?.nickname ?? "익명",
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
