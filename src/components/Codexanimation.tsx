

/**
 * CodexAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated product hero for PIXTRON CODEX (Code Reading & OCR).
 *
 * - Built with GSAP for the conveyor / camera / decode animation.
 * - Fully self-contained: styles are injected via a scoped <style> tag,
 *   nothing here depends on Tailwind or any external CSS file.
 * - Responsive with CSS *container queries* (not just viewport media
 *   queries) so it lays out correctly no matter how narrow the card/frame
 *   is that you drop it into (e.g. inside a ProductDetail panel), not only
 *   how wide the browser window is.
 * - No fixed pixel overlays: layout is CSS Grid based, so nothing clips or
 *   overlaps on small screens.
 * - Respects prefers-reduced-motion.
 * - Safe for multiple instances on one page (all ids are unique per
 *   instance via React's useId).
 *
 * Usage:
 *   npm install gsap
 *   import CodexAnimation from "./CodexAnimation";
 *   <CodexAnimation brochureHref="/files/codex-brochure.pdf" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   TYPES
============================================================ */

type CodeType = "barcode" | "qr" | "datamatrix";

interface Product {
  brand: string;
  codeType: CodeType;
  value: string;
  lot: string;
  mfg: string;
  exp: string;
}

export interface CodexAnimationProps {
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

const BRANDS = ["ACECLO-PLUS", "MEDIVEX 500", "NUTRIGO SYRUP", "CARDIOSAFE", "PULMOCARE"];
const CODE_TYPES: CodeType[] = ["barcode", "qr", "datamatrix"];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function randomProduct(): Product {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const codeType = CODE_TYPES[Math.floor(Math.random() * CODE_TYPES.length)];
  const lot = "BTH" + Math.floor(200000 + Math.random() * 90000);
  const d = new Date();
  const mfg = `${pad(d.getMonth() + 1)}/${d.getFullYear() - 1}`;
  const exp = `${pad(d.getMonth() + 1)}/${d.getFullYear() + 2}`;
  const value =
    codeType === "barcode"
      ? "8901" + Math.floor(100000000 + Math.random() * 900000000)
      : codeType === "qr"
      ? `(01)0890123${Math.floor(100000 + Math.random() * 900000)}(17)${exp.replace("/", "")}`
      : "DM-" + Math.random().toString(36).slice(2, 10).toUpperCase();
  return { brand, codeType, value, lot, mfg, exp };
}

const CODE_LABEL: Record<CodeType, string> = {
  barcode: "1D BARCODE",
  qr: "QR CODE",
  datamatrix: "DATA MATRIX",
};

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

function buildBarcode(w: number, h: number): SVGGElement {
  const g = el("g");
  let x = 0;
  while (x < w) {
    const barW = 1.4 + Math.random() * 2.6;
    if (Math.random() > 0.42) {
      g.appendChild(
        el("rect", { x: x.toFixed(1), y: 0, width: barW.toFixed(1), height: h, class: "cxh-code-bar" })
      );
    }
    x += barW + 1;
  }
  return g;
}

function buildQR(size: number): SVGGElement {
  const g = el("g");
  const cells = 9;
  const cell = size / cells;
  const finder = (fx: number, fy: number) => {
    g.appendChild(el("rect", { x: fx, y: fy, width: cell * 3, height: cell * 3, class: "cxh-code-bar" }));
    g.appendChild(
      el("rect", { x: fx + cell, y: fy + cell, width: cell, height: cell, class: "cxh-code-bg" })
    );
  };
  finder(0, 0);
  finder(size - cell * 3, 0);
  finder(0, size - cell * 3);
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const inCorner =
        (r < 3 && c < 3) || (r < 3 && c > cells - 4) || (r > cells - 4 && c < 3);
      if (inCorner) continue;
      if (Math.random() > 0.52) {
        g.appendChild(
          el("rect", {
            x: (c * cell).toFixed(1),
            y: (r * cell).toFixed(1),
            width: cell.toFixed(1),
            height: cell.toFixed(1),
            class: "cxh-code-bar",
          })
        );
      }
    }
  }
  return g;
}

