"use client";

/**
 * PrimusAgroAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated hero for PRIMUS-AGRO (Agriculture & Farm-to-Retail Traceability).
 *
 * Ported 1:1 from the original HTML/GSAP demo (5-node chain-of-custody
 * journey: a produce crate travels a motion path, scanning at each
 * checkpoint, ending in a "Verified" badge + ledger panel) — the visual
 * design and choreography are UNCHANGED. What's different from the source
 * file:
 *
 *  - React + refs instead of getElementById, MotionPathPlugin registered
 *    once, unique SVG def ids via useId (multi-instance safe — the original
 *    hardcoded ids like #dotgrid/#vignette/#track would collide if this
 *    component were used twice on one page).
 *  - Container-query responsive instead of a fixed max-width stage — the
 *    diagram is dense (5 labelled nodes across a 1600-wide scene), so
 *    rather than shrinking the SVG until the text is unreadable on a phone,
 *    the stage keeps a sane minimum width and scrolls horizontally on very
 *    narrow frames. This is the deliberate choice for "responsive without
 *    changing the UI" — the diagram itself is never restructured or
 *    cropped, it's just given room to stay legible.
 *  - `variant="compact"` drops straight into an existing image/video slot
 *    (e.g. ProductDetailPage) without its own outer card chrome or a
 *    forced aspect-ratio, so it never clips on mobile or grows a stray
 *    scrollbar on desktop (same fix used across the rest of the family).
 *  - Timeline pauses on tab visibility change instead of running invisibly
 *    in the background, and respects prefers-reduced-motion (plays once,
 *    no infinite loop).
 *  - Two node icons were retouched for the Agro theme (harvest leaf +
 *    cold-storage snowflake in place of the generic factory/warehouse
 *    icons) since Primus-Agro is farm produce, not manufacturing — this
 *    was the one open invitation in the brief ("add anything related to
 *    agriculture"). Everything else — the path, the scan beam, the data
 *    card, the ledger, the badge, the timing — is exactly as built.
 *
 * Usage:
 *   npm install gsap
 *   import PrimusAgroAnimation from "./PrimusAgroAnimation";
 *   <PrimusAgroAnimation brochureHref="/brochures/primus-agro.pdf" />
 *   // or, dropped into an existing media frame:
 *   <PrimusAgroAnimation variant="compact" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export interface PrimusAgroAnimationProps {
  /** Optional link for the "Download Brochure" button. If omitted, the button is hidden. */
  brochureHref?: string;
  /** Extra class name on the outer wrapper. */
  className?: string;
  /**
   * "full"    - standalone hero section with its own title, description, CTA (default).
   * "compact" - just the live journey scene, sized to fill its parent
   *             (use this when dropping the animation into an existing image/video
   *             slot such as a ProductDetailPage media frame).
   */
  variant?: "full" | "compact";
}

interface NodeDef {
  x: number;
  y: number;
  label: string;
  city: string;
  time: string;
  note: string;
}

const NODES: NodeDef[] = [
  { x: 160, y: 380, label: "HARVEST", city: "Harvest Collection — Nashik", time: "06:20:11", note: "harvest lot sealed \u00B7 QR tagged" },
  { x: 480, y: 340, label: "PUNE", city: "Cold Storage — Pune", time: "11:04:38", note: "crate RFID tagged \u00B7 cold-chain start" },
  { x: 800, y: 420, label: "MUMBAI", city: "Distribution Hub — Mumbai", time: "16:47:22", note: "RFID checkpoint \u00B7 in transit" },
  { x: 1120, y: 340, label: "KOLHAPUR", city: "Retail — Kolhapur", time: "09:12:05", note: "shelf scan ok \u00B7 BLE handheld" },
  { x: 1440, y: 380, label: "SAWANTWADI", city: "Consumer — Sawantwadi", time: "17:38:50", note: "consumer scan ok \u00B7 verified" },
];

const TRACK_D =
  "M160,380 C300,320 340,340 480,340 C620,340 660,420 800,420 C940,420 980,340 1120,340 C1260,340 1300,380 1440,380";

