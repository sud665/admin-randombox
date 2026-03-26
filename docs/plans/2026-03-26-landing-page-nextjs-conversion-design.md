# 랜딩 페이지 Next.js 변환 설계

## 목표

`random.html` (CDN 기반 순수 HTML 랜딩 페이지)을 기존 Next.js 프로젝트의 루트(`/`) 페이지로 변환하여 기존 홈페이지를 대체한다.

## 결정 사항

- **경로**: `/` (루트) — 기존 홈페이지 대체
- **Spline 3D**: 히어로 섹션 iframe 유지
- **데이터**: 기존 API에서 캡슐/피버/리뷰 실제 데이터 연동
- **기존 코드**: `HomePageClient`, `HomeContent` 컴포넌트 삭제

## 구조

```
src/app/(user)/page.tsx               — 서버 컴포넌트 (데이터 fetch)
src/components/user/landing-page.tsx   — 클라이언트 컴포넌트 (전체 UI)
```

## 데이터 흐름

1. `page.tsx`에서 `getCapsules()`, `getFeverStatus()`, `getHallOfFameReviews()`, `getProducts()`, `getUsers()` 호출
2. 가공된 데이터를 props로 `LandingPage` 컴포넌트에 전달
3. 캡슐 목록, 피버 게이지, 리뷰를 실제 데이터로 렌더링

## 변환 매핑

| random.html | Next.js |
|---|---|
| Tailwind CDN | 프로젝트 Tailwind CSS 4 |
| React CDN + Babel | Next.js React 19 |
| lucide CDN (`<i data-lucide>`) | `lucide-react` 컴포넌트 |
| 하드코딩 데이터 | 서버 fetch 실제 데이터 |
| Spline iframe | 그대로 유지 |

## 삭제 대상

- `src/components/user/home-content.tsx`
- `src/components/user/home-page-client.tsx`
