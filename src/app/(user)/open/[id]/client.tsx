"use client"

import { CapsuleOpenAnimation } from "@/components/user/capsule-open-animation"
import type { Product } from "@/types"

interface OpenPageClientProps {
  product: Product
  capsuleName: string
}

export function OpenPageClient({ product, capsuleName }: OpenPageClientProps) {
  return <CapsuleOpenAnimation product={product} capsuleName={capsuleName} />
}
