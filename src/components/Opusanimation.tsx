"use client";

/**
 * OpusAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated product hero for PIXTRON OPUS (Geometry & Color Inspection).
 *
 * Same visual language as the original Opus concept (machined circular part,
 * cyan geometry ring, color spectrum swatch, dimension calipers, reject
 * module) — rebuilt on the same proven architecture as CodexAnimation.tsx /
 * InspectraAnimation.tsx so it's responsive and bug-free everywhere it's
 * dropped:
 *
 *  - Container-query responsive (works inside any frame width, not just
 *    viewport width) — NOT window.innerWidth + a resize listener, and NOT
 *    vw units. This is the fix for "responsive tha viewport ke hisaab se,
 *    frame ke hisaab se nahi".
 *  - ONE responsive layout via CSS Grid + container queries, instead of two
 *    separate desktop/mobile JSX trees — easier to maintain and no
 *    duplicated logic to keep in sync.
 *  - GSAP-driven conveyor/camera animation, continuous motion (belt never
 *    stops), fast strobe flash timed to the part passing under the camera.
 *  - `variant="compact"` drops straight into an existing image/video slot
 *    (e.g. ProductDetailPage) without a fixed aspect-ratio, so it never
 *    clips on mobile or grows a stray scrollbar on desktop.
 *  - Live metrics strip fills the empty space under the stage (desktop
 *    only, auto-hidden on narrow frames).
 *  - Pauses spawning + clears stale part elements on tab visibility change,
 *    so returning to a backgrounded tab never dumps overlapping parts.
 *  - Respects prefers-reduced-motion, unique ids via useId (multi-instance
 *    safe — the original used hardcoded gradient/filter ids that would
 *    collide if the component were used twice on one page).
 *
 * Usage:
 *   npm install gsap
 *   import OpusAnimation from "./OpusAnimation";
 *   <OpusAnimation brochureHref="/brochures/opus-spec-sheet.pdf" />
 *   // or, dropped into an existing media frame:
 *   <OpusAnimation variant="compact" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   TYPES
============================================================ */

type FaultType = "geometry" | "color" | null;

interface Part {
  dia: number;
  rnd: number;
  col: number;
}

