
/**
 * InspectraAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated product hero for PIXTRON INSPECTRA (Dot Print Inspection).
 *
 * Extracted from the INSPECTRA brochure:
 *  - AI-powered machine vision for dot print & seal integrity inspection.
 *  - Handles conveyor feeds up to 2500 FPS with instant rejection.
 *  - Verifies batch numbers / expiry dates via OCR & OCV (printed dot-matrix
 *    text — NOT barcodes/QR, that's Codex's job).
 *  - Detects: print smudging, missing dots, seal gaps, micro-tears.
 *  - Used on cylindrical packaging (vials, bottles, cans, sachets).
 *
 * Same battle-tested architecture as CodexAnimation.tsx:
 *  - GSAP-driven conveyor/camera/inspection animation, continuous motion
 *    (no belt pausing), fast strobe flash timed to the product passing
 *    under the camera.
 *  - Container-query responsive (works inside any frame width, not just
 *    viewport width) — no fixed pixel overlays.
 *  - `variant="compact"` drops straight into an existing image/video slot
 *    (e.g. ProductDetailPage) without a fixed aspect-ratio, so it never
 *    clips on mobile or grows a stray scrollbar on desktop.
 *  - Live metrics strip fills the empty space under the stage (desktop
 *    only, auto-hidden on narrow frames).
 *  - Pauses spawning + clears stale product elements on tab visibility
 *    change, so returning to a backgrounded tab never dumps overlapping
 *    products.
 *  - Respects prefers-reduced-motion, unique ids via useId (multi-instance
 *    safe).
 *
 * Usage:
 *   npm install gsap
 *   import InspectraAnimation from "./InspectraAnimation";
 *   <InspectraAnimation brochureHref="/brochures/inspectra-spec-sheet.pdf" />
 *   // or, dropped into an existing media frame:
 *   <InspectraAnimation variant="compact" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   TYPES
============================================================ */

type DefectType = "missing" | "smudge" | "contrast" | "misalign";

interface Product {
  brand: string;
  lot: string;
  mfg: string;
  exp: string;
}

export interface InspectraAnimationProps {
  /** Optional link for the "Download Brochure" button. If omitted, the button is hidden. */
  brochureHref?: string;
  /** Extra class name on the outer wrapper. */
  className?: string;
  /**
   * "full"    - standalone hero section with its own title, description, CTA (default).
   * "compact" - just the live machine + software panel, sized to fill its parent
   *             (use this when dropping the animation into an existing image/video
   *             slot such as a ProductDetailPage media frame).
   */
  variant?: "full" | "compact";
}

/* ============================================================
   DATA POOLS (used only client-side, after mount)
============================================================ */

const BRANDS = ["PULMOCARE", "CARDIOSAFE", "AQUAPURE", "NUTRIGO", "MEDIVEX"];
const DEFECT_LABELS: Record<DefectType, string> = {
  missing: "MISSING DOTS",
  smudge: "PRINT SMUDGE",
  contrast: "LOW CONTRAST",
  misalign: "MISALIGNED PRINT",
};
const DEFECT_TYPES: DefectType[] = ["missing", "smudge", "contrast", "misalign"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function randomProduct(): Product {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const lot = Math.floor(4000 + Math.random() * 5900) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const d = new Date();
  const mfg = `${pad(d.getMonth() + 1)}/${(d.getFullYear() - 1).toString().slice(2)}`;
  const exp = `${pad(d.getMonth() + 1)}/${(d.getFullYear() + 2).toString().slice(2)}`;
  return { brand, lot, mfg, exp };
}

/* ============================================================
   DOT-MATRIX FONT (3x5) + SVG BUILD HELPERS (imperative, client-only)
============================================================ */

const SVG_NS = "http://www.w3.org/2000/svg";

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {}
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
  return node;
}

const DOT_FONT: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"],
  "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"],
  "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"],
  "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"],
  "7": ["111", "001", "010", "010", "010"],
  "8": ["111", "101", "111", "101", "111"],
  "9": ["111", "101", "111", "001", "111"],
  A: ["010", "101", "111", "101", "101"],
  B: ["110", "101", "110", "101", "110"],
  C: ["011", "100", "100", "100", "011"],
  E: ["111", "100", "111", "100", "111"],
  G: ["011", "100", "101", "101", "011"],
  H: ["101", "101", "111", "101", "101"],
  L: ["100", "100", "100", "100", "111"],
  O: ["010", "101", "101", "101", "010"],
  P: ["110", "101", "110", "100", "100"],
  T: ["111", "010", "010", "010", "010"],
  X: ["101", "101", "010", "101", "101"],
  "/": ["001", "001", "010", "100", "100"],
  "-": ["000", "000", "111", "000", "000"],
  ":": ["000", "010", "000", "010", "000"],
  " ": ["000", "000", "000", "000", "000"],
};

