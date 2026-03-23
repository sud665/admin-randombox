"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Capsule } from "@/types";
import { Logo } from "@/components/ui/logo";

/* ─── 팔레트 ─── */
const C = {
  periwinkle: "#a682ff",
  slate: "#715aff",
  cornflower: "#5887ff",
  maya: "#55c1ff",
  deep: "#102e4a",
} as const;

/* ─── 애니메이션 헬퍼 ─── */
const smooth = [0.25, 0.1, 0.25, 1] as const;       // cubic-bezier — CSS ease 동등
const decel = [0.0, 0.0, 0.2, 1] as const;           // material decelerate

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smooth } },
};

/* ─── 3D 틸트 카드 ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── 컨페티 파티클 ─── */
function Confetti({ count = 60 }: { count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: [C.periwinkle, C.slate, C.cornflower, C.maya, "#fbbf24", "#f472b6"][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.8,
      duration: Math.random() * 2 + 2,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    })),
  [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "40vh", x: `${p.x}vw`, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            y: [null, `${-20 - Math.random() * 80}vh`],
            x: [null, `${p.x + (Math.random() - 0.5) * 30}vw`],
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.8],
            rotate: [0, p.rotation + 360],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" as const }}
          className="absolute"
          style={{
            width: p.size,
            height: p.shape === "rect" ? p.size * 1.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}

/* ─── 선물상자 SVG ─── */
function GiftBox({ phase }: { phase: "closed" | "opening" | "opened" }) {
  return (
    <div className="relative mx-auto" style={{ width: 180, height: 200 }}>
      {/* 빛 효과 (열릴 때) */}
      <AnimatePresence>
        {(phase === "opening" || phase === "opened") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 0.7, 0], scale: [0.3, 2.5, 3.5] }}
            transition={{ duration: 2.2, ease: "easeOut" as const }}
            className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.maya}60, ${C.cornflower}30, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* 상자 본체 */}
      <motion.svg
        viewBox="0 0 180 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* 상자 본체 */}
        <motion.rect x="20" y="90" width="140" height="100" rx="8" fill={C.slate} />
        <motion.rect x="20" y="90" width="140" height="100" rx="8" fill="url(#boxGrad)" />
        {/* 세로 리본 */}
        <rect x="80" y="90" width="20" height="100" fill={C.maya} opacity="0.6" />
        {/* 가로 리본 */}
        <rect x="20" y="125" width="140" height="20" fill={C.maya} opacity="0.6" />

        {/* 뚜껑 */}
        <motion.g
          animate={
            phase === "opening" ? { y: -60, rotateX: -50, opacity: 0 } :
            phase === "opened" ? { y: -80, opacity: 0 } :
            { y: 0, opacity: 1 }
          }
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0.5, originY: 1 }}
        >
          <rect x="12" y="70" width="156" height="30" rx="6" fill={C.cornflower} />
          <rect x="80" y="70" width="20" height="30" fill={C.maya} opacity="0.6" />
          {/* 리본 매듭 */}
          <ellipse cx="75" cy="65" rx="16" ry="20" transform="rotate(-15 75 65)" fill={C.cornflower} />
          <ellipse cx="105" cy="65" rx="16" ry="20" transform="rotate(15 105 65)" fill={C.cornflower} />
          <circle cx="90" cy="70" r="10" fill={C.maya} />
        </motion.g>

        {/* 반짝임 */}
        <motion.g
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <path d="M155 80l3 5 5 3-5 3-3 5-3-5-5-3 5-3z" fill="white" opacity="0.8" />
          <path d="M35 100l2 3 3 2-3 2-2 3-2-3-3-2 3-2z" fill="white" opacity="0.6" />
        </motion.g>

        <defs>
          <linearGradient id="boxGrad" x1="20" y1="90" x2="160" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor={C.slate} />
            <stop offset="1" stopColor={C.periwinkle} />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}

