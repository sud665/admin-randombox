import { notFound } from "next/navigation";
import { getCapsuleById, getProducts } from "@/lib/data-source";
import { ProductProbabilityList } from "@/components/user/product-probability-list";
import type { ItemWithProduct } from "@/components/user/product-probability-list";
import { CapsuleDetailClient } from "./client";
import { CapsuleDetailHero } from "@/components/user/capsule-detail-hero";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

const statusMap: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "판매중", className: "bg-emerald-500 text-white" },
  SOLD_OUT: { label: "품절", className: "bg-red-500 text-white" },
  INACTIVE: { label: "비활성", className: "bg-gray-400 text-white" },
};

export default async function CapsuleDetailPage({ params }: Props) {
  const { id } = await params;
  const [capsule, products] = await Promise.all([
    getCapsuleById(id),
    getProducts(),
  ]);

  if (!capsule) {
    notFound();
  }

  const status = statusMap[capsule.status] ?? statusMap.INACTIVE;

  // Enrich items with product data
  const productMap = new Map(products.map((p) => [p.id, p]));
  const itemsWithProducts: ItemWithProduct[] = (capsule.items ?? [])
    .map((item) => ({
      ...item,
      product: productMap.get(item.productId)!,
    }))
    .filter((item) => item.product != null);

  const isSoldOut = capsule.status === "SOLD_OUT";

  return (
    <CapsuleDetailClient capsule={capsule} isSoldOut={isSoldOut}>
      <div className="relative flex min-h-screen flex-col pb-20">
        {/* Hero Capsule Illustration */}
        <CapsuleDetailHero capsuleId={capsule.id} capsuleName={capsule.name} />

        {/* Content */}
        <div className="px-4 pt-2">
          {/* Name + Status */}
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-extrabold text-foreground">
              {capsule.name}
            </h1>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          {/* Price */}
          <p className="mt-2 text-2xl font-extrabold text-primary">
            ₩{capsule.price.toLocaleString()}
          </p>

          {/* Description */}
          {capsule.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {capsule.description}
            </p>
          )}

          {/* Divider */}
          <div className="my-4 h-px bg-border" />

          {/* Product List */}
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">
              포함 상품
            </h2>
            <ProductProbabilityList items={itemsWithProducts} />
          </div>
        </div>
      </div>
    </CapsuleDetailClient>
  );
}
