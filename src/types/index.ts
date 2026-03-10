// Enum types
export type Role = 'USER' | 'ADMIN'
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'
export type OrderStatus = 'OPENED' | 'STORED' | 'DECOMPOSED' | 'SHIPPING' | 'DELIVERED'
export type DeliveryStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED'
export type CapsuleStatus = 'ACTIVE' | 'SOLD_OUT' | 'INACTIVE'

// Model types
export interface User {
  id: string
  supabaseUid: string
  email: string
  nickname: string
  phone: string | null
  role: Role
  point: number
  tutorialDone: boolean
  createdAt: string
  updatedAt: string

  // Relations
  orders?: Order[]
  deliveries?: Delivery[]
  reviews?: Review[]
  feverWinners?: FeverWinner[]
}

export interface Product {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  grade: Grade
  marketPrice: number
  createdAt: string
  updatedAt: string

  // Relations
  capsuleItems?: CapsuleItem[]
  orders?: Order[]
  reviews?: Review[]
  feverConfigs?: FeverConfig[]
}

export interface Capsule {
  id: string
  name: string
  description: string | null
  price: number
  imageUrl: string | null
  status: CapsuleStatus
  createdAt: string
  updatedAt: string

  // Relations
  items?: CapsuleItem[]
  orders?: Order[]
}

export interface CapsuleItem {
  id: string
  capsuleId: string
  productId: string
  probability: number
  stock: number

  // Relations
  capsule?: Capsule
  product?: Product
}

export interface Order {
  id: string
  userId: string
  capsuleId: string
  productId: string
  status: OrderStatus
  pgPaymentId: string | null
  amount: number
  createdAt: string
  updatedAt: string

  // Relations
  user?: User
  capsule?: Capsule
  product?: Product
  delivery?: Delivery
  review?: Review
}

export interface Delivery {
  id: string
  orderId: string
  userId: string
  address: string
  trackingNo: string | null
  carrier: string | null
  shippingFee: number
  status: DeliveryStatus
  paidAt: string | null
  createdAt: string
  updatedAt: string

  // Relations
  order?: Order
  user?: User
}

export interface Review {
  id: string
  orderId: string
  userId: string
  productId: string
  rating: number
  content: string
  imageUrl: string | null
  isHallOfFame: boolean
  createdAt: string
  updatedAt: string

  // Relations
  order?: Order
  user?: User
  product?: Product
}

export interface FeverConfig {
  id: string
  targetAmount: number
  rewardProductId: string
  isActive: boolean
  createdAt: string

  // Relations
  rewardProduct?: Product
  winners?: FeverWinner[]
}

export interface FeverProgress {
  id: string
  currentAmount: number
  percentage: number
  isActive: boolean
  lastResetAt: string
  updatedAt: string
}

export interface FeverWinner {
  id: string
  userId: string
  feverConfigId: string
  productId: string
  wonAt: string

  // Relations
  user?: User
  feverConfig?: FeverConfig
}
