/**
 * PanoramaAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated product hero for PIXTRON PANORAMA (360° Cylindrical Inspection).
 *
 * Ported from the original standalone panorama_animation.html into the same
 * architecture as CodexAnimation.tsx:
 *  - GSAP for the conveyor / camera-rig / defect-analysis animation.
 *  - Fully self-contained: styles injected via a scoped <style> tag, no
 *    Tailwind or external CSS dependency.
 *  - Responsive with CSS *container queries* (not just viewport media
 *    queries), so it lays out correctly no matter how narrow the card/frame
 *    it's dropped into is — not only how wide the browser window is.
 *  - No JS "scale-to-fit" transform and no resize listener. The original
 *    HTML manually computed `scale(...)` on a fixed 1200x700 canvas on
 *    every resize; here the machine SVG instead uses a cropped viewBox
 *    (matching the original's own mobile crop) inside a CSS Grid `aspect-
 *    ratio` box, so the browser's normal layout/paint engine handles all
 *    scaling for free — exactly like CODEX's `.cxh-stage`.
 *  - CSS Grid based layout: nothing is `position: absolute` over the art
 *    board, so nothing clips or overlaps on small screens.
 *  - Respects prefers-reduced-motion.
 *  - Safe for multiple instances on one page (all ids are unique per
 *    instance via React's useId).
 *
 * Usage:
 *   npm install gsap
 *   import PanoramaAnimation from "./PanoramaAnimation";
 *   <PanoramaAnimation brochureHref="/files/panorama-brochure.pdf" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   TYPES
============================================================ */

