"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResultCard } from "@/components/user/result-card"
import type { Product, Grade } from "@/types"

interface CapsuleOpenAnimationProps {
  product: Product
  capsuleName: string
}

type Phase = "enter" | "idle" | "shake" | "open" | "result"

const gradeColors: Record<Grade, { primary: string; secondary: string; glow: string }> = {
  S: { primary: "#fbbf24", secondary: "#f59e0b", glow: "rgba(251,191,36,0.8)" },
  A: { primary: "#a855f7", secondary: "#7c3aed", glow: "rgba(168,85,247,0.8)" },
  B: { primary: "#3b82f6", secondary: "#2563eb", glow: "rgba(59,130,246,0.8)" },
  C: { primary: "#10b981", secondary: "#059669", glow: "rgba(16,185,129,0.8)" },
  D: { primary: "#e2e8f0", secondary: "#94a3b8", glow: "rgba(148,163,184,0.8)" },
}

// Particle component for background sparkles
function Particles({ count, color, intensity }: { count: number; color: string; intensity: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 2,
    }))
  }, [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * intensity,
            height: p.size * intensity,
            backgroundColor: color,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -30 * intensity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Radial burst on capsule open
function LightBurst({ color, glowColor }: { color: string; glowColor: string }) {
  const rays = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      angle: (360 / 16) * i,
      length: Math.random() * 120 + 180,
      width: Math.random() * 3 + 2,
      delay: Math.random() * 0.2,
    }))
  }, [])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.6] }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Central glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ backgroundColor: glowColor }}
        initial={{ width: 0, height: 0 }}
        animate={{ width: 500, height: 500, opacity: [1, 0] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      {/* Rays */}
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute"
          style={{
            width: ray.width,
            height: 0,
            backgroundColor: color,
            transformOrigin: "center bottom",
            transform: `rotate(${ray.angle}deg)`,
            borderRadius: 4,
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: ray.length, opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: ray.delay, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  )
}

// Confetti for high-grade results
function Confetti({ color }: { color: string }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      y: -(Math.random() * 400 + 100),
      rotation: Math.random() * 720 - 360,
      size: Math.random() * 8 + 4,
      color: i % 3 === 0 ? color : i % 3 === 1 ? "#ffffff" : "#fbbf24",
      delay: Math.random() * 0.5,
      duration: Math.random() * 1 + 1.5,
    }))
  }, [color])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 2,
          }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + 600],
            rotate: p.rotation,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration + 1,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

// Capsule SVG shape
function CapsuleSVG({ half, color }: { half?: "top" | "bottom"; color: string }) {
  if (half === "top") {
    return (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <defs>
          <linearGradient id="capTopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M10 80 L10 35 Q10 5 60 5 Q110 5 110 35 L110 80"
          fill="url(#capTopGrad)"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <ellipse cx="40" cy="35" rx="12" ry="6" fill="white" fillOpacity="0.25" />
      </svg>
    )
  }
  if (half === "bottom") {
    return (
      <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
        <defs>
          <linearGradient id="capBotGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M10 0 L10 45 Q10 75 60 75 Q110 75 110 45 L110 0"
          fill="url(#capBotGrad)"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
      </svg>
    )
  }

  return (
    <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
      <defs>
        <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
        <filter id="capShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={color} floodOpacity="0.5" />
        </filter>
      </defs>
      <path
        d="M10 80 L10 35 Q10 5 60 5 Q110 5 110 35 L110 80 L110 125 Q110 155 60 155 Q10 155 10 125 Z"
        fill="url(#capGrad)"
        filter="url(#capShadow)"
        stroke="white"
        strokeWidth="2"
        strokeOpacity="0.3"
      />
      {/* Divider line */}
      <line x1="8" y1="80" x2="112" y2="80" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
      {/* Highlight */}
      <ellipse cx="40" cy="40" rx="15" ry="8" fill="white" fillOpacity="0.2" />
      {/* ? mark */}
      <text x="60" y="95" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="32" fontWeight="bold">?</text>
    </svg>
  )
}

