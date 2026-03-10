import { notFound } from "next/navigation";
import Image from "next/image";
import { getCapsuleById, getProducts } from "@/lib/data-source";
import { ProductProbabilityList } from "@/components/user/product-probability-list";
import type { ItemWithProduct } from "@/components/user/product-probability-list";
import { CapsuleDetailClient } from "./client";

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
    <CapsuleDetailClient>
      <div className="relative flex min-h-screen flex-col pb-20">
        {/* Hero Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {capsule.imageUrl ? (
            <Image
              src={capsule.imageUrl}
              alt={capsule.name}
              fill
              className="object-cover"
              sizes="480px"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600">
              <svg
                className="h-20 w-20 text-white/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

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

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto max-w-[480px] border-t bg-white/95 px-4 py-3 backdrop-blur-sm">
            <button
              disabled={isSoldOut}
              className={`w-full rounded-xl py-3.5 text-base font-bold text-white shadow-lg transition-all ${
                isSoldOut
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-primary hover:bg-primary/90 active:scale-[0.98]"
              }`}
            >
              {isSoldOut
                ? "품절"
                : `₩${capsule.price.toLocaleString()} 구매하기`}
            </button>
          </div>
        </div>
      </div>
    </CapsuleDetailClient>
  );
}
