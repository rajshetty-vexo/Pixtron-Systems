import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react';

const DESKTOP_CELL_SIZE = 46;
const MOBILE_CELL_SIZE = 26;
const DESKTOP_BREAKPOINT = 768;
const RADIUS = 0.30;
const RING_FREQ = 16;
const RING_SPEED = 5.5;
const PRIMARY_RGB = '0,57,133'; // matches --color-primary (#003985)

interface SquareWaveBackdropProps {
  rows?: number;
  cols?: number;
}

export interface SquareWaveBackdropHandle {
  updateGlow: (clientX: number, clientY: number) => void;
  reset: () => void;
}

/*
  SquareWaveBackdrop (diamond / paper-fold version)
  -----------------------
  Each tile is a plain square div, but ROTATED 45deg (so it reads as a
  diamond), sized smaller than its grid cell so real gaps of white
  background show through between diamonds — matching the reference
  "folded paper" look instead of a solid, dull-gray wash.

  Idle state: a very light gray-white gradient + a soft embossed
  box-shadow (bright highlight top-left, faint shadow bottom-right) —
  looks like a subtly raised paper tile, no heavy tint anywhere.

  On hover: a wave still travels outward from the cursor, lifting
  and slightly tinting the tiles it passes over toward primary blue —
  but only a LIGHT touch of color, keeping the overall look monochrome
  and clean like the reference, not a blue wash.
*/
export const SquareWaveBackdrop = forwardRef<SquareWaveBackdropHandle, SquareWaveBackdropProps>(
  ({ rows: rowsProp, cols: colsProp }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [grid, setGrid] = useState({ rows: rowsProp ?? 10, cols: colsProp ?? 20 });

    useEffect(() => {
      if (rowsProp && colsProp) return;
      const el = containerRef.current;
      if (!el) return;

      const recompute = () => {
        const { width, height } = el.getBoundingClientRect();
        if (width === 0 || height === 0) return;
        const cellSize = width >= DESKTOP_BREAKPOINT ? DESKTOP_CELL_SIZE : MOBILE_CELL_SIZE;
        const cols = Math.max(6, Math.round(width / cellSize));
        const rows = Math.max(6, Math.round(height / cellSize));
        setGrid((prev) => (prev.rows === rows && prev.cols === cols ? prev : { rows, cols }));
      };

      recompute();
      const observer = new ResizeObserver(recompute);
      observer.observe(el);
      return () => observer.disconnect();
    }, [rowsProp, colsProp]);

    const { rows, cols } = grid;
    const cells = Array.from({ length: rows * cols });

    const loopId = useRef<number | null>(null);
    const active = useRef(false);
    const startTime = useRef<number | null>(null);
    const mousePos = useRef({ px: 0.5, py: 0.5 });

    const applyIdle = (tile: HTMLDivElement) => {
      tile.style.background = 'linear-gradient(135deg, #ffffff 0%, #eef0f4 100%)';
      tile.style.boxShadow =
        '-1px -1px 2px rgba(255,255,255,0.9), 2px 2px 5px rgba(30,41,59,0.08)';
      tile.style.transform = 'rotate(45deg) scale(1)';
    };

    const loop = useCallback(
      (timestamp: number) => {
        if (!active.current) return;
        if (startTime.current === null) startTime.current = timestamp;
        const elapsed = (timestamp - startTime.current) / 1000;
        const { px, py } = mousePos.current;

        tileRefs.current.forEach((tile, i) => {
          if (!tile) return;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const tx = (col + 0.5) / cols;
          const ty = (row + 0.5) / rows;
          const dist = Math.hypot(tx - px, ty - py);
          const falloff = Math.max(0, 1 - dist / RADIUS);

          const ring = Math.max(0, Math.sin(dist * RING_FREQ - elapsed * RING_SPEED)) * falloff;
          const brightness = Math.min(1, Math.max(falloff * 0.4, ring));

          if (brightness > 0.06) {
            const lift = -3 * brightness;
            const scale = 1 + 0.12 * brightness;
            tile.style.transform = `rotate(45deg) translateY(${lift}px) scale(${scale})`;
            tile.style.background = `linear-gradient(135deg, #ffffff 0%, rgba(${PRIMARY_RGB},${0.12 * brightness}) 100%)`;
            tile.style.boxShadow = `-1px -1px 2px rgba(255,255,255,0.95), ${2 + 3 * brightness}px ${2 + 3 * brightness}px ${6 + 6 * brightness}px rgba(${PRIMARY_RGB},${0.18 * brightness}), 0 0 ${8 * brightness}px rgba(${PRIMARY_RGB},${0.15 * brightness})`;
          } else {
            applyIdle(tile);
          }
        });

        loopId.current = requestAnimationFrame(loop);
      },
      [rows, cols]
    );

    const updateGlow = useCallback(
      (clientX: number, clientY: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
          px: (clientX - rect.left) / rect.width,
          py: (clientY - rect.top) / rect.height,
        };
        if (!active.current) {
          active.current = true;
          startTime.current = null;
          loopId.current = requestAnimationFrame(loop);
        }
      },
      [loop]
    );

    const reset = useCallback(() => {
      active.current = false;
      if (loopId.current) {
        cancelAnimationFrame(loopId.current);
        loopId.current = null;
      }
      tileRefs.current.forEach((tile) => {
        if (!tile) return;
        applyIdle(tile);
      });
    }, []);

    useImperativeHandle(ref, () => ({ updateGlow, reset }), [updateGlow, reset]);

    useEffect(
      () => () => {
        if (loopId.current) cancelAnimationFrame(loopId.current);
      },
      []
    );

    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {cells.map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <div
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                className="transition-[box-shadow] duration-150"
                style={{
                  width: '58%',
                  height: '58%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #eef0f4 100%)',
                  boxShadow: '-1px -1px 2px rgba(255,255,255,0.9), 2px 2px 5px rgba(30,41,59,0.08)',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default SquareWaveBackdrop;