export function CapsuleOpenAnimation({ product, capsuleName }: CapsuleOpenAnimationProps) {
  const [phase, setPhase] = useState<Phase>("enter")
  const colors = gradeColors[product.grade]
  const isHighGrade = product.grade === "S" || product.grade === "A"

  const handleTap = useCallback(() => {
    if (phase === "idle") {
      setPhase("shake")
      // After shaking, open
      setTimeout(() => setPhase("open"), 1500)
      // After opening, show result
      setTimeout(() => setPhase("result"), 2500)
    }
  }, [phase])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
      onClick={handleTap}
    >
      {/* Background particles - always present, intensity varies */}
      <Particles
        count={phase === "shake" ? 40 : phase === "open" || phase === "result" ? 60 : 20}
        color={phase === "result" ? colors.primary : "#ffffff"}
        intensity={phase === "shake" ? 1.5 : phase === "open" ? 2.5 : 1}
      />

      {/* Background radial gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background:
            phase === "result"
              ? `radial-gradient(circle at center, ${colors.glow.replace("0.8", "0.15")} 0%, transparent 70%)`
              : "radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
        transition={{ duration: 1 }}
      />

      {/* Capsule name */}
      <AnimatePresence>
        {(phase === "enter" || phase === "idle" || phase === "shake") && (
          <motion.p
            className="absolute top-[15%] text-lg font-bold text-white/70"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
          >
            {capsuleName}
          </motion.p>
        )}
      </AnimatePresence>

      {/* PHASE 1+2: Capsule entrance + idle */}
      <AnimatePresence>
        {(phase === "enter" || phase === "idle") && (
          <motion.div
            className="relative cursor-pointer"
            initial={{ scale: 0, rotate: -10 }}
            animate={{
              scale: 1,
              rotate: 0,
              y: phase === "idle" ? [0, -12, 0] : 0,
            }}
            transition={
              phase === "idle"
                ? { y: { duration: 2, repeat: Infinity, ease: "easeInOut" }, scale: { type: "spring", stiffness: 300, damping: 15 } }
                : { type: "spring", stiffness: 300, damping: 15 }
            }
            onAnimationComplete={() => {
              if (phase === "enter") setPhase("idle")
            }}
            style={{ filter: `drop-shadow(0 0 40px ${colors.glow})` }}
          >
            <CapsuleSVG color={colors.primary} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 3: Shake */}
      <AnimatePresence>
        {phase === "shake" && (
          <motion.div
            className="relative"
            animate={{
              rotate: [0, -15, 15, -15, 15, -18, 18, -20, 20, -22, 22, 0],
              scale: [1, 1.02, 1.02, 1.04, 1.04, 1.06, 1.06, 1.08, 1.08, 1.1, 1.1, 1.15],
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            exit={{ scale: 1.2, opacity: 0 }}
            style={{ filter: `drop-shadow(0 0 60px ${colors.glow})` }}
          >
            <CapsuleSVG color={colors.primary} />
            {/* Pulsing glow ring */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-full"
              style={{ border: `2px solid ${colors.primary}` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 4: Open */}
      <AnimatePresence>
        {phase === "open" && (
          <>
            <LightBurst color={colors.primary} glowColor={colors.glow} />
            {/* Top half */}
            <motion.div
              className="absolute"
              style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -160, opacity: 0, rotate: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CapsuleSVG half="top" color={colors.primary} />
            </motion.div>
            {/* Bottom half */}
            <motion.div
              className="absolute"
              style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 160, opacity: 0, rotate: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <CapsuleSVG half="bottom" color={colors.primary} />
            </motion.div>
            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{ backgroundColor: colors.primary }}
              initial={{ width: 10, height: 10, opacity: 1 }}
              animate={{ width: 800, height: 800, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* PHASE 5: Result */}
      <AnimatePresence>
        {phase === "result" && (
          <>
            {/* Confetti for S/A grades */}
            {isHighGrade && <Confetti color={colors.primary} />}

            {/* Congratulations text */}
            <motion.div
              className="absolute top-[10%] flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.p
                className="text-2xl font-black"
                style={{ color: colors.primary }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                축하합니다!
              </motion.p>
              <p className="text-sm text-white/50">
                {product.grade}급 상품에 당첨되었습니다
              </p>
            </motion.div>

            {/* Result card */}
            <motion.div
              className="z-10 mt-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            >
              <ResultCard product={product} />
            </motion.div>

            {/* Orbiting sparkles for high grades */}
            {isHighGrade && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-2 w-2 rounded-full"
                    style={{ backgroundColor: i % 2 === 0 ? colors.primary : "#ffffff" }}
                    animate={{
                      x: Math.cos((i / 8) * Math.PI * 2) * 180,
                      y: Math.sin((i / 8) * Math.PI * 2) * 180,
                      opacity: [0.3, 1, 0.3],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Tap prompt */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.p
            className="absolute bottom-[20%] text-base font-medium text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            탭하여 캡슐을 열어보세요
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
