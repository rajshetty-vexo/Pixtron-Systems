import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { VisionGraphic } from '../components/VisionGraphic';

const B_MODES_SOURCE = [
  { id: 'geometry', label: 'GEOMETRY & COLOR', details: 'OPUS SERIES', object: 'shape' },
  { id: 'ocr', label: 'DOT PRINT / OCR', details: 'Codex SERIES', object: 'code' },
  { id: 'cable', label: 'CABLE & WIRE', details: 'RAPID SERIES', object: 'wire' },
  { id: 'packaging', label: 'TETRA BRIK', details: 'INSPECTRA SERIES', object: 'brik' },
];

const VISIONGRAPHIC_STEP_MS = 4000;
const PHASE_A_TOTAL_MS = B_MODES_SOURCE.length * VISIONGRAPHIC_STEP_MS;

const BEAM_DURATION = 2.5;
const PASS_DELAY_MS = BEAM_DURATION * 500;
const PHASE_B_STEP_MS = 5000;
const PHASE_B_TOTAL_MS = B_MODES_SOURCE.length * PHASE_B_STEP_MS;
/* ============================================================
   PHASE B — Before/After "blurry → clean + PASS" per product
============================================================ */

type ObjectKind = 'shape' | 'code' | 'wire' | 'brik';

function BarcodeGraphic({ state }: { state: 'defective' | 'clean' }) {
  const defective = state === 'defective';
  const bars = [3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3];
  return (
    <svg viewBox="0 0 100 70" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id="ba-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      <g transform="translate(10 12)" filter={defective ? 'url(#ba-blur)' : undefined} opacity={defective ? 0.55 : 1}>
        {bars.map((w, i) => {
          const x = bars.slice(0, i).reduce((a, b) => a + b + 1, 0);
          const jitter = defective ? (i % 3 === 0 ? 1.5 : 0) : 0;
          return <rect key={i} x={x + jitter} y={0} width={w} height={38} rx={0.4} fill={defective ? '#1e293b' : '#0f172a'} />;
        })}
      </g>
    </svg>
  );
}

function DotLabelGraphic({ state }: { state: 'defective' | 'clean' }) {
  const defective = state === 'defective';
  const cols = 6, rows = 6;
  const seed = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <filter id="ba-smudge" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      <g filter={defective ? 'url(#ba-smudge)' : undefined}>
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
              <circle key={i} cx={22 + c * 11.5 + dx} cy={22 + r * 11.5 + dy} r={3.1}
                fill={defective ? '#1e293b' : '#003985'} opacity={faint ? 0.35 : defective ? 0.7 : 1} />
            );
          })
        )}
      </g>
    </svg>
  );
}

function WireGraphic({ state }: { state: 'defective' | 'clean' }) {
  const defective = state === 'defective';
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full" aria-hidden="true">
      <rect x="4" y="14" width="92" height="12" rx="6" fill={defective ? '#94a3b8' : '#1e293b'} opacity={defective ? 0.5 : 1} />
      {defective && <rect x="40" y="10" width="10" height="20" rx="2" fill="#f87171" opacity="0.5" />}
      {!defective && <circle cx="45" cy="20" r="3" fill="#22c55e" />}
    </svg>
  );
}

function BrikGraphic({ state }: { state: 'defective' | 'clean' }) {
  const defective = state === 'defective';
  return (
    <svg viewBox="0 0 60 90" className="h-full w-full" aria-hidden="true">
      <rect x="8" y="6" width="44" height="78" rx="4" fill="#eef4ff" stroke="#003985" strokeWidth="2" opacity={defective ? 0.6 : 1} />
      <rect x="16" y="20" width="28" height="12" fill={defective ? '#94a3b8' : '#003985'} opacity={defective ? 0.5 : 0.85} />
      {defective ? (
        <rect x="16" y="45" width="28" height="10" rx="2" fill="#f87171" opacity="0.4" stroke="#ef4444" strokeDasharray="2 2" />
      ) : (
        <rect x="14" y="43" width="32" height="14" rx="3" fill="none" stroke="#22c55e" strokeDasharray="2 2" />
      )}
    </svg>
  );
}

const B_GRAPHIC: Record<ObjectKind, (p: { state: 'defective' | 'clean' }) => React.ReactElement> = {
  code: BarcodeGraphic,
  shape: DotLabelGraphic,
  wire: WireGraphic,
  brik: BrikGraphic,
};

const B_MODES: { id: string; label: string; details: string; object: ObjectKind }[] = B_MODES_SOURCE.map((m) => ({
  id: m.id,
  label: m.label,
  details: m.details,
  object: m.object as ObjectKind,
}));

function PhaseB() {
  const [idx, setIdx] = useState(0);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setIdx(0);
    const productTimer = setInterval(() => {
      setIdx((prev) => (prev + 1) % B_MODES.length);
    }, PHASE_B_STEP_MS);
    return () => clearInterval(productTimer);
  }, []);

  useEffect(() => {
    setShowPass(false);
    const showT = setTimeout(() => setShowPass(true), PASS_DELAY_MS);
    const loopT = setInterval(() => {
      setShowPass(false);
      setTimeout(() => setShowPass(true), PASS_DELAY_MS);
    }, BEAM_DURATION * 1000);
    return () => {
      clearTimeout(showT);
      clearInterval(loopT);
    };
  }, [idx]);

  const mode = B_MODES[idx];
  const Graphic = B_GRAPHIC[mode.object];

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] rounded-[2rem] border border-slate-200 bg-gradient-to-br from-primary/5 via-slate-50 to-secondary/10 p-4 sm:p-5 shadow-sm"
      role="img"
      aria-label={`${mode.details} before-and-after inspection demo`}
    >
      <div className="relative grid h-[calc(100%-28px)] w-full grid-cols-2 gap-3 sm:gap-5">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 p-3">
          <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm">
            FAIL
          </span>
          <div className="h-[55%] w-[70%]">
            <Graphic state="defective" />
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/70 bg-white/50 p-3">
          <AnimatePresence>
            {showPass && (
              <motion.span
                key={mode.id + '-pass'}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-sm"
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

        <motion.div
          key={mode.id + '-beam'}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-[2px] sm:w-[3px]"
          style={{
            backgroundColor: '#fbbb0d',
            boxShadow: '0 0 10px 2px rgba(251,187,13,0.75), 0 0 22px 6px rgba(251,187,13,0.35)',
          }}
          initial={{ left: '0%' }}
          animate={{ left: ['0%', '100%'] }}
          transition={{ duration: BEAM_DURATION, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="mt-3 truncate text-center text-xs sm:text-sm font-bold text-primary">
        {mode.details} — {mode.label}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN — Phase A (embedded VisionGraphic) → Phase B → back to A, forever
============================================================ */

export const HeroInspectionShowcase: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<'A' | 'B'>('A');

  useEffect(() => {
    if (prefersReducedMotion) return;
    const duration = phase === 'A' ? PHASE_A_TOTAL_MS : PHASE_B_TOTAL_MS;
    const timer = setTimeout(() => {
      setPhase((prev) => (prev === 'A' ? 'B' : 'A'));
    }, duration);
    return () => clearTimeout(timer);
  }, [phase, prefersReducedMotion]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="w-full flex justify-center lg:justify-end">
        {phase === 'A' ? <VisionGraphic /> : <PhaseB />}
      </motion.div>
    </AnimatePresence>
  );
};

export default HeroInspectionShowcase;