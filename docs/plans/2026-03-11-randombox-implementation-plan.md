# 랜덤박스 웹앱 플랫폼 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 위시켓 제안용 포트폴리오 랜덤박스 웹앱을 mock 데이터로 전체 플로우 체험 가능하도록 구축

**Architecture:** Next.js 15 App Router 모노레포. Route Groups로 사용자(user)/어드민(admin) 분리. mock JSON ↔ Supabase DB 전환은 환경변수로 제어.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, shadcn/ui, Zustand, Framer Motion, Lottie, Supabase (Auth/Storage/Realtime/DB), Prisma 6, Vercel

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `prisma/schema.prisma`
- Create: `.env.local`, `.env.example`, `.gitignore`

**Step 1: Next.js 프로젝트 초기화**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

**Step 2: 핵심 패키지 설치**

```bash
pnpm add @supabase/supabase-js @supabase/ssr @prisma/client zustand framer-motion lottie-react recharts date-fns
pnpm add -D prisma
```

**Step 3: shadcn/ui 초기화**

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card input label dialog tabs table badge avatar dropdown-menu sheet separator skeleton toast select checkbox textarea popover calendar command
```

**Step 4: 환경변수 파일 생성**

`.env.example`:
```env
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
SMART_DELIVERY_API_KEY=
```

`.env.local` → `.env.example` 복사 후 `NEXT_PUBLIC_USE_MOCK=true` 설정

**Step 5: .gitignore 확인**

node_modules, .env.local, .next 포함 확인

**Step 6: 개발 서버 확인**

```bash
pnpm dev
```
Expected: localhost:3000에서 Next.js 기본 페이지 표시

**Step 7: 커밋**

```bash
git add -A && git commit -m "chore: Next.js 15 프로젝트 초기화 + shadcn/ui + 핵심 패키지"
```

---

## Task 2: Prisma 스키마 + Mock 데이터 + 데이터 소스 추상화

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/prisma.ts`
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
- Create: `src/lib/data-source.ts`
- Create: `src/types/index.ts`
- Create: `src/mocks/products.json`, `src/mocks/capsules.json`, `src/mocks/users.json`, `src/mocks/orders.json`, `src/mocks/reviews.json`, `src/mocks/fever.json`

**Step 1: Prisma 스키마 작성**

`prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum Grade {
  S
  A
  B
  C
  D
}

enum OrderStatus {
  OPENED
  STORED
  DECOMPOSED
  SHIPPING
  DELIVERED
}

enum DeliveryStatus {
  PENDING
  PICKED_UP
  IN_TRANSIT
  DELIVERED
}

enum CapsuleStatus {
  ACTIVE
  SOLD_OUT
  INACTIVE
}

model User {
  id          String   @id @default(cuid())
  supabaseUid String   @unique
  email       String   @unique
  nickname    String
  phone       String?
  role        Role     @default(USER)
  point       Int      @default(0)
  tutorialDone Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  orders       Order[]
  deliveries   Delivery[]
  reviews      Review[]
  feverWinners FeverWinner[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  grade       Grade
  marketPrice Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  capsuleItems CapsuleItem[]
  orders       Order[]
  reviews      Review[]
  feverConfigs FeverConfig[]
}

model Capsule {
  id          String        @id @default(cuid())
  name        String
  description String?
  price       Int
  imageUrl    String?
  status      CapsuleStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  items  CapsuleItem[]
  orders Order[]
}

model CapsuleItem {
  id          String  @id @default(cuid())
  capsuleId   String
  productId   String
  probability Float
  stock       Int

  capsule Capsule @relation(fields: [capsuleId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@unique([capsuleId, productId])
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  capsuleId   String
  productId   String
  status      OrderStatus @default(OPENED)
  pgPaymentId String?
  amount      Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user     User      @relation(fields: [userId], references: [id])
  capsule  Capsule   @relation(fields: [capsuleId], references: [id])
  product  Product   @relation(fields: [productId], references: [id])
  delivery Delivery?
  review   Review?
}

model Delivery {
  id          String         @id @default(cuid())
  orderId     String         @unique
  userId      String
  address     String
  trackingNo  String?
  carrier     String?
  shippingFee Int
  status      DeliveryStatus @default(PENDING)
  paidAt      DateTime?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  order Order @relation(fields: [orderId], references: [id])
  user  User  @relation(fields: [userId], references: [id])
}

model Review {
  id          String   @id @default(cuid())
  orderId     String   @unique
  userId      String
  productId   String
  rating      Int
  content     String
  imageUrl    String?
  isHallOfFame Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  order   Order   @relation(fields: [orderId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

model FeverConfig {
  id              String   @id @default(cuid())
  targetAmount    Int
  rewardProductId String
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  rewardProduct Product       @relation(fields: [rewardProductId], references: [id])
  winners       FeverWinner[]
}

model FeverProgress {
  id            String   @id @default(cuid())
  currentAmount Int      @default(0)
  percentage    Float    @default(0)
  isActive      Boolean  @default(true)
  lastResetAt   DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model FeverWinner {
  id            String   @id @default(cuid())
  userId        String
  feverConfigId String
  productId     String
  wonAt         DateTime @default(now())

  user        User        @relation(fields: [userId], references: [id])
  feverConfig FeverConfig @relation(fields: [feverConfigId], references: [id])
}
```

