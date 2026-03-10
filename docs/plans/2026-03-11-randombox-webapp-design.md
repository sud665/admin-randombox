# 랜덤박스 웹앱 플랫폼 설계서

## 프로젝트 개요

위시켓 제안용 포트폴리오 겸 실제 개발 기반이 되는 랜덤박스 웹앱 플랫폼.
프론트엔드는 mock JSON으로 백엔드 없이도 독립 동작하며, 환경변수 전환으로 실제 Supabase DB와 연결 가능.

- **목적**: 제안서 첨부 포트폴리오 + 재사용 가능한 템플릿
- **구조**: 모노레포 (사용자 웹앱 + 어드민 + 백엔드)
- **배포**: Vercel (데모 URL 공유)

---

## 기술 스택

| 영역 | 기술 | 용도 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | 프론트 + API Routes |
| 언어 | TypeScript | 전체 |
| 스타일링 | Tailwind CSS + shadcn/ui | UI 컴포넌트 |
| 상태관리 | Zustand | 클라이언트 상태 |
| 애니메이션 | Framer Motion + Lottie | 캡슐 오픈 연출 |
| DB | PostgreSQL (Supabase) | 데이터 저장 |
| ORM | Prisma | DB 스키마 관리 |
| 인증 | Supabase Auth | 로그인/회원가입 |
| 스토리지 | Supabase Storage | 상품 이미지 |
| 실시간 | Supabase Realtime | 피버 게이지 |
| 배포 | Vercel | 호스팅 |

---

## 디렉토리 구조

```
admin-randombox/
├── public/
│   └── lottie/                # Lottie 애니메이션 JSON
├── src/
│   ├── app/
│   │   ├── (user)/            # 사용자 웹앱
│   │   │   ├── page.tsx           # 메인 (캡슐 리스트)
│   │   │   ├── tutorial/          # 튜토리얼
│   │   │   ├── capsule/[id]/      # 캡슐 상세 + 구매
│   │   │   ├── open/[id]/         # 캡슐 오픈 (애니메이션)
│   │   │   ├── mypage/            # 마이페이지
│   │   │   │   ├── inventory/         # 보유 상품
│   │   │   │   ├── delivery/          # 배송 조회
│   │   │   │   └── reviews/           # 내 리뷰
│   │   │   ├── hall-of-fame/      # 명예의 전당
│   │   │   └── layout.tsx         # 사용자 레이아웃
│   │   ├── (admin)/           # 어드민 페이지
│   │   │   ├── dashboard/         # 대시보드
│   │   │   ├── products/          # 상품 관리
│   │   │   ├── capsules/          # 캡슐 관리
│   │   │   ├── members/           # 회원 관리
│   │   │   ├── orders/            # 주문/결제 관리
│   │   │   ├── deliveries/        # 배송 관리
│   │   │   ├── fever/             # 피버 시스템 설정
│   │   │   ├── reviews/           # 리뷰 관리
│   │   │   ├── stats/             # 통계
│   │   │   └── layout.tsx         # 어드민 레이아웃
│   │   └── api/               # API Routes
│   │       ├── auth/
│   │       ├── capsules/
│   │       ├── orders/
│   │       ├── delivery/
│   │       ├── fever/
│   │       └── admin/
│   ├── components/
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   ├── user/              # 사용자 전용 컴포넌트
│   │   └── admin/             # 어드민 전용 컴포넌트
│   ├── lib/
│   │   ├── supabase/          # Supabase 클라이언트
│   │   ├── prisma.ts          # Prisma 클라이언트
│   │   └── utils.ts
│   ├── hooks/                 # 커스텀 훅
│   ├── stores/                # Zustand 스토어
│   ├── types/                 # TypeScript 타입
│   └── mocks/                 # Mock JSON 데이터
│       ├── capsules.json
│       ├── products.json
│       ├── users.json
│       ├── orders.json
│       └── fever.json
├── prisma/
│   └── schema.prisma
├── .env.local
└── package.json
```

---

## 데이터 모델

### 테이블 목록

