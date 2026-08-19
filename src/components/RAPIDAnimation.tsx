

/**
 * RapidAnimation.tsx
 * ---------------------------------------------------------------------------
 * Animated product hero for PIXTRON RAPID (Continuous Flow Production Line
 * Inspection).
 *
 * Same visual language as the original Rapid concept (pay-out/take-up
 * spools, scrolling cable with print-text & warning stripes, inspection
 * tunnel, camera head, alarm beacon, defect log, line-stops-on-defect +
 * auto-resume behaviour) — rebuilt on the same proven architecture as
 * CodexAnimation.tsx / InspectraAnimation.tsx / OpusAnimation.tsx /
 * PanoramaAnimation.tsx so it's responsive and bug-free everywhere it's
 * dropped:
 *
 *  - Container-query responsive (works inside any frame width, not just
 *    viewport width) — NOT window.innerWidth + a resize listener, and NOT
 *    vw units.
 *  - ONE responsive layout via CSS Grid + container queries, instead of two
 *    separate desktop/mobile JSX trees.
 *  - GSAP-driven animation. The cable's scrolling print-text uses GSAP's
 *    built-in `modifiers` (core feature, no plugin) to wrap seamlessly
 *    instead of a per-frame React state tick.
 *  - `variant="compact"` drops straight into an existing image/video slot
 *    without a fixed aspect-ratio, so it never clips on mobile or grows a
 *    stray scrollbar on desktop.
 *  - Live metrics strip fills the empty space under the stage (desktop
 *    only, auto-hidden on narrow frames).
 *  - Pauses the inspection cycle + ambient motion on tab visibility change,
 *    so a backgrounded tab never desyncs the line-stop/resume sequence.
 *  - Respects prefers-reduced-motion, unique ids via useId (multi-instance
 *    safe).
 *
 * Usage:
 *   npm install gsap
 *   import RapidAnimation from "./RapidAnimation";
 *   <RapidAnimation brochureHref="/brochures/rapid-spec-sheet.pdf" />
 *   // or, dropped into an existing media frame:
 *   <RapidAnimation variant="compact" />
 */

import React, { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";

/* ============================================================
   TYPES
============================================================ */

type DefectType = "SURFACE_SCRATCH" | "INSULATION_DEFECT" | "DIAMETER_ERROR" | "PRINT_MISSING";

export interface RapidAnimationProps {
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

const DEFECT_TYPES: DefectType[] = [
  "SURFACE_SCRATCH",
  "INSULATION_DEFECT",
  "DIAMETER_ERROR",
  "PRINT_MISSING",
];

const DEFECT_LABELS: Record<DefectType, string> = {
  SURFACE_SCRATCH: "Surface Scratch",
  INSULATION_DEFECT: "Insulation Defect",
  DIAMETER_ERROR: "Diameter Out of Tolerance",
  PRINT_MISSING: "Print / Marking Missing",
};

function ts() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
}

function formatDowntime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function randomDefect(): DefectType {
  return DEFECT_TYPES[Math.floor(Math.random() * DEFECT_TYPES.length)];
}

/* ============================================================
   SPOOL WOUND-CABLE LINES (deterministic geometry, computed once)
============================================================ */

const SPOOL_ANGLES = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340];

/* ============================================================
   COMPONENT
============================================================ */