**Step 2: TypeScript 타입 정의**

`src/types/index.ts`:
```typescript
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'
export type OrderStatus = 'OPENED' | 'STORED' | 'DECOMPOSED' | 'SHIPPING' | 'DELIVERED'
export type DeliveryStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED'
export type CapsuleStatus = 'ACTIVE' | 'SOLD_OUT' | 'INACTIVE'
export type Role = 'USER' | 'ADMIN'

export interface User {
  id: string
  email: string
  nickname: string
  phone?: string
  role: Role
  point: number
  tutorialDone: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description?: string
  imageUrl?: string
  grade: Grade
  marketPrice: number
}

export interface Capsule {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  status: CapsuleStatus
  items?: CapsuleItem[]
}

export interface CapsuleItem {
  id: string
  capsuleId: string
  productId: string
  probability: number
  stock: number
  product?: Product
}

export interface Order {
  id: string
  userId: string
  capsuleId: string
  productId: string
  status: OrderStatus
  pgPaymentId?: string
  amount: number
  createdAt: string
  product?: Product
  capsule?: Capsule
  delivery?: Delivery
  review?: Review
}

export interface Delivery {
  id: string
  orderId: string
  userId: string
  address: string
  trackingNo?: string
  carrier?: string
  shippingFee: number
  status: DeliveryStatus
  paidAt?: string
  createdAt: string
}

export interface Review {
  id: string
  orderId: string
  userId: string
  productId: string
  rating: number
  content: string
  imageUrl?: string
  isHallOfFame: boolean
  createdAt: string
  user?: User
  product?: Product
}

export interface FeverConfig {
  id: string
  targetAmount: number
  rewardProductId: string
  isActive: boolean
  rewardProduct?: Product
}

export interface FeverProgress {
  id: string
  currentAmount: number
  percentage: number
  isActive: boolean
}

export interface FeverWinner {
  id: string
  userId: string
  feverConfigId: string
  productId: string
  wonAt: string
  user?: User
}
```

**Step 3: Mock 데이터 생성**

`src/mocks/products.json` — 15개 상품 (S급 2, A급 3, B급 4, C급 3, D급 3)
`src/mocks/capsules.json` — 4개 캡슐 (각각 상품 배정 + 확률)
`src/mocks/users.json` — 테스트 유저 3명
`src/mocks/orders.json` — 주문 10건 (다양한 상태)
`src/mocks/reviews.json` — 리뷰 5건 (명예의 전당 2건)
`src/mocks/fever.json` — 피버 설정 + 진행상황 + 당첨자

각 mock 파일은 해당 타입 인터페이스에 맞는 배열 데이터.

**Step 4: 데이터 소스 추상화**

`src/lib/data-source.ts`:
```typescript
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getCapsules(): Promise<Capsule[]> {
  if (USE_MOCK) {
    const { default: data } = await import('@/mocks/capsules.json')
    return data
  }
  // Prisma 쿼리
  return prisma.capsule.findMany({ include: { items: { include: { product: true } } } })
}

// 동일 패턴으로 getProducts, getOrders, getReviews, getFeverStatus 등 구현
```

