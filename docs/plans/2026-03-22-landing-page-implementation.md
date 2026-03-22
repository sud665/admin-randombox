# 랜딩페이지 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 비로그인 사용자에게 서비스를 소개하는 풀페이지 랜딩페이지를 루트 경로(`/`)에 추가한다.

**Architecture:** 현재 `(user)` 그룹의 `page.tsx`를 클라이언트 컴포넌트 래퍼로 변경하여 인증 상태에 따라 기존 홈 또는 랜딩페이지를 분기 렌더링한다. 랜딩페이지는 `LandingPage` 컴포넌트로 분리하고, `(user)/layout.tsx`에서도 랜딩 모드일 때 Header/BottomNav를 숨긴다.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, Framer Motion, Zustand, Unsplash 이미지

---

### Task 1: 홈페이지 콘텐츠를 별도 컴포넌트로 추출

기존 `page.tsx`의 서버 컴포넌트 콘텐츠를 `HomeContent` 컴포넌트로 분리한다.

**Files:**
- Create: `src/components/user/home-content.tsx`
- Modify: `src/app/(user)/page.tsx`

**Step 1: HomeContent 서버 컴포넌트 생성**

`src/components/user/home-content.tsx` 파일을 생성한다. 기존 `page.tsx`의 내용을 그대로 옮긴다:

```tsx
import { getCapsules, getFeverStatus, getProductById } from "@/lib/data-source";
import { CapsuleCard } from "@/components/user/capsule-card";
import { FeverGaugeSection } from "@/components/user/fever-gauge-section";

export async function HomeContent() {
  const [capsules, feverData] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
  ]);

  const rewardProduct = feverData?.config?.rewardProductId
    ? await getProductById(feverData.config.rewardProductId)
    : null;

  return (
    <div>
      <FeverGaugeSection
        initialData={{
          currentAmount: feverData?.progress?.currentAmount ?? 0,
          targetAmount: feverData?.config?.targetAmount ?? 5000000,
          percentage: feverData?.progress?.percentage ?? 0,
          isActive: feverData?.progress?.isActive ?? true,
        }}
        rewardProduct={rewardProduct}
      />
      <div className="px-4 pb-6">
        <h2 className="mb-3 text-lg font-bold text-foreground">캡슐 목록</h2>
        <div className="grid grid-cols-2 gap-3">
          {capsules.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: page.tsx에서 HomeContent 사용하도록 변경**

`src/app/(user)/page.tsx`를 수정한다. 우선은 단순히 HomeContent를 import해서 사용한다:

```tsx
import { HomeContent } from "@/components/user/home-content";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return <HomeContent />;
}
```

**Step 3: 개발 서버에서 동작 확인**

Run: `cd /Users/max/Desktop/wishket/admin-randombox && pnpm dev`
Expected: 기존과 동일하게 캡슐 목록 + 피버 게이지 표시

**Step 4: 커밋**

```bash
git add src/components/user/home-content.tsx src/app/\(user\)/page.tsx
git commit -m "refactor: 홈페이지 콘텐츠를 HomeContent 컴포넌트로 추출"
```

---

### Task 2: 유저 레이아웃에 랜딩 모드 분기 추가

랜딩페이지 표시 시 Header/BottomNav를 숨기고 풀스크린 레이아웃을 사용한다.

**Files:**
- Modify: `src/app/(user)/layout.tsx`

**Step 1: layout.tsx에 인증 상태 기반 분기 추가**

`src/app/(user)/layout.tsx`를 클라이언트 컴포넌트로 변경하고 auth store를 확인한다:

```tsx
"use client";

