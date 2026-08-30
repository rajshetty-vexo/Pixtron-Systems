import { useEffect, useState,type ReactElement } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/**
 * ProductSlideVisual
 * ------------------
 * Right-side hero panel: a looping "before / after" inspection demo.
 * A scanning beam sweeps over a defective subject on the left; a clean,
 * passing version of the same subject sits on the right and gets a
 * PASS badge once the beam has swept by. Fully SVG/CSS — no image assets.
 */

export type ProductSlideVisualProps = {
  /** e.g. "inspectra", "CodexQ", "panorama" — matched case-insensitively */
  productId: string;
};

type GraphicState = "defective" | "clean";

const BEAM_DURATION = 2.5; // seconds, matches the spec
const PASS_DELAY_MS = BEAM_DURATION * 500; // badge appears ~halfway through the sweep

/* ---------------------------------- */
/* Product-specific SVG illustrations */
/* ---------------------------------- */

function BarcodeGraphic({ state }: { state: GraphicState }) {
  const defective = state === "defective";
  const bars = [3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id="codexq-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <g
        transform="translate(10 12)"
        filter={defective ? "url(#codexq-blur)" : undefined}
        opacity={defective ? 0.55 : 1}
      >
        {bars.map((w, i) => {
          const x = bars.slice(0, i).reduce((a, b) => a + b + 1, 0);
          const jitter = defective ? (i % 3 === 0 ? 1.5 : 0) : 0;
          return (
            <rect
              key={i}
              x={x + jitter}
              y={0}
              width={w}
              height={38}
              rx={0.4}
              fill={defective ? "#1e293b" : "#0f172a"}
            />
          );
        })}
      </g>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontSize="7"
        letterSpacing={defective ? 1.2 : 0.5}
        fill={defective ? "#94a3b8" : "#334155"}
        fontFamily="ui-monospace, monospace"
      >
        {defective ? "0 4 · 1 ? 6 8" : "04 1968 22"}
      </text>
    </svg>
  );
}