**Step 5: Supabase 클라이언트**

`src/lib/supabase/client.ts` — 브라우저용 createBrowserClient
`src/lib/supabase/server.ts` — 서버용 createServerClient

**Step 6: Prisma 클라이언트**

`src/lib/prisma.ts` — 싱글톤 패턴

**Step 7: Prisma generate 확인**

```bash
npx prisma generate
```

**Step 8: 커밋**

```bash
git add -A && git commit -m "feat: Prisma 스키마 + 타입 + mock 데이터 + 데이터 소스 추상화"
```

---

## Task 3: 공통 레이아웃 + 네비게이션

**Files:**
- Create: `src/app/(user)/layout.tsx` — 사용자 레이아웃 (하단 탭 네비게이션)
- Create: `src/app/(admin)/layout.tsx` — 어드민 레이아웃 (사이드바)
- Create: `src/components/user/bottom-nav.tsx` — 하단 탭 (홈/명예의전당/마이페이지)
- Create: `src/components/user/header.tsx` — 상단 헤더 + 피버 게이지 바
- Create: `src/components/admin/sidebar.tsx` — 어드민 사이드바
- Create: `src/components/admin/admin-header.tsx` — 어드민 헤더
- Modify: `src/app/layout.tsx` — 글로벌 폰트, 메타데이터

**Step 1: 글로벌 레이아웃 수정**

루트 layout.tsx에 Pretendard 폰트, 글로벌 메타데이터 설정.

**Step 2: 사용자 레이아웃**

모바일 퍼스트 레이아웃:
- 상단: 헤더 (로고 + 피버 게이지 바)
- 중앙: 콘텐츠 (스크롤)
- 하단: 탭 네비게이션 (홈/명예의전당/마이페이지) — 아이콘 + 라벨, 활성 탭 하이라이트

PC 대응: max-w-[480px] 중앙 정렬 (모바일 웹앱 느낌 유지)

**Step 3: 어드민 레이아웃**

사이드바 네비게이션:
- 대시보드, 상품관리, 캡슐관리, 회원관리, 주문관리, 배송관리, 피버설정, 리뷰관리, 통계
- 반응형: 모바일에서 Sheet(드로어)로 전환

**Step 4: 개발 서버에서 레이아웃 확인**

```bash
pnpm dev
```

**Step 5: 커밋**

```bash
git add -A && git commit -m "feat: 사용자/어드민 레이아웃 + 네비게이션 구현"
```

---

## Task 4: 인증 (회원가입/로그인) + 튜토리얼

**Files:**
- Create: `src/app/(user)/login/page.tsx` — 로그인 페이지
- Create: `src/app/(user)/signup/page.tsx` — 회원가입 페이지
- Create: `src/app/(user)/tutorial/page.tsx` — 튜토리얼 (스와이프 슬라이드)
- Create: `src/stores/auth-store.ts` — Zustand 인증 상태
- Create: `src/lib/mock-auth.ts` — mock 모드 인증 처리
- Create: `src/middleware.ts` — 인증 미들웨어 (보호 라우트)

**Step 1: Zustand 인증 스토어**

mock 모드: localStorage 기반 로그인 상태 유지
실제 모드: Supabase Auth 세션

**Step 2: 로그인/회원가입 UI**

- 이메일 + 비밀번호 폼
- 소셜 로그인 버튼 (카카오/구글 — mock에서는 바로 로그인)
- 반응형 카드 레이아웃

**Step 3: 튜토리얼**

Framer Motion AnimatePresence로 슬라이드 전환:
1. "랜덤박스에 오신 걸 환영합니다" (서비스 소개)
2. "캡슐을 구매하세요" (구매 안내)
3. "캡슐을 열어보세요" (오픈 안내)
4. "상품을 배송받거나 분해하세요" (배송/분해 안내)

최초 로그인 시만 표시 (tutorialDone 플래그)

**Step 4: 미들웨어**

`/mypage/*`, `/open/*` 등 인증 필요 라우트 보호.
`/admin/*` 라우트는 ADMIN role 확인.

**Step 5: 커밋**

```bash
git add -A && git commit -m "feat: 로그인/회원가입 + 튜토리얼 + 인증 미들웨어"
```

