"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Capsule } from "@/types";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

interface LandingPageProps {
  capsules: Capsule[];
  feverPercentage: number;
  feverTarget: number;
  feverCurrent: number;
  reviews: { content: string; rating: number; productName: string; nickname: string }[];
}

export function LandingPage({ capsules, feverPercentage, feverTarget, feverCurrent, reviews }: LandingPageProps) {
  return (
    <div className="bg-zinc-950 text-white">
      {/* ===== Hero Section ===== */}
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

      {/* ===== 서비스 소개 섹션 ===== */}
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
                <p className="mt-3 leading-relaxed text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 캡슐 쇼케이스 섹션 ===== */}
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
                  {capsule.imageUrl ? (
                    <Image
                      src={capsule.imageUrl}
                      alt={capsule.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-5xl">
                      🎲
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold">{capsule.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{capsule.description}</p>
                  <p className="mt-3 text-xl font-bold text-amber-400">
                    ₩{capsule.price.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 피버 게이지 섹션 ===== */}
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
            className="mt-4 text-lg text-zinc-400"
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
            <div className="mx-auto mt-4 flex max-w-lg justify-between text-sm text-zinc-400">
              <span>₩{feverCurrent.toLocaleString()}</span>
              <span className="font-bold text-amber-400">{feverPercentage}%</span>
              <span>₩{feverTarget.toLocaleString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== 명예의 전당 섹션 ===== */}
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
                <p className="mt-3 leading-relaxed text-zinc-300">{review.content}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
                  <span>{review.nickname}</span>
                  <span className="font-medium text-zinc-400">{review.productName}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA 섹션 ===== */}
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

      {/* ===== Footer ===== */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
          <span>&copy; 2026 랜덤박스. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/login" className="transition hover:text-zinc-300">로그인</Link>
            <Link href="/signup" className="transition hover:text-zinc-300">회원가입</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