function DotLabelGraphic({ state }: { state: GraphicState }) {
  const defective = state === "defective";
  const cols = 6;
  const rows = 6;
  // deterministic pseudo-random offsets so the smudge looks organic but stable
  const seed = (i: number) => Math.sin(i * 12.9898) * 43758.5453 % 1;

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id="inspectra-smudge" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <g filter={defective ? "url(#inspectra-smudge)" : undefined}>
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((__, c) => {
            const i = r * cols + c;
            const s = Math.abs(seed(i));
            const dx = defective ? (s - 0.5) * 6 : 0;
            const dy = defective ? (Math.abs(seed(i + 50)) - 0.5) * 6 : 0;
            const missing = defective && s > 0.85;
            const faint = defective && s > 0.6 && s <= 0.85;
            if (missing) return null;
            return (
              <circle
                key={i}
                cx={22 + c * 11.5 + dx}
                cy={22 + r * 11.5 + dy}
                r={3.1}
                fill={defective ? "#1e293b" : "#003985"}
                opacity={faint ? 0.35 : defective ? 0.7 : 1}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}

function BottleGraphic({ state }: { state: GraphicState }) {
  const defective = state === "defective";
  return (
    <svg viewBox="0 0 60 100" className="h-full w-full" aria-hidden="true">
      <path
        d="M24 4h12v10c0 2 2 3 4 5 3 2.5 4 5 4 10v58a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V29c0-5 1-7.5 4-10 2-2 4-3 4-5V4z"
        fill="#eef4ff"
        stroke="#003985"
        strokeWidth="2"
      />
      <rect x="18" y="52" width="24" height="20" rx="1.5" fill="#003985" opacity="0.9" />
      <rect x="20" y="58" width="20" height="2.5" fill="#fbbb0d" />

      {defective ? (
        <g>
          {/* blind-spot patch: an unscanned / obscured region */}
          <rect
            x="30"
            y="30"
            width="14"
            height="22"
            rx="3"
            fill="#f87171"
            opacity="0.35"
          />
          <rect
            x="30"
            y="30"
            width="14"
            height="22"
            rx="3"
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />
        </g>
      ) : (
        <g>
          {/* full-coverage highlight ring showing the whole surface was seen */}
          <rect
            x="15"
            y="27"
            width="30"
            height="28"
            rx="4"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.4"
            strokeDasharray="2.5 2"
            opacity="0.85"
          />
        </g>
      )}
    </svg>
  );
}

function GenericGraphic({ state }: { state: GraphicState }) {
  const defective = state === "defective";
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <rect
        x="15"
        y="15"
        width="70"
        height="70"
        rx="12"
        fill="#eef4ff"
        stroke="#003985"
        strokeWidth="2"
        opacity={defective ? 0.6 : 1}
      />
      <circle cx="50" cy="50" r="18" fill={defective ? "#94a3b8" : "#003985"} opacity={defective ? 0.5 : 0.9} />
    </svg>
  );
}

type ProductConfig = {
  label: string;
  Graphic: (p: { state: GraphicState }) => ReactElement;
};

const PRODUCTS: Record<string, ProductConfig> = {
  codexq: { label: "Barcode read", Graphic: BarcodeGraphic },
  inspectra: { label: "Dot-print label", Graphic: DotLabelGraphic },
  panorama: { label: "360° surface scan", Graphic: BottleGraphic },
};

/* ---------------------------------- */
/* Main component                     */
/* ---------------------------------- */

export function ProductSlideVisual({ productId }: ProductSlideVisualProps) {
  const prefersReducedMotion = useReducedMotion();
  const config = PRODUCTS[productId?.toLowerCase()] ?? {
    label: "Inspection",
    Graphic: GenericGraphic,
  };
  const { label, Graphic } = config;

  const [showPass, setShowPass] = useState(!!prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowPass(true);
      return;
    }

    let hideTimer: ReturnType<typeof setTimeout>;
    setShowPass(false);
    const showTimer1 = setTimeout(() => setShowPass(true), PASS_DELAY_MS);

    const interval = setInterval(() => {
      setShowPass(false);
      hideTimer = setTimeout(() => setShowPass(true), PASS_DELAY_MS);
    }, BEAM_DURATION * 1000);

    return () => {
      clearTimeout(showTimer1);
      clearTimeout(hideTimer);
      clearInterval(interval);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className="relative mx-auto aspect-square w-[240px] max-w-md rounded-[2rem] border border-slate-200 bg-gradient-to-br from-primary/5 via-slate-50 to-secondary/10 p-3 shadow-sm sm:w-full sm:p-5"
      role="img"
      aria-label={`${label} before-and-after inspection demo`}
    >
      <div className="relative grid h-full w-full grid-cols-2 gap-2 sm:gap-4">
        {/* BEFORE / defective panel */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 p-2 sm:p-3">
          <span
            className="absolute left-1.5 top-1.5 z-10 rounded-full bg-red-500 px-1.5 py-0.5 font-semibold text-white shadow-sm sm:left-2 sm:top-2"
            style={{ fontSize: "clamp(8px, 2.4vw, 11px)" }}
          >
            FAIL
          </span>
          <div className="h-[55%] w-[70%]">
            <Graphic state="defective" />
          </div>
        </div>

        {/* AFTER / clean panel */}
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 p-2 sm:p-3">
          <AnimatePresence>
            {showPass && (
              <motion.span
                key="pass-badge"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute right-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 font-semibold text-white shadow-sm sm:right-2 sm:top-2"
                style={{ fontSize: "clamp(8px, 2.4vw, 11px)" }}
              >
                <span aria-hidden="true">✓</span>
                <span>PASS</span>
              </motion.span>
            )}
          </AnimatePresence>
          <div className="h-[55%] w-[70%]">
            <Graphic state="clean" />
          </div>
        </div>

        {/* Scanning beam */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 z-20 w-[2px] sm:w-[3px]"
            style={{
              backgroundColor: "#fbbb0d",
              boxShadow: "0 0 10px 2px rgba(251,187,13,0.75), 0 0 22px 6px rgba(251,187,13,0.35)",
            }}
            initial={{ left: "0%" }}
            animate={{ left: ["0%", "100%"] }}
            transition={{
              duration: BEAM_DURATION,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </div>

      {/* Caption */}
      <div
        className="mt-2 truncate text-center font-medium text-slate-500 sm:mt-3"
        style={{ fontSize: "clamp(9px, 2.6vw, 12px)" }}
      >
        {label}
      </div>
    </div>
  );
}

export default ProductSlideVisual;