---

## Task 5: 메인 페이지 (캡슐 리스트) + 캡슐 상세

**Files:**
- Create: `src/app/(user)/page.tsx` — 메인 (캡슐 카드 그리드)
- Create: `src/app/(user)/capsule/[id]/page.tsx` — 캡슐 상세
- Create: `src/components/user/capsule-card.tsx` — 캡슐 카드 컴포넌트
- Create: `src/components/user/fever-bar.tsx` — 피버 게이지 바
- Create: `src/components/user/product-probability-list.tsx` — 상품 확률 목록

**Step 1: 캡슐 카드 컴포넌트**

- 캡슐 이미지, 이름, 가격, 남은 총 수량
- hover/tap 애니메이션 (Framer Motion scale)
- 등급별 색상 배지 (S: 금색, A: 보라, B: 파랑, C: 초록, D: 회색)

**Step 2: 메인 페이지**

- 상단: 피버 게이지 바 (실시간 업데이트 영역)
- 캡슐 카드 그리드 (모바일 2열, PC 2열 max-w-[480px])
- mock 데이터에서 캡슐 목록 로드

**Step 3: 캡슐 상세 페이지**

- 캡슐 대표 이미지
- 가격, 설명
- 포함 상품 목록 + 각 확률 표시
- "구매하기" 버튼 (CTA, 하단 고정)

**Step 4: 커밋**

```bash
git add -A && git commit -m "feat: 메인 캡슐 리스트 + 캡슐 상세 페이지"
```

---

## Task 6: 캡슐 구매 + 오픈 애니메이션

**Files:**
- Create: `src/app/(user)/open/[id]/page.tsx` — 캡슐 오픈 페이지
- Create: `src/components/user/capsule-open-animation.tsx` — 오픈 애니메이션
- Create: `src/components/user/result-card.tsx` — 당첨 결과 카드
- Create: `src/components/user/payment-modal.tsx` — 결제 모달
- Create: `src/lib/mock-payment.ts` — mock PG 결제
- Create: `src/lib/draw-logic.ts` — 확률 추첨 로직
- Create: `public/lottie/confetti.json` — 축하 이펙트 (무료 Lottie)

**Step 1: 결제 모달**

- 캡슐 정보 요약 + 결제 금액
- 결제 수단 선택 (mock: 바로 성공)
- 포인트 사용 옵션
- 결제 버튼

**Step 2: 확률 추첨 로직**

`src/lib/draw-logic.ts`:
```typescript
export function drawProduct(items: CapsuleItem[]): CapsuleItem {
  const available = items.filter(item => item.stock > 0)
  const totalWeight = available.reduce((sum, item) => sum + item.probability, 0)
  let random = Math.random() * totalWeight
  for (const item of available) {
    random -= item.probability
    if (random <= 0) return item
  }
  return available[available.length - 1]
}
```

**Step 3: 캡슐 오픈 애니메이션**

Framer Motion 시퀀스:
1. 캡슐 등장 (scale 0 → 1, 바운스)
2. 탭하여 열기 안내 텍스트
3. 탭 시 캡슐 흔들림 (rotate -10° ↔ 10° 반복)
4. 캡슐 갈라짐 (두 반쪽 벌어지며 빛 효과)
5. 당첨 상품 카드 등장 (scale + 빛 파티클)
6. S/A급: Lottie confetti 추가 연출

**Step 4: 결과 카드**

- 상품 이미지 + 이름 + 등급 배지
- 시장가 표시
- "보관함에 저장" / "바로 배송 신청" 버튼

**Step 5: 커밋**

```bash
git add -A && git commit -m "feat: 캡슐 구매(mock PG) + 오픈 애니메이션 + 추첨 로직"
```

---

## Task 7: 마이페이지 (보관함 + 분해 + 배송 + 리뷰)

