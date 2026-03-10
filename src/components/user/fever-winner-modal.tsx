"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeverStore } from "@/stores/fever-store";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Confetti particle component
function ConfettiParticle({ index }: { index: number }) {
  const style = useMemo(() => {
    const colors = [
      "#ff0000",
      "#ff6600",
      "#ffcc00",
      "#33cc33",
      "#3399ff",
      "#9933ff",
      "#ff33cc",
      "#ff9933",
    ];
    const color = colors[index % colors.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 2;
    const duration = 2 + Math.random() * 3;
    const size = 6 + Math.random() * 8;
    const rotate = Math.random() * 720 - 360;

    return { color, left, delay, duration, size, rotate };
  }, [index]);

  return (
    <motion.div
      className="pointer-events-none absolute top-0"
      style={{
        left: `${style.left}%`,
        width: style.size,
        height: style.size,
        backgroundColor: style.color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      }}
      initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: "100vh",
        opacity: [1, 1, 0],
        rotate: style.rotate,
        scale: [1, 1, 0.5],
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: style.duration,
        delay: style.delay,
        ease: "easeIn",
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
      }}
    />
  );
}

export function FeverWinnerModal() {
  const { isFeverTriggered, rewardProduct, dismissFever, reset } =
    useFeverStore();
  const [showProduct, setShowProduct] = useState(false);

  useEffect(() => {
    if (isFeverTriggered) {
      setShowProduct(false);
      const timer = setTimeout(() => setShowProduct(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [isFeverTriggered]);

  const handleClose = () => {
    dismissFever();
    reset();
    setShowProduct(false);
  };

  const gradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "from-amber-400 to-yellow-300 text-amber-900 shadow-amber-300/50";
      case "A":
        return "from-violet-500 to-purple-400 text-white shadow-violet-400/50";
      case "B":
        return "from-blue-500 to-cyan-400 text-white shadow-blue-400/50";
      default:
        return "from-gray-400 to-gray-300 text-gray-800 shadow-gray-300/50";
    }
  };

  return (
    <AnimatePresence>
      {isFeverTriggered && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Dark overlay with radial glow */}
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Radial glow effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255, 165, 0, 0.15) 0%, transparent 60%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 mx-4 w-full max-w-sm">
            {/* FEVER Text */}
            <motion.div
              className="mb-6 text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 100,
                delay: 0.2,
              }}
            >
              <motion.h1
                className="text-6xl font-black tracking-wider"
                style={{
                  background:
                    "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #fbbf24)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                FEVER!
              </motion.h1>
              <motion.p
                className="mt-2 text-lg font-bold text-amber-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                축하합니다! 피버 보상 당첨!
              </motion.p>
            </motion.div>

            {/* Product Card */}
            <AnimatePresence>
              {showProduct && rewardProduct && (
                <motion.div
                  className="overflow-hidden rounded-2xl border border-amber-400/30 bg-white/95 shadow-2xl shadow-amber-500/20 backdrop-blur-sm"
                  initial={{ scale: 0, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 100,
                  }}
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                    {rewardProduct.imageUrl ? (
                      <Image
                        src={rewardProduct.imageUrl}
                        alt={rewardProduct.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl">
                        🎁
                      </div>
                    )}
                    {/* Grade badge */}
                    <motion.div
                      className={`absolute right-3 top-3 rounded-full bg-gradient-to-r px-3 py-1 text-sm font-black shadow-lg ${gradeColor(rewardProduct.grade)}`}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(251, 191, 36, 0.3)",
                          "0 0 25px rgba(251, 191, 36, 0.6)",
                          "0 0 10px rgba(251, 191, 36, 0.3)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {rewardProduct.grade}급
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold text-foreground">
                      {rewardProduct.name}
                    </h3>
                    {rewardProduct.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {rewardProduct.description}
                      </p>
                    )}
                    <motion.p
                      className="mt-2 text-xl font-black text-amber-600"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      시장가 ₩{rewardProduct.marketPrice.toLocaleString()}
                    </motion.p>
                  </div>

                  {/* Close button */}
                  <div className="px-5 pb-5">
                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-6 text-base font-bold text-white shadow-lg shadow-amber-300/30 hover:from-amber-600 hover:to-orange-600"
                      onClick={handleClose}
                    >
                      확인
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