export interface OpusAnimationProps {
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
   DATA (used only client-side, after mount)
============================================================ */

function randomPart(): Part {
  return {
    dia: 85 + (Math.random() * 0.06 - 0.03),
    rnd: 0.008 + Math.random() * 0.006,
    col: 0.6 + Math.random() * 0.22,
  };
}

/* ============================================================
   SVG BUILD HELPERS (imperative, client-only)
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

function buildPart(faultType: FaultType): SVGGElement {
  const g = el("g", { class: "opu-part" });
  const isGeo = faultType === "geometry";
  const isColor = faultType === "color";
  const rx = isGeo ? 34 : 30;
  const ry = isGeo ? 21 : 30;

  g.appendChild(el("ellipse", { cx: 35, cy: 74, rx: 33, ry: 6, class: "opu-part-shadow" }));
  g.appendChild(
    el("ellipse", { cx: 35, cy: 35, rx, ry, class: isColor ? "opu-outer opu-outer-fault" : "opu-outer" })
  );
  g.appendChild(el("ellipse", { cx: 35, cy: 35, rx: rx - 7, ry: ry - 7, class: "opu-mid" }));
  g.appendChild(el("circle", { cx: 35, cy: 35, r: 16, class: "opu-inner" }));
  g.appendChild(el("circle", { cx: 35, cy: 35, r: 7, class: "opu-hub" }));
  g.appendChild(el("circle", { cx: 35, cy: 35, r: 3.5, class: "opu-hub2" }));
  for (const deg of [0, 60, 120, 180, 240, 300]) {
    const rad = (deg * Math.PI) / 180;
    const bx = 35 + 19 * Math.sin(rad);
    const by = 35 - 19 * Math.cos(rad);
    g.appendChild(el("circle", { cx: bx.toFixed(1), cy: by.toFixed(1), r: 2.6, class: "opu-hub" }));
  }
  const highlight = el("ellipse", { cx: 25, cy: 22, rx: 8, ry: 4, class: "opu-highlight" });
  highlight.setAttribute("transform", "rotate(-30 25 22)");
  g.appendChild(highlight);

  const badge = el("g", { class: "opu-badge", opacity: 0 });
  badge.appendChild(el("circle", { cx: 58, cy: 8, r: 9, class: "opu-badge-bg" }));
  const mark = el("path", { d: "M 54 8 L 57 11 L 63 4", class: "opu-badge-mark" });
  badge.appendChild(mark);
  g.appendChild(badge);
  (g as any)._badgeGroup = badge;
  (g as any)._badgeMark = mark;

  return g;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function OpusAnimation({ brochureHref, className, variant = "full" }: OpusAnimationProps) {
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
    const setStyle = (role: string, prop: string, value: string) => {
      root.querySelectorAll<HTMLElement>(`[data-role="${role}"]`).forEach((n) => {
        (n.style as any)[prop] = value;
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
        onComplete: () => sensorLedRef.current?.setAttribute("fill", "#00D4FF"),
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

    const updatePanel = (part: Part, faultType: FaultType) => {
      const faulty = !!faultType;
      let dia: string, rnd: string, col: string, conf: string, status: string;

      if (!faulty) {
        dia = part.dia.toFixed(2) + "mm \u2713";
        rnd = part.rnd.toFixed(3) + "mm \u2713";
        col = part.col.toFixed(2) + " \u2713";
        conf = (99.3 + Math.random() * 0.6).toFixed(1) + "%";
        status = "PART VERIFIED";
      } else if (faultType === "geometry") {
        const bad = (part.dia + 1.7 + Math.random() * 0.4).toFixed(2);
        dia = bad + "mm \u2715";
        rnd = "0.08" + Math.floor(Math.random() * 9) + "mm \u2715";
        col = part.col.toFixed(2) + " \u2713";
        conf = (30 + Math.random() * 15).toFixed(1) + "%";
        status = "GEOMETRY FAULT DETECTED";
      } else {
        const badCol = (part.col + 3.5 + Math.random() * 0.6).toFixed(2);
        dia = part.dia.toFixed(2) + "mm \u2713";
        rnd = part.rnd.toFixed(3) + "mm \u2713";
        col = badCol + " \u2715";
        conf = (40 + Math.random() * 18).toFixed(1) + "%";
        status = "COLOR VARIANCE EXCEEDED";
      }

      setText("diaValue", dia);
      setText("rndValue", rnd);
      setText("colValue", col);
      setColor("diaValue", dia.includes("\u2715") ? "var(--opu-red)" : "var(--opu-green)");
      setColor("rndValue", rnd.includes("\u2715") ? "var(--opu-red)" : "var(--opu-green)");
      setColor("colValue", col.includes("\u2715") ? "var(--opu-red)" : "var(--opu-green)");
      setText("confidenceValue", conf);
      setText("diameterLive", "\u00D8 " + part.dia.toFixed(2) + "mm");
      setStyle("colorMarker", "left", `${Math.min(96, part.col * 100)}%`);

      if (faulty) {
        setText("resultValue", "NOT OK");
        setColor("resultValue", "var(--opu-red)");
      } else {
        setText("resultValue", "OK");
        setColor("resultValue", "var(--opu-green)");
      }
      setText("statusText", status);
      root.querySelectorAll<HTMLElement>('[data-role="statusLight"]').forEach((n) => {
        n.style.background = faulty ? "var(--opu-red)" : "var(--opu-green)";
        n.style.boxShadow = faulty ? "0 0 8px var(--opu-red)" : "0 0 8px var(--opu-green)";
      });
    };

    const inspectProduct = (part: Part, faultType: FaultType) => {
      setText("statusText", "SCANNING GEOMETRY\u2026");

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
      setStyle("diameterLive", "opacity", "1");

      window.setTimeout(() => updatePanel(part, faultType), 240);

      window.setTimeout(() => {
        if (beamRef.current) gsap.to(beamRef.current, { opacity: 0, duration: 0.18 });
        if (scanLineRef.current) gsap.to(scanLineRef.current, { opacity: 0, duration: 0.12 });
        setStyle("diameterLive", "opacity", "0");
      }, 380);
    };

    let stopped = false;

    const spawnProduct = () => {
      if (stopped || !productsGroupRef.current) return;
      const part = randomPart();
      const faulty = Math.random() < 0.22;
      const faultType: FaultType = faulty ? (Math.random() < 0.5 ? "geometry" : "color") : null;
      const partEl = buildPart(faultType);
      productsGroupRef.current.appendChild(partEl);
      gsap.set(partEl, { x: -80, y: 0 });

      const tl = gsap.timeline({
        onComplete: () => partEl.remove(),
      });

      tl.to(partEl, { x: 200, duration: 1.0, ease: "none" });
      tl.add(() => pulseSensor(), ">-0.15");
      tl.to(partEl, { x: 450, duration: 1.0, ease: "none" });
      tl.add(() => inspectProduct(part, faultType));
      // Conveyor never stops — the part keeps rolling straight through.
      // inspectProduct() fires a fast strobe (~0.5s) right as it crosses
      // the camera, so the scan lands on it without the belt pausing.
      tl.to(partEl, { x: 730, duration: 1.0, ease: "none" });
      tl.add(() => {
        counts.read += 1;
        const grp = (partEl as any)._badgeGroup as SVGGElement | undefined;
        if (grp) {
          const mark = (partEl as any)._badgeMark as SVGPathElement;
          const circle = grp.firstChild as SVGCircleElement;
          circle.setAttribute("class", faulty ? "opu-badge-bg opu-badge-bg-fail" : "opu-badge-bg");
          mark.setAttribute("d", faulty ? "M 54 4 L 63 12 M 63 4 L 54 12" : "M 54 8 L 57 11 L 63 4");
          gsap.to(grp, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.5 });
        }
        if (faulty) {
          counts.rejected += 1;
          rejectPulse();
          gsap.to(partEl, { x: 760, y: -46, rotation: 40, opacity: 0, duration: 0.55, ease: "power2.out" });
        }
        updateStats();
      });
      if (!faulty) {
        tl.to(partEl, { x: 1090, duration: 0.9, ease: "none" });
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
    setText("statusText", "GEOMETRY & COLOR READY");
    updateStats();

    // Live metrics strip (line speed / vision fps / avg scan time / uptime).
    const startedAt = Date.now();
    const formatUptime = (ms: number) => {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };
    setText("lineSpeed", "185 ppm");
    setText("visionFps", "310 fps");
    setText("avgScan", "22 ms");
    setText("uptime", "00:00:00");

    let metricsInterval: number | undefined;
    if (!reduceMotion) {
      metricsInterval = window.setInterval(() => {
        setText("lineSpeed", `${178 + Math.floor(Math.random() * 16)} ppm`);
        setText("visionFps", `${296 + Math.floor(Math.random() * 24)} fps`);
        setText("avgScan", `${18 + Math.floor(Math.random() * 10)} ms`);
        setText("uptime", formatUptime(Date.now() - startedAt));
      }, 1000);
    }

    // Clears any in-flight parts/tweens — used both on unmount and when the
    // tab regains visibility, so leftover/stale animations from before the
    // tab was backgrounded never overlap with freshly spawned ones.
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
      interval = window.setInterval(spawnProduct, 2700);
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

  const gradId = `opu-beam-${uid}`;
  const specId = `opu-spec-${uid}`;

  return (
    <div ref={rootRef} className={`opu-root ${variant === "compact" ? "opu-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="opu-card">
        <div className="opu-bgfx" aria-hidden="true">
          <div className="opu-grid" />
          <span className="opu-corner opu-corner-a" />
          <span className="opu-corner opu-corner-b" />
        </div>

        <div className="opu-layout">
          {/* HEADER */}
          <div className="opu-header">
            <div className="opu-logo">
              PIXTRON <span>SYSTEMS</span>
            </div>
            <div className="opu-producttag">
              <span className="opu-line" />
              OPUS <em>|</em> GEOMETRY &amp; COLOR INSPECTION
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="opu-hero">
            <h1>
              OP<span>US</span>
            </h1>
            <p>
              Precise shape, size, and color consistency verification for complex manufacturing
              components.
            </p>
            <div className="opu-taglist">
              <span className="opu-pill">GEOMETRY &amp; COLOR MATCH</span>
              <span className="opu-pill opu-pill-ghost">AI VISION</span>
            </div>
            {brochureHref && (
              <a className="opu-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
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
          <div className="opu-stage">
            <div className="opu-stage-label">LIVE GEOMETRY &amp; COLOR VIEW</div>
            <svg viewBox="0 0 1000 400" className="opu-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={specId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FF4B5C" />
                  <stop offset="33%" stopColor="#FFD400" />
                  <stop offset="66%" stopColor="#21E68A" />
                  <stop offset="100%" stopColor="#00D4FF" />
                </linearGradient>
              </defs>

              {/* conveyor */}
              <rect x="0" y="290" width="1000" height="10" className="opu-conveyor-top" />
              <rect x="0" y="300" width="1000" height="26" className="opu-conveyor-side" />
              <g ref={rollersRef}>
                {Array.from({ length: 26 }).map((_, i) => (
                  <circle key={i} cx={-20 + i * 42} cy={313} r={7} className="opu-roller" />
                ))}
              </g>

              {/* sensor */}
              <g transform="translate(200,220)">
                <rect x="-10" y="-14" width="20" height="20" rx="3" className="opu-sensor-body" />
                <circle ref={sensorLedRef} cx="0" cy="-4" r="3" fill="#00D4FF" className="opu-sensor-led" />
                <line ref={sensorBeamRef} x1="0" y1="6" x2="0" y2="76" className="opu-sensor-beam" />
              </g>

              {/* gantry + combo geometry/color camera */}
              <rect x="380" y="34" width="230" height="14" rx="5" className="opu-gantry-bar" />
              <rect x="392" y="34" width="12" height="52" rx="4" className="opu-gantry-post" />
              <rect x="588" y="34" width="12" height="38" rx="4" className="opu-gantry-post" />

              <g transform="translate(495,48)">
                <rect x="-40" y="0" width="80" height="52" rx="10" className="opu-camera-body" />
                <circle cx="-8" cy="66" r="26" className="opu-camera-face" />
                <circle ref={cameraRingRef} cx="-8" cy="66" r="21" className="opu-camera-ring" />
                <circle cx="-8" cy="66" r="13" className="opu-camera-lens" />
                <circle cx="-8" cy="66" r="6" className="opu-camera-cyan" />
                {/* color spectrum swatch on the same housing */}
                <rect x="24" y="14" width="30" height="24" rx="4" className="opu-spec-body" />
                <rect x="28" y="19" width="22" height="7" rx="2" fill={`url(#${specId})`} />
                <circle cx="39" cy="31" r="3" className="opu-spec-dot" />
                <polygon
                  ref={beamRef}
                  points="-32,92 16,92 62,258 -78,258"
                  fill={`url(#${gradId})`}
                  className="opu-beam"
                />
              </g>
              <line ref={scanLineRef} x1="430" y1="142" x2="430" y2="292" className="opu-scanline" />

              {/* rejector */}
              <g transform="translate(830,230)">
                <rect x="-8" y="0" width="16" height="60" className="opu-reject-body" />
                <rect ref={rejectHeadRef} x="-30" y="24" width="24" height="12" rx="2" className="opu-reject-head" />
                <path d="M 40 60 L 92 60 L 78 110 L 30 110 Z" className="opu-reject-bin" />
                <circle ref={rejectFlashRef} cx="60" cy="80" r="30" className="opu-reject-flash" opacity="0" />
              </g>

              {/* parts travel on this group */}
              <g transform="translate(0,222)">
                <g ref={productsGroupRef} />
              </g>
            </svg>
          </div>

          {/* LIVE METRICS STRIP — desktop-compact only */}
          <div className="opu-stage-foot">
            <div className="opu-mini">
              <span className="opu-mini-label">LINE SPEED</span>
              <span className="opu-mini-value" data-role="lineSpeed">
                &mdash;
              </span>
            </div>
            <div className="opu-mini">
              <span className="opu-mini-label">VISION FPS</span>
              <span className="opu-mini-value" data-role="visionFps">
                &mdash;
              </span>
            </div>
            <div className="opu-mini">
              <span className="opu-mini-label">AVG SCAN TIME</span>
              <span className="opu-mini-value" data-role="avgScan">
                &mdash;
              </span>
            </div>
            <div className="opu-mini">
              <span className="opu-mini-label">UPTIME</span>
              <span className="opu-mini-value" data-role="uptime">
                00:00:00
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="opu-status">
            <span className="opu-status-dot" data-role="statusLight" />
            <span data-role="statusText">GEOMETRY &amp; COLOR READY</span>
          </div>

          {/* SOFTWARE PANEL */}
          <div className="opu-panel">
            <div className="opu-panel-head">
              <span className="opu-panel-title">OPUS LIVE FEED</span>
              <span className="opu-running">
                <i className="opu-running-dot" /> LIVE
              </span>
            </div>

            <div className="opu-preview">
              <span className="opu-preview-label">LIVE CAMERA VIEW</span>
              <span className="opu-preview-dim" data-role="diameterLive">
                &mdash;
              </span>
              <div className="opu-preview-part">
                <div className="opu-preview-disc">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="opu-preview-cross" />
              </div>
              <div className="opu-preview-spectrum">
                <span className="opu-preview-marker" data-role="colorMarker" />
              </div>
              <span className="opu-preview-scan" data-role="previewScan" />
            </div>

            <div className="opu-result">
              <div>
                <div className="opu-result-label">INSPECTION RESULT</div>
                <div className="opu-result-value" data-role="resultValue">
                  &mdash;
                </div>
              </div>
              <div className="opu-confidence">
                CONFIDENCE
                <strong data-role="confidenceValue">&mdash;</strong>
              </div>
            </div>

            <div className="opu-captured">
              <div className="opu-captured-title">MEASURED PARAMETERS</div>
              <div className="opu-captured-row">
                <span>DIAMETER</span>
                <span data-role="diaValue">&mdash;</span>
              </div>
              <div className="opu-captured-row">
                <span>ROUNDNESS</span>
                <span data-role="rndValue">&mdash;</span>
              </div>
              <div className="opu-captured-row">
                <span>COLOR &Delta;E</span>
                <span data-role="colValue">&mdash;</span>
              </div>
            </div>

            <div className="opu-stats">
              <div className="opu-stat">
                <div className="opu-stat-title">INSPECTED</div>
                <div className="opu-stat-value" data-role="statRead">
                  0
                </div>
              </div>
              <div className="opu-stat">
                <div className="opu-stat-title">PASS RATE</div>
                <div className="opu-stat-value opu-stat-yellow" data-role="statRate">
                  100.0%
                </div>
              </div>
              <div className="opu-stat">
                <div className="opu-stat-title">REJECTED</div>
                <div className="opu-stat-value opu-stat-red" data-role="statRejected">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="opu-features">
            <div className="opu-feature">
              <span className="opu-feature-icon">&#9673;</span>
              <div>
                <strong>Dimensional Tolerance Checks</strong>
                <small>Angles, lengths &amp; diameters to mm fractions</small>
              </div>
            </div>
            <div className="opu-feature">
              <span className="opu-feature-icon">&#9679;</span>
              <div>
                <strong>Spectrum Color Matching</strong>
                <small>Faint batch mismatches under standard light</small>
              </div>
            </div>
            <div className="opu-feature">
              <span className="opu-feature-icon">&#9889;</span>
              <div>
                <strong>Surface Defect Inspection</strong>
                <small>Micro-scratches, cracks &amp; dents in real time</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .opu- prefix, container-query responsive)
============================================================ */

const CSS = `
.opu-root {
  --opu-blue-950: #03152F;
  --opu-blue-900: #05245A;
  --opu-blue-800: #06357D;
  --opu-blue-700: #0757B8;
  --opu-blue: #0878E8;
  --opu-yellow: #FFD400;
  --opu-cyan: #00D4FF;
  --opu-white: #FFFFFF;
  --opu-gray-200: #DCE5F0;
  --opu-gray-400: #8FA2BA;
  --opu-green: #21E68A;
  --opu-red: #FF4B5C;

  width: 100%;
  container-type: inline-size;
  container-name: opu;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.opu-root *, .opu-root *::before, .opu-root *::after { box-sizing: border-box; }

.opu-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: linear-gradient(135deg, #041A3A 0%, #052B65 55%, #041A3A 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,90,200,0.08);
  padding: clamp(16px, 3.2cqw, 34px);
}

.opu-bgfx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.opu-grid {
  position: absolute; inset: 0; opacity: 0.1;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}
.opu-corner { position: absolute; border: 1px solid rgba(0,212,255,0.16); opacity: 0.5; }
.opu-corner-a { width: 220px; height: 110px; top: 120px; left: -100px; border-right: 0; }
.opu-corner-b { width: 240px; height: 150px; right: -120px; bottom: 60px; border-left: 0; }

.opu-layout {
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

@container opu (max-width: 780px) {
  .opu-layout {
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

.opu-header { grid-area: header; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.opu-logo { color: #fff; font-size: clamp(12px, 1.6cqw, 16px); font-weight: 800; letter-spacing: 1px; }
.opu-logo span { color: var(--opu-yellow); }
.opu-producttag { display: flex; align-items: center; gap: 10px; color: #fff; font-size: clamp(9px, 1.1cqw, 11px); font-weight: 700; letter-spacing: 0.8px; opacity: 0.9; }
.opu-producttag em { font-style: normal; color: var(--opu-yellow); }
.opu-line { width: 22px; height: 2px; background: var(--opu-yellow); display: inline-block; }

.opu-hero { grid-area: hero; color: #fff; }
.opu-hero h1 { margin: clamp(6px,1.5cqw,14px) 0 0; font-size: clamp(28px, 5.6cqw, 48px); line-height: 0.95; font-weight: 800; letter-spacing: -1.5px; }
.opu-hero h1 span { color: var(--opu-cyan); }
.opu-hero p { margin: 10px 0 0; max-width: 50ch; font-size: clamp(12px, 1.5cqw, 14px); color: #B9C9DF; line-height: 1.5; }
.opu-taglist { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.opu-pill { padding: 6px 11px; border-radius: 5px; background: var(--opu-yellow); color: var(--opu-blue-950); font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; }
.opu-pill-ghost { background: rgba(255,255,255,0.08); color: #E7EEF8; border: 1px solid rgba(255,255,255,0.18); }
.opu-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 10px 16px; border-radius: 8px; background: var(--opu-blue-700); color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.opu-cta:hover { background: var(--opu-blue); transform: translateY(-1px); }

.opu-stage {
  grid-area: stage;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #020B18;
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1000 / 400;
}
.opu-stage-label {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  font-size: clamp(7px, 1.7cqw, 9px); font-weight: 700; letter-spacing: 0.7px; color: #9FC0E0;
  background: rgba(2,11,24,0.75);
  padding: 3px 7px;
  border-radius: 5px;
  max-width: calc(100% - 16px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.opu-svg { width: 100%; height: 100%; display: block; }

.opu-conveyor-top { fill: #172B47; }
.opu-conveyor-side { fill: #091B34; }
.opu-roller { fill: #08172C; stroke: #315274; stroke-width: 1; }
.opu-sensor-body { fill: #182C47; stroke: #6B83A2; stroke-width: 1; }
.opu-sensor-led { filter: drop-shadow(0 0 4px rgba(0,212,255,0.8)); }
.opu-sensor-beam { stroke: #00D4FF; stroke-width: 1.5; stroke-dasharray: 5 4; opacity: 0; }
.opu-gantry-bar { fill: #182C47; stroke: #2E4F72; stroke-width: 1; }
.opu-gantry-post { fill: #7F91A7; }
.opu-camera-body { fill: #102B54; stroke: #6C86A8; stroke-width: 1; }
.opu-camera-face { fill: #061A38; }
.opu-camera-ring { fill: none; stroke: var(--opu-cyan); stroke-width: 3; filter: drop-shadow(0 0 6px rgba(0,212,255,0.7)); }
.opu-camera-lens { fill: #020A17; stroke: #2D74C8; stroke-width: 2; }
.opu-camera-cyan { fill: #00D4FF; opacity: 0.75; }
.opu-spec-body { fill: #0E2545; stroke: #6C86A8; stroke-width: 1; }
.opu-spec-dot { fill: var(--opu-green); filter: drop-shadow(0 0 4px rgba(33,230,138,0.8)); }
.opu-beam { opacity: 0; }
.opu-scanline { stroke: var(--opu-cyan); stroke-width: 2; opacity: 0; filter: drop-shadow(0 0 6px rgba(0,212,255,0.9)); }
.opu-reject-body { fill: #273E5B; stroke: #7186A0; stroke-width: 1; }
.opu-reject-head { fill: var(--opu-yellow); }
.opu-reject-bin { fill: #12203a; stroke: rgba(255,255,255,0.12); }
.opu-reject-flash { fill: rgba(255,75,92,0.25); filter: blur(6px); }

.opu-part-shadow { fill: rgba(0,0,0,0.35); }
.opu-outer { fill: #B0BCC8; stroke: #7A8FA3; stroke-width: 1.2; }
.opu-outer-fault { fill: #C07070; stroke: #A05050; }
.opu-mid { fill: #8098AE; }
.opu-inner { fill: #9AAFC2; stroke: #6C82A0; stroke-width: 1; }
.opu-hub { fill: #041525; }
.opu-hub2 { fill: #0A2035; }
.opu-highlight { fill: rgba(255,255,255,0.18); }
.opu-badge-bg { fill: var(--opu-green); }
.opu-badge-bg-fail { fill: var(--opu-red); }
.opu-badge-mark { stroke: #04203c; stroke-width: 1.6; fill: none; stroke-linecap: round; stroke-linejoin: round; }

.opu-status {
  grid-area: status;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 9px 13px; border-radius: 8px;
  background: rgba(3,20,43,0.9); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 10.5px; font-weight: 700; width: fit-content; max-width: 100%;
}
.opu-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--opu-green); box-shadow: 0 0 8px var(--opu-green); flex: none; }

.opu-panel {
  grid-area: panel;
  padding: clamp(12px, 1.8cqw, 17px);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(8,44,96,0.97), rgba(3,22,48,0.97));
  border: 1px solid rgba(88,153,230,0.35);
  box-shadow: 0 20px 45px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.08);
}
.opu-panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.opu-panel-title { color: #fff; font-size: 13px; font-weight: 800; }
.opu-running { display: flex; align-items: center; gap: 6px; color: var(--opu-green); font-size: 9px; font-weight: 800; letter-spacing: 0.5px; }
.opu-running-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--opu-green); box-shadow: 0 0 8px var(--opu-green); }

.opu-preview { position: relative; height: 128px; border-radius: 9px; overflow: hidden; background: #020B18; border: 1px solid rgba(255,255,255,0.1); }
.opu-preview-label { position: absolute; top: 8px; left: 9px; z-index: 3; font-size: 8px; color: #7EA0C7; font-weight: 700; letter-spacing: 0.6px; }
.opu-preview-dim { position: absolute; top: 8px; right: 9px; z-index: 3; font-size: 8px; color: var(--opu-yellow); font-weight: 700; font-family: monospace; opacity: 0; transition: opacity 0.2s; }
.opu-preview-part { position: absolute; top: 26px; left: 50%; transform: translateX(-50%); width: 62px; height: 62px; }
.opu-preview-disc { position: relative; width: 100%; height: 100%; border-radius: 50%; background: #B0BCC8; border: 1px solid #7A8FA3; }
.opu-preview-disc span:nth-child(1) { position: absolute; inset: 12%; border-radius: 50%; background: #8098AE; }
.opu-preview-disc span:nth-child(2) { position: absolute; inset: 32%; border-radius: 50%; background: #9AAFC2; border: 1px solid #6C82A0; }
.opu-preview-disc span:nth-child(3) { position: absolute; inset: 44%; border-radius: 50%; background: #041525; }
.opu-preview-cross { position: absolute; inset: 0; }
.opu-preview-cross::before, .opu-preview-cross::after { content: ""; position: absolute; background: rgba(0,212,255,0.25); }
.opu-preview-cross::before { left: 50%; top: 0; bottom: 0; width: 1px; }
.opu-preview-cross::after { top: 50%; left: 0; right: 0; height: 1px; }
.opu-preview-spectrum { position: absolute; bottom: 0; left: 0; right: 0; height: 16%; background: linear-gradient(90deg,#FF4B5C,#FF8C42,#FFD400,#21E68A,#00D4FF,#8B5CF6); opacity: 0.8; }
.opu-preview-marker { position: absolute; top: 0; bottom: 0; width: 3px; border-radius: 2px; background: #fff; box-shadow: 0 0 6px #fff; left: 50%; transition: left 0.4s ease; }
.opu-preview-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: var(--opu-cyan); box-shadow: 0 0 12px var(--opu-cyan); opacity: 0; }

.opu-result { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding: 11px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.opu-result-label { color: #7D96B5; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; }
.opu-result-value { font-size: 18px; font-weight: 800; color: var(--opu-green); margin-top: 2px; }
.opu-confidence { text-align: right; color: #8EA7C4; font-size: 8px; }
.opu-confidence strong { display: block; color: #fff; font-size: 13px; margin-top: 2px; }

.opu-captured { margin-top: 10px; }
.opu-captured-title { color: #7693B5; font-size: 8px; margin-bottom: 5px; font-weight: 700; letter-spacing: 0.3px; }
.opu-captured-row { display: flex; justify-content: space-between; padding: 5px 7px; margin-bottom: 3px; background: rgba(255,255,255,0.035); border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #DCE8F7; }
.opu-captured-row span:first-child { color: #7D96B5; font-family: Inter, sans-serif; }

.opu-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.opu-stat { padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.opu-stat-title { color: #718AA7; font-size: 7px; letter-spacing: 0.3px; }
.opu-stat-value { color: #fff; font-size: 12.5px; font-weight: 800; margin-top: 3px; }
.opu-stat-yellow { color: var(--opu-yellow); }
.opu-stat-red { color: var(--opu-red); }

.opu-features { grid-area: features; display: flex; gap: 10px; flex-wrap: wrap; }
.opu-feature { flex: 1 1 200px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(4,26,58,0.82); border: 1px solid rgba(93,145,205,0.2); }
.opu-feature-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(0,212,255,0.12); color: var(--opu-cyan); font-size: 12px; flex: none; }
.opu-feature strong { display: block; color: #fff; font-size: 10.5px; }
.opu-feature small { color: #7891AE; font-size: 8.5px; display: block; margin-top: 2px; }

@container opu (max-width: 480px) {
  .opu-features { flex-direction: column; }
  .opu-result-value { font-size: 15px; }
}

/* ---------- compact variant: fill an existing image/video slot ---------- */
.opu-root.opu-compact { height: auto; }
.opu-compact .opu-card { height: auto; padding: clamp(10px, 1.6cqw, 16px); border-radius: 0; border: none; box-shadow: none; }
.opu-compact .opu-header,
.opu-compact .opu-hero,
.opu-compact .opu-status,
.opu-compact .opu-features { display: none; }
.opu-compact .opu-layout {
  height: auto;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  grid-template-areas:
    "stage panel"
    "stagefoot panel";
  align-items: start;
}
.opu-compact .opu-stage { aspect-ratio: 1000 / 400; height: auto; }
.opu-compact .opu-panel { height: auto; overflow: visible; }

.opu-stage-foot { grid-area: stagefoot; display: none; }
.opu-compact .opu-stage-foot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.opu-mini { padding: 10px 11px; border-radius: 10px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 5px; }
.opu-mini-label { font-size: 7.5px; letter-spacing: 0.5px; color: #7D96B5; font-weight: 700; }
.opu-mini-value { font-size: clamp(11px, 1.5cqw, 15px); font-weight: 800; color: #fff; font-variant-numeric: tabular-nums; }

@container opu (max-width: 900px) {
  .opu-compact .opu-stage-foot { grid-template-columns: repeat(2, 1fr); }
}
@container opu (max-width: 680px) {
  .opu-compact .opu-layout { grid-template-columns: 1fr; grid-template-areas: "stage" "panel"; }
  .opu-compact .opu-stage { aspect-ratio: 4 / 3; }
  .opu-compact .opu-stage-foot { display: none; }
}
@container opu (max-width: 380px) {
  .opu-compact .opu-stage { aspect-ratio: 1 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .opu-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;