export interface PanoramaAnimationProps {
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

type DefectName = "SCRATCH" | "CONTAMINATION" | "CAP DEFECT" | "DENT" | "LABEL SKEW";

const DEFECT_NAMES: DefectName[] = ["SCRATCH", "CONTAMINATION", "CAP DEFECT", "DENT", "LABEL SKEW"];

/* Visual icon shown INSIDE each defect box on the unwrapped-surface strip,
   so the operator sees what kind of flaw it is, not just a red rectangle. */
const DEFECT_VISUALS: Record<DefectName, string> = {
  DENT: `<svg viewBox="0 0 34 20"><ellipse cx="17" cy="11" rx="10" ry="6.5" fill="rgba(0,0,0,0.5)"/><ellipse cx="17" cy="11" rx="10" ry="6.5" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="1"/><ellipse cx="13.5" cy="8.5" rx="3.2" ry="1.8" fill="rgba(255,255,255,0.35)"/></svg>`,
  SCRATCH: `<svg viewBox="0 0 34 20"><path d="M3 3 L12 9 L7 13 L20 5 L15 17 L31 6" fill="none" stroke="#FF4B5C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/></svg>`,
  CONTAMINATION: `<svg viewBox="0 0 34 20"><circle cx="10" cy="8" r="2.2" fill="#8a6f3a"/><circle cx="21" cy="13" r="1.6" fill="#6E5A2E"/><circle cx="16" cy="5" r="1.1" fill="#8a6f3a"/><circle cx="26" cy="7" r="1" fill="#6E5A2E"/></svg>`,
  "CAP DEFECT": `<svg viewBox="0 0 34 20"><rect x="9" y="3" width="16" height="7" rx="1.5" fill="#FFD400" transform="rotate(14 17 6.5)"/><line x1="2" y1="15" x2="32" y2="15" stroke="rgba(255,212,0,0.4)" stroke-width="1" stroke-dasharray="2 2"/></svg>`,
  "LABEL SKEW": `<svg viewBox="0 0 34 20"><rect x="4" y="4" width="26" height="12" rx="1" fill="none" stroke="#FF4B5C" stroke-width="1.3" transform="rotate(-9 17 10)"/></svg>`,
};

/* ============================================================
   DETERMINISTIC GEOMETRY (computed once — no randomness, so it
   can be precomputed at module scope instead of built imperatively)
============================================================ */

const RX = 108;
const RY = 52;
const RAIL_RX = 150;
const RAIL_RY = 70;
const CAM_ANGLES_DEG = [-45, 45, 135, 225];

interface CamLayout {
  armX1: number;
  armY1: number;
  armX2: number;
  armY2: number;
  mountRotate: number;
  bodyX: number;
  bodyY: number;
  bodyRotate: number;
  numX: number;
  numY: number;
  label: string;
}

const CAM_LAYOUT: CamLayout[] = CAM_ANGLES_DEG.map((deg, i) => {
  const angle = (deg * Math.PI) / 180;
  const rx1 = Math.cos(angle) * RAIL_RX;
  const ry1 = Math.sin(angle) * RAIL_RY;
  const rx2 = Math.cos(angle) * (RX + 26);
  const ry2 = Math.sin(angle) * (RY + 16);
  return {
    armX1: rx1,
    armY1: ry1,
    armX2: rx2,
    armY2: ry2,
    mountRotate: deg + 90,
    bodyX: rx2,
    bodyY: ry2,
    bodyRotate: deg + 90,
    numX: rx2 * 1.2,
    numY: ry2 * 1.28,
    label: `CAM ${i + 1}`,
  };
});

function ellipsePath(rx: number, ry: number, startDeg: number, endDeg: number): string {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = Math.cos(s) * rx;
  const y1 = Math.sin(s) * ry;
  const x2 = Math.cos(e) * rx;
  const y2 = Math.sin(e) * ry;
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${rx} ${ry} 0 ${large} 1 ${x2} ${y2}`;
}
const SWEEP_ARC_D = ellipsePath(RX, RY, -90, 270);

/** Roller circles along the conveyor top, same spacing as the original (x: 20 → 1190, step 30). */
const ROLLER_XS: number[] = [];
for (let x = 20; x < 1190; x += 30) ROLLER_XS.push(x);

const SPARK_COUNT = 4;

/* ============================================================
   SVG BUILD HELPERS (imperative, client-only — used only for the
   per-instance random bottle, since its defects are randomized)
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

function buildBottle(faulty: boolean, defects: DefectName[]): SVGGElement {
  const g = el("g", { class: "pnr-bottle" });

  const capTilt = faulty && defects.includes("CAP DEFECT") ? 16 : 0;
  const labelTilt = faulty && defects.includes("LABEL SKEW") ? 10 : 0;

  g.appendChild(el("ellipse", { cx: 0, cy: 56, rx: 20, ry: 5, class: "pnr-b-shadow" }));

  const capGroup = el("g", { class: capTilt ? "pnr-defect-mark" : "" });
  capGroup.setAttribute("transform", `rotate(${capTilt} -9 -68)`);
  capGroup.appendChild(el("rect", { fill: "url(#pnrCapGrad)", x: -9, y: -74, width: 18, height: 13, rx: 3 }));
  capGroup.appendChild(el("rect", { fill: "#1E2C3F", x: -9, y: -64, width: 18, height: 2.4 }));
  g.appendChild(capGroup);

  g.appendChild(
    el("path", {
      fill: "url(#pnrGlassGrad)",
      stroke: "#B9C7DA",
      "stroke-width": 1,
      d:
        "M -11 -61 L -11 -22 Q -11 4 -17 6 L -17 44 Q -17 52 -9 52 L 9 52 Q 17 52 17 44 L 17 6 Q 11 4 11 -22 L 11 -61 Z",
    })
  );
  g.appendChild(el("rect", { class: "pnr-b-highlight", x: -8, y: -56, width: 3, height: 98, rx: 1.5, opacity: 0.5 }));

  if (faulty && defects.includes("SCRATCH")) {
    g.appendChild(
      el("path", {
        class: "pnr-defect-scratch pnr-defect-mark",
        d: "M -5 -32 L -1 -18 L -6 -2 L -2 12",
      })
    );
  }
  if (faulty && defects.includes("DENT")) {
    g.appendChild(el("ellipse", { class: "pnr-defect-dent pnr-defect-mark", cx: 9, cy: -4, rx: 5.5, ry: 7.5 }));
  }
  if (faulty && defects.includes("CONTAMINATION")) {
    g.appendChild(el("circle", { class: "pnr-defect-spot pnr-defect-mark", cx: 4, cy: 30, r: 1.6 }));
    g.appendChild(el("circle", { class: "pnr-defect-spot pnr-defect-mark", cx: -3, cy: 34, r: 1.1 }));
  }

  const labelGroup = el("g", { class: labelTilt ? "pnr-defect-mark" : "" });
  labelGroup.setAttribute("transform", `rotate(${labelTilt} 0 25)`);
  labelGroup.appendChild(el("rect", { fill: "#0757B8", x: -16.5, y: 13, width: 33, height: 25, rx: 2 }));
  labelGroup.appendChild(el("rect", { fill: "#FFD400", x: -16.5, y: 13, width: 33, height: 4.5 }));
  g.appendChild(labelGroup);

  return g;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function PanoramaAnimation({ brochureHref, className, variant = "full" }: PanoramaAnimationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const productsGroupRef = useRef<SVGGElement | null>(null);
  const rollerRowRef = useRef<SVGGElement | null>(null);
  const rigRef = useRef<SVGGElement | null>(null);
  const camRingPulseRef = useRef<SVGEllipseElement | null>(null);
  const sweepArcRef = useRef<SVGPathElement | null>(null);
  const camFlashRefs = useRef<(SVGCircleElement | null)[]>([]);
  const sensorLedRef = useRef<SVGCircleElement | null>(null);
  const sensorBeamRef = useRef<SVGLineElement | null>(null);
  const rejectHeadRef = useRef<SVGRectElement | null>(null);
  const sparkRefs = useRef<(SVGCircleElement | null)[]>([]);

  const stripFillRef = useRef<HTMLDivElement | null>(null);
  const dboxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dtagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mCapCardRef = useRef<HTMLDivElement | null>(null);
  const mLabelCardRef = useRef<HTMLDivElement | null>(null);
  const mSealCardRef = useRef<HTMLDivElement | null>(null);

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
    const setDot = (role: string, colorVar: string) => {
      root.querySelectorAll<HTMLElement>(`[data-role="${role}"]`).forEach((n) => {
        n.style.background = colorVar;
        n.style.boxShadow = `0 0 8px ${colorVar}`;
      });
    };

    let inspected = 0;
    let rejected = 0;

    const resetPanel = () => {
      if (stripFillRef.current) gsap.set(stripFillRef.current, { width: "0%" });
      const boxes = dboxRefs.current.filter(Boolean) as HTMLDivElement[];
      const tags = dtagRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.set([...boxes, ...tags], { opacity: 0 });
      boxes.forEach((b) => (b.innerHTML = ""));

      setDot("statusDot", "var(--pnr-gray-400)");
      setText("liveText", "IDLE");
      setColor("liveText", "var(--pnr-gray-400)");
      setText("statusIcon", "\u2022");
      setColor("statusIcon", "var(--pnr-gray-400)");
      setText("statusText", "STANDBY");
      setColor("statusText", "var(--pnr-gray-400)");
      setText("mCoverage", "0%");
      setText("mConfidence", "\u2013\u2013");
      setText("mCap", "\u2013\u2013");
      setText("mLabel", "\u2013\u2013");
      setText("mSeal", "\u2013\u2013");
      setText("mCams", "0/4");
      [mCapCardRef, mLabelCardRef, mSealCardRef].forEach((r) => {
        r.current?.classList.remove("pnr-metric-ok", "pnr-metric-fail");
      });
    };

    const triggerSensor = (onDone?: () => void) => {
      setText("liveText", "OBJECT DETECTED");
      setColor("liveText", "var(--pnr-amber)");
      setDot("statusDot", "var(--pnr-amber)");
      setText("statusText", "SENSOR TRIGGERED");
      setColor("statusText", "var(--pnr-amber)");

      if (sensorBeamRef.current) gsap.to(sensorBeamRef.current, { opacity: 1, duration: 0.08, yoyo: true, repeat: 1 });
      if (sensorLedRef.current) {
        gsap.to(sensorLedRef.current, {
          attr: { fill: "#FFD400" },
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            sensorLedRef.current?.setAttribute("fill", "#FF3348");
            onDone?.();
          },
        });
      }
    };

    const fireCameraRig = (onDone?: () => void) => {
      setText("statusText", "SYNCING ARRAY...");
      setColor("statusText", "var(--pnr-yellow)");
      setDot("statusDot", "var(--pnr-yellow)");
      setText("liveText", "SCANNING");
      setColor("liveText", "var(--pnr-yellow)");

      if (camRingPulseRef.current) gsap.to(camRingPulseRef.current, { opacity: 1, duration: 0.15 });
      if (rigRef.current) {
        gsap.to(rigRef.current, { scale: 1.015, duration: 0.15, yoyo: true, repeat: 1, transformOrigin: "50% 50%" });
      }

      let synced = 0;
      camFlashRefs.current.forEach((f, i) => {
        if (!f) return;
        gsap.to(f, {
          opacity: 0.9,
          scale: 1.3,
          duration: 0.1,
          delay: i * 0.09,
          yoyo: true,
          repeat: 1,
          transformOrigin: "center",
          onStart: () => {
            synced++;
            setText("mCams", `${synced}/4`);
          },
        });
      });

      if (sweepArcRef.current) {
        gsap.fromTo(sweepArcRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 });
        gsap.fromTo(
          sweepArcRef.current,
          { strokeDasharray: "44 400", strokeDashoffset: 0 },
          {
            strokeDashoffset: -444,
            duration: 0.55,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.to(sweepArcRef.current!, { opacity: 0, duration: 0.2 });
              if (camRingPulseRef.current) gsap.to(camRingPulseRef.current, { opacity: 0.55, duration: 0.3 });
              onDone?.();
            },
          }
        );
      }

      if (stripFillRef.current) {
        gsap.fromTo(
          stripFillRef.current,
          { width: "0%" },
          {
            width: "100%",
            duration: 0.55,
            ease: "power1.inOut",
            onUpdate: function () {
              setText("mCoverage", Math.round(this.progress() * 100) + "%");
            },
          }
        );
      }
    };

    const showResult = (bottleEl: SVGGElement, faulty: boolean, defects: DefectName[]) => {
      if (faulty) {
        setDot("statusDot", "var(--pnr-red)");
        setText("liveText", "REJECT");
        setColor("liveText", "var(--pnr-red)");
        setText("statusIcon", "\u2715");
        setColor("statusIcon", "var(--pnr-red)");
        setText("statusText", "DEFECT FOUND");
        setColor("statusText", "var(--pnr-red)");
        setText("mConfidence", (96 + Math.random() * 2.5).toFixed(1) + "%");

        const capFail = defects.includes("CAP DEFECT") || defects.includes("DENT");
        const labelFail = defects.includes("LABEL SKEW");
        const sealFail = defects.includes("CONTAMINATION") || defects.includes("SCRATCH");

        setText("mCap", capFail ? "FAIL" : "OK");
        mCapCardRef.current?.classList.add(capFail ? "pnr-metric-fail" : "pnr-metric-ok");
        setText("mLabel", labelFail ? "FAIL" : "OK");
        mLabelCardRef.current?.classList.add(labelFail ? "pnr-metric-fail" : "pnr-metric-ok");
        setText("mSeal", sealFail ? "FAIL" : "OK");
        mSealCardRef.current?.classList.add(sealFail ? "pnr-metric-fail" : "pnr-metric-ok");

        const boxes = dboxRefs.current;
        const tags = dtagRefs.current;
        defects.slice(0, 2).forEach((name, i) => {
          const box = boxes[i];
          const tag = tags[i];
          if (!box || !tag) return;
          const left = 15 + Math.random() * 60;
          const top = 8 + Math.random() * 40;
          box.innerHTML = DEFECT_VISUALS[name] || "";
          gsap.set(box, { left: left + "%", top: top + "px", width: "34px", height: "20px", opacity: 0 });
          gsap.set(tag, { left: left + "%", top: top - 10 + "px", opacity: 0 });
          tag.textContent = name;
          gsap.to([box, tag], { opacity: 1, duration: 0.2, delay: 0.1 + i * 0.15 });
          gsap.fromTo(box, { scale: 1.15 }, { scale: 1, duration: 0.35, delay: 0.1 + i * 0.15, ease: "back.out(2)" });
        });

        const marks = bottleEl.querySelectorAll(".pnr-defect-mark");
        gsap.fromTo(marks, { opacity: 1 }, { opacity: 0.25, duration: 0.22, yoyo: true, repeat: 5 });
      } else {
        setDot("statusDot", "var(--pnr-green)");
        setText("liveText", "PASS");
        setColor("liveText", "var(--pnr-green)");
        setText("statusIcon", "\u2713");
        setColor("statusIcon", "var(--pnr-green)");
        setText("statusText", "PASS \u00b7 360\u00b0 VERIFIED");
        setColor("statusText", "var(--pnr-green)");
        setText("mConfidence", (99.3 + Math.random() * 0.6).toFixed(1) + "%");
        setText("mCap", "OK");
        mCapCardRef.current?.classList.add("pnr-metric-ok");
        setText("mLabel", "OK");
        mLabelCardRef.current?.classList.add("pnr-metric-ok");
        setText("mSeal", "OK");
        mSealCardRef.current?.classList.add("pnr-metric-ok");
      }
    };

    const dropIntoBin = (bottleEl: SVGGElement) => {
      if (rejectHeadRef.current) {
        gsap
          .timeline()
          .to(rejectHeadRef.current, { y: 18, duration: 0.09, ease: "power2.in" })
          .to(rejectHeadRef.current, { y: 0, duration: 0.22, ease: "power2.out" }, "<0.02");
      }

      gsap
        .timeline()
        .to(bottleEl, { y: 520, rotation: -20, duration: 0.18, ease: "power2.out" })
        .to(bottleEl, { x: "+=6", y: 605, rotation: 60, scale: 0.85, duration: 0.26, ease: "power2.in" })
        .to(bottleEl, { y: 635, rotation: 110, scale: 0.55, opacity: 0, duration: 0.24, ease: "power1.in" });

      const sparks = sparkRefs.current.filter(Boolean) as SVGCircleElement[];
      sparks.forEach((s, i) => {
        const ang = (i / sparks.length) * Math.PI * 2;
        gsap.set(s, { opacity: 0, attr: { cx: 890 + Math.cos(ang) * 4, cy: 520 + Math.sin(ang) * 4 } });
        gsap.to(s, {
          opacity: 0.9,
          duration: 0.1,
          delay: 0.16,
          onComplete: () => {
            gsap.to(s, {
              attr: { cx: 890 + Math.cos(ang) * 20, cy: 514 + Math.sin(ang) * 12 - 6 },
              opacity: 0,
              duration: 0.32,
              ease: "power2.out",
            });
          },
        });
      });
    };

    let stopped = false;

    const spawnProduct = () => {
      if (stopped || !productsGroupRef.current) return;
      const faulty = Math.random() < 0.3;
      const defects: DefectName[] = [];
      if (faulty) {
        const shuffled = [...DEFECT_NAMES].sort(() => 0.5 - Math.random());
        defects.push(shuffled[0], shuffled[1]);
      }

      const bottleEl = buildBottle(faulty, defects);
      productsGroupRef.current.appendChild(bottleEl);
      gsap.set(bottleEl, { x: -60, y: 410, rotation: 0 });

      const wobble = gsap.to(bottleEl, { rotation: 1.2, duration: 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });

      const tl = gsap.timeline({ onComplete: () => bottleEl.remove() });

      // approach the sensor
      tl.to(bottleEl, { x: 340, duration: 1.29, ease: "none" });
      tl.add(() => triggerSensor());

      // sensor to camera rig
      tl.to(bottleEl, { x: 530, duration: 0.61, ease: "none" });
      tl.add(() => {
        resetPanel();
        fireCameraRig(() => showResult(bottleEl, faulty, defects));
      });

      // rig straight through to the ejector at constant speed
      tl.to(bottleEl, { x: 890, duration: 1.16, ease: "none" });

      tl.add(() => {
        inspected++;
        setText("statInspected", inspected.toLocaleString());
        if (faulty) {
          rejected++;
          setText("statRejected", rejected.toLocaleString());
          wobble.kill();
          dropIntoBin(bottleEl);
        } else {
          wobble.kill();
          gsap.set(bottleEl, { rotation: 0 });
        }
      });

      if (!faulty) {
        tl.to(bottleEl, { x: 1320, duration: 1.4, ease: "none" });
      } else {
        tl.to({}, { duration: 0.75 });
      }
    };

    // ambient / continuous animations
    const ambientTweens: gsap.core.Tween[] = [];
    if (rollerRowRef.current && !reduceMotion) {
      ambientTweens.push(
        gsap.to(rollerRowRef.current.querySelectorAll("circle"), {
          x: -26,
          duration: 0.65,
          repeat: -1,
          ease: "none",
          stagger: { each: 0.03, repeat: -1 },
        })
      );
    }
    const rigOrbit = root.querySelectorAll<SVGEllipseElement>(".pnr-rig-orbit");
    if (rigOrbit.length) {
      ambientTweens.push(
        gsap.to(rigOrbit, {
          opacity: reduceMotion ? 0.5 : 0.5,
          duration: 1.8,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }
    const blueLights = root.querySelectorAll<SVGCircleElement>(".pnr-camera-blue-light");
    if (blueLights.length) {
      ambientTweens.push(
        gsap.to(blueLights, {
          opacity: reduceMotion ? 1 : 1,
          r: reduceMotion ? 4 : 5.5,
          duration: 1.2,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.15,
        })
      );
    }

    let interval: number | undefined;
    let speedInterval: number | undefined;

    resetPanel();
    setText("statSpeed", "180");
    setText("statInspected", "0");
    setText("statRejected", "0");

    if (!reduceMotion) {
      speedInterval = window.setInterval(() => {
        const speed = 172 + Math.floor(Math.random() * 18);
        setText("statSpeed", String(speed));
      }, 2000);
    }

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
      interval = window.setInterval(spawnProduct, 3200);
    };

    if (reduceMotion) {
      spawnProduct();
    } else {
      startSpawnLoop();
    }

    // Background/throttled tabs make timers fall behind; wipe + restart
    // fresh on visibility regain so queued spawns never land on top of
    // each other (same pattern as CodexAnimation).
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
      if (speedInterval) window.clearInterval(speedInterval);
      ambientTweens.forEach((t) => t.kill());
      gsap.killTweensOf([
        camRingPulseRef.current,
        sweepArcRef.current,
        sensorLedRef.current,
        sensorBeamRef.current,
        rejectHeadRef.current,
        rigRef.current,
        ...camFlashRefs.current,
        ...sparkRefs.current,
      ]);
      clearProducts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capGradId = `pnrCapGrad-${uid}`;
  const glassGradId = `pnrGlassGrad-${uid}`;
  const sweepGradId = `pnrSweepGradient-${uid}`;
  const inspectionGradId = `pnrInspectionGradient-${uid}`;
  const blueGlowId = `pnrBlueGlow-${uid}`;
  const yellowGlowId = `pnrYellowGlow-${uid}`;
  const softGlowId = `pnrSoftGlow-${uid}`;
  const redGlowId = `pnrRedGlow-${uid}`;

  return (
    <div ref={rootRef} className={`pnr-root ${variant === "compact" ? "pnr-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="pnr-card">
        <div className="pnr-bgfx" aria-hidden="true">
          <div className="pnr-grid" />
          <span className="pnr-corner pnr-corner-a" />
          <span className="pnr-corner pnr-corner-b" />
        </div>

        <div className="pnr-layout">
          {/* HEADER */}
          <div className="pnr-header">
            <div className="pnr-logo">
              PIXTRON <span>SYSTEMS</span>
            </div>
            <div className="pnr-producttag">
              <span className="pnr-line" />
              PANORAMA <em>|</em> 360&deg; CYLINDRICAL INSPECTION
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="pnr-hero">
            <h1>
              PANOR<span>AMA</span>
            </h1>
            <p>
              Synchronized multi-camera arrays deliver complete 360&deg; coverage of bottles, cans &amp; tubes at
              full line speed.
            </p>
            <div className="pnr-taglist">
              <span className="pnr-pill">AI-POWERED MACHINE VISION</span>
            </div>
            {brochureHref && (
              <a className="pnr-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
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
          <div className="pnr-stage">
            <div className="pnr-stage-label">360&deg; INSPECTION VIEW</div>
            {/* Cropped viewBox — matches the original mobile-only crop, used
               here at every size instead of a JS scale-to-fit transform.
               The header/hero text is now its own grid area rather than an
               absolute overlay, so the empty top half of the original
               1200x700 canvas is never needed. */}
            <svg viewBox="0 320 1200 380" className="pnr-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <filter id={blueGlowId} x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id={yellowGlowId} x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id={softGlowId} x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id={redGlowId} x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id={inspectionGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#168DFF" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#168DFF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={sweepGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1495FF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFD400" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1495FF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={glassGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DCE9F7" stopOpacity="0.35" />
                  <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.75" />
                  <stop offset="55%" stopColor="#B9CFE6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8FAFD1" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id={capGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5C7495" />
                  <stop offset="100%" stopColor="#2C3F58" />
                </linearGradient>
              </defs>

              {/* MACHINE FRAME */}
              <rect className="pnr-machine-frame" x="0" y="574" width="1200" height="60" />
              <rect className="pnr-machine-frame-highlight" x="0" y="574" width="1200" height="4" />

              {/* CONVEYOR */}
              <g>
                <rect className="pnr-conveyor-side" x="0" y="484" width="1200" height="90" />
                <rect className="pnr-conveyor-top" x="0" y="460" width="1200" height="24" />
                <rect className="pnr-conveyor-highlight" x="0" y="460" width="1200" height="3" />
                <g ref={rollerRowRef}>
                  {ROLLER_XS.map((x, i) => (
                    <circle key={i} cx={x} cy={472} r={9} className="pnr-conveyor-rollers" />
                  ))}
                </g>
              </g>

              {/* SIDE REJECT CHUTE + BIN (back) */}
              <g>
                <path className="pnr-chute" d="M 840 574 L 940 574 L 926 606 L 854 606 Z" />
                <rect className="pnr-bin-back" x="846" y="604" width="88" height="56" rx="5" />
                <rect className="pnr-bin-inner" x="853" y="611" width="74" height="43" rx="3" />
              </g>

              {/* PHOTOELECTRIC SENSOR */}
              <g transform="translate(340,0)">
                <rect className="pnr-sensor-body" x="-12" y="405" width="24" height="38" rx="5" />
                <circle ref={sensorLedRef} className="pnr-sensor-led" cx="0" cy="416" r="3" />
                <line ref={sensorBeamRef} className="pnr-sensor-beam" x1="0" y1="443" x2="0" y2="460" />
                <text className="pnr-sensor-label" x="0" y="398" textAnchor="middle">
                  SENSOR
                </text>
              </g>

              {/* CAMERA RIG at inspection zone */}
              <g ref={rigRef} transform="translate(530,438)">
                <ellipse className="pnr-rail" cx="0" cy="0" rx={RAIL_RX} ry={RAIL_RY} />
                <ellipse className="pnr-rig-orbit" cx="0" cy="0" rx={RX} ry={RY} />
                <ellipse ref={camRingPulseRef} className="pnr-cam-ring" cx="0" cy="0" rx={RX} ry={RY} />
                <path ref={sweepArcRef} className="pnr-sweep-arc" d={SWEEP_ARC_D} />
                <g>
                  {CAM_LAYOUT.map((c, i) => (
                    <g key={i}>
                      <line className="pnr-cam-arm" x1={c.armX1} y1={c.armY1} x2={c.armX2} y2={c.armY2} />
                      <rect
                        className="pnr-mount-dark"
                        x="-9"
                        y="-7"
                        width="18"
                        height="14"
                        rx="4"
                        transform={`translate(${c.armX1},${c.armY1}) rotate(${c.mountRotate})`}
                      />
                      <g transform={`translate(${c.bodyX},${c.bodyY}) rotate(${c.bodyRotate})`}>
                        <rect className="pnr-camera-body" x="-23" y="-17" width="46" height="34" rx="8" />
                        <rect className="pnr-camera-face" x="-15" y="-10" width="30" height="20" rx="5" />
                        <circle className="pnr-camera-ring" cx="0" cy="0" r="12" />
                        <circle className="pnr-camera-lens" cx="0" cy="0" r="8" />
                        <circle className="pnr-camera-blue-light" cx="0" cy="0" r="4" />
                        <circle
                          ref={(node) => {
                            camFlashRefs.current[i] = node;
                          }}
                          className="pnr-cam-flash"
                          cx="0"
                          cy="0"
                          r="24"
                        />
                      </g>
                      <text className="pnr-cam-num" x={c.numX} y={c.numY} textAnchor="middle">
                        {c.label}
                      </text>
                    </g>
                  ))}
                </g>
              </g>

              {/* PRODUCT */}
              <g ref={productsGroupRef} />

              {/* REJECTOR */}
              <g transform="translate(890,420)">
                <rect className="pnr-reject-body" x="-16" y="0" width="32" height="30" rx="3" />
                <rect ref={rejectHeadRef} className="pnr-reject-rod" x="-4.5" y="26" width="9" height="34" />
                <rect className="pnr-reject-cap" x="-10" y="56" width="20" height="9" rx="2" />
              </g>

              {/* BIN FRONT RIM — after products so a falling bottle sinks behind it */}
              <g>
                <rect className="pnr-bin-front" x="846" y="604" width="88" height="13" rx="4" />
                <text className="pnr-bin-label" x="890" y="676" textAnchor="middle">
                  REJECT
                </text>
              </g>

              <g>
                {Array.from({ length: SPARK_COUNT }).map((_, i) => (
                  <circle
                    key={i}
                    ref={(node) => {
                      sparkRefs.current[i] = node;
                    }}
                    className="pnr-spark"
                    r={2.5 - i * 0.2}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* STATUS */}
          <div className="pnr-status">
            <span className="pnr-status-dot" data-role="statusDot" />
            <span data-role="statusText">STANDBY</span>
          </div>

          {/* SOFTWARE PANEL */}
          <div className="pnr-panel">
            <div className="pnr-panel-head">
              <span className="pnr-panel-title">360&deg; STITCH ANALYSIS</span>
              <span className="pnr-live-pill">
                <i className="pnr-live-dot" data-role="statusDot" />
                <span className="pnr-live-text" data-role="liveText">
                  IDLE
                </span>
              </span>
            </div>

            <div className="pnr-strip-wrap">
              <div className="pnr-strip-fill" ref={stripFillRef} />
              <div className="pnr-strip-label">UNWRAPPED SURFACE VIEW</div>
              <div
                className="pnr-defect-box"
                ref={(node) => {
                  dboxRefs.current[0] = node;
                }}
              />
              <div
                className="pnr-defect-tag"
                ref={(node) => {
                  dtagRefs.current[0] = node;
                }}
              />
              <div
                className="pnr-defect-box"
                ref={(node) => {
                  dboxRefs.current[1] = node;
                }}
              />
              <div
                className="pnr-defect-tag"
                ref={(node) => {
                  dtagRefs.current[1] = node;
                }}
              />
            </div>

            <div className="pnr-status-row">
              <span className="pnr-status-icon" data-role="statusIcon">
                &bull;
              </span>
              <span className="pnr-status-text" data-role="statusText">
                STANDBY
              </span>
            </div>

            <div className="pnr-metric-grid">
              <div className="pnr-metric pnr-metric-neutral">
                <div className="pnr-metric-label">Coverage</div>
                <div className="pnr-metric-value" data-role="mCoverage">
                  0%
                </div>
              </div>
              <div className="pnr-metric pnr-metric-neutral">
                <div className="pnr-metric-label">Confidence</div>
                <div className="pnr-metric-value" data-role="mConfidence">
                  &mdash;
                </div>
              </div>
              <div className="pnr-metric" ref={mCapCardRef}>
                <div className="pnr-metric-label">Cap Align</div>
                <div className="pnr-metric-value" data-role="mCap">
                  &mdash;
                </div>
              </div>
              <div className="pnr-metric" ref={mLabelCardRef}>
                <div className="pnr-metric-label">Label Skew</div>
                <div className="pnr-metric-value" data-role="mLabel">
                  &mdash;
                </div>
              </div>
              <div className="pnr-metric" ref={mSealCardRef}>
                <div className="pnr-metric-label">Seal</div>
                <div className="pnr-metric-value" data-role="mSeal">
                  &mdash;
                </div>
              </div>
              <div className="pnr-metric pnr-metric-neutral">
                <div className="pnr-metric-label">Cameras Synced</div>
                <div className="pnr-metric-value" data-role="mCams">
                  0/4
                </div>
              </div>
            </div>
          </div>

          {/* STAT BAR */}
          <div className="pnr-stats">
            <div className="pnr-stat-chip">
              <span className="pnr-stat-accent" />
              <div className="pnr-stat-lab">Units Inspected</div>
              <div className="pnr-stat-val" data-role="statInspected">
                0
              </div>
            </div>
            <div className="pnr-stat-chip pnr-c-red">
              <span className="pnr-stat-accent" />
              <div className="pnr-stat-lab">Rejected</div>
              <div className="pnr-stat-val pnr-val-red" data-role="statRejected">
                0
              </div>
            </div>
            <div className="pnr-stat-chip pnr-c-yellow">
              <span className="pnr-stat-accent" />
              <div className="pnr-stat-lab">Line Speed</div>
              <div className="pnr-stat-val pnr-val-yellow">
                <span data-role="statSpeed">180</span>
                <span className="pnr-stat-unit">&nbsp;u/min</span>
              </div>
            </div>
            <div className="pnr-stat-chip pnr-c-green">
              <span className="pnr-stat-accent" />
              <div className="pnr-stat-lab">Camera Array</div>
              <div className="pnr-stat-val pnr-val-green">4 / 4 ONLINE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .pnr- prefix, container-query responsive —
   same structural approach as CodexAnimation's CSS)
============================================================ */

const CSS = `
.pnr-root {
  --pnr-blue-950: #03152F;
  --pnr-blue-900: #05245A;
  --pnr-blue-800: #06357D;
  --pnr-blue-700: #0757B8;
  --pnr-blue: #0878E8;
  --pnr-yellow: #FFD400;
  --pnr-yellow-soft: #FFE45C;
  --pnr-white: #FFFFFF;
  --pnr-gray-100: #F4F7FB;
  --pnr-gray-200: #DCE5F0;
  --pnr-gray-400: #8FA2BA;
  --pnr-gray-600: #536781;
  --pnr-green: #21E68A;
  --pnr-red: #FF4B5C;
  --pnr-amber: #FFA23C;

  width: 100%;
  container-type: inline-size;
  container-name: pnr;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.pnr-root *, .pnr-root *::before, .pnr-root *::after { box-sizing: border-box; }

.pnr-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: linear-gradient(135deg, #041A3A 0%, #052B65 55%, #041A3A 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,90,200,0.08);
  padding: clamp(16px, 3.2cqw, 34px);
}

.pnr-bgfx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.pnr-grid {
  position: absolute; inset: 0; opacity: 0.12;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 45px 45px;
}
.pnr-corner { position: absolute; border: 1px solid rgba(255,212,0,0.18); opacity: 0.4; }
.pnr-corner-a { width: 240px; height: 120px; top: 130px; left: -100px; border-right: 0; }
.pnr-corner-b { width: 260px; height: 160px; right: -130px; bottom: 100px; border-left: 0; }

.pnr-layout {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(12px, 2cqw, 22px);
  grid-template-columns: minmax(0, 1fr) minmax(260px, 340px);
  grid-template-areas:
    "header header"
    "hero   panel"
    "stage  panel"
    "status panel"
    "stats  stats";
  align-items: start;
}

@container pnr (max-width: 780px) {
  .pnr-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "hero"
      "stage"
      "status"
      "panel"
      "stats";
  }
}

.pnr-header { grid-area: header; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.pnr-logo { color: #fff; font-size: clamp(12px, 1.6cqw, 16px); font-weight: 800; letter-spacing: 1px; }
.pnr-logo span { color: var(--pnr-yellow); }
.pnr-producttag { display: flex; align-items: center; gap: 10px; color: #fff; font-size: clamp(9px, 1.1cqw, 11px); font-weight: 700; letter-spacing: 0.8px; opacity: 0.9; }
.pnr-producttag em { font-style: normal; color: var(--pnr-yellow); }
.pnr-line { width: 22px; height: 2px; background: var(--pnr-yellow); display: inline-block; }

.pnr-hero { grid-area: hero; color: #fff; }
.pnr-hero h1 { margin: clamp(6px,1.5cqw,14px) 0 0; font-size: clamp(30px, 6.2cqw, 52px); line-height: 0.95; font-weight: 800; letter-spacing: -1.5px; }
.pnr-hero h1 span { color: var(--pnr-yellow); }
.pnr-hero p { margin: 10px 0 0; max-width: 46ch; font-size: clamp(12px, 1.5cqw, 14px); color: #B9C9DF; line-height: 1.5; }
.pnr-taglist { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.pnr-pill { padding: 6px 11px; border-radius: 5px; background: var(--pnr-yellow); color: var(--pnr-blue-950); font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; }
.pnr-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 10px 16px; border-radius: 8px; background: var(--pnr-blue-700); color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.pnr-cta:hover { background: var(--pnr-blue); transform: translateY(-1px); }

.pnr-stage {
  grid-area: stage;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #020B18;
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1200 / 380;
}
.pnr-stage-label { position: absolute; top: 10px; left: 12px; z-index: 2; font-size: 9px; font-weight: 700; letter-spacing: 0.8px; color: #7EA0C7; }
.pnr-svg { width: 100%; height: 100%; display: block; }

.pnr-machine-frame { fill: #071A32; }
.pnr-machine-frame-highlight { fill: #2B527A; }
.pnr-conveyor-top { fill: #172B47; }
.pnr-conveyor-side { fill: #091B34; }
.pnr-conveyor-highlight { fill: #2C4C70; }
.pnr-conveyor-rollers { fill: #08172C; stroke: #315274; stroke-width: 1; }

.pnr-sensor-body { fill: #182C47; stroke: #6B83A2; stroke-width: 1; }
.pnr-sensor-led { fill: #FF3348; }
.pnr-sensor-beam { stroke: #FF4055; stroke-width: 1.5; stroke-dasharray: 5 4; opacity: 0; }
.pnr-sensor-label { fill: #90A9C6; font-family: "Inter", sans-serif; font-size: 7.5px; font-weight: 800; letter-spacing: 0.6px; }

.pnr-mount-dark { fill: #243B5A; }
.pnr-camera-body { fill: #102B54; stroke: #6C86A8; stroke-width: 1; }
.pnr-camera-face { fill: #061A38; }
.pnr-camera-ring { fill: none; stroke: var(--pnr-yellow); stroke-width: 2.4; filter: drop-shadow(0 0 6px rgba(255,212,0,0.7)); }
.pnr-camera-lens { fill: #020A17; stroke: #2D74C8; stroke-width: 1.6; }
.pnr-camera-blue-light { fill: #1495FF; opacity: 0.65; }
.pnr-cam-num { fill: #90A9C6; font-family: "Inter", sans-serif; font-size: 7.5px; font-weight: 800; letter-spacing: 0.5px; }
.pnr-cam-flash { fill: var(--pnr-yellow); opacity: 0; }

.pnr-rail { fill: none; stroke: rgba(140,170,210,0.35); stroke-width: 2; }
.pnr-rig-orbit { fill: none; stroke: rgba(255,212,0,0.3); stroke-width: 1.5; stroke-dasharray: 4 5; }
.pnr-cam-arm { stroke: #4A6A93; stroke-width: 3.5; }
.pnr-cam-ring { fill: none; stroke: var(--pnr-yellow); stroke-width: 2.2; filter: drop-shadow(0 0 6px rgba(255,212,0,0.75)); opacity: 0.55; }
.pnr-sweep-arc { fill: none; stroke: #FFD400; stroke-width: 4.5; stroke-linecap: round; opacity: 0; }

.pnr-bottle .pnr-b-shadow { fill: rgba(0,0,0,0.35); }
.pnr-bottle .pnr-b-highlight { fill: rgba(255,255,255,0.55); }
.pnr-defect-scratch { fill: none; stroke: var(--pnr-red); stroke-width: 1.4; stroke-linecap: round; }
.pnr-defect-dent { fill: rgba(10,20,35,0.45); }
.pnr-defect-spot { fill: #6E5A2E; }

.pnr-reject-body { fill: #273E5B; stroke: #7186A0; stroke-width: 1; }
.pnr-reject-rod { fill: #C3CEDA; }
.pnr-reject-cap { fill: var(--pnr-yellow); }
.pnr-bin-back { fill: #081A34; stroke: #3E5C82; stroke-width: 1.2; }
.pnr-bin-inner { fill: #050F20; }
.pnr-bin-front { fill: #0E2547; stroke: #4A6A93; stroke-width: 1.4; }
.pnr-bin-label { fill: #8CA3C2; font-family: "Inter", sans-serif; font-size: 8px; font-weight: 800; letter-spacing: 1.2px; }
.pnr-chute { fill: #0A1E3A; stroke: #3E5C82; stroke-width: 1; }
.pnr-spark { fill: var(--pnr-yellow); opacity: 0; }

.pnr-status {
  grid-area: status;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 9px 13px; border-radius: 8px;
  background: rgba(3,20,43,0.9); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 10.5px; font-weight: 700; width: fit-content; max-width: 100%;
}
.pnr-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--pnr-gray-400); box-shadow: 0 0 6px var(--pnr-gray-400); flex: none; }

.pnr-panel {
  grid-area: panel;
  padding: clamp(12px, 1.8cqw, 18px);
  border-radius: 16px;
  background: linear-gradient(160deg, rgba(10,50,106,0.97), rgba(3,20,44,0.98));
  border: 1px solid rgba(120,175,240,0.28);
  box-shadow: 0 24px 60px rgba(0,8,26,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
  position: relative;
}
.pnr-panel::before {
  content: ""; position: absolute; top: 0; left: 16px; right: 16px; height: 2px;
  background: linear-gradient(90deg, var(--pnr-blue), var(--pnr-yellow));
  border-radius: 2px;
}
.pnr-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 13px; }
.pnr-panel-title { font-size: 11px; font-weight: 800; letter-spacing: 1.1px; color: var(--pnr-yellow); }
.pnr-live-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px 3px 6px; border-radius: 20px; background: rgba(255,255,255,0.06); }
.pnr-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pnr-gray-400); box-shadow: 0 0 6px var(--pnr-gray-400); transition: all 0.2s; display: inline-block; }
.pnr-live-text { font-size: 8px; font-weight: 800; letter-spacing: 0.8px; color: var(--pnr-gray-400); }

.pnr-strip-wrap {
  width: 100%; height: 72px; border-radius: 10px;
  background: #071A38 repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 7px);
  border: 1px solid rgba(255,255,255,0.09); position: relative; overflow: hidden; margin-bottom: 12px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.35);
}
.pnr-strip-fill { position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(90deg, rgba(8,120,232,0.05), rgba(8,120,232,0.4)); border-right: 2px solid var(--pnr-yellow); box-shadow: 2px 0 10px rgba(255,212,0,0.4); }
.pnr-strip-label { position: absolute; bottom: 5px; left: 8px; font-size: 7.5px; color: var(--pnr-gray-400); letter-spacing: 0.6px; font-weight: 700; }
.pnr-defect-box { position: absolute; border: 1.4px solid var(--pnr-red); border-radius: 2px; opacity: 0; box-shadow: 0 0 8px rgba(255,75,92,0.6); overflow: visible; background: rgba(255,75,92,0.08); }
.pnr-defect-box svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: visible; }
.pnr-defect-tag { position: absolute; font-size: 6px; font-weight: 800; letter-spacing: 0.4px; padding: 1.5px 4px; border-radius: 3px; background: var(--pnr-red); color: #1a0508; white-space: nowrap; opacity: 0; }

.pnr-status-row { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 0; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); margin-bottom: 12px; }
.pnr-status-icon { width: 14px; height: 14px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); font-size: 9px; font-weight: 900; color: var(--pnr-gray-400); }
.pnr-status-text { font-size: 12.5px; font-weight: 800; letter-spacing: 1px; color: var(--pnr-gray-400); }

.pnr-metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.pnr-metric { position: relative; background: rgba(255,255,255,0.035); border-radius: 8px; padding: 8px 10px 8px 12px; border-left: 3px solid rgba(255,255,255,0.15); transition: border-color 0.2s; }
.pnr-metric-ok { border-left-color: var(--pnr-green); }
.pnr-metric-fail { border-left-color: var(--pnr-red); }
.pnr-metric-neutral { border-left-color: var(--pnr-blue); }
.pnr-metric-label { font-size: 8px; color: var(--pnr-gray-400); letter-spacing: 0.6px; font-weight: 700; text-transform: uppercase; }
.pnr-metric-value { font-size: 13px; font-weight: 800; margin-top: 3px; color: #fff; }

.pnr-stats { grid-area: stats; display: flex; gap: clamp(8px, 1.4cqw, 12px); flex-wrap: wrap; }
.pnr-stat-chip {
  flex: 1 1 150px; position: relative; overflow: hidden;
  background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.1); border-radius: 13px; padding: 11px 16px;
  box-shadow: 0 10px 26px rgba(0,10,26,0.35), inset 0 1px 0 rgba(255,255,255,0.07);
}
.pnr-stat-accent { position: absolute; top: 0; left: 0; width: 100%; height: 2.5px; background: var(--pnr-gray-400); }
.pnr-c-yellow .pnr-stat-accent { background: var(--pnr-yellow); }
.pnr-c-red .pnr-stat-accent { background: var(--pnr-red); }
.pnr-c-green .pnr-stat-accent { background: var(--pnr-green); }
.pnr-stat-lab { font-size: 8.5px; color: var(--pnr-gray-400); font-weight: 700; letter-spacing: 0.9px; text-transform: uppercase; }
.pnr-stat-val { font-size: clamp(15px, 2.2cqw, 19px); font-weight: 800; color: #fff; margin-top: 3px; letter-spacing: -0.3px; }
.pnr-stat-unit { font-size: 11px; }
.pnr-val-yellow { color: var(--pnr-yellow); }
.pnr-val-red { color: var(--pnr-red); }
.pnr-val-green { color: var(--pnr-green); }

@container pnr (max-width: 480px) {
  .pnr-stats { flex-direction: column; }
  .pnr-metric-grid { grid-template-columns: 1fr 1fr; }
  .pnr-stat-val { font-size: 16px; }
}

/* ---------- compact variant: fill an existing image/video slot ---------- */
.pnr-root.pnr-compact { height: auto; }
.pnr-compact .pnr-card { height: auto; padding: clamp(10px, 1.6cqw, 16px); border-radius: 0; border: none; box-shadow: none; }
.pnr-compact .pnr-header,
.pnr-compact .pnr-hero,
.pnr-compact .pnr-status,
.pnr-compact .pnr-stats { display: none; }
.pnr-compact .pnr-layout {
  height: auto;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
  grid-template-areas: "stage panel";
  align-items: start;
}
.pnr-compact .pnr-stage { aspect-ratio: 1200 / 380; height: auto; }
.pnr-compact .pnr-panel { height: auto; overflow: visible; }

@container pnr (max-width: 680px) {
  .pnr-compact .pnr-layout { grid-template-columns: 1fr; grid-template-areas: "stage" "panel"; }
  .pnr-compact .pnr-stage { aspect-ratio: 4 / 3; }
}
@container pnr (max-width: 380px) {
  .pnr-compact .pnr-stage { aspect-ratio: 1 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .pnr-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;