- **User**: 회원 정보 (supabaseUid, email, nickname, phone, role, point)
- **Capsule**: 캡슐 (name, description, price, imageUrl, status)
- **Product**: 상품 (name, description, imageUrl, grade[S/A/B/C/D], marketPrice)
- **CapsuleItem**: 캡슐-상품 매핑 (capsuleId, productId, probability, stock)
- **Order**: 주문 (userId, capsuleId, productId, status, pgPaymentId, amount)
- **Delivery**: 배송 (orderId, userId, address, trackingNo, carrier, shippingFee, status)
- **Review**: 리뷰 (orderId, userId, productId, rating, content, imageUrl, isHallOfFame)
- **FeverConfig**: 피버 설정 (targetAmount, rewardProductId, isActive)
- **FeverProgress**: 피버 진행 (currentAmount, percentage, isActive)
- **FeverWinner**: 피버 당첨자 (userId, feverConfigId, productId, wonAt)

### 주요 관계

- User 1:N Order
- Capsule 1:N CapsuleItem N:1 Product
- Order → 당첨된 Product 기록
- Order 1:1 Delivery
- Order 1:1 Review
- Order 상태 흐름: opened → stored → decomposed 또는 shipping → delivered

### 상품 분해

분해 시 등급별 포인트 전환, User.point에 적립, 포인트로 캡슐 재구매 가능.

---

## 사용자 플로우

```
회원가입/로그인 → 튜토리얼(최초) → 메인(캡슐 리스트)
→ 캡슐 상세 → 캡슐 구매(PG) → 캡슐 오픈(애니메이션)
→ 보관함 저장 or 바로 배송 신청
→ 분해(포인트) or 배송비 결제 → 배송 추적
→ 리뷰 작성
```

### 핵심 화면

**사용자**
- 메인: 캡슐 카드 리스트 + 피버 게이지 바 + 하단 탭
- 캡슐 오픈: Framer Motion 흔들기/열림/빛 효과, Lottie 등급별 이펙트
- 마이페이지: 보관함, 주문/배송 내역, 리뷰, 포인트
- 명예의 전당: S/A급 당첨 리뷰 그리드
- 피버: 상단 게이지 바, 100% 시 폭죽 연출 + 당첨자 모달

**어드민**
- 대시보드: 매출, 주문수, 신규회원, 피버 현황 차트
- 상품 관리: CRUD, 이미지 업로드, 등급/시장가
- 캡슐 관리: 생성, 상품 배정, 확률 설정 (합계 100% 검증)
- 회원/주문/배송/리뷰/피버/통계 관리

---

## API 설계

### 엔드포인트

```
POST /api/auth/signup, login, logout
GET  /api/capsules, /api/capsules/[id]
POST /api/capsules/[id]/open
GET  /api/orders
POST /api/orders
POST /api/orders/[id]/decompose
POST /api/orders/webhook (PG 웹훅)
POST /api/delivery
GET  /api/delivery/[id]/tracking
POST /api/delivery/webhook
GET  /api/fever/status
POST /api/fever/claim
GET  /api/reviews, /api/reviews/hall-of-fame
POST /api/reviews
GET  /api/users/me, PATCH /api/users/me
GET  /api/users/me/inventory
/api/admin/* (상품/캡슐/회원/주문/배송/피버/리뷰/통계 CRUD)
```

### 확률 추첨 로직

가중 랜덤 알고리즘: CapsuleItem의 probability 가중치 기반 추첨, 당첨 시 재고 차감.

### 외부 연동

- **PG**: 토스페이먼츠 (프론트 결제 위젯 → 서버 웹훅 검증)
- **택배 조회**: 스마트택배 API
- **실시간**: Supabase Realtime (FeverProgress 테이블 구독)

### Mock 모드

`NEXT_PUBLIC_USE_MOCK=true` 시 모든 API가 JSON 파일에서 응답.
PG 결제 → 항상 성공, 택배 → 샘플 데이터, Realtime → setInterval 시뮬레이션.

---

## 배포 및 환경

| 환경 | 용도 | Mock | DB |
|------|------|------|-----|
| local | 개발 | ON/OFF | Supabase dev |
| preview | PR별 자동 배포 | OFF | Supabase dev |
| production | 데모 URL | OFF | Supabase main |

### Git 워크플로우

```
main (production) ← develop (preview) ← feat/* 브랜치
```

### 주요 패키지

next@15, react@19, @supabase/supabase-js@2, @supabase/ssr, @prisma/client@6,
framer-motion@11, lottie-react@2, @tosspayments/tosspayments-sdk@2,
zustand@5, tailwindcss@4, recharts@2, date-fns@4, shadcn/ui
