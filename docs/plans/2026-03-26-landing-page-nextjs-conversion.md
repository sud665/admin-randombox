# Landing Page Next.js Conversion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `random.html` (CDN 기반 HTML)을 Next.js 루트 페이지로 변환하여 기존 홈페이지를 대체한다.

**Architecture:** 서버 컴포넌트(`page.tsx`)에서 데이터를 fetch하고, 단일 클라이언트 컴포넌트(`LandingPage`)에서 전체 UI를 렌더링한다. 기존 `HomePageClient`, `HomeContent`는 삭제한다.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, lucide-react, framer-motion

---

### Task 1: 기존 홈페이지 컴포넌트 삭제

**Files:**
- Delete: `src/components/user/home-content.tsx`
- Delete: `src/components/user/home-page-client.tsx`

**Step 1: 삭제 대상의 다른 참조가 없는지 확인**

`HomeContent`와 `HomePageClient`는 `src/app/(user)/page.tsx`에서만 사용됨을 확인 완료.

**Step 2: 파일 삭제**

```bash
rm src/components/user/home-content.tsx
rm src/components/user/home-page-client.tsx
```

**Step 3: 커밋**

```bash
git add -u
git commit -m "chore: 기존 홈페이지 컴포넌트 삭제 (HomeContent, HomePageClient)"
```

---

### Task 2: LandingPage 컴포넌트를 random.html 기반으로 교체

**Files:**
- Modify: `src/components/user/landing-page.tsx` (전체 교체)

`random.html`의 구조를 Next.js로 변환:
- CDN 의존성 → 프로젝트 라이브러리 (lucide-react, framer-motion)
- `<i data-lucide="name">` → `<IconName />` (lucide-react)
- 하드코딩 캡슐/피버 데이터 → props로 전달받는 실제 데이터
- Spline 3D iframe 유지
- `<a href>` 네비게이션 → Next.js `<Link>` (내부 링크)

**Props 인터페이스:**

```typescript
interface LandingPageProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
}
```

**섹션 구성 (random.html 기준):**
1. Header — 고정 네비게이션, 스크롤 시 배경 변경
2. Hero — Spline 3D iframe 배경 + 타이틀/CTA
3. How it works — 3단계 카드 (구매/오픈/배송|분해)
4. Capsules — 실제 캡슐 데이터 그리드
5. Fever — 실제 피버 게이지 데이터
6. Footer

**Step 1: landing-page.tsx 전체 교체**

`random.html`의 JSX를 변환하여 작성. 주요 변환:
- `Icon` wrapper → `lucide-react` 직접 import (`Gift`, `PackageOpen`, `RefreshCw`, `Crown`, `Sparkles`, `Heart`, `Plus`, `ArrowRight`, `Menu`, `X`)
- 스크롤 감지/FAQ 토글 → React hooks (`useState`, `useEffect`)
- 하드코딩 캡슐 배열 → `props.capsules`
- 하드코딩 피버 수치 → `props.feverPercentage`, `props.feverCurrent`, `props.feverTarget`
- 색상 팔레트: `#F04EA3` (핑크), `#FFB3C6`, `#90E0EF`, `#4A5568`, `#7A7A7A`

**Step 2: 빌드 확인**

```bash
pnpm build
```

Expected: 빌드 성공

**Step 3: 커밋**

```bash
git add src/components/user/landing-page.tsx
git commit -m "feat: random.html 기반 새 랜딩페이지 컴포넌트로 교체"
```

---

### Task 3: page.tsx 업데이트 — 새 랜딩페이지 직접 렌더링

**Files:**
- Modify: `src/app/(user)/page.tsx`

**Step 1: page.tsx 수정**

기존 `HomePageClient` + `HomeContent` 분기 로직 제거. 서버에서 데이터 fetch → `LandingPage`에 직접 전달.

```typescript
import { getCapsules, getFeverStatus, getProducts, getHallOfFameReviews, getUsers } from "@/lib/data-source";
import { LandingPage } from "@/components/user/landing-page";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [capsules, feverData, hallOfFameRaw, products, users] = await Promise.all([
    getCapsules(),
    getFeverStatus(),
    getHallOfFameReviews(),
    getProducts(),
    getUsers(),
  ]);

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
    <LandingPage
      capsules={capsules}
      feverPercentage={feverData?.progress?.percentage ?? 0}
      feverTarget={feverData?.config?.targetAmount ?? 5000000}
      feverCurrent={feverData?.progress?.currentAmount ?? 0}
      reviews={hallOfFameReviews}
    />
  );
}
```

**Step 2: 개발 서버에서 확인**

```bash
pnpm dev
# 브라우저에서 localhost:3000 확인
```

**Step 3: 빌드 확인**

```bash
pnpm build
```

Expected: 빌드 성공

**Step 4: 커밋**

```bash
git add src/app/(user)/page.tsx
git commit -m "feat: 루트 페이지를 새 랜딩페이지로 교체"
```
