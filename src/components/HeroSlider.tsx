import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { VisionGraphic } from './VisionGraphic';
import { ArrowRight, Play, CheckCircle, ShieldCheck, CheckCircle2, Orbit } from 'lucide-react';
import { ProductSlideVisual } from './ProductSlideVisualProps';

const AUTOPLAY_MS = 6000;

// Promo slides — each pitches one product with a question + direct link to its page
const promoSlides = [
  {
    id: 'inspectra',
    icon: ShieldCheck,
    question: 'Need a Dot Print Verification?',
    highlight: 'Inspectra',
    description:
      ' Inspectra EVO model is built to inspect dot print integrity, seal quality, and OCR/OCV at full production speed — with zero compromise on accuracy.',
    productId: 'inspectra',
    highlights: ['Dot Print Verification',  'OCR/OCV Accuracy'],
  },
  {
    id: 'CodexQ',
    icon: CheckCircle2,
    question: 'Struggling with Low Contrast Codes?',
    highlight: 'CodexQ',
    description:
      'CodexQ reads and verifies 1D/2D barcodes and pharma codes instantly — even when standard readers fail on damaged or low-contrast prints.',
    productId: 'CodexQ',
    highlights: ['1D & 2D Code Reading','Pharma Compliance'],
  },
  {
    id: 'panorama',
    icon: Orbit,
    question: 'Worried About Blind Spots on Products?',
    highlight: 'Panorama',
    description:
      'Panorama gives you complete surface coverage on bottles, cans, and tubes — catching cap and label defects a single camera would miss.',
    productId: 'panorama',
    highlights: ['Full Surface Coverage', 'Zero Blind Spots'],
  },
];

const TOTAL_SLIDES = promoSlides.length + 1; // +1 for the main hero slide

export const HeroSlider: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const goTo = (index: number) => setActiveSlide(index);

  return (
    <section
      className="relative pt-28 pb-10 lg:pt-28 lg:pb-16 overflow-hidden bg-white group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Base faint grid — always visible, subtle */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808016_1px,transparent_1px),linear-gradient(to_bottom,#80808016_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          {/* ============ SLIDE 0 — MAIN HERO ============ */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs mb-8 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Next-Gen Machine Vision Systems
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 lg:mb-10 tracking-tighter">
                  Intelligence <br />
                  <span className="text-primary italic whitespace-nowrap">In Every Frame.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-500 mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Pixtron Systems engineers high-speed automated inspection platforms. We bridge the gap between raw production data and actionable quality control through advanced optical intelligence.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto">
                  <Link
                    to="/solutions"
                    className="bg-primary text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-primary/95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group w-full sm:w-auto"
                  >
                    Explore Solutions
                    <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={18} />
                    </div>
                  </Link>
                  <Link
                    to="/company"
                    className="flex items-center justify-center sm:justify-start gap-4 px-6 sm:px-8 py-3 sm:py-4 text-slate-900 font-bold hover:text-primary transition-all group w-full sm:w-auto"
                  >
                    <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                      <Play size={20} className="ml-1 text-primary" fill="currentColor" />
                    </div>
                    About Pixtron
                  </Link>
                </div>

                <div className="mt-8 lg:mt-10 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-primary" />
                    <span className="text-sm font-bold uppercase tracking-tighter">Real-Time Inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" />
                    <span className="text-sm font-bold uppercase tracking-tighter">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-primary" />
                    <span className="text-sm font-bold uppercase tracking-tighter">99.9% Accuracy</span>
                  </div>
                </div>
              </div>

              
              <div className="flex-1 w-full flex justify-center lg:justify-end relative">
  <VisionGraphic />
                <motion.div
                  className="absolute top-0 right-0 bg-white shadow-2xl p-4 rounded-2xl border border-slate-100 hidden xl:block"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Defect Status</div>
                      <div className="text-sm font-black text-slate-900">ZERO DETECTED</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ============ SLIDES 1-3 — PROMO SLIDES ============ */}
          {promoSlides.map((slide, i) => {
            const slideIndex = i + 1;
            if (activeSlide !== slideIndex) return null;
            const Icon = slide.icon;

            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
              >
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs mb-8 uppercase tracking-widest">
                    <Icon size={14} className="text-primary" />
                    Pixtron Systems Recommends
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-6 lg:mb-8 tracking-tight">
                    {slide.question}
                  </h1>

                  <p className="text-base sm:text-lg text-slate-500 mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                    Our <span className="text-primary font-bold">{slide.highlight}</span> {slide.description.replace(slide.highlight, '').trim()}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                    <Link
                      to={`/products/${slide.productId}`}
                      className="bg-primary text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-primary/95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group w-full sm:w-auto"
                    >
                      Explore {slide.highlight}
                      <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                        <ArrowRight size={18} />
                      </div>
                    </Link>
                  </div>
                  <div className="mt-8 lg:mt-10 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all">
  {slide.highlights.map((h, idx) => (
    <div key={idx} className="flex items-center gap-2">
      <CheckCircle size={20} className="text-primary" />
      <span className="text-sm font-bold uppercase tracking-tighter">{h}</span>
    </div>
  ))}
</div>
                </div>

               <div className="flex-1 w-full flex justify-center items-center lg:justify-end relative h-[300px] sm:h-[380px] lg:h-auto overflow-hidden">
  <ProductSlideVisual productId={slide.productId} />
</div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* NAVIGATION DOTS */}
        <div className="flex justify-center lg:justify-start items-center gap-2 mt-6">
          {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === index ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};