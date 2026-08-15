import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from '../components/PixtronArrows';

/*
  FeatureCard
  -----------------------
  This is the cursor-following grid + ambient glow effect, moved over
  from HomePage's hero section — now scoped to a single card. Each card
  tracks its OWN local mouse position (relative to itself), so the glow
  only reveals within that card's bounds, following the cursor exactly
  like it did on the hero background.
*/
const FeatureCard = ({ feature, idx }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-slate-50/80 rounded-3xl p-8 border border-slate-200/70 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Base faint grid — always visible, subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:22px_22px] pointer-events-none" />

      {/* Bright grid — revealed only in a circle around the cursor */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#0284c735_1px,transparent_1px),linear-gradient(to_bottom,#0284c735_1px,transparent_1px)] bg-[size:22px_22px] transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          maskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 80%)`,
        }}
      />

      {/* Ambient glow that follows the cursor */}
      <div
        className="absolute rounded-full pointer-events-none transition-opacity duration-300 bg-primary/10 blur-2xl"
        style={{
          width: '220px',
          height: '220px',
          left: `${mousePos.x - 110}px`,
          top: `${mousePos.y - 110}px`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <div className="relative w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <PixtronArrows size={20} />
      </div>

      <h3 className="relative text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
      <p className="relative text-slate-600 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

/* ---------------------------------------------------------------- */
/* 3. MAIN FEATURES SECTION — drop-in replacement, needs `product`   */
/* ---------------------------------------------------------------- */

export const MainFeaturesSection = ({ product }) => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
        Explore the main features
      </h2>
      <p className="text-slate-500 mt-2 font-normal">
        Designed for high precision and effortless integration.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {product.mainFeatures.map((feature, idx) => (
        <FeatureCard key={idx} feature={feature} idx={idx} />
      ))}
    </div>
  </section>
);

export default MainFeaturesSection;