"use client";

import { motion } from "framer-motion";

interface CapsuleIllustrationProps {
  variant: "premium" | "standard" | "light" | "season";
  className?: string;
}

const variants = {
  premium: {
    bg: "from-amber-400 via-yellow-300 to-orange-500",
    capsuleTop: "#f59e0b",
    capsuleBottom: "#d97706",
    capsuleHighlight: "#fbbf24",
    sparkleColor: "#fef3c7",
    label: "PREMIUM",
    labelColor: "#92400e",
  },
  standard: {
    bg: "from-violet-500 via-purple-400 to-indigo-600",
    capsuleTop: "#8b5cf6",
    capsuleBottom: "#6d28d9",
    capsuleHighlight: "#a78bfa",
    sparkleColor: "#ede9fe",
    label: "STANDARD",
    labelColor: "#4c1d95",
  },
  light: {
    bg: "from-cyan-400 via-sky-300 to-blue-500",
    capsuleTop: "#22d3ee",
    capsuleBottom: "#0891b2",
    capsuleHighlight: "#67e8f9",
    sparkleColor: "#ecfeff",
    label: "LIGHT",
    labelColor: "#164e63",
  },
  season: {
    bg: "from-rose-500 via-pink-400 to-fuchsia-600",
    capsuleTop: "#f43f5e",
    capsuleBottom: "#be123c",
    capsuleHighlight: "#fb7185",
    sparkleColor: "#ffe4e6",
    label: "SEASON",
    labelColor: "#881337",
  },
};

export function CapsuleIllustration({
  variant,
  className = "",
}: CapsuleIllustrationProps) {
  const v = variants[variant];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${v.bg} overflow-hidden ${className}`}
    >
      {/* Background particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            backgroundColor: v.sparkleColor,
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            opacity: 0.4 + Math.random() * 0.4,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Capsule SVG */}
      <motion.svg
        viewBox="0 0 120 160"
        className="relative z-10 w-[55%] drop-shadow-lg"
        initial={{ y: 5 }}
        animate={{ y: -5 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Shadow */}
        <ellipse cx="60" cy="155" rx="30" ry="4" fill="black" opacity="0.15" />

        {/* Capsule body - bottom half */}
        <path
          d="M30,80 L30,120 Q30,145 60,145 Q90,145 90,120 L90,80 Z"
          fill={v.capsuleBottom}
        />
        {/* Bottom half shine */}
        <path
          d="M38,80 L38,118 Q38,138 60,138 Q68,138 73,133"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.15"
        />

        {/* Divider line */}
        <rect x="28" y="76" width="64" height="8" rx="4" fill="white" opacity="0.3" />

        {/* Capsule body - top half */}
        <path
          d="M30,80 L30,40 Q30,15 60,15 Q90,15 90,40 L90,80 Z"
          fill={v.capsuleTop}
        />

        {/* Top half highlight */}
        <path
          d="M42,25 Q55,18 68,25"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Main shine reflection */}
        <ellipse
          cx="48"
          cy="50"
          rx="8"
          ry="18"
          fill={v.capsuleHighlight}
          opacity="0.4"
          transform="rotate(-15, 48, 50)"
        />

        {/* Small shine dot */}
        <circle cx="44" cy="35" r="3" fill="white" opacity="0.6" />

        {/* Star decoration on capsule */}
        <g transform="translate(60, 60)" opacity="0.9">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <path
              d="M0,-8 L2,-2 L8,-2 L3,2 L5,8 L0,4 L-5,8 L-3,2 L-8,-2 L-2,-2 Z"
              fill="white"
              opacity="0.8"
            />
          </motion.g>
        </g>

        {/* Label text */}
        <text
          x="60"
          y="115"
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill="white"
          opacity="0.9"
          letterSpacing="1"
        >
          {v.label}
        </text>
      </motion.svg>

      {/* Corner sparkle effects */}
      <motion.div
        className="absolute right-3 top-3"
        animate={{ rotate: 180, scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M8,0 L9.5,6.5 L16,8 L9.5,9.5 L8,16 L6.5,9.5 L0,8 L6.5,6.5 Z"
            fill={v.sparkleColor}
            opacity="0.7"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-4 left-3"
        animate={{ rotate: -180, scale: [1, 1.3, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 16 16">
          <path
            d="M8,0 L9.5,6.5 L16,8 L9.5,9.5 L8,16 L6.5,9.5 L0,8 L6.5,6.5 Z"
            fill={v.sparkleColor}
            opacity="0.5"
          />
        </svg>
      </motion.div>
    </div>
  );
}

/** capsule id → variant mapping */
export function getCapsuleVariant(
  capsuleId: string
): CapsuleIllustrationProps["variant"] {
  const map: Record<string, CapsuleIllustrationProps["variant"]> = {
    "cap-1": "premium",
    "cap-2": "standard",
    "cap-3": "light",
    "cap-4": "season",
  };
  return map[capsuleId] ?? "standard";
}