export default function RapidAnimation({ brochureHref, className, variant = "full" }: RapidAnimationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = useRef<HTMLDivElement | null>(null);

  const cableTextRef = useRef<SVGGElement | null>(null);
  const stripeRowRef = useRef<SVGGElement | null>(null);
  const spoolLeftRef = useRef<SVGGElement | null>(null);
  const spoolRightRef = useRef<SVGGElement | null>(null);
  const camRingRef = useRef<SVGCircleElement | null>(null);
  const camLightRef = useRef<SVGCircleElement | null>(null);
  const beaconGlassRef = useRef<SVGEllipseElement | null>(null);
  const ledLeftRef = useRef<SVGRectElement | null>(null);
  const ledRightRef = useRef<SVGRectElement | null>(null);
  const beamRef = useRef<SVGPathElement | null>(null);
  const scanLineRef = useRef<SVGLineElement | null>(null);
  const defectGroupRef = useRef<SVGGElement | null>(null);
  const stageAlertRef = useRef<SVGGElement | null>(null);
  const edgeXLeftRef = useRef<SVGTextElement | null>(null);
  const edgeXRightRef = useRef<SVGTextElement | null>(null);
  const downtimeBannerRef = useRef<SVGGElement | null>(null);
  const logListRef = useRef<HTMLDivElement | null>(null);
  const previewScanRef = useRef<HTMLDivElement | null>(null);

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
    const showDefectMark = (type: DefectType | null) => {
      root.querySelectorAll<SVGGElement>("[data-defect]").forEach((g) => {
        g.style.opacity = g.dataset.defect === type ? "1" : "0";
      });
    };

    let running = true;
    let alarmOn = false;
    let busy = false;
    let downtimeSec = 0;
    let meterPos = 0;
    let inspected = 0;
    let defectCount = 0;

    const setPanelOk = (conf: string) => {
      setText("resultValue", "OK");
      setColor("resultValue", "var(--rpd-green)");
      setText("confidenceValue", conf);
      setText("pSurface", "OK \u2713");
      setText("pDiameter", "OK \u2713");
      setText("pMarking", "OK \u2713");
      setText("pProfile", "OK \u2713");
      ["pSurface", "pDiameter", "pMarking", "pProfile"].forEach((r) => setColor(r, "var(--rpd-green)"));
      setDot("panelDot", "var(--rpd-green)");
      setText("panelStatusText", "SYSTEM RUNNING");
      setColor("panelStatusText", "var(--rpd-green)");
      setDot("statusDot", "var(--rpd-green)");
      setText("statusText", "CONTINUOUS INSPECTION RUNNING");
      setColor("statusText", "var(--rpd-green)");
    };

    const setPanelScanning = () => {
      setText("resultValue", "SCANNING");
      setColor("resultValue", "var(--rpd-cyan)");
      setDot("statusDot", "var(--rpd-cyan)");
      setText("statusText", "ANALYSING MATERIAL\u2026");
      setColor("statusText", "var(--rpd-cyan)");
    };

    const setPanelDefect = (type: DefectType) => {
      setText("resultValue", "DEFECT");
      setColor("resultValue", "var(--rpd-red)");
      setText("confidenceValue", "41.2%");
      const fields = { pSurface: "OK \u2713", pDiameter: "OK \u2713", pMarking: "OK \u2713", pProfile: "OK \u2713" };
      if (type === "SURFACE_SCRATCH" || type === "INSULATION_DEFECT") fields.pSurface = DEFECT_LABELS[type] + " \u2715";
      else if (type === "DIAMETER_ERROR") fields.pDiameter = "Out of Tol. \u2715";
      else fields.pMarking = "Missing \u2715";
      (Object.keys(fields) as (keyof typeof fields)[]).forEach((k) => {
        setText(k, fields[k]);
        setColor(k, fields[k].includes("\u2715") ? "var(--rpd-red)" : "var(--rpd-green)");
      });
      setDot("statusDot", "var(--rpd-red)");
      setText("statusText", "DEFECT DETECTED \u2014 STOPPING LINE");
      setColor("statusText", "var(--rpd-red)");
    };

    const setPanelStopped = () => {
      setDot("statusDot", "var(--rpd-red)");
      setText("statusText", "LINE STOPPED \u2014 DEFECT ALERT");
      setColor("statusText", "var(--rpd-red)");
      setDot("panelDot", "var(--rpd-red)");
      setText("panelStatusText", "LINE STOPPED");
      setColor("panelStatusText", "var(--rpd-red)");
    };

    const addLogEntry = (type: DefectType, position: string, severity: "HIGH" | "MEDIUM") => {
      const list = logListRef.current;
      if (!list) return null;
      const empty = list.querySelector<HTMLElement>('[data-role="logEmpty"]');
      if (empty) empty.style.display = "none";

      const row = document.createElement("div");
      row.className = "rpd-log-row rpd-log-row-active";
      const sevColor = severity === "HIGH" ? "var(--rpd-red)" : "var(--rpd-yellow)";
      row.innerHTML = `
        <span class="rpd-log-dot" style="background:${sevColor};box-shadow:0 0 6px ${sevColor}"></span>
        <div class="rpd-log-body">
          <div class="rpd-log-top">
            <span class="rpd-log-label">${DEFECT_LABELS[type]}</span>
            <span class="rpd-log-time">${ts()}</span>
          </div>
          <div class="rpd-log-meta">
            <span>@ ${position}</span>
            <span style="color:${sevColor};font-weight:700">${severity}</span>
            <span data-role="stopDurLive">Stop: 00:00</span>
          </div>
        </div>`;
      list.insertBefore(row, list.firstChild);

      const rows = list.querySelectorAll<HTMLElement>(".rpd-log-row");
      rows.forEach((r, i) => {
        r.classList.remove("rpd-log-row-active");
        if (i > 7) r.remove();
      });
      return row;
    };

    const pulseSensorLeds = (on: boolean) => {
      const color = on ? "var(--rpd-cyan)" : "#1E3D65";
      if (ledLeftRef.current) ledLeftRef.current.setAttribute("fill", on ? "#00D4FF" : "#1E3D65");
      if (ledRightRef.current) ledRightRef.current.setAttribute("fill", on ? "#00D4FF" : "#1E3D65");
      void color;
    };

    // ---------- ambient / continuous animations ----------
    const ambientTweens: gsap.core.Tween[] = [];

    if (cableTextRef.current && !reduceMotion) {
      const tiles = cableTextRef.current.querySelectorAll<SVGTextElement>("text");
      ambientTweens.push(
        gsap.to(tiles, {
          x: "+=440",
          duration: 5.5,
          repeat: -1,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((x: number) => ((x % 440) + 440) % 440),
          },
        })
      );
    }
    if (stripeRowRef.current && !reduceMotion) {
      ambientTweens.push(
        gsap.to(stripeRowRef.current.querySelectorAll("rect"), {
          x: -38,
          duration: 0.65,
          repeat: -1,
          ease: "none",
          stagger: { each: 0.028, repeat: -1 },
        })
      );
    }
    if (spoolLeftRef.current && !reduceMotion) {
      ambientTweens.push(gsap.to(spoolLeftRef.current, { rotation: 360, duration: 9, repeat: -1, ease: "none", transformOrigin: "50% 50%" }));
    }
    if (spoolRightRef.current && !reduceMotion) {
      ambientTweens.push(gsap.to(spoolRightRef.current, { rotation: -360, duration: 9, repeat: -1, ease: "none", transformOrigin: "50% 50%" }));
    }
    if (camRingRef.current) {
      ambientTweens.push(
        gsap.to(camRingRef.current, {
          opacity: reduceMotion ? 0.8 : 0.4,
          duration: 1.3,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }
    if (camLightRef.current) {
      ambientTweens.push(
        gsap.to(camLightRef.current, {
          attr: { r: reduceMotion ? 8 : 10 },
          duration: 1.1,
          repeat: reduceMotion ? 0 : -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      );
    }

    const pauseAmbient = () => ambientTweens.forEach((t) => t.pause());
    const resumeAmbient = () => {
      if (running) ambientTweens.forEach((t) => t.play());
    };

    // ---------- alarm control ----------
    let beaconFlashTween: gsap.core.Tween | null = null;

    const activateAlarm = () => {
      alarmOn = true;
      root.querySelectorAll<HTMLElement>('[data-role="cardAlarm"]').forEach((n) => n.classList.add("rpd-alarm-on"));
      if (stageAlertRef.current) gsap.to(stageAlertRef.current, { opacity: 1, duration: 0.15 });
      if (edgeXLeftRef.current) gsap.to(edgeXLeftRef.current, { opacity: 1, duration: 0.15 });
      if (edgeXRightRef.current) gsap.to(edgeXRightRef.current, { opacity: 1, duration: 0.15 });
      if (downtimeBannerRef.current) gsap.to(downtimeBannerRef.current, { opacity: 1, duration: 0.15 });
      if (beaconGlassRef.current) {
        beaconFlashTween = gsap.to(beaconGlassRef.current, {
          attr: { fill: "#FF4B5C" },
          duration: 0.38,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }
    };
    const clearAlarm = () => {
      alarmOn = false;
      root.querySelectorAll<HTMLElement>('[data-role="cardAlarm"]').forEach((n) => n.classList.remove("rpd-alarm-on"));
      if (stageAlertRef.current) gsap.to(stageAlertRef.current, { opacity: 0, duration: 0.2 });
      if (edgeXLeftRef.current) gsap.to(edgeXLeftRef.current, { opacity: 0, duration: 0.2 });
      if (edgeXRightRef.current) gsap.to(edgeXRightRef.current, { opacity: 0, duration: 0.2 });
      if (downtimeBannerRef.current) gsap.to(downtimeBannerRef.current, { opacity: 0, duration: 0.2 });
      if (beaconFlashTween) {
        beaconFlashTween.kill();
        beaconFlashTween = null;
      }
      if (beaconGlassRef.current) beaconGlassRef.current.setAttribute("fill", "#1A2E4A");
      showDefectMark(null);
    };

    // ---------- inspection cycle ----------
    const runInspectionCycle = () => {
      if (!running || busy) return;
      busy = true;
      setPanelScanning();
      if (beamRef.current) gsap.to(beamRef.current, { opacity: 0.4, duration: 0.1 });
      if (scanLineRef.current) gsap.to(scanLineRef.current, { opacity: 1, duration: 0.1 });
      pulseSensorLeds(true);
      if (previewScanRef.current) {
        gsap.set(previewScanRef.current, { opacity: 1, left: "10%" });
        gsap.to(previewScanRef.current, { left: "90%", duration: 0.56, ease: "power1.inOut" });
      }

      window.setTimeout(() => {
        if (beamRef.current) gsap.to(beamRef.current, { opacity: 0, duration: 0.2 });
        if (scanLineRef.current) gsap.to(scanLineRef.current, { opacity: 0, duration: 0.15 });
        if (previewScanRef.current) gsap.to(previewScanRef.current, { opacity: 0, duration: 0.15 });
        pulseSensorLeds(false);

        inspected += 1;
        setText("statInspected", inspected.toLocaleString());

        const isDefect = Math.random() < 0.22;

        if (!isDefect) {
          setPanelOk((99.5 + Math.random() * 0.4).toFixed(1) + "%");
          busy = false;
          return;
        }

        const dtype = randomDefect();
        showDefectMark(dtype);
        setText("defectLabel", "\u2715 " + DEFECT_LABELS[dtype].toUpperCase());
        setPanelDefect(dtype);
        defectCount += 1;
        setText("statDefects", defectCount.toString());

        window.setTimeout(() => {
          // STOP the line
          running = false;
          pauseAmbient();
          setPanelStopped();
          activateAlarm();
          downtimeSec = 0;
          setText("downtimeValue", "00:00");
          setText("panelDowntimeValue", "00:00");

          const position = `m ${(142 + Math.random() * 500).toFixed(1)}`;
          const severity: "HIGH" | "MEDIUM" =
            dtype === "INSULATION_DEFECT" || dtype === "DIAMETER_ERROR" ? "HIGH" : "MEDIUM";
          const row = addLogEntry(dtype, position, severity);

          const downtimeTick = window.setInterval(() => {
            downtimeSec += 1;
            const f = formatDowntime(downtimeSec);
            setText("downtimeValue", f);
            setText("panelDowntimeValue", f);
            const dur = row?.querySelector<HTMLElement>('[data-role="stopDurLive"]');
            if (dur) dur.textContent = "Stop: " + f;
          }, 1000);

          window.setTimeout(() => {
            window.clearInterval(downtimeTick);
            clearAlarm();
            running = true;
            resumeAmbient();
            setPanelOk("99.8%");
            setText("statSpeed", running ? "220" : "0");
            busy = false;
          }, 5000);
        }, 600);
      }, 560);
    };

    let cycleInterval: number | undefined;
    let speedInterval: number | undefined;
    let meterInterval: number | undefined;
    let uptimeInterval: number | undefined;

    setPanelOk("99.8%");
    setText("statInspected", "0");
    setText("statDefects", "0");
    setText("statSpeed", "220");
    setText("downtimeValue", "00:00");
    setText("panelDowntimeValue", "00:00");
    setText("meterPos", "0.0");

    const startedAt = Date.now();
    const formatUptime = (ms: number) => {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
    };

    const startTimers = () => {
      if (reduceMotion) return;
      cycleInterval = window.setInterval(runInspectionCycle, 2600);
      speedInterval = window.setInterval(() => {
        const speed = running ? 215 + Math.floor(Math.random() * 12) : 0;
        setText("statSpeed", String(speed));
      }, 1900);
      meterInterval = window.setInterval(() => {
        if (!running) return;
        meterPos = parseFloat((meterPos + 0.05).toFixed(2));
        setText("meterPos", meterPos.toFixed(1));
      }, 200);
      uptimeInterval = window.setInterval(() => {
        setText("uptime", formatUptime(Date.now() - startedAt));
      }, 1000);
    };

    const stopTimers = () => {
      if (cycleInterval) window.clearInterval(cycleInterval);
      if (speedInterval) window.clearInterval(speedInterval);
      if (meterInterval) window.clearInterval(meterInterval);
      if (uptimeInterval) window.clearInterval(uptimeInterval);
      cycleInterval = speedInterval = meterInterval = uptimeInterval = undefined;
    };

    if (reduceMotion) {
      // Static illustrative frame — no running loop.
      setPanelOk("99.8%");
    } else {
      startTimers();
    }

    // Background/throttled tabs make timers fall behind; pause the whole
    // cycle + ambient motion while hidden and pick back up cleanly when
    // visible again, so the line-stop/alarm/auto-resume sequence never
    // desyncs from what's on screen.
    const handleVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        stopTimers();
        pauseAmbient();
      } else {
        startTimers();
        resumeAmbient();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopTimers();
      ambientTweens.forEach((t) => t.kill());
      if (beaconFlashTween) beaconFlashTween.kill();
      gsap.killTweensOf([
        beamRef.current,
        scanLineRef.current,
        stageAlertRef.current,
        edgeXLeftRef.current,
        edgeXRightRef.current,
        downtimeBannerRef.current,
        beaconGlassRef.current,
        previewScanRef.current,
      ]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scanGradId = `rpd-scan-${uid}`;

  return (
    <div ref={rootRef} className={`rpd-root ${variant === "compact" ? "rpd-compact" : ""} ${className ?? ""}`}>
      <style>{CSS}</style>

      <div className="rpd-card" data-role="cardAlarm">
        <div className="rpd-bgfx" aria-hidden="true">
          <div className="rpd-grid" />
          <span className="rpd-corner rpd-corner-a" />
          <span className="rpd-corner rpd-corner-b" />
        </div>

        <div className="rpd-layout">
          {/* HEADER */}
          <div className="rpd-header">
            <div className="rpd-logo">
              PIXTRON <span>SYSTEMS</span>
            </div>
            <div className="rpd-producttag">
              <span className="rpd-line" />
              RAPID <em>|</em> CONTINUOUS FLOW INSPECTION
            </div>
          </div>

          {/* HERO TEXT */}
          <div className="rpd-hero">
            <h1>
              R<span>APID</span>
            </h1>
            <p>
              High-speed AI vision inspection for continuous manufacturing lines — cable, web and
              extrusion surfaces verified without slowing production.
            </p>
            <div className="rpd-taglist">
              <span className="rpd-pill">100% CONTINUOUS INSPECTION</span>
              <span className="rpd-pill rpd-pill-ghost">AI VISION</span>
            </div>
            {brochureHref && (
              <a className="rpd-cta" href={brochureHref} target="_blank" rel="noopener noreferrer">
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
          <div className="rpd-stage">
            <div className="rpd-stage-label">CABLE LINE VIEW</div>
            <svg viewBox="0 0 1200 400" className="rpd-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id={scanGradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                </linearGradient>
                <clipPath id={`rpd-clip-${uid}`}>
                  <rect x="170" y="185" width="860" height="30" />
                </clipPath>
              </defs>

              {/* LEFT SPOOL — PAY-OUT */}
              <g transform="translate(90,200)">
                <g ref={spoolLeftRef}>
                  {SPOOL_ANGLES.map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={22 * Math.cos(rad)}
                        y1={22 * Math.sin(rad)}
                        x2={48 * Math.cos(rad)}
                        y2={48 * Math.sin(rad)}
                        className="rpd-spool-wind"
                      />
                    );
                  })}
                </g>
                <ellipse cx="0" cy="0" rx="66" ry="66" className="rpd-spool-rim" />
                <ellipse cx="0" cy="0" rx="49" ry="49" className="rpd-spool-inner" />
                <ellipse cx="0" cy="0" rx="16" ry="16" className="rpd-spool-hub" />
                <ellipse cx="0" cy="0" rx="7" ry="7" className="rpd-spool-hub2" />
              </g>
              <text x="90" y="288" textAnchor="middle" className="rpd-spool-label">
                PAY-OUT
              </text>

              {/* RIGHT SPOOL — TAKE-UP */}
              <g transform="translate(1110,200)">
                <g ref={spoolRightRef}>
                  {SPOOL_ANGLES.map((deg, i) => {
                    const rad = (deg * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={22 * Math.cos(rad)}
                        y1={22 * Math.sin(rad)}
                        x2={44 * Math.cos(rad)}
                        y2={44 * Math.sin(rad)}
                        className="rpd-spool-wind"
                      />
                    );
                  })}
                </g>
                <ellipse cx="0" cy="0" rx="66" ry="66" className="rpd-spool-rim" />
                <ellipse cx="0" cy="0" rx="49" ry="49" className="rpd-spool-inner" />
                <ellipse cx="0" cy="0" rx="16" ry="16" className="rpd-spool-hub" />
                <ellipse cx="0" cy="0" rx="7" ry="7" className="rpd-spool-hub2" />
              </g>
              <text x="1110" y="288" textAnchor="middle" className="rpd-spool-label">
                TAKE-UP
              </text>

              {/* CABLE RIBBON */}
              <rect x="170" y="185" width="860" height="30" rx="4" className="rpd-cable-jacket" />
              <rect x="170" y="185" width="860" height="5" rx="4" className="rpd-cable-highlight" />
              <g ref={stripeRowRef}>
                {Array.from({ length: 24 }).map((_, i) => (
                  <rect key={i} x={176 + i * 38} y="188" width="14" height="24" className="rpd-cable-stripe" />
                ))}
              </g>
              <g clipPath={`url(#rpd-clip-${uid})`}>
                <g ref={cableTextRef}>
                  {[0, 1, 2].map((i) => (
                    <text key={i} x={170 + i * 440} y="204" className="rpd-cable-print">
                      50618 HALOGEN FREE PV SOLAR CABLE &#9670;
                    </text>
                  ))}
                </g>
              </g>

              {/* guide rollers */}
              <ellipse cx="185" cy="200" rx="12" ry="12" className="rpd-guide" />
              <ellipse cx="185" cy="200" rx="5" ry="5" className="rpd-guide-hub" />
              <ellipse cx="1015" cy="200" rx="12" ry="12" className="rpd-guide" />
              <ellipse cx="1015" cy="200" rx="5" ry="5" className="rpd-guide-hub" />

              {/* INSPECTION TUNNEL */}
              <rect x="558" y="128" width="22" height="145" rx="4" className="rpd-tunnel-side" />
              <rect x="620" y="128" width="22" height="145" rx="4" className="rpd-tunnel-side" />
              <rect x="554" y="114" width="110" height="16" rx="4" className="rpd-tunnel-top" />
              <rect ref={ledLeftRef} x="564" y="132" width="8" height="136" rx="2" className="rpd-tunnel-led" />
              <rect ref={ledRightRef} x="628" y="132" width="8" height="136" rx="2" className="rpd-tunnel-led" />

              {/* CAMERA HEAD */}
              <g transform="translate(600,40)">
                <rect x="-6" y="-30" width="12" height="30" className="rpd-mount" />
                <rect x="-40" y="0" width="80" height="52" rx="10" className="rpd-camera-body" />
                <rect x="-32" y="10" width="64" height="34" rx="6" className="rpd-camera-face" />
                <circle cx="0" cy="66" r="26" className="rpd-camera-ring-bg" />
                <circle ref={camRingRef} cx="0" cy="66" r="21" className="rpd-camera-ring" />
                <circle cx="0" cy="66" r="13" className="rpd-camera-lens" />
                <circle ref={camLightRef} cx="0" cy="66" r="8" className="rpd-camera-light" />
                <text x="0" y="102" textAnchor="middle" className="rpd-camera-caption">
                  RAPID VISION
                </text>
                <path
                  ref={beamRef}
                  d="M-30 92 L30 92 L48 178 L-48 178 Z"
                  fill={`url(#${scanGradId})`}
                  className="rpd-beam"
                />
              </g>
              <line ref={scanLineRef} x1="565" y1="200" x2="635" y2="200" className="rpd-scanline" />

              {/* ALARM BEACON */}
              <g transform="translate(470,44)">
                <rect x="-4" y="0" width="8" height="46" rx="3" className="rpd-beacon-pole" />
                <rect x="-22" y="-24" width="44" height="28" rx="8" className="rpd-beacon-housing" />
                <ellipse ref={beaconGlassRef} cx="0" cy="-12" rx="17" ry="12" className="rpd-beacon-glass" fill="#1A2E4A" />
                <text x="0" y="18" textAnchor="middle" className="rpd-camera-caption">
                  ALARM
                </text>
              </g>

              {/* DEFECT MARK (single reusable zone at inspection point) */}
              <g ref={defectGroupRef} transform="translate(600,150)">
                <g data-defect="SURFACE_SCRATCH" className="rpd-defect-visual">
                  <line x1="-20" y1="14" x2="-6" y2="46" className="rpd-defect-scratch" strokeWidth={3} />
                  <line x1="-14" y1="14" x2="0" y2="46" className="rpd-defect-scratch" strokeWidth={2} opacity={0.5} />
                </g>
                <g data-defect="INSULATION_DEFECT" className="rpd-defect-visual">
                  <ellipse cx="-8" cy="30" rx="18" ry="16" className="rpd-defect-outline" />
                </g>
                <g data-defect="DIAMETER_ERROR" className="rpd-defect-visual">
                  <rect x="-25" y="10" width="30" height="36" rx="4" className="rpd-defect-fill" />
                </g>
                <g data-defect="PRINT_MISSING" className="rpd-defect-visual">
                  <rect x="-28" y="14" width="80" height="28" className="rpd-defect-fill" />
                </g>
                <g className="rpd-defect-callout">
                  <rect x="-65" y="-28" width="150" height="22" rx="4" className="rpd-defect-tag-bg" />
                  <text x="-58" y="-13" className="rpd-defect-tag-text" data-role="defectLabel">
                    &nbsp;
                  </text>
                  <polygon points="-8,0 0,0 -4,10" className="rpd-defect-tag-arrow" />
                </g>
              </g>

              {/* STAGE ALERT BANNER */}
              <g ref={stageAlertRef} opacity="0" className="rpd-stage-alert">
                <rect x="330" y="255" width="340" height="42" rx="8" className="rpd-alert-bg" />
                <text x="500" y="274" textAnchor="middle" className="rpd-alert-title">
                  \u26A0 LINE STOPPED &mdash; DEFECT DETECTED
                </text>
                <text x="500" y="288" textAnchor="middle" className="rpd-alert-sub">
                  CHECK DEFECT LOG FOR DETAILS
                </text>
              </g>

              <text ref={edgeXLeftRef} x="210" y="207" className="rpd-edge-x" opacity="0">
                &#10007;
              </text>
              <text ref={edgeXRightRef} x="975" y="207" className="rpd-edge-x" opacity="0">
                &#10007;
              </text>

              <g ref={downtimeBannerRef} opacity="0" transform="translate(720,258)">
                <rect x="0" y="0" width="150" height="40" rx="6" className="rpd-downtime-bg" />
                <text x="75" y="16" textAnchor="middle" className="rpd-downtime-label">
                  DOWNTIME
                </text>
                <text x="75" y="33" textAnchor="middle" className="rpd-downtime-value" data-role="downtimeValue">
                  00:00
                </text>
              </g>
            </svg>
          </div>

          {/* LIVE METRICS STRIP — desktop-compact only */}
          <div className="rpd-stage-foot">
            <div className="rpd-mini">
              <span className="rpd-mini-label">LINE SPEED</span>
              <span className="rpd-mini-value" data-role="statSpeed">
                &mdash;
              </span>
            </div>
            <div className="rpd-mini">
              <span className="rpd-mini-label">METER POSITION</span>
              <span className="rpd-mini-value" data-role="meterPos">
                &mdash;
              </span>
            </div>
            <div className="rpd-mini">
              <span className="rpd-mini-label">SESSION DEFECTS</span>
              <span className="rpd-mini-value" data-role="statDefects">
                0
              </span>
            </div>
            <div className="rpd-mini">
              <span className="rpd-mini-label">UPTIME</span>
              <span className="rpd-mini-value" data-role="uptime">
                00:00:00
              </span>
            </div>
          </div>

          {/* STATUS */}
          <div className="rpd-status">
            <span className="rpd-status-dot" data-role="statusDot" />
            <span data-role="statusText">CONTINUOUS INSPECTION RUNNING</span>
          </div>

          {/* SOFTWARE PANEL */}
          <div className="rpd-panel">
            <div className="rpd-panel-head">
              <span className="rpd-panel-title">RAPID</span>
              <span className="rpd-running">
                <i className="rpd-running-dot" data-role="panelDot" /> <span data-role="panelStatusText">SYSTEM RUNNING</span>
              </span>
            </div>

            <div className="rpd-preview">
              <span className="rpd-preview-label">LIVE CAMERA VIEW</span>
              <span className="rpd-preview-pos" data-role="meterPosPreview">
                POS: <span data-role="meterPos">0.0</span>m
              </span>
              <div className="rpd-preview-cable" />
              <span className="rpd-preview-scan" ref={previewScanRef} />
            </div>

            <div className="rpd-result">
              <div>
                <div className="rpd-result-label">INSPECTION RESULT</div>
                <div className="rpd-result-value" data-role="resultValue">
                  &mdash;
                </div>
              </div>
              <div className="rpd-confidence">
                CONFIDENCE
                <strong data-role="confidenceValue">&mdash;</strong>
              </div>
            </div>

            <div className="rpd-captured">
              <div className="rpd-captured-title">INSPECTION PARAMETERS</div>
              <div className="rpd-captured-row">
                <span>SURFACE</span>
                <span data-role="pSurface">&mdash;</span>
              </div>
              <div className="rpd-captured-row">
                <span>DIAMETER</span>
                <span data-role="pDiameter">&mdash;</span>
              </div>
              <div className="rpd-captured-row">
                <span>MARKING</span>
                <span data-role="pMarking">&mdash;</span>
              </div>
              <div className="rpd-captured-row">
                <span>PROFILE</span>
                <span data-role="pProfile">&mdash;</span>
              </div>
            </div>

            <div className="rpd-downtime-card" data-role="cardAlarm">
              <div>
                <div className="rpd-downtime-card-label">\u26A0 LINE STOPPED</div>
                <div className="rpd-downtime-card-value" data-role="panelDowntimeValue">
                  00:00
                </div>
              </div>
              <div className="rpd-downtime-card-right">
                DOWNTIME
                <div>AUTO-RESUME</div>
              </div>
            </div>

            <div className="rpd-stats">
              <div className="rpd-stat">
                <div className="rpd-stat-title">SPEED</div>
                <div className="rpd-stat-value rpd-stat-yellow" data-role="statSpeedPanel">
                  <span data-role="statSpeed">220</span> m/min
                </div>
              </div>
              <div className="rpd-stat">
                <div className="rpd-stat-title">INSPECTED</div>
                <div className="rpd-stat-value" data-role="statInspected">
                  0
                </div>
              </div>
              <div className="rpd-stat">
                <div className="rpd-stat-title">DEFECTS</div>
                <div className="rpd-stat-value rpd-stat-red" data-role="statDefects">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* DEFECT LOG */}
          <div className="rpd-log">
            <div className="rpd-log-head">
              <span className="rpd-log-title">DEFECT LOG</span>
              <span className="rpd-log-sub" data-role="statDefectsSub">
                <span data-role="statDefects">0</span> total defects detected
              </span>
            </div>
            <div className="rpd-log-list" ref={logListRef}>
              <div className="rpd-log-empty" data-role="logEmpty">
                No defects recorded this session
              </div>
            </div>
          </div>

          {/* FEATURES */}
          <div className="rpd-features">
            <div className="rpd-feature">
              <span className="rpd-feature-icon">&#128269;</span>
              <div>
                <strong>Surface Detect</strong>
                <small>Scratch, crack &amp; tear recognition</small>
              </div>
            </div>
            <div className="rpd-feature">
              <span className="rpd-feature-icon">&#9889;</span>
              <div>
                <strong>High Speed</strong>
                <small>Continuous web &amp; cable feeds</small>
              </div>
            </div>
            <div className="rpd-feature">
              <span className="rpd-feature-icon">&#9670;</span>
              <div>
                <strong>AI Powered</strong>
                <small>Smart defect classification</small>
              </div>
            </div>
            <div className="rpd-feature">
              <span className="rpd-feature-icon">&#9737;</span>
              <div>
                <strong>Reliable</strong>
                <small>24/7 production monitoring</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES (scoped by .rpd- prefix, container-query responsive)
============================================================ */

const CSS = `
.rpd-root {
  --rpd-blue-950: #03152F;
  --rpd-blue-900: #05245A;
  --rpd-blue-800: #06357D;
  --rpd-blue-700: #0757B8;
  --rpd-blue: #0878E8;
  --rpd-yellow: #FFD400;
  --rpd-cyan: #00D4FF;
  --rpd-white: #FFFFFF;
  --rpd-gray-200: #DCE5F0;
  --rpd-gray-400: #8FA2BA;
  --rpd-green: #21E68A;
  --rpd-red: #FF4B5C;

  width: 100%;
  container-type: inline-size;
  container-name: rpd;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  box-sizing: border-box;
}
.rpd-root *, .rpd-root *::before, .rpd-root *::after { box-sizing: border-box; }

.rpd-card {
  position: relative;
  width: 100%;
  border-radius: clamp(14px, 3cqw, 26px);
  overflow: hidden;
  background: linear-gradient(135deg, #041A3A 0%, #052B65 55%, #041A3A 100%);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 100px rgba(0,90,200,0.08);
  padding: clamp(16px, 3.2cqw, 34px);
  transition: box-shadow 0.15s;
}
.rpd-card.rpd-alarm-on { box-shadow: 0 30px 80px rgba(0,0,0,0.4), inset 0 0 90px rgba(255,75,92,0.14), 0 0 0 2px var(--rpd-red); }

.rpd-bgfx { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.rpd-grid {
  position: absolute; inset: 0; opacity: 0.1;
  background-image:
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}
.rpd-corner { position: absolute; border: 1px solid rgba(255,212,0,0.16); opacity: 0.5; }
.rpd-corner-a { width: 220px; height: 110px; top: 120px; left: -100px; border-right: 0; }
.rpd-corner-b { width: 240px; height: 150px; right: -120px; bottom: 60px; border-left: 0; }

.rpd-layout {
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
    "log    log"
    "features features";
  align-items: start;
}

@container rpd (max-width: 780px) {
  .rpd-layout {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "hero"
      "stage"
      "status"
      "panel"
      "log"
      "features";
  }
}

.rpd-header { grid-area: header; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.rpd-logo { color: #fff; font-size: clamp(12px, 1.6cqw, 16px); font-weight: 800; letter-spacing: 1px; }
.rpd-logo span { color: var(--rpd-yellow); }
.rpd-producttag { display: flex; align-items: center; gap: 10px; color: #fff; font-size: clamp(9px, 1.1cqw, 11px); font-weight: 700; letter-spacing: 0.8px; opacity: 0.9; }
.rpd-producttag em { font-style: normal; color: var(--rpd-yellow); }
.rpd-line { width: 22px; height: 2px; background: var(--rpd-yellow); display: inline-block; }

.rpd-hero { grid-area: hero; color: #fff; }
.rpd-hero h1 { margin: clamp(6px,1.5cqw,14px) 0 0; font-size: clamp(28px, 5.6cqw, 48px); line-height: 0.95; font-weight: 800; letter-spacing: -1.5px; }
.rpd-hero h1 span { color: var(--rpd-yellow); }
.rpd-hero p { margin: 10px 0 0; max-width: 52ch; font-size: clamp(12px, 1.5cqw, 14px); color: #B9C9DF; line-height: 1.5; }
.rpd-taglist { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.rpd-pill { padding: 6px 11px; border-radius: 5px; background: var(--rpd-yellow); color: var(--rpd-blue-950); font-size: 9.5px; font-weight: 800; letter-spacing: 0.6px; }
.rpd-pill-ghost { background: rgba(255,255,255,0.08); color: #E7EEF8; border: 1px solid rgba(255,255,255,0.18); }
.rpd-cta {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 10px 16px; border-radius: 8px; background: var(--rpd-blue-700); color: #fff;
  font-size: 12px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.rpd-cta:hover { background: var(--rpd-blue); transform: translateY(-1px); }

.rpd-stage {
  grid-area: stage;
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #020B18;
  border: 1px solid rgba(255,255,255,0.1);
  aspect-ratio: 1200 / 400;
}
.rpd-stage-label {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  font-size: clamp(7px, 1.7cqw, 9px); font-weight: 700; letter-spacing: 0.7px; color: #9FC0E0;
  background: rgba(2,11,24,0.75); padding: 3px 7px; border-radius: 5px;
  max-width: calc(100% - 16px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rpd-svg { width: 100%; height: 100%; display: block; }

.rpd-spool-rim { fill: #1A3356; stroke: #2C4F78; stroke-width: 2; }
.rpd-spool-inner { fill: #0E2347; stroke: #1E3D65; stroke-width: 1.5; }
.rpd-spool-hub { fill: #071525; }
.rpd-spool-hub2 { fill: #1A3356; }
.rpd-spool-wind { stroke: #2A4F78; stroke-width: 2; }
.rpd-spool-label { fill: #8DA7C5; font-size: 8px; font-weight: 700; font-family: Inter, sans-serif; }

.rpd-cable-jacket { fill: #1E3348; stroke: #2C4A68; stroke-width: 1; transition: fill 0.3s; }
.rpd-alarm-on .rpd-cable-jacket { fill: #3A0A0A; }
.rpd-cable-highlight { fill: rgba(255,255,255,0.07); }
.rpd-cable-stripe { fill: var(--rpd-yellow); opacity: 0.28; }
.rpd-cable-print { fill: #7BA5C8; font-size: 8px; font-family: monospace; font-weight: 700; }
.rpd-alarm-on .rpd-cable-print { fill: rgba(200,100,100,0.6); }

.rpd-guide { fill: #1A3356; stroke: #2C4F78; stroke-width: 1.5; }
.rpd-guide-hub { fill: #071525; }

.rpd-tunnel-side { fill: #0E2347; stroke: #2C4F78; stroke-width: 1; }
.rpd-tunnel-top { fill: #182C47; stroke: #2E4F72; stroke-width: 1; }
.rpd-tunnel-led { fill: #1E3D65; opacity: 0.7; transition: fill 0.2s; }

.rpd-mount { fill: #7F91A7; }
.rpd-camera-body { fill: #102B54; stroke: #6C86A8; stroke-width: 1; }
.rpd-camera-face { fill: #061A38; }
.rpd-camera-ring-bg { fill: #061A38; }
.rpd-camera-ring { fill: none; stroke: var(--rpd-cyan); stroke-width: 3; filter: drop-shadow(0 0 6px rgba(0,212,255,0.7)); }
.rpd-alarm-on .rpd-camera-ring { stroke: var(--rpd-red); filter: drop-shadow(0 0 6px rgba(255,75,92,0.7)); }
.rpd-camera-lens { fill: #020A17; stroke: #2D74C8; stroke-width: 2; }
.rpd-camera-light { fill: #00CFFF; opacity: 0.7; }
.rpd-alarm-on .rpd-camera-light { fill: var(--rpd-red); }
.rpd-camera-caption { fill: #8DA7C5; font-size: 7px; font-weight: 700; font-family: Inter, sans-serif; }
.rpd-beam { opacity: 0; }
.rpd-scanline { stroke: var(--rpd-cyan); stroke-width: 2.5; opacity: 0; filter: drop-shadow(0 0 8px rgba(0,212,255,0.9)); }
.rpd-alarm-on .rpd-scanline { stroke: var(--rpd-red); }

.rpd-beacon-pole { fill: #243B5A; }
.rpd-beacon-housing { fill: #1A2E4A; stroke: #3A5570; stroke-width: 1; }
.rpd-beacon-glass { stroke: #2E4F72; stroke-width: 2; transition: stroke 0.2s; }
.rpd-alarm-on .rpd-beacon-glass { stroke: var(--rpd-red); filter: drop-shadow(0 0 10px rgba(255,75,92,0.8)); }

.rpd-defect-visual { opacity: 0; transition: none; }
.rpd-defect-scratch { stroke: var(--rpd-red); stroke-linecap: round; }
.rpd-defect-outline { fill: none; stroke: var(--rpd-red); stroke-width: 3; stroke-dasharray: 4 2; }
.rpd-defect-fill { fill: rgba(255,75,92,0.22); stroke: var(--rpd-red); stroke-width: 2; }
.rpd-defect-callout { opacity: 0; }
.rpd-alarm-on .rpd-defect-callout { opacity: 1; }
.rpd-defect-tag-bg { fill: var(--rpd-red); filter: drop-shadow(0 0 8px rgba(255,75,92,0.8)); }
.rpd-defect-tag-text { fill: #fff; font-size: 9px; font-weight: 800; font-family: monospace; }
.rpd-defect-tag-arrow { fill: var(--rpd-red); }

.rpd-stage-alert { }
.rpd-alert-bg { fill: var(--rpd-red); filter: drop-shadow(0 0 16px rgba(255,75,92,0.7)); }
.rpd-alert-title { fill: #fff; font-size: 11px; font-weight: 800; font-family: Inter, sans-serif; }
.rpd-alert-sub { fill: rgba(255,255,255,0.85); font-size: 8px; font-family: Inter, sans-serif; }
.rpd-edge-x { fill: var(--rpd-red); font-size: 15px; font-weight: 900; filter: drop-shadow(0 0 6px rgba(255,75,92,0.8)); }
.rpd-downtime-bg { fill: rgba(3,20,43,0.95); stroke: var(--rpd-red); stroke-width: 1; }
.rpd-downtime-label { fill: var(--rpd-red); font-size: 8px; font-weight: 700; font-family: Inter, sans-serif; }
.rpd-downtime-value { fill: #fff; font-size: 14px; font-weight: 800; font-family: Inter, sans-serif; }

.rpd-status {
  grid-area: status;
  display: inline-flex; align-items: center; gap: 9px;
  padding: 9px 13px; border-radius: 8px;
  background: rgba(3,20,43,0.9); border: 1px solid rgba(255,255,255,0.1);
  color: #fff; font-size: 10.5px; font-weight: 700; width: fit-content; max-width: 100%;
}
.rpd-status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rpd-green); box-shadow: 0 0 8px var(--rpd-green); flex: none; }

.rpd-panel {
  grid-area: panel;
  padding: clamp(12px, 1.8cqw, 17px);
  border-radius: 15px;
  background: linear-gradient(145deg, rgba(8,44,96,0.97), rgba(3,22,48,0.97));
  border: 1px solid rgba(88,153,230,0.35);
  box-shadow: 0 20px 45px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.08);
}
.rpd-panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.rpd-panel-title { color: #fff; font-size: 13px; font-weight: 800; }
.rpd-running { display: flex; align-items: center; gap: 6px; color: var(--rpd-green); font-size: 9px; font-weight: 800; letter-spacing: 0.5px; }
.rpd-running-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rpd-green); box-shadow: 0 0 8px var(--rpd-green); display: inline-block; }

.rpd-preview { position: relative; height: 96px; border-radius: 9px; overflow: hidden; background: #020B18; border: 1px solid rgba(255,255,255,0.1); }
.rpd-preview-label { position: absolute; top: 8px; left: 9px; z-index: 3; font-size: 8px; color: #7EA0C7; font-weight: 700; letter-spacing: 0.6px; }
.rpd-preview-pos { position: absolute; bottom: 7px; right: 9px; z-index: 3; font-size: 8px; color: var(--rpd-cyan); font-weight: 700; font-family: monospace; }
.rpd-preview-cable {
  position: absolute; left: 6%; right: 6%; top: 40%; height: 26%; border-radius: 4px;
  background: repeating-linear-gradient(90deg, #1E3348 0 22px, rgba(255,212,0,0.28) 22px 30px);
  border: 1px solid rgba(255,255,255,0.08);
}
.rpd-preview-scan { position: absolute; top: 0; bottom: 0; left: 0; width: 2px; background: var(--rpd-cyan); box-shadow: 0 0 12px var(--rpd-cyan); opacity: 0; }

.rpd-result { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding: 11px; border-radius: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.rpd-result-label { color: #7D96B5; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; }
.rpd-result-value { font-size: 15px; font-weight: 800; color: var(--rpd-green); margin-top: 2px; }
.rpd-confidence { text-align: right; color: #8EA7C4; font-size: 8px; }
.rpd-confidence strong { display: block; color: #fff; font-size: 13px; margin-top: 2px; }

.rpd-captured { margin-top: 10px; }
.rpd-captured-title { color: #7693B5; font-size: 8px; margin-bottom: 5px; font-weight: 700; letter-spacing: 0.3px; }
.rpd-captured-row { display: flex; justify-content: space-between; padding: 5px 7px; margin-bottom: 3px; background: rgba(255,255,255,0.035); border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #DCE8F7; }
.rpd-captured-row span:first-child { color: #7D96B5; font-family: Inter, sans-serif; }

.rpd-downtime-card { display: none; justify-content: space-between; align-items: center; margin-top: 10px; padding: 9px 11px; border-radius: 8px; background: rgba(255,75,92,0.12); border: 1px solid rgba(255,75,92,0.3); }
.rpd-alarm-on.rpd-downtime-card { display: flex; }
.rpd-downtime-card-label { color: var(--rpd-red); font-size: 8px; font-weight: 700; }
.rpd-downtime-card-value { color: #fff; font-size: 15px; font-weight: 800; margin-top: 2px; }
.rpd-downtime-card-right { color: #8EA7C4; font-size: 7px; text-align: right; }
.rpd-downtime-card-right div { color: var(--rpd-red); font-weight: 800; margin-top: 2px; }

.rpd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 10px; }
.rpd-stat { padding: 8px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.05); }
.rpd-stat-title { color: #718AA7; font-size: 7px; letter-spacing: 0.3px; }
.rpd-stat-value { color: #fff; font-size: 12px; font-weight: 800; margin-top: 3px; }
.rpd-stat-yellow { color: var(--rpd-yellow); }
.rpd-stat-red { color: var(--rpd-red); }

.rpd-log { grid-area: log; padding: clamp(12px, 1.6cqw, 16px); border-radius: 12px; background: linear-gradient(145deg, rgba(8,44,96,0.95), rgba(3,22,48,0.95)); border: 1px solid rgba(88,153,230,0.25); }
.rpd-alarm-on .rpd-log { border-color: rgba(255,75,92,0.4); }
.rpd-log-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.rpd-log-title { font-size: 11px; font-weight: 800; color: #fff; }
.rpd-log-sub { font-size: 8px; color: #7693B5; }
.rpd-log-list { display: flex; flex-direction: column; gap: 4px; max-height: 160px; overflow-y: auto; }
.rpd-log-empty { color: #7693B5; font-size: 9px; text-align: center; padding: 10px 0; }
.rpd-log-row { display: flex; gap: 8px; align-items: flex-start; padding: 7px 9px; border-radius: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); }
.rpd-log-row-active { background: rgba(255,75,92,0.12); border-color: rgba(255,75,92,0.3); }
.rpd-log-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; margin-top: 3px; }
.rpd-log-body { flex: 1; min-width: 0; }
.rpd-log-top { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.rpd-log-label { font-size: 9px; font-weight: 700; color: #fff; }
.rpd-log-time { font-size: 7.5px; color: #7693B5; flex: none; }
.rpd-log-meta { display: flex; gap: 10px; margin-top: 2px; font-size: 7.5px; color: #8EA7C4; flex-wrap: wrap; }

.rpd-features { grid-area: features; display: flex; gap: 10px; flex-wrap: wrap; }
.rpd-feature { flex: 1 1 160px; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: rgba(4,26,58,0.82); border: 1px solid rgba(93,145,205,0.2); }
.rpd-feature-icon { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: rgba(255,212,0,0.12); color: var(--rpd-yellow); font-size: 12px; flex: none; }
.rpd-feature strong { display: block; color: #fff; font-size: 10.5px; }
.rpd-feature small { color: #7891AE; font-size: 8.5px; display: block; margin-top: 2px; }

@container rpd (max-width: 480px) {
  .rpd-features { flex-direction: column; }
  .rpd-result-value { font-size: 14px; }
}

/* ---------- compact variant: fill an existing image/video slot ---------- */
.rpd-root.rpd-compact { height: auto; }
.rpd-compact .rpd-card { height: auto; padding: clamp(10px, 1.6cqw, 16px); border-radius: 0; border: none; box-shadow: none; }
.rpd-compact .rpd-header,
.rpd-compact .rpd-hero,
.rpd-compact .rpd-status,
.rpd-compact .rpd-log,
.rpd-compact .rpd-features { display: none; }
.rpd-compact .rpd-layout {
  height: auto;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  grid-template-areas:
    "stage panel"
    "stagefoot panel";
  align-items: start;
}
.rpd-compact .rpd-stage { aspect-ratio: 1200 / 400; height: auto; }
.rpd-compact .rpd-panel { height: auto; overflow: visible; }

.rpd-stage-foot { grid-area: stagefoot; display: none; }
.rpd-compact .rpd-stage-foot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
.rpd-mini { padding: 10px 11px; border-radius: 10px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 5px; }
.rpd-mini-label { font-size: 7.5px; letter-spacing: 0.5px; color: #7D96B5; font-weight: 700; }
.rpd-mini-value { font-size: clamp(11px, 1.5cqw, 15px); font-weight: 800; color: #fff; font-variant-numeric: tabular-nums; }

@container rpd (max-width: 900px) {
  .rpd-compact .rpd-stage-foot { grid-template-columns: repeat(2, 1fr); }
}
@container rpd (max-width: 680px) {
  .rpd-compact .rpd-layout { grid-template-columns: 1fr; grid-template-areas: "stage" "panel"; }
  .rpd-compact .rpd-stage { aspect-ratio: 4 / 3; }
  .rpd-compact .rpd-stage-foot { display: none; }
}
@container rpd (max-width: 380px) {
  .rpd-compact .rpd-stage { aspect-ratio: 1 / 1; }
}

@media (prefers-reduced-motion: reduce) {
  .rpd-root * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`;