function buildDataMatrix(size: number): SVGGElement {
  const g = el("g");
  const cells = 8;
  const cell = size / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      let on = Math.random() > 0.5;
      if (c === 0 || r === cells - 1) on = true; // solid L border
      if ((c === cells - 1 || r === 0) && (r + c) % 2 === 0) on = true; // clock track
      if (on) {
        g.appendChild(
          el("rect", {
            x: (c * cell).toFixed(1),
            y: (r * cell).toFixed(1),
            width: (cell - 0.6).toFixed(1),
            height: (cell - 0.6).toFixed(1),
            class: "cxh-code-bar",
          })
        );
      }
    }
  }
  return g;
}

function buildCode(type: CodeType, w: number, h: number): SVGGElement {
  if (type === "barcode") return buildBarcode(w, h);
  const size = Math.min(w, h);
  const g = type === "qr" ? buildQR(size) : buildDataMatrix(size);
  g.setAttribute("transform", `translate(${((w - size) / 2).toFixed(1)},0)`);
  return g;
}

function buildCarton(product: Product): SVGGElement {
  const g = el("g", { class: "cxh-carton" });

  // shadow
  g.appendChild(el("ellipse", { cx: 34, cy: 66, rx: 34, ry: 5, class: "cxh-carton-shadow" }));

  // box body
  g.appendChild(el("rect", { x: 0, y: 8, width: 68, height: 52, rx: 4, class: "cxh-carton-box" }));
  g.appendChild(el("rect", { x: 0, y: 8, width: 68, height: 14, rx: 4, class: "cxh-carton-top" }));
  g.appendChild(el("rect", { x: 0, y: 18, width: 10, height: 42, class: "cxh-carton-blue" }));

  // brand text
  const brandText = el("text", { x: 15, y: 27, class: "cxh-carton-brand" });
  brandText.textContent = product.brand.split(" ")[0];
  g.appendChild(brandText);

  // label area (white patch holding the code)
  const labelX = 13;
  const labelY = 32;
  const labelW = 44;
  const labelH = 22;
  g.appendChild(
    el("rect", { x: labelX, y: labelY, width: labelW, height: labelH, rx: 2, class: "cxh-code-label" })
  );
  const codeG = buildCode(product.codeType, labelW - 6, labelH - 10);
  codeG.setAttribute("transform", `translate(${labelX + 3},${labelY + 3})`);
  g.appendChild(codeG);

  const lotText = el("text", { x: labelX + 3, y: labelY + labelH - 2, class: "cxh-carton-lot" });
  lotText.textContent = product.lot;
  g.appendChild(lotText);

  // pass/fail badge (hidden until result phase)
  const badge = el("g", { class: "cxh-badge", opacity: 0 });
  badge.appendChild(el("circle", { cx: 60, cy: 14, r: 9, class: "cxh-badge-bg" }));
  const mark = el("path", { d: "M 56 14 L 59 17 L 65 10", class: "cxh-badge-mark" });
  badge.appendChild(mark);
  g.appendChild(badge);
  (g as any)._badgeCircle = badge.firstChild;
  (g as any)._badgeMark = mark;
  (g as any)._badgeGroup = badge;

  return g;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function CodexAnimation({ brochureHref, className, variant = "full" }: CodexAnimationProps) {
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
        gsap.fromTo(
          rejectFlashRef.current,
          { opacity: 0.85 },
          { opacity: 0, duration: 0.5 }
        );
      }
    };

    const updatePanel = (product: Product, faulty: boolean) => {
      setText("codeType", CODE_LABEL[product.codeType]);
      setText("decodedValue", product.value);
      setText("lotValue", product.lot + (faulty ? "" : " \u2713"));
      setText("mfgValue", product.mfg + (faulty ? "" : " \u2713"));
      setText("expValue", product.exp + (faulty ? "" : " \u2713"));
      setColor("lotValue", faulty ? "var(--cxh-red)" : "var(--cxh-green)");
      setColor("mfgValue", faulty ? "var(--cxh-red)" : "var(--cxh-green)");
      setColor("expValue", faulty ? "var(--cxh-red)" : "var(--cxh-green)");

      const conf = faulty ? (61 + Math.random() * 20).toFixed(1) : (98.4 + Math.random() * 1.5).toFixed(1);
      setText("confidenceValue", conf + "%");

      if (faulty) {
        setText("resultValue", "FAIL");
        setColor("resultValue", "var(--cxh-red)");
        setText("statusText", "READ FAILURE");
      } else {
        setText("resultValue", "PASS");
        setColor("resultValue", "var(--cxh-green)");
        setText("statusText", "CODE VERIFIED");
      }
      root.querySelectorAll<HTMLElement>('[data-role="statusLight"]').forEach((n) => {
        n.style.background = faulty ? "var(--cxh-red)" : "var(--cxh-green)";
        n.style.boxShadow = faulty ? "0 0 8px var(--cxh-red)" : "0 0 8px var(--cxh-green)";
      });
    };

    const inspectProduct = (product: Product, faulty: boolean) => {
      setText("statusText", "DECODING ARRAY\u2026");

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

      window.setTimeout(() => updatePanel(product, faulty), 240);

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
      const carton = buildCarton(product);
      productsGroupRef.current.appendChild(carton);
      gsap.set(carton, { x: -70, y: 0 });

      const tl = gsap.timeline({
        onComplete: () => carton.remove(),
      });

      tl.to(carton, { x: 210, duration: 1.0, ease: "none" });
      tl.add(() => pulseSensor(), ">-0.15");
      tl.to(carton, { x: 460, duration: 1.0, ease: "none" });
      tl.add(() => inspectProduct(product, faulty));
      // Conveyor never stops — the carton keeps rolling straight through.
      // inspectProduct() below fires a fast strobe (~0.5s) right as the
      // carton crosses the camera, so the light lands on it without the
      // belt needing to pause.
      tl.to(carton, { x: 740, duration: 1.0, ease: "none" });
      tl.add(() => {
        counts.read += 1;
        const grp = (carton as any)._badgeGroup as SVGGElement | undefined;
        if (grp) {
          const mark = (carton as any)._badgeMark as SVGPathElement;
          const circle = grp.firstChild as SVGCircleElement;
          circle.setAttribute("class", faulty ? "cxh-badge-bg cxh-badge-bg-fail" : "cxh-badge-bg");
          mark.setAttribute("d", faulty ? "M 56 10 L 65 18 M 65 10 L 56 18" : "M 56 14 L 59 17 L 65 10");
          gsap.to(grp, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1, repeatDelay: 0.5 });
        }
        if (faulty) {
          counts.rejected += 1;
          rejectPulse();
          gsap.to(carton, { x: 770, y: -46, rotation: 12, opacity: 0, duration: 0.55, ease: "power2.out" });
        }
        updateStats();
      });
      if (!faulty) {
        tl.to(carton, { x: 1080, duration: 0.9, ease: "none" });
      }
    };

    // ambient / continuous animations
    const ambientTweens: gsap.core.Tween[] = [];
    if (rollersRef.current && !reduceMotion) {
      ambientTweens.push(
        gsap.to(rollersRef.current.querySelectorAll("circle"), {
          x: -30,
          duration: 0.7,
          repeat: -1,
          ease: "none",
          stagger: { each: 0.03, repeat: -1 },
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

    // Live metrics strip (line speed / camera fps / avg decode / uptime).
    const startedAt = Date.now();
    const formatUptime = (ms: number) => {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };
    setText("lineSpeed", "218 ppm");
    setText("camFps", "240 fps");
    setText("avgDecode", "34 ms");
    setText("uptime", "00:00:00");

    let metricsInterval: number | undefined;
    if (!reduceMotion) {
      metricsInterval = window.setInterval(() => {
        setText("lineSpeed", `${205 + Math.floor(Math.random() * 22)} ppm`);
        setText("camFps", `${236 + Math.floor(Math.random() * 10)} fps`);
        setText("avgDecode", `${29 + Math.floor(Math.random() * 14)} ms`);
        setText("uptime", formatUptime(Date.now() - startedAt));
      }, 1000);
    }

    // Clears any in-flight cartons/tweens — used both on unmount and when
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
      interval = window.setInterval(spawnProduct, 2600);
    };

    if (reduceMotion) {
      // Render a single static illustrative frame instead of a running loop.
      spawnProduct();
    } else {
      startSpawnLoop();
    }

    // Background/throttled tabs make timers (and GSAP's own ticker) fall
    // behind; on switching back, all the queued/delayed spawns used to fire
    // in a burst and land on top of each other. Instead: stop spawning while
    // hidden, and wipe + restart fresh the moment the tab is visible again.
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

  const gradId = `cxh-beam-${uid}`;

  return (
    <div ref={rootRef} className={`cxh-root ${variant === "compact" ? "cxh-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="cxh-card">
        <div className="cxh-bgfx" aria-hidden="true">
          <div className="cxh-grid" />
          <span className="cxh-corner cxh-corner-a" />
          <span className="cxh-corner cxh-corner-b" />
        </div>

        <div className="cxh-layout">
          {/* HEADER */}
          <div className="cxh-header">
            <div className="cxh-logo">
              PIXTRON <span>SYSTEMS</span>
            </div>
            <div className="cxh-producttag">
              <span className="cxh-line" />
              CODEX <em>|</em> CODE READING &amp; OCR
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="cxh-hero">
            <h1>
              COD<span>EX</span>
            </h1>
            <p>
              Ultra-fast reading and OCR-based verification of 1D/2D codes, including
              pharma-grade traceability labels.
            </p>
            <div className="cxh-taglist">
              <span className="cxh-pill">1D &amp; 2D ARRAY DECODING</span>
              <span className="cxh-pill cxh-pill-ghost">OCR / OCV</span>
            </div>
            {brochureHref && (
              <a className="cxh-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
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
          <div className="cxh-stage">
            <div className="cxh-stage-label">LIVE INSPECTION VIEW</div>
            <svg viewBox="0 0 1000 400" className="cxh-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1495FF" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#1495FF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* conveyor */}
              <rect x="0" y="290" width="1000" height="10" className="cxh-conveyor-top" />
              <rect x="0" y="300" width="1000" height="26" className="cxh-conveyor-side" />
              <g ref={rollersRef}>
                {Array.from({ length: 26 }).map((_, i) => (
                  <circle key={i} cx={-20 + i * 42} cy={313} r={7} className="cxh-roller" />
                ))}
              </g>

              {/* sensor */}
              <g transform="translate(210,220)">
                <rect x="-10" y="-14" width="20" height="20" rx="3" className="cxh-sensor-body" />
                <circle ref={sensorLedRef} cx="0" cy="-4" r="3" fill="#FF3348" className="cxh-sensor-led" />
                <line ref={sensorBeamRef} x1="0" y1="6" x2="0" y2="76" className="cxh-sensor-beam" />
              </g>

              {/* camera */}
              <g transform="translate(495,40)">
                <rect x="-6" y="-30" width="12" height="30" className="cxh-mount" />
                <rect x="-34" y="0" width="68" height="52" rx="10" className="cxh-camera-body" />
                <circle cx="0" cy="66" r="26" className="cxh-camera-face" />
                <circle ref={cameraRingRef} cx="0" cy="66" r="21" className="cxh-camera-ring" />
                <circle cx="0" cy="66" r="13" className="cxh-camera-lens" />
                <circle cx="0" cy="66" r="6" className="cxh-camera-blue" />
                <polygon
                  ref={beamRef}
                  points="-24,92 24,92 70,250 -70,250"
                  fill={`url(#${gradId})`}
                  className="cxh-beam"
                />
              </g>
              <line ref={scanLineRef} x1="430" y1="150" x2="430" y2="292" className="cxh-scanline" />

              {/* rejector */}
              <g transform="translate(830,230)">
                <rect x="-8" y="0" width="16" height="60" className="cxh-reject-body" />
                <rect ref={rejectHeadRef} x="-30" y="24" width="24" height="12" rx="2" className="cxh-reject-head" />
                <path d="M 40 60 L 92 60 L 78 110 L 30 110 Z" className="cxh-reject-bin" />
                <circle ref={rejectFlashRef} cx="60" cy="80" r="30" className="cxh-reject-flash" opacity="0" />
              </g>

              {/* products travel on this group */}
              <g transform="translate(0,238)">
                <g ref={productsGroupRef} />
              </g>
            </svg>
          </div>

          {/* LIVE METRICS STRIP — desktop-compact only; fills the space left
              under the (short, wide) stage next to the taller panel. Hidden
              entirely on narrow/mobile frames where the layout stacks and
              there's no spare room for it. */}
          <div className="cxh-stage-foot">
            <div className="cxh-mini">
              <span className="cxh-mini-label">LINE SPEED</span>
              <span className="cxh-mini-value" data-role="lineSpeed">
                &mdash;
              </span>
            </div>
            <div className="cxh-mini">
              <span className="cxh-mini-label">CAMERA FPS</span>
              <span className="cxh-mini-value" data-role="camFps">
                &mdash;
              </span>
            </div>
            <div className="cxh-mini">
              <span className="cxh-mini-label">AVG DECODE</span>
              <span className="cxh-mini-value" data-role="avgDecode">
                &mdash;
              </span>
            </div>
            <div className="cxh-mini">
              <span className="cxh-mini-label">UPTIME</span>
              <span className="cxh-mini-value" data-role="uptime">
                00:00:00
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="cxh-status">
            <span className="cxh-status-dot" data-role="statusLight" />
            <span data-role="statusText">SYSTEM READY</span>
          </div>

          {/* SOFTWARE PANEL */}
          <div className="cxh-panel">
            <div className="cxh-panel-head">
              <span className="cxh-panel-title">CODEX LIVE FEED</span>
              <span className="cxh-running">
                <i className="cxh-running-dot" /> LIVE
              </span>
            </div>

            <div className="cxh-preview">
              <span className="cxh-preview-label" data-role="codeType">
                &mdash;
              </span>
              <div className="cxh-preview-product">
                <span className="cxh-preview-brand">
                  CODEX
                </span>
                <div className="cxh-preview-box" />
              </div>
              <span className="cxh-preview-scan" data-role="previewScan" />
            </div>

            <div className="cxh-result">
              <div>
                <div className="cxh-result-label">DECODE RESULT</div>
                <div className="cxh-result-value" data-role="resultValue">
                  &mdash;
                </div>
              </div>
              <div className="cxh-confidence">
                CONFIDENCE
                <strong data-role="confidenceValue">&mdash;</strong>
              </div>
            </div>

            <div className="cxh-captured">
              <div className="cxh-captured-title">DECODED FIELDS</div>
              <div className="cxh-captured-row">
                <span>VALUE</span>
                <span data-role="decodedValue">&mdash;</span>
              </div>
              <div className="cxh-captured-row">
                <span>LOT NO</span>
                <span data-role="lotValue">&mdash;</span>
              </div>
              <div className="cxh-captured-row">
                <span>MFG DATE</span>
                <span data-role="mfgValue">&mdash;</span>
              </div>
              <div className="cxh-captured-row">
                <span>EXP DATE</span>
                <span data-role="expValue">&mdash;</span>
              </div>
            </div>

            <div className="cxh-stats">
              <div className="cxh-stat">
                <div className="cxh-stat-title">CODES READ</div>
                <div className="cxh-stat-value" data-role="statRead">
                  0
                </div>
              </div>
              <div className="cxh-stat">
                <div className="cxh-stat-title">READ RATE</div>
                <div className="cxh-stat-value cxh-stat-yellow" data-role="statRate">
                  100.0%
                </div>
              </div>
              <div className="cxh-stat">
                <div className="cxh-stat-title">REJECTED</div>
                <div className="cxh-stat-value cxh-stat-red" data-role="statRejected">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="cxh-features">
            <div className="cxh-feature">
              <span className="cxh-feature-icon">&#9636;</span>
              <div>
                <strong>1D &amp; 2D Array Decoding</strong>
                <small>QR, DataMatrix &amp; damaged barcodes</small>
              </div>
            </div>
            <div className="cxh-feature">
              <span className="cxh-feature-icon">&#10003;</span>
              <div>
                <strong>Pharma Traceability</strong>
                <small>GS1 &amp; global track-and-trace</small>
              </div>
            </div>
            <div className="cxh-feature">
              <span className="cxh-feature-icon">&#9889;</span>
              <div>
                <strong>High-Speed OCR/OCV</strong>
                <small>Lot, batch &amp; expiry verification</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .cxh- prefix, container-query responsive)
============================================================ */

const CSS = `
.cxh-root {
  --cxh-blue-950: #03152F;
  --cxh-blue-900: #05245A;
  --cxh-blue-800: #06357D;
  --cxh-blue-700: #0757B8;
  --cxh-blue: #0878E8;
  --cxh-yellow: #FFD400;
  --cxh-white: #FFFFFF;
  --cxh-gray-200: #DCE5F0;
  --cxh-gray-400: #8FA2BA;
  --cxh-green: #21E68A;
  --cxh-red: #FF4B5C;

  width: 100%;
  container-type: inline-size;
  container-name: cxh;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.cxh-root *, .cxh-root *::before, .cxh-root *::after { box-sizing: border-box; }

.cxh-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: linear-gradient(135deg, #041A3A 0%, #052B65 55%, #041A3A 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,90,200,0.08);
  padding: clamp(16px, 3.2cqw, 34px);
}

.cxh-bgfx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.cxh-grid {
  position: absolute; inset: 0; opacity: 0.1;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}
.cxh-corner { position: absolute; border: 1px solid rgba(255,212,0,0.16); opacity: 0.5; }
.cxh-corner-a { width: 220px; height: 110px; top: 120px; left: -100px; border-right: 0; }
.cxh-corner-b { width: 240px; height: 150px; right: -120px; bottom: 60px; border-left: 0; }

.cxh-layout {
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

@container cxh (max-width: 780px) {
  .cxh-layout {
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

.cxh-header { grid-area: header; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.cxh-logo { color: #fff; font-size: clamp(12px, 1.6cqw, 16px); font-weight: 800; letter-spacing: 1px; }
.cxh-logo span { color: var(--cxh-yellow); }
.cxh-producttag { display: flex; align-items: center; gap: 10px; color: #fff; font-size: clamp(9px, 1.1cqw, 11px); font-weight: 700; letter-spacing: 0.8px; opacity: 0.9; }
.cxh-producttag em { font-style: normal; color: var(--cxh-yellow); }
.cxh-line { width: 22px; height: 2px; background: var(--cxh-yellow); display: inline-block; }

.cxh-hero { grid-area: hero; color: #fff; }
.cxh-hero h1 { margin: clamp(6px,1.5cqw,14px) 0 0; font-size: clamp(30px, 6.2cqw, 52px); line-height: 0.95; font-weight: 800; letter-spacing: -1.5px; }
.cxh-hero h1 span { color: var(--cxh-yellow); }
.cxh-hero p { margin: 10px 0 0; max-width: 46ch; font-size: clamp(12px, 1.5cqw, 14px); color: #B9C9DF; line-height: 1.5; }
.cxh-taglist { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.cxh-pill { padding: 6px 11px; border-radius: 5px; background: var(--cxh-yellow); color: var(--cxh-blue-950); font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; }
.cxh-pill-ghost { background: rgba(255,255,255,0.08); color: #E7EEF8; border: 1px solid rgba(255,255,255,0.18); }
.cxh-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 10px 16px; border-radius: 8px; background: var(--cxh-blue-700); color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.cxh-cta:hover { background: var(--cxh-blue); transform: translateY(-1px); }

.cxh-stage {
  grid-area: stage;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #020B18;
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1000 / 400;
}
.cxh-stage-label {
  position: absolute; top: 10px; left: 12px; z-index: 2;
  font-size: 9px; font-weight: 700; letter-spacing: 0.8px; color: #7EA0C7;
}
.cxh-svg { width: 100%; height: 100%; display: block; }

.cxh-conveyor-top { fill: #172B47; }
.cxh-conveyor-side { fill: #091B34; }
.cxh-roller { fill: #08172C; stroke: #315274; stroke-width: 1; }
.cxh-sensor-body { fill: #182C47; stroke: #6B83A2; stroke-width: 1; }
.cxh-sensor-led { filter: drop-shadow(0 0 4px rgba(255,51,72,0.8)); }
.cxh-sensor-beam { stroke: #FF4055; stroke-width: 1.5; stroke-dasharray: 5 4; opacity: 0; }
.cxh-mount { fill: #7F91A7; }
.cxh-camera-body { fill: #102B54; stroke: #6C86A8; stroke-width: 1; }
.cxh-camera-face { fill: #061A38; }
.cxh-camera-ring { fill: none; stroke: var(--cxh-yellow); stroke-width: 3; filter: drop-shadow(0 0 6px rgba(255,212,0,0.7)); }
.cxh-camera-lens { fill: #020A17; stroke: #2D74C8; stroke-width: 2; }
.cxh-camera-blue { fill: #1495FF; opacity: 0.75; }
.cxh-beam { opacity: 0; }
.cxh-scanline { stroke: var(--cxh-yellow); stroke-width: 2; opacity: 0; filter: drop-shadow(0 0 6px rgba(255,212,0,0.9)); }
.cxh-reject-body { fill: #273E5B; stroke: #7186A0; stroke-width: 1; }
.cxh-reject-head { fill: var(--cxh-yellow); }
.cxh-reject-bin { fill: #12203a; stroke: rgba(255,255,255,0.12); }
.cxh-reject-flash { fill: rgba(255,75,92,0.25); filter: blur(6px); }

.cxh-carton-shadow { fill: rgba(0,0,0,0.35); }
.cxh-carton-box { fill: #F7FAFD; stroke: #D3DDEA; stroke-width: 1; }
.cxh-carton-top { fill: #EDF2F9; }
.cxh-carton-blue { fill: var(--cxh-blue-800); }
.cxh-carton-brand { font-family: Inter, sans-serif; font-size: 6.5px; font-weight: 800; fill: #0B1E38; }
.cxh-carton-lot { font-family: monospace; font-size: 4.6px; fill: #57708F; }
.cxh-code-label { fill: #ffffff; stroke: var(--cxh-yellow); stroke-width: 0.6; }
.cxh-code-bar { fill: #0B1E38; }
.cxh-code-bg { fill: #ffffff; }
.cxh-badge-bg { fill: var(--cxh-green); }
.cxh-badge-bg-fail { fill: var(--cxh-red); }
.cxh-badge-mark { stroke: #04203c; stroke-width: 1.6; fill: none; stroke-linecap: round; stroke-linejoin: round; }

.cxh-status {
  grid-area: status;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 9px 13px; border-radius: 8px;
  background: rgba(3,20,43,0.9); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 10.5px; font-weight: 700; width: fit-content; max-width: 100%;
}
.cxh-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--cxh-green); box-shadow: 0 0 8px var(--cxh-green); flex: none; }

.cxh-panel {
  grid-area: panel;
  padding: clamp(12px, 1.8cqw, 17px);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(8,44,96,0.97), rgba(3,22,48,0.97));
  border: 1px solid rgba(88,153,230,0.35);
  box-shadow: 0 20px 45px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.08);
}
.cxh-panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.cxh-panel-title { color: #fff; font-size: 13px; font-weight: 800; }
.cxh-running { display: flex; align-items: center; gap: 6px; color: var(--cxh-green); font-size: 9px; font-weight: 800; letter-spacing: 0.5px; }
.cxh-running-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cxh-green); box-shadow: 0 0 8px var(--cxh-green); }

.cxh-preview { position: relative; height: 118px; border-radius: 9px; overflow: hidden; background: #020B18; border: 1px solid rgba(255,255,255,0.1); }
.cxh-preview-label { position: absolute; top: 8px; left: 9px; z-index: 3; font-size: 8px; color: #7EA0C7; font-weight: 700; letter-spacing: 0.6px; }
.cxh-preview-product { position: absolute; inset: 22px 16px 16px; border-radius: 5px; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.cxh-preview-brand { position: absolute; top: 8px; left: 10px; font-size: 9px; font-weight: 800; color: var(--cxh-blue-800); }
.cxh-preview-brand span { color: var(--cxh-yellow); }
.cxh-preview-box {
  width: 60%; height: 55%; border: 1px solid var(--cxh-yellow); box-shadow: 0 0 8px rgba(255,212,0,0.3); border-radius: 3px;
  background:
    repeating-linear-gradient(90deg, #0B1E38 0 2px, transparent 2px 5px);
}
.cxh-preview-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: var(--cxh-yellow); box-shadow: 0 0 12px var(--cxh-yellow); opacity: 0; }

.cxh-result { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding: 11px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.cxh-result-label { color: #7D96B5; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; }
.cxh-result-value { font-size: 18px; font-weight: 800; color: var(--cxh-green); margin-top: 2px; }
.cxh-confidence { text-align: right; color: #8EA7C4; font-size: 8px; }
.cxh-confidence strong { display: block; color: #fff; font-size: 13px; margin-top: 2px; }

.cxh-captured { margin-top: 10px; }
.cxh-captured-title { color: #7693B5; font-size: 8px; margin-bottom: 5px; font-weight: 700; letter-spacing: 0.3px; }
.cxh-captured-row { display: flex; justify-content: space-between; padding: 5px 7px; margin-bottom: 3px; background: rgba(255,255,255,0.035); border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #DCE8F7; }
.cxh-captured-row span:first-child { color: #7D96B5; font-family: Inter, sans-serif; }

.cxh-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.cxh-stat { padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.cxh-stat-title { color: #718AA7; font-size: 7px; letter-spacing: 0.3px; }
.cxh-stat-value { color: #fff; font-size: 12.5px; font-weight: 800; margin-top: 3px; }
.cxh-stat-yellow { color: var(--cxh-yellow); }
.cxh-stat-red { color: var(--cxh-red); }

.cxh-features { grid-area: features; display: flex; gap: 10px; flex-wrap: wrap; }
.cxh-feature { flex: 1 1 200px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(4,26,58,0.82); border: 1px solid rgba(93,145,205,0.2); }
.cxh-feature-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(255,212,0,0.12); color: var(--cxh-yellow); font-size: 12px; flex: none; }
.cxh-feature strong { display: block; color: #fff; font-size: 10.5px; }
.cxh-feature small { color: #7891AE; font-size: 8.5px; display: block; margin-top: 2px; }

@container cxh (max-width: 480px) {
  .cxh-features { flex-direction: column; }
  .cxh-stats { grid-template-columns: repeat(3, 1fr); }
  .cxh-result-value { font-size: 15px; }
}

/* ---------- compact variant: fill an existing image/video slot ----------
   Height is never forced/stretched here — the component always sizes to
   its own natural content height (stage keeps its aspect-ratio, panel
   sizes to its content). The parent frame should NOT impose a fixed
   aspect-ratio on this slide; let it size to whatever cxh-root reports
   (see the ProductDetailPage integration notes). This is what avoids the
   "scrollbar on desktop" / "content hidden on mobile" issues entirely. */
.cxh-root.cxh-compact { height: auto; }
.cxh-compact .cxh-card { height: auto; padding: clamp(10px, 1.6cqw, 16px); border-radius: 0; border: none; box-shadow: none; }
.cxh-compact .cxh-header,
.cxh-compact .cxh-hero,
.cxh-compact .cxh-status,
.cxh-compact .cxh-features { display: none; }
.cxh-compact .cxh-layout {
  height: auto;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  grid-template-areas:
    "stage panel"
    "stagefoot panel";
  align-items: start;
}
.cxh-compact .cxh-stage { aspect-ratio: 1000 / 400; height: auto; }
.cxh-compact .cxh-panel { height: auto; overflow: visible; }

.cxh-stage-foot { grid-area: stagefoot; display: none; }
.cxh-compact .cxh-stage-foot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.cxh-mini { padding: 10px 11px; border-radius: 10px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 5px; }
.cxh-mini-label { font-size: 7.5px; letter-spacing: 0.5px; color: #7D96B5; font-weight: 700; }
.cxh-mini-value { font-size: clamp(12px, 1.6cqw, 15px); font-weight: 800; color: #fff; font-variant-numeric: tabular-nums; }

@container cxh (max-width: 900px) {
  .cxh-compact .cxh-stage-foot { grid-template-columns: repeat(2, 1fr); }
}
@container cxh (max-width: 680px) {
  .cxh-compact .cxh-layout { grid-template-columns: 1fr; grid-template-areas: "stage" "panel"; }
  .cxh-compact .cxh-stage { aspect-ratio: 4 / 3; }
  .cxh-compact .cxh-stage-foot { display: none; }
}
@container cxh (max-width: 380px) {
  .cxh-compact .cxh-stage { aspect-ratio: 1 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .cxh-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;