function renderDotText(text: string, dot: number, gap: number, defect: DefectType | null): SVGGElement {
  const g = el("g", { class: "isp-dottext" });
  const misalign = defect === "misalign";
  let cx = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toUpperCase();
    const pattern = DOT_FONT[ch] || DOT_FONT[" "];
    const yOff = misalign ? Math.random() * 3.4 - 1.7 : 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        if (pattern[r][c] !== "1") continue;
        if (defect === "missing" && Math.random() < 0.24) continue;
        const px = cx + c * dot;
        const py = r * dot + yOff;
        let opacity = 1;
        if (defect === "contrast") opacity = 0.32;
        if (defect === "smudge" && Math.random() < 0.35) opacity = 0.45;
        const dotEl = el("circle", {
          cx: px.toFixed(1),
          cy: py.toFixed(1),
          r: (dot * 0.42).toFixed(2),
          class: "isp-dot",
        });
        dotEl.style.opacity = String(opacity);
        g.appendChild(dotEl);
        if (defect === "smudge" && Math.random() < 0.3) {
          g.appendChild(
            el("circle", {
              cx: (px + (Math.random() * 1.6 - 0.8)).toFixed(1),
              cy: (py + (Math.random() * 1.6 - 0.8)).toFixed(1),
              r: (dot * 0.62).toFixed(2),
              class: "isp-dot-smear",
            })
          );
        }
      }
    }
    cx += 3 * dot + gap;
  }
  return g;
}