**Files:**
- Create: `src/app/(user)/mypage/page.tsx` — 마이페이지 메인
- Create: `src/app/(user)/mypage/inventory/page.tsx` — 보관함
- Create: `src/app/(user)/mypage/delivery/page.tsx` — 배송 조회
- Create: `src/app/(user)/mypage/reviews/page.tsx` — 내 리뷰
- Create: `src/components/user/inventory-card.tsx` — 보관 상품 카드
- Create: `src/components/user/decompose-modal.tsx` — 분해 확인 모달
- Create: `src/components/user/delivery-request-modal.tsx` — 배송 신청 모달
- Create: `src/components/user/delivery-tracking.tsx` — 배송 추적 UI
- Create: `src/components/user/review-form.tsx` — 리뷰 작성 폼
- Create: `src/lib/mock-delivery.ts` — mock 배송 추적 데이터

**Step 1: 마이페이지 메인**

- 프로필 (닉네임, 이메일)
- 포인트 잔액 표시
- 메뉴: 보관함 / 주문·배송 / 내 리뷰 / 회원정보 수정

**Step 2: 보관함**

- 보관 중인 상품 카드 리스트 (이미지, 이름, 등급, 시장가)
- 각 카드에 "배송 신청" / "분해" 버튼
- 분해 시: 확인 모달 → 등급별 포인트 전환 (S:5000, A:3000, B:1500, C:700, D:300)
- 배송 신청 시: 주소 입력 + 배송비 결제 모달

**Step 3: 배송 조회**

- 주문별 배송 상태 표시 (타임라인 UI)
- mock 데이터: 단계별 상태 (접수 → 수거 → 이동중 → 배달완료)
- 운송장 번호, 택배사 정보

**Step 4: 리뷰**

- 배송 완료된 주문에 대해 리뷰 작성
- 별점 (1~5), 텍스트, 이미지 업로드 (mock: 미리보기만)

**Step 5: 커밋**

```bash
git add -A && git commit -m "feat: 마이페이지 - 보관함/분해/배송조회/리뷰"
```

---

## Task 8: 피버 시스템 + 명예의 전당

**Files:**
- Create: `src/components/user/fever-gauge.tsx` — 피버 게이지 (애니메이션)
- Create: `src/components/user/fever-winner-modal.tsx` — 피버 당첨 모달
- Create: `src/app/(user)/hall-of-fame/page.tsx` — 명예의 전당
- Create: `src/components/user/hall-of-fame-card.tsx` — 명예의 전당 카드
- Create: `src/stores/fever-store.ts` — Zustand 피버 상태

**Step 1: 피버 게이지 컴포넌트**

- 상단 프로그레스 바 (Framer Motion 애니메이션)
- 현재 금액 / 목표 금액 텍스트
- 80% 이상: 게이지 빨간색 + 펄스 애니메이션
- mock 모드: setInterval로 자동 증가 시뮬레이션

**Step 2: 피버 100% 달성 연출**

- 전체 화면 오버레이
- Lottie confetti + 축하 메시지
- 당첨자 정보 (닉네임, 상품) 표시
- 게이지 리셋

**Step 3: 명예의 전당**

- isHallOfFame=true인 리뷰 목록
- 카드: 상품 이미지 + 등급 배지 + 유저 닉네임 + 리뷰 발췌
- 필터: 전체 / S급 / A급

**Step 4: 커밋**

```bash
git add -A && git commit -m "feat: 피버 시스템(게이지+당첨 연출) + 명예의 전당"
```

---

## Task 9: 어드민 페이지

**Files:**
- Create: `src/app/(admin)/dashboard/page.tsx` — 대시보드
- Create: `src/app/(admin)/products/page.tsx` — 상품 관리
- Create: `src/app/(admin)/capsules/page.tsx` — 캡슐 관리
- Create: `src/app/(admin)/members/page.tsx` — 회원 관리
- Create: `src/app/(admin)/orders/page.tsx` — 주문 관리
- Create: `src/app/(admin)/deliveries/page.tsx` — 배송 관리
- Create: `src/app/(admin)/fever/page.tsx` — 피버 설정
- Create: `src/app/(admin)/reviews/page.tsx` — 리뷰 관리
- Create: `src/app/(admin)/stats/page.tsx` — 통계
- Create: `src/components/admin/data-table.tsx` — 범용 데이터 테이블
- Create: `src/components/admin/stat-card.tsx` — 통계 카드
- Create: `src/components/admin/chart-card.tsx` — 차트 카드

**Step 1: 범용 데이터 테이블**

shadcn/ui Table 기반:
- 정렬, 검색, 페이지네이션
- 행 클릭 → 상세/수정 Dialog
- 삭제 확인 Dialog