import { useAuthStore } from "@/stores/auth-store";
import { UserHeader } from "@/components/user/header";
import { BottomNav } from "@/components/user/bottom-nav";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  // 루트 경로에서 비로그인 시 랜딩 모드 (풀스크린, Header/BottomNav 숨김)
  const isLandingMode = pathname === "/" && !user;

  if (isLandingMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      <div className="mx-auto flex min-h-screen max-w-[480px] flex-col bg-white shadow-xl">
        <UserHeader />
        <main className="flex-1 pb-16">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
```

**Step 2: 커밋**

```bash
git add src/app/\(user\)/layout.tsx
git commit -m "feat: 유저 레이아웃에 랜딩 모드 분기 추가"
```

---

### Task 3: LandingPage 컴포넌트 생성 — Hero 섹션

풀블리드 Unsplash 배경 + 다크 오버레이 + 핵심 메시지 + CTA.

**Files:**
- Create: `src/components/user/landing-page.tsx`

**Step 1: LandingPage 컴포넌트 생성 (Hero 섹션)**

`src/components/user/landing-page.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// 스크롤 시 fade-in 애니메이션 헬퍼
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export function LandingPage() {
  return (
    <div className="bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1920&q=80&auto=format"
          alt="랜덤박스 히어로 배경"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            열어봐야 아는
            <br />
            <span className="text-amber-400">짜릿한 순간</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg text-zinc-300 md:text-xl"
          >
            랜덤 캡슐 안에 숨겨진 상품을 만나보세요.
            <br className="hidden md:block" />
            아이패드부터 소소한 선물까지, 두근거리는 순간이 기다립니다.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/signup"
              className="rounded-full bg-amber-400 px-8 py-3.5 text-lg font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              지금 시작하기
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-500 px-8 py-3.5 text-lg font-medium text-zinc-300 transition hover:border-zinc-300 hover:text-white"
            >
              로그인
            </Link>
          </motion.div>
        </div>
        {/* 스크롤 유도 */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="h-10 w-6 rounded-full border-2 border-zinc-400 p-1">
            <div className="mx-auto h-2 w-1 rounded-full bg-zinc-400" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
```

**Step 2: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: LandingPage Hero 섹션 구현"
```

---

### Task 4: LandingPage — 서비스 소개 섹션

3단계 과정(구매→오픈→수령/분해)을 시각적으로 설명한다.

**Files:**
- Modify: `src/components/user/landing-page.tsx`

**Step 1: 서비스 소개 섹션 추가**

Hero 섹션 뒤에 다음 섹션을 추가한다:

```tsx
{/* 서비스 소개 섹션 */}
<section className="px-6 py-24 md:py-32">
  <div className="mx-auto max-w-5xl">
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center text-3xl font-bold md:text-4xl"
    >
      3단계로 즐기는 랜덤박스
    </motion.h2>
    <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
      {[
        {
          step: "01",
          title: "캡슐 구매",
          desc: "원하는 가격대의 캡슐을 선택하세요. 프리미엄부터 라이트까지 다양한 옵션이 준비되어 있습니다.",
          icon: "🎰",
        },
        {
          step: "02",
          title: "캡슐 오픈",
          desc: "두근거리는 순간! 캡슐을 열면 S급부터 D급까지 랜덤 상품이 등장합니다.",
          icon: "🎁",
        },
        {
          step: "03",
          title: "수령 또는 분해",
          desc: "마음에 드는 상품은 배송받고, 아쉬운 상품은 분해해서 포인트로 전환하세요.",
          icon: "📦",
        },
      ].map((item, i) => (
        <motion.div
          key={item.step}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: i * 0.15 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-800 text-4xl">
            {item.icon}
          </div>
          <span className="text-sm font-semibold text-amber-400">{item.step}</span>
          <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
          <p className="mt-3 text-zinc-400 leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: LandingPage 서비스 소개 섹션 추가"
```

---

### Task 5: LandingPage — 캡슐 쇼케이스 섹션

실제 캡슐 데이터를 활용한 쇼케이스. 서버에서 데이터를 props로 전달한다.

**Files:**
- Modify: `src/components/user/landing-page.tsx`
- Modify: `src/app/(user)/page.tsx`

**Step 1: LandingPage에 캡슐 데이터 props 추가**

LandingPage 컴포넌트에 capsules props를 추가하고 쇼케이스 섹션을 구현한다:

```tsx
import type { Capsule } from "@/types";

interface LandingPageProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
}
```

캡슐 쇼케이스 섹션:

```tsx
{/* 캡슐 쇼케이스 */}
<section className="bg-zinc-900 px-6 py-24 md:py-32">
  <div className="mx-auto max-w-5xl">
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center text-3xl font-bold md:text-4xl"
    >
      지금 도전할 수 있는 캡슐
    </motion.h2>
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {capsules.map((capsule, i) => (
        <motion.div
          key={capsule.id}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1 }}
          className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition hover:border-amber-400/50"
        >
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={capsule.imageUrl}
              alt={capsule.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg">{capsule.name}</h3>
            <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{capsule.description}</p>
            <p className="mt-3 text-xl font-bold text-amber-400">
              ₩{capsule.price.toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: LandingPage 캡슐 쇼케이스 섹션 추가"
```

---

### Task 6: LandingPage — 피버 게이지 섹션

커뮤니티 피버 시스템을 시각적으로 소개한다.

**Files:**
- Modify: `src/components/user/landing-page.tsx`

**Step 1: 피버 게이지 섹션 추가**

```tsx
{/* 피버 게이지 섹션 */}
<section className="px-6 py-24 md:py-32">
  <div className="mx-auto max-w-4xl text-center">
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-3xl font-bold md:text-4xl"
    >
      함께 채우는 <span className="text-amber-400">피버 게이지</span>
    </motion.h2>
    <motion.p
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-4 text-zinc-400 text-lg"
    >
      모든 구매가 모여 피버 게이지를 채웁니다.
      가득 차면 특별한 보상이 추첨됩니다!
    </motion.p>
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-12"
    >
      <div className="relative mx-auto h-6 max-w-lg overflow-hidden rounded-full bg-zinc-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${feverPercentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
        />
      </div>
      <div className="mt-4 flex justify-between text-sm text-zinc-400 max-w-lg mx-auto">
        <span>₩{feverCurrent.toLocaleString()}</span>
        <span className="font-bold text-amber-400">{feverPercentage}%</span>
        <span>₩{feverTarget.toLocaleString()}</span>
      </div>
    </motion.div>
  </div>
</section>
```

**Step 2: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: LandingPage 피버 게이지 섹션 추가"
```

---

### Task 7: LandingPage — 명예의 전당 + CTA + Footer

리뷰 하이라이트, 최종 CTA, 서비스 정보 Footer.

**Files:**
- Modify: `src/components/user/landing-page.tsx`

**Step 1: 명예의 전당 섹션 추가**

```tsx
{/* 명예의 전당 */}
<section className="bg-zinc-900 px-6 py-24 md:py-32">
  <div className="mx-auto max-w-5xl">
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center text-3xl font-bold md:text-4xl"
    >
      실제 당첨 후기
    </motion.h2>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: review.rating }, (_, j) => (
              <span key={j}>★</span>
            ))}
          </div>
          <p className="mt-3 text-zinc-300 leading-relaxed">{review.content}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
            <span>{review.nickname}</span>
            <span className="font-medium text-zinc-400">{review.productName}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

**Step 2: CTA 섹션 추가**

```tsx
{/* CTA */}
<section className="px-6 py-24 text-center md:py-32">
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="mx-auto max-w-2xl"
  >
    <h2 className="text-3xl font-bold md:text-4xl">
      다음 행운의 주인공은 <span className="text-amber-400">당신</span>입니다
    </h2>
    <p className="mt-4 text-lg text-zinc-400">
      지금 가입하고 첫 캡슐을 열어보세요.
    </p>
    <Link
      href="/signup"
      className="mt-8 inline-block rounded-full bg-amber-400 px-10 py-4 text-lg font-bold text-zinc-950 transition hover:bg-amber-300"
    >
      무료로 시작하기
    </Link>
  </motion.div>
</section>
```

**Step 3: Footer 추가**

```tsx
{/* Footer */}
<footer className="border-t border-zinc-800 px-6 py-8">
  <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
    <span>© 2026 랜덤박스. All rights reserved.</span>
    <div className="flex gap-6">
      <Link href="/login" className="hover:text-zinc-300 transition">로그인</Link>
      <Link href="/signup" className="hover:text-zinc-300 transition">회원가입</Link>
    </div>
  </div>
</footer>
```

**Step 4: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: LandingPage 명예의 전당, CTA, Footer 섹션 추가"
```

---

### Task 8: page.tsx에서 인증 분기 + 데이터 전달

루트 페이지에서 인증 상태에 따라 LandingPage 또는 HomeContent를 렌더링한다.

**Files:**
- Modify: `src/app/(user)/page.tsx`

**Step 1: page.tsx를 분기 래퍼로 변경**

서버 컴포넌트에서 데이터를 fetch하고, 클라이언트 래퍼에서 인증 분기를 처리한다:

`src/app/(user)/page.tsx`:

```tsx
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
```

**Step 2: HomePageClient 클라이언트 래퍼 생성**

Create: `src/components/user/home-page-client.tsx`

```tsx
"use client";

import { useAuthStore } from "@/stores/auth-store";
import { LandingPage } from "@/components/user/landing-page";
import type { Capsule } from "@/types";

interface HomePageClientProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
  children: React.ReactNode;
}