function buildBottle(product: Product, defect: DefectType | null): SVGGElement {
  const g = el("g", { class: "isp-bottle" });

  g.appendChild(el("ellipse", { cx: 34, cy: 96, rx: 32, ry: 6, class: "isp-bottle-shadow" }));

  // Real vial silhouette: narrow neck -> curved shoulder -> straight
  // cylindrical body -> rounded bottom, all as one smooth path instead of
  // stacked rectangles.
  const bodyPath =
    "M 27,0 L 41,0 L 41,15 " +
    "C 41,15 54,19 59,31 C 62,38 62,38 62,38 " +
    "L 62,79 C 62,87 56,92 48,92 " +
    "L 20,92 C 12,92 6,87 6,79 " +
    "L 6,38 C 6,38 6,38 9,31 " +
    "C 14,19 27,15 27,15 Z";
  g.appendChild(el("path", { d: bodyPath, class: "isp-glass" }));

  // cap
  g.appendChild(el("rect", { x: 23, y: -12, width: 22, height: 13, rx: 3, class: "isp-cap" }));
  g.appendChild(el("rect", { x: 23, y: -3, width: 22, height: 3, class: "isp-cap-ring" }));

  // glass shine
  g.appendChild(el("path", { d: "M 12,42 C 12,42 11,60 12,76", class: "isp-glass-highlight" }));

  // dot-print label band, wrapped around the straight body section
  g.appendChild(el("rect", { x: 10, y: 44, width: 48, height: 32, rx: 3, class: "isp-print-area" }));

  const line1 = renderDotText(`LOT ${product.lot}`, 1.4, 0.75, defect);
  line1.setAttribute("transform", "translate(13,51)");
  g.appendChild(line1);

  const line2 = renderDotText(`EXP ${product.exp}`, 1.4, 0.75, defect);
  line2.setAttribute("transform", "translate(13,64)");
  g.appendChild(line2);

  // pass/fail badge (hidden until result phase)
  const badge = el("g", { class: "isp-badge", opacity: 0 });
  badge.appendChild(el("circle", { cx: 55, cy: 6, r: 9, class: "isp-badge-bg" }));
  const mark = el("path", { d: "M 51 6 L 54 9 L 60 2", class: "isp-badge-mark" });
  badge.appendChild(mark);
  g.appendChild(badge);
  (g as any)._badgeGroup = badge;
  (g as any)._badgeMark = mark;

  return g;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function InspectraAnimation({ brochureHref, className, variant = "full" }: InspectraAnimationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const productsGroupRef = useRef<SVGGElement | null>(null);
  const cameraRingRef = useRef<SVGCircleElement | null>(null);
  const beamRef = useRef<SVGPolygonElement | null>(null);
  const scanLineRef = useRef<SVGLineElement | null>(null);
  const sensorLedRef = useRef<SVGCircleElement | null>(null);
  const sensorBeamRef = useRef<SVGLineElement | null>(null);
  const rejectHeadRef = useRef<SVGRectElement | null>(null);
  const rejectFlashRef = useRef<SVGCircleElement | null>(null);
  const rollersRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setText = (role: string, text: string) => {
      root.querySelectorAll<HTMLElement>(`[data-role="${role}"]`).forEach((n) => (n.textContent = text));
    };
    const setColor = (role: string, colorVar: string) => {
      root.querySelectorAll<HTMLElement>(`[data-role="${role}"]`).forEach((n) => {
        n.style.color = colorVar;
      });
    };

    const counts = { read: 0, rejected: 0 };

    const updateStats = () => {
      setText("statRead", counts.read.toLocaleString());
      setText("statRejected", counts.rejected.toLocaleString());
      const rate = counts.read === 0 ? "100.0" : (100 - (counts.rejected / counts.read) * 100).toFixed(1);
      setText("statRate", rate + "%");
    };

    const pulseSensor = () => {
      if (!sensorBeamRef.current || !sensorLedRef.current) return;
      gsap.to(sensorBeamRef.current, { opacity: 1, duration: 0.08, yoyo: true, repeat: 1 });
      gsap.to(sensorLedRef.current, {
        attr: { fill: "#FFD400" },
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        onComplete: () => sensorLedRef.current?.setAttribute("fill", "#FF3348"),
      });
    };

    const rejectPulse = () => {
      if (rejectHeadRef.current) {
        gsap
          .timeline()
          .to(rejectHeadRef.current, { x: -14, duration: 0.09, ease: "power2.in" })
          .to(rejectHeadRef.current, { x: 0, duration: 0.2, ease: "power2.out" });
      }
      if (rejectFlashRef.current) {
        gsap.fromTo(rejectFlashRef.current, { opacity: 0.85 }, { opacity: 0, duration: 0.5 });
      }
    };

    const updatePanel = (product: Product, defect: DefectType | null) => {
      const faulty = !!defect;
      setText("printedText", `LOT ${product.lot}  /  EXP ${product.exp}`);
      setText("lotValue", product.lot + (faulty ? "" : " \u2713"));
      setText("mfgValue", product.mfg + (faulty ? "" : " \u2713"));
      setText("expValue", product.exp + (faulty ? "" : " \u2713"));
      setText("defectValue", faulty ? DEFECT_LABELS[defect as DefectType] : "CLEAN");
      setColor("lotValue", faulty ? "var(--isp-red)" : "var(--isp-green)");
      setColor("mfgValue", faulty ? "var(--isp-red)" : "var(--isp-green)");
      setColor("expValue", faulty ? "var(--isp-red)" : "var(--isp-green)");
      setColor("defectValue", faulty ? "var(--isp-red)" : "var(--isp-green)");

      const conf = faulty ? (58 + Math.random() * 22).toFixed(1) : (98.2 + Math.random() * 1.6).toFixed(1);
      setText("confidenceValue", conf + "%");

      if (faulty) {
        setText("resultValue", "FAIL");
        setColor("resultValue", "var(--isp-red)");
        setText("statusText", "DEFECT DETECTED");
      } else {
        setText("resultValue", "PASS");
        setColor("resultValue", "var(--isp-green)");
        setText("statusText", "PRINT VERIFIED");
      }
      root.querySelectorAll<HTMLElement>('[data-role="statusLight"]').forEach((n) => {
        n.style.background = faulty ? "var(--isp-red)" : "var(--isp-green)";
        n.style.boxShadow = faulty ? "0 0 8px var(--isp-red)" : "0 0 8px var(--isp-green)";
      });
    };

    const inspectProduct = (product: Product, defect: DefectType | null) => {
      setText("statusText", "READING PRINT\u2026");

      if (cameraRingRef.current) {
        gsap.to(cameraRingRef.current, { attr: { r: 26 }, duration: 0.14, yoyo: true, repeat: 1 });
      }
      if (beamRef.current) {
        gsap.to(beamRef.current, { opacity: 0.4, duration: 0.1 });
      }
      if (scanLineRef.current) {
        gsap.set(scanLineRef.current, { opacity: 1, attr: { x1: 445, x2: 445 } });
        gsap.to(scanLineRef.current, { attr: { x1: 545, x2: 545 }, duration: 0.32, ease: "power1.inOut" });
      }
      const previewScan = root.querySelector<HTMLElement>('[data-role="previewScan"]');
      if (previewScan) {
        gsap.set(previewScan, { opacity: 1, left: "0%" });
        gsap.to(previewScan, { left: "100%", duration: 0.32, ease: "power1.inOut" });
      }

      window.setTimeout(() => updatePanel(product, defect), 240);

      window.setTimeout(() => {
        if (beamRef.current) gsap.to(beamRef.current, { opacity: 0, duration: 0.18 });
        if (scanLineRef.current) gsap.to(scanLineRef.current, { opacity: 0, duration: 0.12 });
      }, 380);
    };

    let stopped = false;

    const spawnProduct = () => {
      if (stopped || !productsGroupRef.current) return;
      const product = randomProduct();
      const faulty = Math.random() < 0.22;
      const defect = faulty ? DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)] : null;
      const bottle = buildBottle(product, defect);
      productsGroupRef.current.appendChild(bottle);
      gsap.set(bottle, { x: -90, y: 0 });

      const tl = gsap.timeline({
        onComplete: () => bottle.remove(),
      });

      tl.to(bottle, { x: 200, duration: 1.0, ease: "none" });
      tl.add(() => pulseSensor(), ">-0.15");
      tl.to(bottle, { x: 450, duration: 1.0, ease: "none" });
      tl.add(() => inspectProduct(product, defect));
      // Conveyor never stops — the bottle keeps rolling straight through.
      // inspectProduct() fires a fast strobe (~0.5s) right as it crosses
      // the camera, so the light lands on the print without the belt
      // needing to pause.
      tl.to(bottle, { x: 730, duration: 1.0, ease: "none" });
      tl.add(() => {
        counts.read += 1;
        const grp = (bottle as any)._badgeGroup as SVGGElement | undefined;
        if (grp) {
          const mark = (bottle as any)._badgeMark as SVGPathElement;
          const circle = grp.firstChild as SVGCircleElement;
          circle.setAttribute("class", faulty ? "isp-badge-bg isp-badge-bg-fail" : "isp-badge-bg");
          mark.setAttribute("d", faulty ? "M 51 2 L 60 10 M 60 2 L 51 10" : "M 51 6 L 54 9 L 60 2");
          gsap.to(grp, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.5 });
        }
        if (faulty) {
          counts.rejected += 1;
          rejectPulse();
          gsap.to(bottle, { x: 760, y: -46, rotation: 14, opacity: 0, duration: 0.55, ease: "power2.out" });
        }
        updateStats();
      });
      if (!faulty) {
        tl.to(bottle, { x: 1090, duration: 0.9, ease: "none" });
      }
    };

    // ambient / continuous animations
    const ambientTweens: gsap.core.Tween[] = [];
    if (rollersRef.current && !reduceMotion) {
      ambientTweens.push(
        gsap.to(rollersRef.current.querySelectorAll("circle"), {
          x: -30,
          duration: 0.55,
          repeat: -1,
          ease: "none",
          stagger: { each: 0.025, repeat: -1 },
        })
      );
    }
    if (cameraRingRef.current) {
      ambientTweens.push(
        gsap.to(cameraRingRef.current, {
          opacity: reduceMotion ? 0.8 : 0.55,
          duration: 1.4,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }

    let interval: number | undefined;
    setText("statusText", "SYSTEM READY");
    updateStats();

    // Live metrics strip (line speed / camera fps / avg OCR time / uptime).
    // INSPECTRA's brochure spec: up to 2500 FPS conveyor feeds.
    const startedAt = Date.now();
    const formatUptime = (ms: number) => {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };
    setText("lineSpeed", "312 ppm");
    setText("camFps", "2,480 fps");
    setText("avgOcr", "12 ms");
    setText("uptime", "00:00:00");

    let metricsInterval: number | undefined;
    if (!reduceMotion) {
      metricsInterval = window.setInterval(() => {
        setText("lineSpeed", `${296 + Math.floor(Math.random() * 30)} ppm`);
        setText("camFps", `${(2350 + Math.floor(Math.random() * 150)).toLocaleString()} fps`);
        setText("avgOcr", `${9 + Math.floor(Math.random() * 8)} ms`);
        setText("uptime", formatUptime(Date.now() - startedAt));
      }, 1000);
    }

    // Clears any in-flight products/tweens — used both on unmount and when
    // the tab regains visibility, so leftover/stale animations from before
    // the tab was backgrounded never overlap with freshly spawned ones.
    const clearProducts = () => {
      if (productsGroupRef.current) {
        gsap.killTweensOf(productsGroupRef.current.children);
        productsGroupRef.current.innerHTML = "";
      }
    };

    const stopSpawnLoop = () => {
      if (interval) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };

    const startSpawnLoop = () => {
      if (interval || stopped) return;
      spawnProduct();
      interval = window.setInterval(spawnProduct, 2500);
    };

    if (reduceMotion) {
      // Render a single static illustrative frame instead of a running loop.
      spawnProduct();
    } else {
      startSpawnLoop();
    }

    // Background/throttled tabs make timers fall behind; on switching back,
    // queued spawns used to fire in a burst and land on top of each other.
    // Instead: stop spawning while hidden, wipe + restart fresh when visible.
    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        stopSpawnLoop();
      } else {
        stopSpawnLoop();
        clearProducts();
        startSpawnLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopped = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      stopSpawnLoop();
      if (metricsInterval) window.clearInterval(metricsInterval);
      ambientTweens.forEach((t) => t.kill());
      gsap.killTweensOf([
        cameraRingRef.current,
        beamRef.current,
        scanLineRef.current,
        sensorLedRef.current,
        sensorBeamRef.current,
        rejectHeadRef.current,
        rejectFlashRef.current,
      ]);
      clearProducts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradId = `isp-beam-${uid}`;

  return (
    <div ref={rootRef} className={`isp-root ${variant === "compact" ? "isp-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="isp-card">
        <div className="isp-bgfx" aria-hidden="true">
          <div className="isp-grid" />
          <span className="isp-corner isp-corner-a" />
          <span className="isp-corner isp-corner-b" />
        </div>

        <div className="isp-layout">
          {/* HEADER */}
          <div className="isp-header">
            <div className="isp-logo">
              PIXTRON <span>SYSTEMS</span>
            </div>
            <div className="isp-producttag">
              <span className="isp-line" />
              INSPECTRA <em>|</em> DOT PRINT INSPECTION
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="isp-hero">
            <h1>
              INSPEC<span>TRA</span>
            </h1>
            <p>
              High precision, ultra high-speed dot print inspection designed for complex packaging
              lines. Inspectra ensures 100% real-time defect verification without slowing production
              speeds.
            </p>
            <div className="isp-taglist">
              <span className="isp-pill">DOT PRINT &amp; SEAL INTEGRITY</span>
              <span className="isp-pill isp-pill-ghost">OCR / OCV</span>
            </div>
            {brochureHref && (
              <a className="isp-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download Brochure
              </a>
            )}
          </div>

          {/* MACHINE STAGE */}
          <div className="isp-stage">
            <div className="isp-stage-label">LIVE PRINT INSPECTION VIEW</div>
            <svg viewBox="0 0 1000 400" className="isp-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1495FF" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#1495FF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* conveyor */}
              <rect x="0" y="290" width="1000" height="10" className="isp-conveyor-top" />
              <rect x="0" y="300" width="1000" height="26" className="isp-conveyor-side" />
              <g ref={rollersRef}>
                {Array.from({ length: 26 }).map((_, i) => (
                  <circle key={i} cx={-20 + i * 42} cy={313} r={7} className="isp-roller" />
                ))}
              </g>

              {/* sensor */}
              <g transform="translate(200,220)">
                <rect x="-10" y="-14" width="20" height="20" rx="3" className="isp-sensor-body" />
                <circle ref={sensorLedRef} cx="0" cy="-4" r="3" fill="#FF3348" className="isp-sensor-led" />
                <line ref={sensorBeamRef} x1="0" y1="6" x2="0" y2="76" className="isp-sensor-beam" />
              </g>

              {/* camera */}
              <g transform="translate(495,32)">
                <rect x="-6" y="-30" width="12" height="30" className="isp-mount" />
                <rect x="-34" y="0" width="68" height="52" rx="10" className="isp-camera-body" />
                <circle cx="0" cy="66" r="26" className="isp-camera-face" />
                <circle ref={cameraRingRef} cx="0" cy="66" r="21" className="isp-camera-ring" />
                <circle cx="0" cy="66" r="13" className="isp-camera-lens" />
                <circle cx="0" cy="66" r="6" className="isp-camera-blue" />
                <polygon
                  ref={beamRef}
                  points="-24,92 24,92 70,258 -70,258"
                  fill={`url(#${gradId})`}
                  className="isp-beam"
                />
              </g>
              <line ref={scanLineRef} x1="430" y1="142" x2="430" y2="292" className="isp-scanline" />

              {/* rejector */}
              <g transform="translate(830,230)">
                <rect x="-8" y="0" width="16" height="60" className="isp-reject-body" />
                <rect ref={rejectHeadRef} x="-30" y="24" width="24" height="12" rx="2" className="isp-reject-head" />
                <path d="M 40 60 L 92 60 L 78 110 L 30 110 Z" className="isp-reject-bin" />
                <circle ref={rejectFlashRef} cx="60" cy="80" r="30" className="isp-reject-flash" opacity="0" />
              </g>

              {/* products travel on this group */}
              <g transform="translate(0,222)">
                <g ref={productsGroupRef} />
              </g>
            </svg>
          </div>

          {/* LIVE METRICS STRIP — desktop-compact only */}
          <div className="isp-stage-foot">
            <div className="isp-mini">
              <span className="isp-mini-label">LINE SPEED</span>
              <span className="isp-mini-value" data-role="lineSpeed">
                &mdash;
              </span>
            </div>
            <div className="isp-mini">
              <span className="isp-mini-label">CAMERA FPS</span>
              <span className="isp-mini-value" data-role="camFps">
                &mdash;
              </span>
            </div>
            <div className="isp-mini">
              <span className="isp-mini-label">AVG OCR TIME</span>
              <span className="isp-mini-value" data-role="avgOcr">
                &mdash;
              </span>
            </div>
            <div className="isp-mini">
              <span className="isp-mini-label">UPTIME</span>
              <span className="isp-mini-value" data-role="uptime">
                00:00:00
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="isp-status">
            <span className="isp-status-dot" data-role="statusLight" />
            <span data-role="statusText">SYSTEM READY</span>
          </div>

          {/* SOFTWARE PANEL */}
          <div className="isp-panel">
            <div className="isp-panel-head">
              <span className="isp-panel-title">INSPECTRA LIVE FEED</span>
              <span className="isp-running">
                <i className="isp-running-dot" /> LIVE
              </span>
            </div>

            <div className="isp-preview">
              <span className="isp-preview-label">DOT-MATRIX OCR</span>
              <div className="isp-preview-product">
                <span className="isp-preview-brand">
                  INSPECTRA
                </span>
                <div className="isp-preview-box" data-role="printedText">
                  &mdash;
                </div>
              </div>
              <span className="isp-preview-scan" data-role="previewScan" />
            </div>

            <div className="isp-result">
              <div>
                <div className="isp-result-label">PRINT VERIFY RESULT</div>
                <div className="isp-result-value" data-role="resultValue">
                  &mdash;
                </div>
              </div>
              <div className="isp-confidence">
                OCR CONFIDENCE
                <strong data-role="confidenceValue">&mdash;</strong>
              </div>
            </div>

            <div className="isp-captured">
              <div className="isp-captured-title">DECODED FIELDS</div>
              <div className="isp-captured-row">
                <span>LOT NO</span>
                <span data-role="lotValue">&mdash;</span>
              </div>
              <div className="isp-captured-row">
                <span>MFG DATE</span>
                <span data-role="mfgValue">&mdash;</span>
              </div>
              <div className="isp-captured-row">
                <span>EXP DATE</span>
                <span data-role="expValue">&mdash;</span>
              </div>
              <div className="isp-captured-row">
                <span>DEFECT</span>
                <span data-role="defectValue">&mdash;</span>
              </div>
            </div>

            <div className="isp-stats">
              <div className="isp-stat">
                <div className="isp-stat-title">UNITS INSPECTED</div>
                <div className="isp-stat-value" data-role="statRead">
                  0
                </div>
              </div>
              <div className="isp-stat">
                <div className="isp-stat-title">PASS RATE</div>
                <div className="isp-stat-value isp-stat-yellow" data-role="statRate">
                  100.0%
                </div>
              </div>
              <div className="isp-stat">
                <div className="isp-stat-title">REJECTED</div>
                <div className="isp-stat-value isp-stat-red" data-role="statRejected">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="isp-features">
            <div className="isp-feature">
              <span className="isp-feature-icon">&#9679;</span>
              <div>
                <strong>OCR &amp; OCV Intelligence</strong>
                <small>Batch, expiry &amp; variable code verification</small>
              </div>
            </div>
            <div className="isp-feature">
              <span className="isp-feature-icon">&#10003;</span>
              <div>
                <strong>Dot Print &amp; Seal Integrity</strong>
                <small>Micron-level smudge &amp; missing-dot detection</small>
              </div>
            </div>
            <div className="isp-feature">
              <span className="isp-feature-icon">&#9889;</span>
              <div>
                <strong>Inline High-Speed Processing</strong>
                <small>Up to 2500 FPS, instant rejection</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .isp- prefix, container-query responsive)
============================================================ */

const CSS = `
.isp-root {
  --isp-blue-950: #03152F;
  --isp-blue-900: #05245A;
  --isp-blue-800: #06357D;
  --isp-blue-700: #0757B8;
  --isp-blue: #0878E8;
  --isp-yellow: #FFD400;
  --isp-white: #FFFFFF;
  --isp-gray-200: #DCE5F0;
  --isp-gray-400: #8FA2BA;
  --isp-green: #21E68A;
  --isp-red: #FF4B5C;

  width: 100%;
  container-type: inline-size;
  container-name: isp;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.isp-root *, .isp-root *::before, .isp-root *::after { box-sizing: border-box; }

.isp-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: linear-gradient(135deg, #041A3A 0%, #052B65 55%, #041A3A 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,90,200,0.08);
  padding: clamp(16px, 3.2cqw, 34px);
}

.isp-bgfx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.isp-grid {
  position: absolute; inset: 0; opacity: 0.1;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}
.isp-corner { position: absolute; border: 1px solid rgba(255,212,0,0.16); opacity: 0.5; }
.isp-corner-a { width: 220px; height: 110px; top: 120px; left: -100px; border-right: 0; }
.isp-corner-b { width: 240px; height: 150px; right: -120px; bottom: 60px; border-left: 0; }

.isp-layout {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(12px, 2cqw, 22px);
  grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
  grid-template-areas:
    "header header"
    "hero   panel"
    "stage  panel"
    "status panel"
    "features features";
  align-items: start;
}

@container isp (max-width: 780px) {
  .isp-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "hero"
      "stage"
      "status"
      "panel"
      "features";
  }
}

.isp-header { grid-area: header; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.isp-logo { color: #fff; font-size: clamp(12px, 1.6cqw, 16px); font-weight: 800; letter-spacing: 1px; }
.isp-logo span { color: var(--isp-yellow); }
.isp-producttag { display: flex; align-items: center; gap: 10px; color: #fff; font-size: clamp(9px, 1.1cqw, 11px); font-weight: 700; letter-spacing: 0.8px; opacity: 0.9; }
.isp-producttag em { font-style: normal; color: var(--isp-yellow); }
.isp-line { width: 22px; height: 2px; background: var(--isp-yellow); display: inline-block; }

.isp-hero { grid-area: hero; color: #fff; }
.isp-hero h1 { margin: clamp(6px,1.5cqw,14px) 0 0; font-size: clamp(28px, 5.6cqw, 48px); line-height: 0.95; font-weight: 800; letter-spacing: -1.5px; }
.isp-hero h1 span { color: var(--isp-yellow); }
.isp-hero p { margin: 10px 0 0; max-width: 50ch; font-size: clamp(12px, 1.5cqw, 14px); color: #B9C9DF; line-height: 1.5; }
.isp-taglist { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.isp-pill { padding: 6px 11px; border-radius: 5px; background: var(--isp-yellow); color: var(--isp-blue-950); font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; }
.isp-pill-ghost { background: rgba(255,255,255,0.08); color: #E7EEF8; border: 1px solid rgba(255,255,255,0.18); }
.isp-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 10px 16px; border-radius: 8px; background: var(--isp-blue-700); color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.isp-cta:hover { background: var(--isp-blue); transform: translateY(-1px); }

.isp-stage {
  grid-area: stage;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #020B18;
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1000 / 400;
}
.isp-stage-label {
  position: absolute; top: 10px; left: 12px; z-index: 2;
  font-size: 9px; font-weight: 700; letter-spacing: 0.8px; color: #7EA0C7;
}
.isp-svg { width: 100%; height: 100%; display: block; }

.isp-conveyor-top { fill: #172B47; }
.isp-conveyor-side { fill: #091B34; }
.isp-roller { fill: #08172C; stroke: #315274; stroke-width: 1; }
.isp-sensor-body { fill: #182C47; stroke: #6B83A2; stroke-width: 1; }
.isp-sensor-led { filter: drop-shadow(0 0 4px rgba(255,51,72,0.8)); }
.isp-sensor-beam { stroke: #FF4055; stroke-width: 1.5; stroke-dasharray: 5 4; opacity: 0; }
.isp-mount { fill: #7F91A7; }
.isp-camera-body { fill: #102B54; stroke: #6C86A8; stroke-width: 1; }
.isp-camera-face { fill: #061A38; }
.isp-camera-ring { fill: none; stroke: var(--isp-yellow); stroke-width: 3; filter: drop-shadow(0 0 6px rgba(255,212,0,0.7)); }
.isp-camera-lens { fill: #020A17; stroke: #2D74C8; stroke-width: 2; }
.isp-camera-blue { fill: #1495FF; opacity: 0.75; }
.isp-beam { opacity: 0; }
.isp-scanline { stroke: var(--isp-yellow); stroke-width: 2; opacity: 0; filter: drop-shadow(0 0 6px rgba(255,212,0,0.9)); }
.isp-reject-body { fill: #273E5B; stroke: #7186A0; stroke-width: 1; }
.isp-reject-head { fill: var(--isp-yellow); }
.isp-reject-bin { fill: #12203a; stroke: rgba(255,255,255,0.12); }
.isp-reject-flash { fill: rgba(255,75,92,0.25); filter: blur(6px); }

.isp-bottle-shadow { fill: rgba(0,0,0,0.35); }
.isp-cap { fill: var(--isp-blue-800); stroke: rgba(255,255,255,0.15); stroke-width: 0.6; }
.isp-cap-ring { fill: var(--isp-yellow); opacity: 0.85; }
.isp-glass { fill: rgba(220,235,250,0.14); stroke: rgba(220,235,250,0.55); stroke-width: 1.1; }
.isp-glass-highlight { fill: none; stroke: rgba(255,255,255,0.4); stroke-width: 3; stroke-linecap: round; }
.isp-print-area { fill: #ffffff; stroke: var(--isp-yellow); stroke-width: 0.6; }
.isp-dot { fill: #0B1E38; }
.isp-dot-smear { fill: #0B1E38; opacity: 0.18; }
.isp-badge-bg { fill: var(--isp-green); }
.isp-badge-bg-fail { fill: var(--isp-red); }
.isp-badge-mark { stroke: #04203c; stroke-width: 1.6; fill: none; stroke-linecap: round; stroke-linejoin: round; }

.isp-status {
  grid-area: status;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 9px 13px; border-radius: 8px;
  background: rgba(3,20,43,0.9); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 10.5px; font-weight: 700; width: fit-content; max-width: 100%;
}
.isp-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--isp-green); box-shadow: 0 0 8px var(--isp-green); flex: none; }

.isp-panel {
  grid-area: panel;
  padding: clamp(12px, 1.8cqw, 17px);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(8,44,96,0.97), rgba(3,22,48,0.97));
  border: 1px solid rgba(88,153,230,0.35);
  box-shadow: 0 20px 45px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.08);
}
.isp-panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.isp-panel-title { color: #fff; font-size: 13px; font-weight: 800; }
.isp-running { display: flex; align-items: center; gap: 6px; color: var(--isp-green); font-size: 9px; font-weight: 800; letter-spacing: 0.5px; }
.isp-running-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--isp-green); box-shadow: 0 0 8px var(--isp-green); }

.isp-preview { position: relative; height: 118px; border-radius: 9px; overflow: hidden; background: #020B18; border: 1px solid rgba(255,255,255,0.1); }
.isp-preview-label { position: absolute; top: 8px; left: 9px; z-index: 3; font-size: 8px; color: #7EA0C7; font-weight: 700; letter-spacing: 0.6px; }
.isp-preview-product { position: absolute; inset: 22px 16px 16px; border-radius: 5px; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.isp-preview-brand { position: absolute; top: 8px; left: 10px; font-size: 9px; font-weight: 800; color: var(--isp-blue-800); }
.isp-preview-brand span { color: var(--isp-yellow); }
.isp-preview-box {
  width: 78%; height: 40%; border: 1px solid var(--isp-yellow); box-shadow: 0 0 8px rgba(255,212,0,0.3); border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  font-family: monospace; font-size: 9px; font-weight: 700; color: #0B1E38; text-align: center; padding: 4px;
}
.isp-preview-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: var(--isp-yellow); box-shadow: 0 0 12px var(--isp-yellow); opacity: 0; }

.isp-result { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding: 11px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.isp-result-label { color: #7D96B5; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; }
.isp-result-value { font-size: 18px; font-weight: 800; color: var(--isp-green); margin-top: 2px; }
.isp-confidence { text-align: right; color: #8EA7C4; font-size: 8px; }
.isp-confidence strong { display: block; color: #fff; font-size: 13px; margin-top: 2px; }

.isp-captured { margin-top: 10px; }
.isp-captured-title { color: #7693B5; font-size: 8px; margin-bottom: 5px; font-weight: 700; letter-spacing: 0.3px; }
.isp-captured-row { display: flex; justify-content: space-between; padding: 5px 7px; margin-bottom: 3px; background: rgba(255,255,255,0.035); border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #DCE8F7; }
.isp-captured-row span:first-child { color: #7D96B5; font-family: Inter, sans-serif; }

.isp-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.isp-stat { padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.isp-stat-title { color: #718AA7; font-size: 7px; letter-spacing: 0.3px; }
.isp-stat-value { color: #fff; font-size: 12.5px; font-weight: 800; margin-top: 3px; }
.isp-stat-yellow { color: var(--isp-yellow); }
.isp-stat-red { color: var(--isp-red); }

.isp-features { grid-area: features; display: flex; gap: 10px; flex-wrap: wrap; }
.isp-feature { flex: 1 1 200px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(4,26,58,0.82); border: 1px solid rgba(93,145,205,0.2); }
.isp-feature-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(255,212,0,0.12); color: var(--isp-yellow); font-size: 12px; flex: none; }
.isp-feature strong { display: block; color: #fff; font-size: 10.5px; }
.isp-feature small { color: #7891AE; font-size: 8.5px; display: block; margin-top: 2px; }

@container isp (max-width: 480px) {
  .isp-features { flex-direction: column; }
  .isp-result-value { font-size: 15px; }
}

/* ---------- compact variant: fill an existing image/video slot ---------- */
.isp-root.isp-compact { height: auto; }
.isp-compact .isp-card { height: auto; padding: clamp(10px, 1.6cqw, 16px); border-radius: 0; border: none; box-shadow: none; }
.isp-compact .isp-header,
.isp-compact .isp-hero,
.isp-compact .isp-status,
.isp-compact .isp-features { display: none; }
.isp-compact .isp-layout {
  height: auto;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  grid-template-areas:
    "stage panel"
    "stagefoot panel";
  align-items: start;
}
.isp-compact .isp-stage { aspect-ratio: 1000 / 400; height: auto; }
.isp-compact .isp-panel { height: auto; overflow: visible; }

.isp-stage-foot { grid-area: stagefoot; display: none; }
.isp-compact .isp-stage-foot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.isp-mini { padding: 10px 11px; border-radius: 10px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 5px; }
.isp-mini-label { font-size: 7.5px; letter-spacing: 0.5px; color: #7D96B5; font-weight: 700; }
.isp-mini-value { font-size: clamp(11px, 1.5cqw, 15px); font-weight: 800; color: #fff; font-variant-numeric: tabular-nums; }

@container isp (max-width: 900px) {
  .isp-compact .isp-stage-foot { grid-template-columns: repeat(2, 1fr); }
}
@container isp (max-width: 680px) {
  .isp-compact .isp-layout { grid-template-columns: 1fr; grid-template-areas: "stage" "panel"; }
  .isp-compact .isp-stage { aspect-ratio: 4 / 3; }
  .isp-compact .isp-stage-foot { display: none; }
}
@container isp (max-width: 380px) {
  .isp-compact .isp-stage { aspect-ratio: 1 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .isp-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;