/* ─── 랜딩용 기본 리뷰 데이터 ─── */
const LANDING_REVIEWS = [
  { content: "3,000원 캡슐에서 에어팟 프로 나왔습니다… 손이 떨렸어요 진짜로. 친구한테 자랑했더니 아무도 안 믿어줌 ㅋㅋ", rating: 5, productName: "에어팟 프로 2", nickname: "럭키보이" },
  { content: "반신반의하면서 라이트 캡슐 열었는데 스타벅스 텀블러 당첨! 가격 대비 이 정도면 완전 이득이죠. 매주 하나씩 열어보는 재미가 있어요.", rating: 5, productName: "스타벅스 텀블러", nickname: "커피중독자" },
  { content: "D급이라 별 기대 안 했는데 귀여운 키링이랑 스티커 세트 왔어요. 포장도 깔끔하고 소소하게 기분 좋아지는 느낌!", rating: 4, productName: "캐릭터 키링 세트", nickname: "모닝글로리" },
  { content: "프리미엄 캡슐 질렀는데 아이패드 미니 당첨됐습니다. 실화인가 싶어서 세 번 확인함. 배송도 이틀 만에 와서 놀랐어요.", rating: 5, productName: "아이패드 미니", nickname: "갓생러" },
  { content: "솔직히 처음엔 뽑기라 좀 찝찝했는데, 분해 기능으로 포인트 전환되니까 손해 보는 느낌 없어요. B급 나왔는데 블루투스 스피커라 꽤 만족!", rating: 4, productName: "JBL 블루투스 스피커", nickname: "음악덕후" },
  { content: "피버 이벤트 때 닌텐도 스위치 당첨된 사람입니다. 커뮤니티 게이지 같이 채우는 거 은근 중독성 있어요. 다음 피버도 기대 중!", rating: 5, productName: "닌텐도 스위치", nickname: "겜돌이" },
  { content: "5,000원짜리 캡슐 3개 열었는데 다이슨 에어랩 나옴 ㄷㄷ 역대급 운이었던 것 같아요. 여자친구 선물로 줬더니 대반응!", rating: 5, productName: "다이슨 에어랩", nickname: "선물장인" },
  { content: "매번 C~D급 나오다가 드디어 S급 떴어요!! 갤럭시 버즈 당첨. 꾸준히 하면 진짜 나오긴 하는구나 싶었습니다.", rating: 5, productName: "갤럭시 버즈 3 프로", nickname: "끈기의달인" },
  { content: "가벼운 마음으로 라이트 캡슐 열었다가 올리브영 기프트카드 5만원권 당첨. 쏠쏠하네요~ 다음 달에도 도전할 예정!", rating: 4, productName: "올리브영 기프트카드", nickname: "뷰티러버" },
  { content: "회사 점심시간에 심심해서 열어봤는데 애플워치 SE 나왔어요. 팀원들이 다 몰려와서 구경함 ㅋㅋ 회사에서 제일 유명해졌습니다.", rating: 5, productName: "애플워치 SE", nickname: "직장인J" },
  { content: "처음이라 제일 싼 캡슐로 시작했어요. 귀여운 양말 세트 나왔는데 퀄리티가 생각보다 좋아서 오히려 만족! D급도 괜찮네요.", rating: 4, productName: "디자인 양말 세트", nickname: "양말수집가" },
  { content: "분해해서 모은 포인트로 프리미엄 캡슐 도전했더니 B급 무선 충전기 당첨. 전략적으로 하면 더 재밌어요.", rating: 4, productName: "삼성 무선 충전기", nickname: "전략가K" },
];

/* ─── Props ─── */
interface LandingPageProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
}

