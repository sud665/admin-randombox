"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Capsule } from "@/types";

/* ─── 팔레트 ─── */
const C = {
  periwinkle: "#a682ff",
  slate: "#715aff",
  cornflower: "#5887ff",
  maya: "#55c1ff",
  deep: "#102e4a",
} as const;

/* ─── 애니메이션 헬퍼 ─── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const wordReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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

/* ─── 단어별 리빌 텍스트 ─── */
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span variants={staggerContainer} initial="hidden" animate="visible" className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span variants={wordReveal} className="inline-block">
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
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
      delay: Math.random() * 0.5,
      duration: Math.random() * 1.5 + 1.5,
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
            animate={{ opacity: [0, 0.8, 0], scale: [0.3, 2.5, 3] }}
            transition={{ duration: 1.5, ease: "easeOut" as const }}
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
          transition={{ duration: 0.8, ease: "easeOut" as const }}
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
  const capsuleX = useTransform(capsuleScroll, [0.1, 0.9], ["5%", "-15%"]);

  /* ─── 상자 오프닝 시퀀스 ─── */
  const [boxPhase, setBoxPhase] = useState<"closed" | "opening" | "opened" | "done">("closed");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBoxPhase("opening"), 800);
    const t2 = setTimeout(() => setBoxPhase("opened"), 1600);
    const t3 = setTimeout(() => { setBoxPhase("done"); setShowContent(true); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white text-[#102e4a]">

      {/* ═══ Floating Nav ═══ */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-6 rounded-full border border-white/20 bg-white/70 px-6 py-2.5 shadow-lg backdrop-blur-xl">
          <span className="text-sm font-bold" style={{ color: C.slate }}>랜덤박스</span>
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
        {/* 배경 */}
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 45deg at 50% 50%, ${C.periwinkle}20, ${C.cornflower}15, ${C.maya}20, ${C.periwinkle}20)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, ${C.deep} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

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
                exit={{ scale: 1.3, opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <GiftBox phase={boxPhase} />
                {boxPhase === "closed" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4 text-sm font-medium text-[#102e4a]/40"
                  >
                    상자를 여는 중...
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 메인 콘텐츠 (상자 사라진 후 등장) */}
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#715aff]/20 bg-[#715aff]/5 px-4 py-1.5 text-sm font-medium"
                style={{ color: C.slate }}
              >
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                지금 {capsules.length}개 캡슐 오픈 가능
              </motion.div>

              <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight">
                <SplitText text="열어봐야 아는" />
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.slate}, ${C.cornflower}, ${C.maya})` }}
                >
                  <SplitText text="짜릿한 순간" />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mx-auto mt-8 max-w-xl text-lg text-[#102e4a]/50 md:text-xl"
              >
                랜덤 캡슐 안에 숨겨진 상품을 만나보세요.
                아이패드부터 소소한 선물까지.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
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
                  className="rounded-full px-8 py-4 text-lg font-medium text-[#102e4a]/60 transition hover:text-[#715aff]"
                >
                  이미 계정이 있나요?
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Scroll indicator */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 12, 0] }}
            transition={{ opacity: { delay: 1.5 }, y: { repeat: Infinity, duration: 2 } }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-[#102e4a]/30">
              <span>scroll</span>
              <div className="h-8 w-[1px] bg-[#102e4a]/20" />
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
          {capsules.map((capsule) => (
            <TiltCard
              key={capsule.id}
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
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
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
                className="mt-4 leading-relaxed text-[#102e4a]/50"
              >
                모든 구매가 모여 피버 게이지를 채웁니다. 목표 금액에 도달하면 특별한 보상이 추첨됩니다!
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-3xl border border-[#715aff]/10 bg-gradient-to-br from-[#715aff]/5 to-[#55c1ff]/5 p-8"
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {reviews.map((review, i) => (
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
          <span>&copy; 2026 랜덤박스. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/login" className="transition hover:text-[#715aff]">로그인</Link>
            <Link href="/signup" className="transition hover:text-[#715aff]">회원가입</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