export function HomePageClient({
  capsules,
  feverPercentage,
  feverTarget,
  feverCurrent,
  reviews,
  children,
}: HomePageClientProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <LandingPage
        capsules={capsules}
        feverPercentage={feverPercentage}
        feverTarget={feverTarget}
        feverCurrent={feverCurrent}
        reviews={reviews}
      />
    );
  }

  return <>{children}</>;
}
```

**Step 3: 커밋**

```bash
git add src/app/\(user\)/page.tsx src/components/user/home-page-client.tsx
git commit -m "feat: 루트 페이지에 인증 기반 랜딩/홈 분기 추가"
```

---

### Task 9: 데이터 소스에 getProducts, getReviews 확인 및 보완

page.tsx에서 사용하는 `getProducts`, `getReviews` 함수가 data-source에 존재하는지 확인하고, 없으면 추가한다.

**Files:**
- Modify: `src/lib/data-source.ts` (필요 시)

**Step 1: data-source.ts에서 getProducts, getReviews 존재 확인**

Run: `grep -n "export.*getProducts\|export.*getReviews" src/lib/data-source.ts`

이미 존재하면 스킵. 없으면 mock JSON에서 읽어오는 함수를 추가한다.

**Step 2: 개발 서버 동작 확인**

Run: `pnpm dev`
Expected: 비로그인 상태에서 `/`에 랜딩페이지 표시, 로그인 상태에서 기존 홈 표시

**Step 3: 커밋 (변경 있을 경우)**

```bash
git add src/lib/data-source.ts
git commit -m "feat: getProducts, getReviews 데이터 소스 함수 추가"
```

---

### Task 10: 전체 통합 테스트 및 최종 정리

전체 플로우를 확인하고 마무리한다.

**Files:**
- 전체 프로젝트

**Step 1: 빌드 확인**

Run: `pnpm build`
Expected: 빌드 성공, 에러 없음

**Step 2: 동작 확인 체크리스트**

- [ ] 비로그인 시 `/`에서 랜딩페이지 표시
- [ ] Hero 섹션: 풀블리드 배경, CTA 버튼 동작
- [ ] 서비스 소개: 3단계 카드 스크롤 애니메이션
- [ ] 캡슐 쇼케이스: 4개 캡슐 카드 표시
- [ ] 피버 게이지: 진행률 애니메이션
- [ ] 명예의 전당: 리뷰 카드 표시
- [ ] CTA: 회원가입 링크 동작
- [ ] 로그인 후 `/`에서 기존 홈 표시
- [ ] Header/BottomNav: 랜딩 모드에서 숨김, 로그인 시 표시

**Step 3: 최종 커밋**

```bash
git add -A
git commit -m "feat: 랜딩페이지 전체 구현 완료"
```
