/* ─── 랜덤박스 브랜드 로고 ─── */

const COLORS = {
  slate: "#715aff",
  cornflower: "#5887ff",
  maya: "#55c1ff",
} as const;

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const SIZES = {
  sm: { icon: 20, text: "text-sm", gap: "gap-1.5" },
  md: { icon: 26, text: "text-lg", gap: "gap-2" },
  lg: { icon: 36, text: "text-2xl", gap: "gap-2.5" },
} as const;

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const s = SIZES[size];

  return (
    <span className={`inline-flex items-center ${s.gap} ${className ?? ""}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor={COLORS.slate} />
            <stop offset="0.5" stopColor={COLORS.cornflower} />
            <stop offset="1" stopColor={COLORS.maya} />
          </linearGradient>
          <linearGradient id="lid-grad" x1="4" y1="10" x2="36" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor={COLORS.cornflower} />
            <stop offset="1" stopColor={COLORS.maya} />
          </linearGradient>
        </defs>

        {/* 상자 본체 */}
        <rect x="4" y="16" width="32" height="20" rx="4" fill="url(#logo-grad)" />

        {/* 세로 리본 */}
        <rect x="17.5" y="16" width="5" height="20" rx="0.5" fill="white" opacity="0.3" />

        {/* 가로 리본 */}
        <rect x="4" y="23" width="32" height="5" rx="0.5" fill="white" opacity="0.3" />

        {/* 뚜껑 */}
        <rect x="2" y="12" width="36" height="7" rx="3" fill="url(#lid-grad)" />

        {/* 리본 매듭 (좌) */}
        <ellipse cx="16" cy="10" rx="5" ry="6" transform="rotate(-12 16 10)" fill={COLORS.cornflower} />
        {/* 리본 매듭 (우) */}
        <ellipse cx="24" cy="10" rx="5" ry="6" transform="rotate(12 24 10)" fill={COLORS.cornflower} />
        {/* 매듭 센터 */}
        <circle cx="20" cy="12" r="3.5" fill={COLORS.maya} />

        {/* 물음표 (랜덤 느낌) */}
        <text
          x="20"
          y="32"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fill="white"
          opacity="0.85"
          fontFamily="system-ui, sans-serif"
        >
          ?
        </text>

        {/* 반짝임 */}
        <path d="M34 6l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill={COLORS.maya} opacity="0.8" />
        <path d="M8 4l0.7 1.3 1.3 0.7-1.3 0.7L8 8l-0.7-1.3L6 6l1.3-0.7z" fill={COLORS.slate} opacity="0.6" />
      </svg>

      {showText && (
        <span
          className={`${s.text} font-extrabold tracking-tight bg-clip-text text-transparent`}
          style={{
            backgroundImage: `linear-gradient(135deg, ${COLORS.slate}, ${COLORS.cornflower}, ${COLORS.maya})`,
          }}
        >
          RANDBOX
        </span>
      )}
    </span>
  );
}