export default function PrimusAgroAnimation({ brochureHref, className, variant = "full" }: PrimusAgroAnimationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const trackPathRef = useRef<SVGPathElement | null>(null);
  const trackFillRef = useRef<SVGPathElement | null>(null);
  const packageRef = useRef<SVGGElement | null>(null);
  const beamRef = useRef<SVGRectElement | null>(null);
  const dataCardRef = useRef<SVGGElement | null>(null);
  const dcRectRef = useRef<SVGRectElement | null>(null);
  const dcTitleRef = useRef<SVGTextElement | null>(null);
  const dcRow1Ref = useRef<SVGTextElement | null>(null);
  const dcRow2Ref = useRef<SVGTextElement | null>(null);
  const dcCheckRef = useRef<SVGPathElement | null>(null);
  const badgeRef = useRef<SVGGElement | null>(null);
  const ledgerRef = useRef<SVGGElement | null>(null);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const lrRefs = useRef<(SVGGElement | null)[]>([]);
  const loopDotRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const trackPath = trackPathRef.current;
    const trackFill = trackFillRef.current;
    const pkg = packageRef.current;
    const beam = beamRef.current;
    const card = dataCardRef.current;
    const dcRect = dcRectRef.current;
    const dcTitle = dcTitleRef.current;
    const dcRow1 = dcRow1Ref.current;
    const dcRow2 = dcRow2Ref.current;
    const dcCheck = dcCheckRef.current;
    const badge = badgeRef.current;
    const ledger = ledgerRef.current;
    if (!trackPath || !trackFill || !pkg || !beam || !card || !dcRect || !dcTitle || !dcRow1 || !dcRow2 || !dcCheck || !badge || !ledger) {
      return;
    }

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const trackLen = trackFill.getTotalLength();
    trackFill.style.strokeDasharray = String(trackLen);
    trackFill.style.strokeDashoffset = String(trackLen);

    const resetScene = () => {
      gsap.set(trackFill, { strokeDashoffset: trackLen });
      gsap.set(pkg, { attr: { transform: `translate(${NODES[0].x},${NODES[0].y})` }, opacity: 0, scale: 1 });
      gsap.set(beam, { opacity: 0 });
      gsap.set(card, { opacity: 0, scale: 0.9 });
      gsap.set(dcCheck, { opacity: 0 });
      gsap.set(badge, { opacity: 0, scale: 0.7 });
      gsap.set(ledger, { opacity: 0, y: "+=16" });
      ringRefs.current.forEach((r) => r && gsap.set(r, { opacity: 0, scale: 1, transformOrigin: "center" }));
      lrRefs.current.forEach((r) => r && gsap.set(r, { opacity: 0, x: -10 }));
    };

    const scanAt = (n: NodeDef, idx: number, tl: gsap.core.Timeline) => {
      const ring = ringRefs.current[idx];
      tl.to(beam, { opacity: 0.9, duration: 0.001, attr: { x: n.x - 30, y: n.y - 46 } }, "<")
        .fromTo(beam, { attr: { y: n.y - 46 } }, { attr: { y: n.y + 30 }, duration: 0.5, ease: "power1.inOut" })
        .to(beam, { opacity: 0, duration: 0.15 }, "-=0.1");
      if (ring) {
        tl.to(ring, { opacity: 1, scale: 1.28, duration: 0.35, ease: "power2.out" }, "<").to(ring, { opacity: 0, duration: 0.4 }, ">");
      }
      tl.set(dcTitle, { attr: { x: n.x - 79 }, text: "LOT-4821-NS" })
        .set(dcRow1, { attr: { x: n.x - 79 }, text: `${n.label}  ${n.time}` })
        .set(dcRow2, { attr: { x: n.x - 79 }, text: n.note })
        .set(dcRect, { attr: { x: n.x - 95, y: n.y - 104 } })
        .set(dcTitle, { attr: { y: n.y - 82 } })
        .set(dcRow1, { attr: { y: n.y - 64 } })
        .set(dcRow2, { attr: { y: n.y - 49 } })
        .set(dcCheck, { attr: { d: `M${n.x + 62},${n.y - 67} l8,8 l14,-16` } })
        .to(card, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.1")
        .to(dcCheck, { opacity: 1, duration: 0.25 }, "-=0.1")
        .to(card, { opacity: 0, duration: 0.3, delay: 0.55 });
    };

    const buildTimeline = () => {
      const tl = gsap.timeline({
        repeat: reduceMotion ? 0 : -1,
        repeatDelay: 0.6,
        onRepeat: resetScene,
      });
      resetScene();

      tl.to(pkg, { opacity: 1, duration: 0.3 }).to(
        trackFill,
        { strokeDashoffset: trackLen - trackLen * 0.02, duration: 0.3 },
        "<"
      );

      scanAt(NODES[0], 0, tl);

      for (let i = 1; i < NODES.length; i++) {
        const segEnd = trackLen * (i / (NODES.length - 1));

        tl.to(pkg, {
          duration: 1.1,
          ease: "power2.inOut",
          motionPath: { path: trackPath, start: (i - 1) / (NODES.length - 1), end: i / (NODES.length - 1), align: trackPath },
        }).to(trackFill, { strokeDashoffset: trackLen - segEnd, duration: 1.1, ease: "power2.inOut" }, "<");

        scanAt(NODES[i], i, tl);

        if (i === NODES.length - 1) {
          tl.to(pkg, { opacity: 0, duration: 0.25 }, "-=0.2")
            .to(badge, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)" }, "<")
            .to(ledger, { opacity: 1, y: "-=16", duration: 0.45, ease: "power2.out" }, "-=0.15");
          lrRefs.current.forEach((r) => {
            if (r) tl.to(r, { opacity: 1, x: 0, duration: 0.3 }, "-=0.15");
          });
          tl.to({}, { duration: 2.2 }).to(
            [badge, ledger, ...lrRefs.current.filter(Boolean)],
            { opacity: 0, duration: 0.4 }
          );
        }
      }
      return tl;
    };

    const tl = buildTimeline();
    const loopDotTween = loopDotRef.current
      ? gsap.to(loopDotRef.current, {
          opacity: 0.25,
          duration: 0.9,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      : null;

    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        tl.pause();
        loopDotTween?.pause();
      } else {
        tl.play();
        loopDotTween?.play();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      tl.kill();
      loopDotTween?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRing = (i: number) => (el: SVGCircleElement | null) => {
    ringRefs.current[i] = el;
  };
  const setLr = (i: number) => (el: SVGGElement | null) => {
    lrRefs.current[i] = el;
  };

  const dotgridId = `pag-dotgrid-${uid}`;
  const vignetteId = `pag-vignette-${uid}`;
  const glowId = `pag-glow-${uid}`;
  const softId = `pag-soft-${uid}`;

  return (
    <div ref={rootRef} className={`pag-root ${variant === "compact" ? "pag-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="pag-card">
        {variant === "full" && (
          <div className="pag-header">
            <h1>
              PRIMUS<span>-AGRO</span>
            </h1>
            <p>Every crate gets a QR + RFID identity at harvest, and a verified scan at every handoff after.</p>
            {brochureHref && (
              <a className="pag-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
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
        )}

        <div className="pag-stage-wrap">
          <div className="pag-stage">
            <svg viewBox="0 0 1600 700" className="pag-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id={dotgridId} width="34" height="34" patternUnits="userSpaceOnUse">
                  <circle cx="1.2" cy="1.2" r="1.2" fill="var(--pag-bg-grid)" />
                </pattern>
                <radialGradient id={vignetteId} cx="50%" cy="42%" r="75%">
                  <stop offset="0%" stopColor="#0E1526" stopOpacity="0" />
                  <stop offset="100%" stopColor="#05070E" stopOpacity="0.9" />
                </radialGradient>
                <linearGradient id={glowId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--pag-yellow)" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--pag-yellow)" stopOpacity="1" />
                </linearGradient>
                <filter id={softId} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>

              <rect x="0" y="0" width="1600" height="700" fill="var(--pag-bg)" />
              <rect x="0" y="0" width="1600" height="700" fill={`url(#${dotgridId})`} />
              <rect x="0" y="0" width="1600" height="700" fill={`url(#${vignetteId})`} />

              {/* journey path */}
              <path
                ref={trackPathRef}
                d={TRACK_D}
                fill="none"
                stroke="var(--pag-line)"
                strokeWidth="2"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
              <path
                ref={trackFillRef}
                d={TRACK_D}
                fill="none"
                stroke="var(--pag-yellow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.9"
              />

              {/* NODE 1 — Harvest (leaf icon) */}
              <g transform={`translate(${NODES[0].x},${NODES[0].y})`}>
                <circle r="30" className="pag-node-bg" />
                <circle ref={setRing(0)} r="30" className="pag-node-ring" opacity="0" />
                <g className="pag-icon">
                  <path d="M0,10 C0,10 -10,4 -10,-6 C-10,-14 -2,-16 0,-16 C2,-16 10,-14 10,-6 C10,4 0,10 0,10 Z" />
                  <line x1="0" y1="10" x2="0" y2="16" />
                  <line x1="0" y1="-2" x2="-5" y2="-8" />
                  <line x1="0" y1="-2" x2="5" y2="-8" />
                </g>
                <text className="pag-node-label" x="0" y="58" textAnchor="middle">
                  Harvest Collection
                </text>
                <text className="pag-node-sub" x="0" y="76" textAnchor="middle">
                  Nashik
                </text>
              </g>

              {/* NODE 2 — Cold Storage (snowflake icon) */}
              <g transform={`translate(${NODES[1].x},${NODES[1].y})`}>
                <circle r="30" className="pag-node-bg" />
                <circle ref={setRing(1)} r="30" className="pag-node-ring" opacity="0" />
                <g className="pag-icon">
                  <line x1="0" y1="-13" x2="0" y2="13" />
                  <line x1="-11.3" y1="-6.5" x2="11.3" y2="6.5" />
                  <line x1="-11.3" y1="6.5" x2="11.3" y2="-6.5" />
                </g>
                <text className="pag-node-label" x="0" y="58" textAnchor="middle">
                  Cold Storage
                </text>
                <text className="pag-node-sub" x="0" y="76" textAnchor="middle">
                  Pune
                </text>
              </g>

              {/* NODE 3 — Distribution Hub (truck icon) */}
              <g transform={`translate(${NODES[2].x},${NODES[2].y})`}>
                <circle r="30" className="pag-node-bg" />
                <circle ref={setRing(2)} r="30" className="pag-node-ring" opacity="0" />
                <g className="pag-icon">
                  <rect x="-16" y="-4" width="18" height="12" />
                  <path d="M2,-4 L12,-4 L17,2 L17,8 L2,8 Z" />
                  <circle cx="-9" cy="10" r="3" fill="var(--pag-panel)" />
                  <circle cx="9" cy="10" r="3" fill="var(--pag-panel)" />
                </g>
                <text className="pag-node-label" x="0" y="58" textAnchor="middle">
                  Distribution Hub
                </text>
                <text className="pag-node-sub" x="0" y="76" textAnchor="middle">
                  Mumbai
                </text>
              </g>

              {/* NODE 4 — Retail Store (shop icon) */}
              <g transform={`translate(${NODES[3].x},${NODES[3].y})`}>
                <circle r="30" className="pag-node-bg" />
                <circle ref={setRing(3)} r="30" className="pag-node-ring" opacity="0" />
                <g className="pag-icon">
                  <path d="M-14,-4 L-14,10 L14,10 L14,-4" />
                  <path d="M-16,-4 L-10,-12 L10,-12 L16,-4 Z" />
                  <line x1="-4" y1="10" x2="-4" y2="2" />
                  <line x1="4" y1="10" x2="4" y2="2" />
                </g>
                <text className="pag-node-label" x="0" y="58" textAnchor="middle">
                  Retail Store
                </text>
                <text className="pag-node-sub" x="0" y="76" textAnchor="middle">
                  Kolhapur
                </text>
              </g>

              {/* NODE 5 — Consumer (phone icon) */}
              <g transform={`translate(${NODES[4].x},${NODES[4].y})`}>
                <circle r="30" className="pag-node-bg" />
                <circle ref={setRing(4)} r="30" className="pag-node-ring" opacity="0" />
                <g className="pag-icon">
                  <rect x="-8" y="-13" width="16" height="26" rx="2" />
                  <line x1="-8" y1="9" x2="8" y2="9" />
                </g>
                <text className="pag-node-label" x="0" y="58" textAnchor="middle">
                  Consumer Scan
                </text>
                <text className="pag-node-sub" x="0" y="76" textAnchor="middle">
                  Sawantwadi
                </text>
              </g>

              {/* data readout card, reused & repositioned per stop */}
              <g ref={dataCardRef} opacity="0">
                <rect ref={dcRectRef} x="-95" y="-70" width="190" height="58" rx="8" className="pag-card-rect" />
                <text ref={dcTitleRef} className="pag-data-title" x="-79" y="-48">
                  LOT-4821-NS
                </text>
                <text ref={dcRow1Ref} className="pag-data-row" x="-79" y="-30">
                  verified
                </text>
                <text ref={dcRow2Ref} className="pag-data-row" x="-79" y="-15">
                  scan ok
                </text>
                <path ref={dcCheckRef} d="M62,-33 l8,8 l14,-16" className="pag-check" opacity="0" />
              </g>

              {/* scan beam, reused */}
              <rect ref={beamRef} x="-30" y="-40" width="60" height="4" className="pag-beam" opacity="0" filter={`url(#${softId})`} />

              {/* traveling crate: QR + RFID tagged produce crate */}
              <g ref={packageRef} transform={`translate(${NODES[0].x},${NODES[0].y})`} opacity="0">
                <rect x="-16" y="-13" width="32" height="26" rx="3" className="pag-pkg-body" />
                <line x1="-16" y1="-4" x2="16" y2="-4" className="pag-pkg-slat" />
                <line x1="-16" y1="4" x2="16" y2="4" className="pag-pkg-slat" />
                <rect x="-9" y="-9" width="4" height="4" className="pag-pkg-accent" />
                <circle cx="9" cy="8" r="2.5" className="pag-pkg-rfid" />
              </g>

              {/* final verified badge */}
              <g ref={badgeRef} transform="translate(1440,270)" opacity="0">
                <rect x="-64" y="-20" width="128" height="40" rx="20" fill="var(--pag-teal)" />
                <path d="M-40,0 l8,8 l16,-18" fill="none" stroke="var(--pag-yellow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <text className="pag-badge-text" x="4" y="6" textAnchor="middle">
                  Verified
                </text>
              </g>

              {/* farm-to-retail ledger panel */}
              <g ref={ledgerRef} transform="translate(1120,120)" opacity="0">
                <rect x="-210" y="-14" width="420" height="200" rx="12" className="pag-card-rect" />
                <text className="pag-ledger-title" x="-186" y="18">
                  Farm-to-Retail Ledger
                </text>
                <line x1="-186" y1="30" x2="186" y2="30" stroke="var(--pag-panel-border)" strokeWidth="1" />

                {NODES.map((n, i) => (
                  <g key={n.city} ref={setLr(i)} transform={`translate(0,${50 + i * 28})`}>
                    <circle cx="-186" cy="-4" r="3" fill={i === NODES.length - 1 ? "var(--pag-amber)" : "var(--pag-teal)"} />
                    <text className="pag-ledger-city" x="-172" y="0">
                      {n.city}
                    </text>
                    <text className="pag-ledger-time" x="120" y="0" textAnchor="end">
                      {n.time}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            <div className="pag-loopnote">
              <span className="pag-loopdot" ref={loopDotRef} />
              Demo loops automatically
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .pag- prefix, container-query responsive)
============================================================ */

const CSS = `
.pag-root {
  --pag-bg: #0A0F1D;
  --pag-bg-grid: #131B30;
  --pag-panel: #101728;
  --pag-panel-border: #223047;
  --pag-ink: #E9EDF6;
  --pag-ink-dim: #8B96AE;
  --pag-teal: #23D9BE;
  --pag-amber: #FFA23C;
  --pag-yellow: #FFC800;

  width: 100%;
  container-type: inline-size;
  container-name: pag;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.pag-root *, .pag-root *::before, .pag-root *::after { box-sizing: border-box; }

.pag-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: var(--pag-bg);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  padding: clamp(14px, 3cqw, 30px);
}

.pag-header { color: #fff; margin-bottom: clamp(12px, 2cqw, 20px); }
.pag-header h1 { margin: 0; font-size: clamp(26px, 5cqw, 44px); font-weight: 800; letter-spacing: -1px; color: #fff; }
.pag-header h1 span { color: var(--pag-yellow); }
.pag-header p { margin: 8px 0 0; max-width: 52ch; font-size: clamp(12px, 1.5cqw, 14px); color: var(--pag-ink-dim); line-height: 1.5; }
.pag-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 14px;
  padding: 10px 16px; border-radius: 8px; background: #0757B8; color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.pag-cta:hover { background: #0878E8; transform: translateY(-1px); }

/* Wide, dense diagram: rather than shrinking text below legibility on a
   narrow frame, the stage keeps a real minimum width and the wrapper
   scrolls horizontally. The diagram itself is never restructured/cropped. */
.pag-stage-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: clamp(10px, 2cqw, 18px);
  scrollbar-width: thin;
}
.pag-stage {
  position: relative;
  width: 100%;
  min-width: 760px;
  aspect-ratio: 1600 / 700;
  border-radius: clamp(10px, 2cqw, 18px);
  overflow: hidden;
  background: var(--pag-bg);
}
.pag-svg { width: 100%; height: 100%; display: block; }

.pag-node-bg { fill: var(--pag-panel); stroke: var(--pag-panel-border); stroke-width: 2; }
.pag-node-ring { fill: none; stroke: var(--pag-teal); stroke-width: 2; }
.pag-icon { stroke: var(--pag-ink-dim); stroke-width: 1.8; fill: none; stroke-linejoin: round; stroke-linecap: round; }
.pag-node-label { font-family: Inter, sans-serif; font-size: 15px; font-weight: 600; fill: var(--pag-ink); }
.pag-node-sub { font-family: Inter, sans-serif; font-size: 12px; fill: var(--pag-ink-dim); }

.pag-card-rect { fill: var(--pag-panel); stroke: var(--pag-panel-border); stroke-width: 1.5; }
.pag-data-title { font-family: "IBM Plex Mono", monospace; font-size: 12px; fill: var(--pag-teal); font-weight: 500; }
.pag-data-row { font-family: "IBM Plex Mono", monospace; font-size: 12px; fill: var(--pag-ink-dim); }
.pag-check { fill: none; stroke: var(--pag-teal); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.pag-beam { fill: var(--pag-teal); }

.pag-pkg-body { fill: var(--pag-panel); stroke: var(--pag-amber); stroke-width: 2; }
.pag-pkg-slat { stroke: var(--pag-amber); stroke-width: 1.4; }
.pag-pkg-accent { fill: var(--pag-amber); }
.pag-pkg-rfid { fill: var(--pag-teal); }

.pag-badge-text { font-family: Inter, sans-serif; font-size: 16px; font-weight: 700; fill: var(--pag-bg); }

.pag-ledger-title { font-family: Inter, sans-serif; font-size: 19px; font-weight: 700; fill: var(--pag-ink); }
.pag-ledger-city { font-family: Inter, sans-serif; font-size: 13px; font-weight: 600; fill: var(--pag-ink); }
.pag-ledger-time { font-family: "IBM Plex Mono", monospace; font-size: 11px; fill: var(--pag-ink-dim); }

.pag-loopnote {
  position: absolute; bottom: 10px; right: 12px; z-index: 5;
  display: flex; align-items: center; gap: 7px;
  font-family: "IBM Plex Mono", monospace;
  font-size: clamp(9px, 1cqw, 11px);
  color: var(--pag-ink-dim);
  background: rgba(2,11,24,0.65);
  padding: 4px 9px;
  border-radius: 6px;
}
.pag-loopdot { width: 6px; height: 6px; border-radius: 50%; background: var(--pag-teal); flex: none; }

/* ---------- compact variant: fill an existing image/video slot ---------- */
.pag-root.pag-compact { height: auto; }
.pag-compact .pag-card { border-radius: 0; border: none; box-shadow: none; padding: 0; }
.pag-compact .pag-stage-wrap { border-radius: 0; }
.pag-compact .pag-stage { border-radius: 0; }

@media (prefers-reduced-motion: reduce) {
  .pag-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;