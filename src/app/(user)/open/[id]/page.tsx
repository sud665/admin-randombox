import { notFound } from "next/navigation"
import { getCapsuleById, getProducts } from "@/lib/data-source"
import { drawProduct } from "@/lib/draw-logic"
import { OpenPageClient } from "./client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CapsuleOpenPage({ params }: Props) {
  const { id } = await params
  const [capsule, products] = await Promise.all([
    getCapsuleById(id),
    getProducts(),
  ])

  if (!capsule || !capsule.items || capsule.items.length === 0) {
    notFound()
  }

  // Enrich items with product data for draw
  const productMap = new Map(products.map((p) => [p.id, p]))
  const enrichedItems = capsule.items.map((item) => ({
    ...item,
    product: productMap.get(item.productId),
  }))

  // Draw a product
  const drawnItem = drawProduct(enrichedItems)
  const drawnProduct = productMap.get(drawnItem.productId)

  if (!drawnProduct) {
    notFound()
  }

  return (
    <OpenPageClient
      product={drawnProduct}
      capsuleName={capsule.name}
    />
  )
}
