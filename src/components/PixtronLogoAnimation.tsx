import React from "react";

interface PixtronLogoAnimationProps {
  /** Width of the animation stage. Accepts any valid CSS size (e.g. "100%", "320px", "20rem"). */
  width?: string;
  /** Height of the animation stage. Defaults to matching `width` (square stage). */
  height?: string;
  /** Background color behind the logo. */
  background?: string;
  /** Extra class name for the outer wrapper. */
  className?: string;
}

/**
 * Pixtron Systems animated logo.
 *
 * Self-contained: sizing is driven by CSS container queries (cqw), so the
 * whole animation scales cleanly with whatever width/height you give the
 * wrapper — no viewport (vw) dependency, safe to drop anywhere (header,
 * splash screen, card, etc).
 */
const PixtronLogoAnimation: React.FC<PixtronLogoAnimationProps> = ({
  width = "100%",
  height,
  background = "#ffffff",
  className = "",
}) => {
  return (
    <div
      className={`pxl-stage ${className}`}
      style={{ width, height: height ?? width, background }}
    >
      <div className="pxl-logo-wrap">
        <div className="pxl-logo-text">
          <div className="pxl-brand">Pixtron</div>
          <div className="pxl-sub">Systems</div>
        </div>

        <div className="pxl-chev pxl-chev-yellow">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M78 88 L78 24 L22 24" stroke="var(--pxl-yellow)" />
          </svg>
        </div>

        <div className="pxl-chev pxl-chev-navy">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M78 88 L78 24 L22 24" stroke="var(--pxl-navy)" />
          </svg>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .pxl-stage{
          --pxl-navy:#003B8B;
          --pxl-yellow:#FABB0C;
          container-type: inline-size;
          container-name: pxl-stage;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
        }

        .pxl-logo-wrap{
          position:relative;
          display:inline-block;
        }

        .pxl-logo-text{
          font-family:'Poppins', 'Segoe UI', sans-serif;
          line-height:1;
          opacity:0;
          animation: pxl-textFade 2.6s ease-in-out infinite;
        }

        .pxl-brand{
          font-size:9cqw;
          font-weight:700;
          color:var(--pxl-navy);
          letter-spacing:-0.01em;
          white-space:nowrap;
        }

        .pxl-sub{
          font-size:3.4cqw;
          font-weight:400;
          color:var(--pxl-navy);
          margin-top:0.35cqw;
          letter-spacing:0.01em;
          white-space:nowrap;
        }

        /* the two overlapping corner-bracket marks, sitting just above
           the trailing edge of "Pixtron" like a superscript accent */
        .pxl-chev{
          position:absolute;
          top:-3.11cqw;
          right:-5.13cqw;
          width:5cqw;
          height:5cqw;
        }

        .pxl-chev svg{
          width:100%;
          height:100%;
          display:block;
          overflow:visible;
        }

        .pxl-chev path{
          fill:none;
          stroke-width:26;
          stroke-linecap:round;
          stroke-linejoin:round;
        }

        /* yellow bracket: sits behind + down-left, mostly hidden.
           Same size as the navy bracket. Drops in from above-right, fading in as it settles. */
        .pxl-chev-yellow{
          width:5cqw;
          height:5cqw;
          top:-1.25cqw;
          right:-3.09cqw;
          z-index:1;
          opacity:0;
          filter:drop-shadow(0.15cqw 0.3cqw 0.25cqw rgba(0,0,0,0.18));
          transform:translateY(1.8cqw) scale(0.7);
          animation: pxl-yellowDrop 2.6s ease-in-out infinite;
        }

        /* navy bracket: full size, sits in front + up-right.
           It also rises in from below, a beat after the yellow one. */
        .pxl-chev-navy{
          z-index:2;
          opacity:0;
          filter:drop-shadow(0.15cqw 0.3cqw 0.25cqw rgba(0,0,0,0.22));
          transform:translateY(2cqw) scale(0.7);
          animation: pxl-navyDrop 2.6s ease-in-out infinite;
        }

        @keyframes pxl-textFade{
          0%          { opacity:0; }
          13%         { opacity:1; }
          78%         { opacity:1; }
          90%,100%    { opacity:0; }
        }

        @keyframes pxl-yellowDrop{
          0%,15%      { opacity:0; transform:translateY(1.8cqw) scale(0.7); }
          21%         { opacity:1; transform:translateY(0) scale(1.15); }
          26%,59%     { opacity:1; transform:translateY(0) scale(1); }
          63%         { opacity:1; transform:translateY(0) scale(1.2); }
          67%,78%     { opacity:1; transform:translateY(0) scale(1); }
          90%,100%    { opacity:0; transform:translateY(1.8cqw) scale(0.7); }
        }

        @keyframes pxl-navyDrop{
          0%,46%      { opacity:0; transform:translateY(2cqw) scale(0.7); }
          52%         { opacity:1; transform:translateY(0) scale(1.15); }
          57%,66%     { opacity:1; transform:translateY(0) scale(1); }
          70%         { opacity:1; transform:translateY(0) scale(1.2); }
          74%,78%     { opacity:1; transform:translateY(0) scale(1); }
          90%,100%    { opacity:0; transform:translateY(2cqw) scale(0.7); }
        }
      `}</style>
    </div>
  );
};

export default PixtronLogoAnimation;