**Step 2: 대시보드**

- 통계 카드 4개: 오늘 매출, 주문수, 신규회원, 피버 진행률
- 차트: 최근 7일 매출 추이 (recharts BarChart)
- 최근 주문 5건 테이블

**Step 3: 상품 관리**

- 데이터 테이블: 이름, 등급, 시장가, 생성일
- 생성/수정 Dialog: 이름, 설명, 등급 선택, 시장가, 이미지 업로드

**Step 4: 캡슐 관리**

- 데이터 테이블: 이름, 가격, 상태, 상품 수
- 생성/수정 Dialog: 기본 정보 + 상품 배정 (확률 입력, 합계 100% 실시간 검증)

**Step 5: 회원/주문/배송/리뷰/피버/통계 관리**

동일한 데이터 테이블 + Dialog 패턴으로 구현:
- 회원: 목록, 포인트 수동 조정
- 주문: 목록, 상태 변경, 환불
- 배송: 운송장 입력, 상태 변경
- 리뷰: 목록, 명예의 전당 선정 토글
- 피버: 목표 금액/보상 상품 설정, 히스토리
- 통계: 기간별 매출, 캡슐별 판매량 차트 (recharts)

**Step 6: 커밋**

```bash
git add -A && git commit -m "feat: 어드민 전체 페이지 (대시보드/상품/캡슐/회원/주문/배송/피버/리뷰/통계)"
```

---

## Task 10: API Routes + Vercel 배포

**Files:**
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/capsules/route.ts`
- Create: `src/app/api/capsules/[id]/route.ts`
- Create: `src/app/api/capsules/[id]/open/route.ts`
- Create: `src/app/api/orders/route.ts`
- Create: `src/app/api/orders/[id]/decompose/route.ts`
- Create: `src/app/api/delivery/route.ts`
- Create: `src/app/api/delivery/[id]/tracking/route.ts`
- Create: `src/app/api/fever/status/route.ts`
- Create: `src/app/api/reviews/route.ts`
- Create: `src/app/api/reviews/hall-of-fame/route.ts`
- Create: `src/app/api/users/me/route.ts`
- Create: `src/app/api/users/me/inventory/route.ts`
- Create: `src/app/api/admin/products/route.ts` (+ 나머지 admin CRUD)

**Step 1: API 미들웨어 헬퍼**

```typescript
// src/lib/api-helpers.ts
export function mockOrDb<T>(mockData: T, dbQuery: () => Promise<T>): Promise<T> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') return Promise.resolve(mockData)
  return dbQuery()
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status })
}
```

**Step 2: 각 API Route 구현**

mock 모드: JSON 파일에서 읽어서 반환
실제 모드: Prisma 쿼리

모든 API는 `mockOrDb` 헬퍼로 전환.

**Step 3: 빌드 확인**

```bash
pnpm build
```
Expected: 에러 없이 빌드 성공

**Step 4: Vercel 배포**

```bash
pnpm dlx vercel --prod
```
또는 GitHub 연동 후 자동 배포.

환경변수 설정: `NEXT_PUBLIC_USE_MOCK=true` (초기에는 mock 모드로 배포)

**Step 5: 최종 커밋**

```bash
git add -A && git commit -m "feat: API Routes + Vercel 배포 설정"
```

---

## 실행 순서 요약

| Task | 내용 | 의존성 |
|------|------|--------|
| 1 | 프로젝트 스캐폴딩 | 없음 |
| 2 | Prisma + Mock + 타입 | Task 1 |
| 3 | 레이아웃 + 네비게이션 | Task 1 |
| 4 | 인증 + 튜토리얼 | Task 2, 3 |
| 5 | 메인 + 캡슐 상세 | Task 2, 3 |
| 6 | 캡슐 구매 + 오픈 | Task 5 |
| 7 | 마이페이지 | Task 4, 6 |
| 8 | 피버 + 명예의 전당 | Task 5 |
| 9 | 어드민 | Task 2, 3 |
| 10 | API + 배포 | Task 1~9 |

**병렬 가능:** Task 4+5 (인증과 메인은 독립), Task 8+9 (피버와 어드민은 독립)
