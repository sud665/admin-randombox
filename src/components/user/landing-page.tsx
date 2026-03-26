"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Capsule } from "@/types";
import {
  Gift,
  PackageOpen,
  RefreshCw,
  Crown,
  Sparkles,
  Heart,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useRef } from "react";

/* ─── Props ─── */
interface LandingPageProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: {
    content: string;
    rating: number;
    productName: string;
    nickname: string;
  }[];
}

/* ─── 색상 팔레트 ─── */
const PINK = "#F04EA3";
const PINK_LIGHT = "#FFB3C6";
const CYAN = "#90E0EF";
const SLATE = "#4A5568";
const GRAY = "#7A7A7A";
const BG_LIGHT = "#F8F9FA";

/* ─── 애니메이션 헬퍼 ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── 캡슐 카드 아이콘 매핑 ─── */
const capsuleIcons = [Crown, Gift, Sparkles, Heart];
function getCapsuleIcon(index: number) {
  return capsuleIcons[index % capsuleIcons.length];
}

/* ─── 스크롤 애니메이션 래퍼 ─── */
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export function LandingPage({
  capsules,
  feverPercentage,
  feverTarget,
  feverCurrent,
  reviews,
}: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen font-[Inter,sans-serif] bg-white text-[#4A4A4A]">
      {/* ─── Float 키프레임 CSS ─── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .animate-float { animation: float 3s ease-in-out infinite; }
            .animate-float-delayed { animation: float 3s ease-in-out infinite; animation-delay: 1.5s; }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #f1f1f1; }
            ::-webkit-scrollbar-thumb { background: #F04EA3; border-radius: 10px; }
            ::-webkit-scrollbar-thumb:hover { background: #D03E83; }
          `,
        }}
      />

      {/* ═══════════════ Header ═══════════════ */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-extrabold text-2xl tracking-tighter">
                RANDOM<span style={{ color: PINK }}>BOX</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-10">
              <a
                href="#how"
                className="text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3] transition-colors"
              >
                이용방법
              </a>
              <a
                href="#capsules"
                className="text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3] transition-colors"
              >
                박스목록
              </a>
              <a
                href="#fever"
                className="text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3] transition-colors"
              >
                피버
              </a>
              <a
                href="#reviews"
                className="text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3] transition-colors"
              >
                후기
              </a>
            </nav>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/login"
                className="text-[15px] font-bold text-[#7A7A7A]"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="text-[15px] font-bold bg-[#F04EA3] text-white px-6 py-2.5 rounded-full shadow-sm"
              >
                시작하기
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#7A7A7A]"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-4 space-y-3"
          >
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3]"
            >
              이용방법
            </a>
            <a
              href="#capsules"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3]"
            >
              박스목록
            </a>
            <a
              href="#fever"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3]"
            >
              피버
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[15px] font-bold text-[#7A7A7A] hover:text-[#F04EA3]"
            >
              후기
            </a>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <Link
                href="/login"
                className="block text-[15px] font-bold text-[#7A7A7A]"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="block text-[15px] font-bold bg-[#F04EA3] text-white px-6 py-2.5 rounded-full shadow-sm text-center"
              >
                시작하기
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════════════ Hero Section ═══════════════ */}
      <section className="relative h-[70dvh] min-h-[500px] w-full overflow-hidden bg-white">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://my.spline.design/interactivecubes-W9UkIQwhtgibR7TOuQEhfqgS/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="3D Background"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-white/30 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.05] mb-6"
            >
              두근두근 랜덤박스
              <br />
              <span style={{ color: PINK }}>RANDOM BOX</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-lg md:text-2xl font-bold text-gray-600 mb-8 max-w-2xl"
            >
              무엇이 나올지 모르는 설렘.
              <br />
              당신의 일상에 작은 기적을 선물하세요.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="pointer-events-auto"
            >
              <a
                href="#capsules"
                className="inline-flex items-center px-8 py-3.5 text-base font-bold rounded-full text-white bg-[#4A5568] shadow-xl hover:bg-[#2D3748] transition-colors"
              >
                박스 열어보기 <ArrowRight size={20} className="ml-2" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ How it works ═══════════════ */}
      <section id="how" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-10 md:mb-14">
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold mb-4 tracking-tighter">
                3단계로 즐기는 랜덤박스
              </h2>
              <p className="text-lg md:text-2xl text-[#7A7A7A] font-bold">
                원하는 박스를 선택하고, 행운을 시험해보세요.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div variants={fadeUp} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-[2rem] bg-[#FFF0F6] mb-6 flex flex-col items-center justify-center p-6 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-[#F04EA3]/5 to-[#F04EA3]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Gift size={50} className="text-[#F04EA3] animate-float" />
                  <h3 className="text-xl font-extrabold text-[#F04EA3] mt-2">
                    STEP 1
                  </h3>
                </div>
                <h4 className="text-xl font-extrabold mb-2">박스 구매</h4>
                <p className="text-[#7A7A7A]">
                  다양한 테마의 박스 중 원하는 박스를 구매하세요.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeUp} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-[2rem] bg-[#FFF0F5] mb-6 flex flex-col items-center justify-center p-6 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-[#FFB3C6]/5 to-[#FFB3C6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <PackageOpen
                    size={50}
                    className="text-[#FFB3C6] animate-float-delayed"
                  />
                  <h3 className="text-xl font-extrabold text-[#FFB3C6] mt-2">
                    STEP 2
                  </h3>
                </div>
                <h4 className="text-xl font-extrabold mb-2">박스 오픈</h4>
                <p className="text-[#7A7A7A]">
                  구매한 박스를 열어 당첨 상품을 바로 확인하세요.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeUp} className="group cursor-pointer">
                <div className="aspect-[16/10] rounded-[2rem] bg-[#F0FAFF] mb-6 flex flex-col items-center justify-center p-6 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-[#90E0EF]/5 to-[#90E0EF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <RefreshCw
                    size={50}
                    className="text-[#90E0EF] animate-float"
                  />
                  <h3 className="text-xl font-extrabold text-[#90E0EF] mt-2">
                    STEP 3
                  </h3>
                </div>
                <h4 className="text-xl font-extrabold mb-2">배송 또는 분해</h4>
                <p className="text-[#7A7A7A]">
                  상품을 배송받거나 포인트로 분해하세요.
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ Loved By You — Capsules Grid ═══════════════ */}
      <section
        id="capsules"
        className="py-16 md:py-24 bg-white border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-black mb-3 text-[#F04EA3]">
                Loved By You
              </h2>
              <p className="text-base md:text-lg text-[#7A7A7A] font-bold">
                당신이 사랑하는 가장 핫한 박스들
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
              {capsules.map((capsule, idx) => {
                const IconComp = getCapsuleIcon(idx);
                return (
                  <motion.div
                    key={capsule.id}
                    variants={fadeUp}
                    className="group"
                  >
                    <Link href={`/capsules/${capsule.id}`} className="block">
                      <div className="aspect-square rounded-2xl bg-[#F8F9FA] mb-3 overflow-hidden relative flex items-center justify-center">
                        {capsule.imageUrl ? (
                          <Image
                            src={capsule.imageUrl}
                            alt={capsule.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <IconComp
                            size={40}
                            className="text-[#F04EA3] opacity-40"
                          />
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold line-clamp-1">
                        {capsule.name}
                      </h3>
                      {capsule.description && (
                        <p className="text-xs text-[#7A7A7A] line-clamp-2 mt-0.5">
                          {capsule.description}
                        </p>
                      )}
                      <p className="text-sm font-extrabold text-[#F04EA3] mt-1">
                        {capsule.price.toLocaleString()}원
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ Fever Section ═══════════════ */}
      <section id="fever" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <motion.div variants={fadeUp} className="mb-8 md:mb-10">
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold mb-3 tracking-tighter">
                함께 채우는 피버 게이지
              </h2>
              <p className="text-lg md:text-2xl text-[#7A7A7A] font-bold">
                Community Fever
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative text-[#4A4A4A] flex flex-col lg:flex-row items-center justify-between"
            >
              {/* Left: Fever Info */}
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <div className="inline-block px-3 py-1 bg-[#F04EA3] text-white rounded-full text-[10px] font-extrabold mb-4">
                  EVENT
                </div>
                <h3 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                  게이지가 100% 차면
                  <br />
                  <span className="text-[#F04EA3]">피버 타임</span>이
                  시작됩니다!
                </h3>
                <div className="flex items-center space-x-4">
                  <span className="text-5xl md:text-6xl font-black text-[#F04EA3]">
                    {feverPercentage}%
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                      <motion.div
                        className="bg-[#F04EA3] h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${feverPercentage}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-[#7A7A7A]">
                      <span>현재 진행률</span>
                      <span>목표까지 {100 - feverPercentage}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Fever Stats Card */}
              <div className="w-full lg:w-1/3 bg-[#F8F9FA] rounded-[1.5rem] p-6 shadow-xl border border-white">
                <div className="space-y-3">
                  <div className="flex justify-between text-base">
                    <span className="text-[#7A7A7A] font-bold">목표 금액</span>
                    <span className="font-extrabold">
                      {feverTarget.toLocaleString()} P
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-[#7A7A7A] font-bold">현재 금액</span>
                    <span className="font-extrabold">
                      {feverCurrent.toLocaleString()} P
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ Reviews Section ═══════════════ */}
      {reviews.length > 0 && (
        <section
          id="reviews"
          className="py-16 md:py-24 bg-[#F8F9FA] border-t border-gray-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <motion.div variants={fadeUp} className="mb-8 md:mb-12">
                <h2 className="text-3xl md:text-[2.75rem] font-extrabold mb-3 tracking-tighter">
                  고객 후기
                </h2>
                <p className="text-lg md:text-2xl text-[#7A7A7A] font-bold">
                  리얼 유저들의 생생한 후기
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex space-x-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Sparkles
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "text-[#F04EA3]"
                                : "text-gray-200"
                            }
                            fill={i < review.rating ? PINK : "none"}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-xs font-bold text-[#7A7A7A]">
                        {review.productName}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A4A4A] mb-3 line-clamp-3">
                      {review.content}
                    </p>
                    <p className="text-xs font-bold text-[#7A7A7A]">
                      {review.nickname}
                    </p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ═══════════════ Footer ═══════════════ */}
      <footer className="bg-[#F8F9FA] text-[#7A7A7A] py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; 2026 RANDOM BOX Corp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