/* ═══════════════════════════════════════════════════ */
export function LandingPage({ capsules, feverPercentage, feverTarget, feverCurrent, reviews }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: capsuleScroll } = useScroll({
    target: horizontalRef,
    offset: ["start end", "end start"],
  });
  const capsuleX = useTransform(capsuleScroll, [0.15, 0.85], ["10%", "-55%"]);

  /* 캡슐 목록을 3배로 반복 → 스크롤 의미 부여 */
  const repeatedCapsules = useMemo(() => {
    if (capsules.length === 0) return [];
    const result = [];
    for (let r = 0; r < 3; r++) {
      for (const c of capsules) {
        result.push({ ...c, _key: `${c.id}-${r}` });
      }
    }
    return result;
  }, [capsules]);

  /* DB 리뷰 + 랜딩 기본 리뷰 병합 (중복 닉네임 제거, 최대 12개) */
  const allReviews = useMemo(() => {
    const seen = new Set(reviews.map((r) => r.nickname));
    const extra = LANDING_REVIEWS.filter((r) => !seen.has(r.nickname));
    return [...reviews, ...extra].slice(0, 12);
  }, [reviews]);

  /* ─── 상자 오프닝 시퀀스 ─── */
  const [boxPhase, setBoxPhase] = useState<"closed" | "opening" | "opened" | "done">("closed");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBoxPhase("opening"), 1200);
    const t2 = setTimeout(() => setBoxPhase("opened"), 2400);
    const t3 = setTimeout(() => { setBoxPhase("done"); setShowContent(true); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white text-[#102e4a]">

      {/* ═══ Floating Nav ═══ */}
      <motion.nav
        initial={{ y: -40, opacity: 0, filter: "blur(8px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ delay: 1.2, duration: 1, ease: smooth }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-6 rounded-full border border-white/20 bg-white/70 px-6 py-2.5 shadow-lg backdrop-blur-xl">
          <Logo size="sm" />
          <div className="hidden items-center gap-5 text-xs font-medium text-[#102e4a]/60 sm:flex">
            <a href="#how" className="transition hover:text-[#715aff]">이용방법</a>
            <a href="#capsules" className="transition hover:text-[#715aff]">캡슐</a>
            <a href="#fever" className="transition hover:text-[#715aff]">피버</a>
            <a href="#reviews" className="transition hover:text-[#715aff]">후기</a>
          </div>
          <Link
            href="/signup"
            className="rounded-full px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${C.slate}, ${C.cornflower})` }}
          >
            시작하기
          </Link>
        </div>
        {/* Scroll Progress */}
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          className="mt-1 mx-auto h-0.5 w-full max-w-[200px] rounded-full"
          layoutScroll
        >
          <div className="h-full w-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.slate}, ${C.maya})` }} />
        </motion.div>
      </motion.nav>

      {/* ═══ Hero — 상자 오프닝 시퀀스 ═══ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          {/* 오버레이: 가독성 + 브랜드 톤 보정 */}
          <div className="absolute inset-0 bg-black/30" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(ellipse at 50% 40%, ${C.cornflower}50, transparent 70%)`,
            }}
          />
        </div>

        {/* 빛 폭발 효과 */}
        <AnimatePresence>
          {boxPhase === "opening" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${C.maya}30, ${C.cornflower}15, transparent 60%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* 컨페티 */}
        {(boxPhase === "opening" || boxPhase === "opened") && (
          <div className="absolute inset-0 z-20">
            <Confetti count={80} />
          </div>
        )}

        <div className="relative z-30 mx-auto max-w-5xl text-center">
          {/* 상자 (닫힘 → 열림 → 사라짐) */}
          <AnimatePresence>
            {boxPhase !== "done" && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.15, opacity: 0, y: -30 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <GiftBox phase={boxPhase} />
                {boxPhase === "closed" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4 text-sm font-medium text-white/40"
                  >
                    상자를 여는 중...
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 메인 콘텐츠 (상자 사라진 후 등장) */}
          {showContent && (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: smooth }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm"
              >
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                지금 {capsules.length}개 캡슐 오픈 가능
              </motion.div>

              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight text-center text-white">
                {"열어봐야 아는".split("").map((char, i) => (
                  <motion.span
                    key={`a-${i}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.04, ease: decel }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.periwinkle}, ${C.cornflower}, ${C.maya})` }}
                >
                  {"짜릿한 순간".split("").map((char, i) => (
                    <motion.span
                      key={`b-${i}`}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.04, ease: decel }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: smooth }}
                className="mx-auto mt-8 max-w-xl text-lg text-white/60 md:text-xl"
              >
                랜덤 캡슐 안에 숨겨진 상품을 만나보세요.
                아이패드부터 소소한 선물까지.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1, ease: smooth }}
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <div className="group relative rounded-full p-[2px]">
                  <div
                    className="absolute inset-0 rounded-full opacity-75 blur-sm transition group-hover:opacity-100"
                    style={{ background: `linear-gradient(135deg, ${C.slate}, ${C.cornflower}, ${C.maya})` }}
                  />
                  <Link
                    href="/signup"
                    className="relative flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white transition"
                    style={{ background: `linear-gradient(135deg, ${C.slate}, ${C.cornflower})` }}
                  >
                    지금 시작하기
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition group-hover:translate-x-1">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
                <Link
                  href="/login"
                  className="rounded-full px-8 py-4 text-lg font-medium text-white/50 transition hover:text-white"
                >
                  이미 계정이 있나요?
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 12, 0] }}
            transition={{ opacity: { delay: 2, duration: 1 }, y: { repeat: Infinity, duration: 2.5, ease: smooth } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-white/30">
              <span>scroll</span>
              <div className="h-8 w-[1px] bg-white/20" />
            </div>
          </motion.div>
        )}
      </section>

      {/* ═══ 벤토 그리드 — 서비스 소개 ═══ */}
      <section id="how" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-sm font-semibold uppercase tracking-widest"
            style={{ color: C.slate }}
          >
            How it works
          </motion.p>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-3 text-center text-3xl font-bold md:text-5xl"
          >
            3단계로 즐기는 랜덤박스
          </motion.h2>

          {/* Bento Grid */}
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
            {/* Card 1 — 큰 카드 */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl border border-[#715aff]/10 bg-gradient-to-br from-[#715aff]/5 to-transparent p-8 md:col-span-3 md:row-span-2"
            >
              <span className="text-6xl font-black text-[#715aff]/10">01</span>
              <div className="mt-4">
                <span className="text-4xl">🎰</span>
                <h3 className="mt-3 text-2xl font-bold">캡슐 구매</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-[#102e4a]/50">
                  프리미엄부터 라이트까지, 원하는 가격대의 캡슐을 선택하세요.
                  각 캡슐마다 S급~D급 상품이 다양한 확률로 들어있습니다.
                </p>
              </div>
              <div
                className="absolute -bottom-4 -right-4 h-40 w-40 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                style={{ background: C.slate }}
              />
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-[#5887ff]/10 bg-gradient-to-br from-[#5887ff]/5 to-transparent p-8 md:col-span-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-4xl">🎁</span>
                  <h3 className="mt-3 text-xl font-bold">캡슐 오픈</h3>
                  <p className="mt-2 leading-relaxed text-[#102e4a]/50">
                    두근거리는 순간! S급부터 D급까지 랜덤 상품이 등장합니다.
                  </p>
                </div>
                <span className="text-5xl font-black text-[#5887ff]/10">02</span>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl border border-[#55c1ff]/10 bg-gradient-to-br from-[#55c1ff]/5 to-transparent p-8 md:col-span-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-4xl">📦</span>
                  <h3 className="mt-3 text-xl font-bold">수령 또는 분해</h3>
                  <p className="mt-2 leading-relaxed text-[#102e4a]/50">
                    마음에 드는 상품은 배송, 아쉬운 상품은 포인트로 전환하세요.
                  </p>
                </div>
                <span className="text-5xl font-black text-[#55c1ff]/10">03</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 가로 스크롤 캡슐 쇼케이스 ═══ */}
      <section id="capsules" ref={horizontalRef} className="overflow-hidden py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: C.slate }}
          >
            Capsules
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-3 text-3xl font-bold md:text-5xl"
          >
            지금 도전할 수 있는 캡슐
          </motion.h2>
        </div>
        <motion.div style={{ x: capsuleX }} className="mt-12 flex gap-6 px-6">
          {repeatedCapsules.map((capsule) => (
            <TiltCard
              key={capsule._key}
              className="w-[320px] flex-shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-[#a682ff]/15 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {capsule.imageUrl ? (
                  <Image
                    src={capsule.imageUrl}
                    alt={capsule.name}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f8f6ff] text-5xl">🎲</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{capsule.name}</h3>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${C.slate}, ${C.cornflower})` }}
                  >
                    ₩{capsule.price.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#102e4a]/50">{capsule.description}</p>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </section>

      {/* ═══ 피버 게이지 ═══ */}
      <section id="fever" className="relative overflow-hidden px-6 py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, ${C.slate} 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ color: C.slate }}
            >
              Community Fever
            </motion.p>
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mt-3 text-3xl font-bold md:text-5xl"
            >
              함께 채우는{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.slate}, ${C.maya})` }}
              >
                피버 게이지
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="mx-auto mt-4 max-w-lg leading-relaxed text-[#102e4a]/50"
            >
              모든 구매가 모여 피버 게이지를 채웁니다. 목표 금액에 도달하면 특별한 보상이 추첨됩니다!
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mx-auto max-w-xl rounded-3xl border border-[#715aff]/10 bg-gradient-to-br from-[#715aff]/5 to-[#55c1ff]/5 p-8"
          >
            <div className="text-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="text-5xl font-black"
                style={{ color: C.slate }}
              >
                {feverPercentage}%
              </motion.span>
              <p className="mt-1 text-sm text-[#102e4a]/40">달성률</p>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#102e4a]/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${feverPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" as const, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${C.slate}, ${C.cornflower}, ${C.maya})` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-[#102e4a]/40">
              <span>₩{feverCurrent.toLocaleString()}</span>
              <span>₩{feverTarget.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 명예의 전당 ═══ */}
      <section id="reviews" className="bg-[#fafafe] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center text-sm font-semibold uppercase tracking-widest"
            style={{ color: C.slate }}
          >
            Reviews
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-3 text-center text-3xl font-bold md:text-5xl"
          >
            실제 당첨 후기
          </motion.h2>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((review, i) => (
              <TiltCard
                key={i}
                className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur"
              >
                <div className="flex items-center gap-1" style={{ color: C.periwinkle }}>
                  {Array.from({ length: review.rating }, (_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-[#102e4a]/70">{review.content}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#102e4a]/5 pt-4 text-sm">
                  <span className="font-medium text-[#102e4a]/60">{review.nickname}</span>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{ background: `${C.slate}10`, color: C.slate }}
                  >
                    {review.productName}
                  </span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative overflow-hidden px-6 py-32 text-center md:py-40">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${C.slate}08 0%, transparent 70%)`,
          }}
        />
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="relative mx-auto max-w-2xl"
        >
          <h2 className="text-3xl font-bold md:text-5xl">
            다음 행운의 주인공은{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.slate}, ${C.cornflower}, ${C.maya})` }}
            >
              당신
            </span>
            입니다
          </h2>
          <p className="mt-6 text-lg text-[#102e4a]/50">
            지금 가입하고 첫 캡슐을 열어보세요.
          </p>
          <div className="group relative mt-10 inline-block rounded-full p-[2px]">
            <div
              className="absolute inset-0 rounded-full opacity-60 blur-md transition group-hover:opacity-100"
              style={{ background: `linear-gradient(135deg, ${C.periwinkle}, ${C.slate}, ${C.cornflower}, ${C.maya})` }}
            />
            <Link
              href="/signup"
              className="relative flex items-center gap-2 rounded-full px-10 py-4 text-lg font-bold text-white transition"
              style={{ background: `linear-gradient(135deg, ${C.slate}, ${C.cornflower})` }}
            >
              무료로 시작하기
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition group-hover:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-[#102e4a]/5 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-[#102e4a]/30 md:flex-row">
          <span className="flex items-center gap-1.5">&copy; 2026 <Logo size="sm" /> All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/login" className="transition hover:text-[#715aff]">로그인</Link>
            <Link href="/signup" className="transition hover:text-[#715aff]">회원가입</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
