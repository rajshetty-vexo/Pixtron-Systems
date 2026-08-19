import React from "react";
import Codexanimation from "./Codexanimation";
import Inspectraanimation from "./Inspectraanimation";
import Opusanimation from "./Opusanimation";
import PanoramaAnimation from "./PanoramaAnimation"; 
import RAPIDAnimation from "./RAPIDAnimation";
// add when ready
// import InspectraAnimation from "./InspectraAnimation"; // add when ready
// import RapidAnimation from "./RapidAnimation";           // add when ready

/**
 * Maps a product's `id` (from productsData.ts) to a live animation component.
 * Products NOT listed here simply fall back to the normal image/video slider
 * in ProductDetailPage — nothing breaks for products that don't have an
 * animation yet.
 *
 * To give another product (e.g. "inspectra") its own animation later:
 *   1. Build InspectraAnimation.tsx the same way CodexAnimation.tsx was built.
 *   2. Uncomment the import above.
 *   3. Add:  inspectra: InspectraAnimation,  below.
 */
export const productAnimations: Record<string, React.ComponentType<{ variant?: "full" | "compact" }>> = {
  codex: Codexanimation,
  inspectra: Inspectraanimation,
   opus: Opusanimation,
  panorama: PanoramaAnimation,
  rapid: RAPIDAnimation,
};