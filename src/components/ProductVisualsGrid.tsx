import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * ProductVisualsGrid
 * -------------------
 * A grid of four mini "VisionGraphic"-style cards — one per product series
 * (Inspectra, Rapid, CodexQ, Opus) — each running its own continuous
 * inspection animation (3D wireframe box + scan beam + HUD readouts),
 * instead of VisionGraphic's single cycling display. Meant to sit right
 * below the main hero, same visual language, fully responsive.
 */

type ObjectKind = 'shape' | 'code' | 'wire' | 'brik';

interface ProductVisual {
  id: string;
  series: string;
  label: string;
  status: string;
  accuracy: string;
  object: ObjectKind;
}

const products: ProductVisual[] = [
  {
    id: 'inspectra',
    series: 'INSPECTRA SERIES',
    label: 'DOT PRINT / OCR',
    status: 'SEAL OK',
    accuracy: '99.7% Accurate',
    object: 'brik',
  },
  {
    id: 'rapid',
    series: 'RAPID SERIES',
    label: 'CABLE & WIRE',
    status: 'SCANNING',
    accuracy: '99.9% Accurate',
    object: 'wire',
  },
  {
    id: 'codexq',
    series: 'CodexQ SERIES',
    label: 'CODE READING',
    status: 'VERIFIED',
    accuracy: '99.8% Accurate',
    object: 'code',
  },
  {
    id: 'opus',
    series: 'OPUS SERIES',
    label: 'GEOMETRY & COLOR',
    status: 'PASS',
    accuracy: '99.9% Accurate',
    object: 'shape',
  },
];

const statusColor = (status: string) =>
  status === 'PASS' || status === 'VERIFIED' || status === 'SEAL OK'
    ? 'bg-green-100 text-green-600'
    : 'bg-amber-100 text-amber-700';

function InspectionObject({ object, codeGridPattern }: { object: ObjectKind; codeGridPattern: boolean[] }) {
  switch (object) {
    case 'brik':
      return (
        <div className="w-16 h-28 sm:w-20 sm:h-32 bg-slate-200 border-2 border-slate-300 rounded-sm shadow-xl relative">
          <div className="absolute top-2 left-1.5 right-1.5 h-4 bg-primary/10 rounded-sm" />
          <div className="absolute bottom-2 left-1.5 right-1.5 h-10 bg-slate-300/50 rounded-sm" />
        </div>
      );
    case 'shape':
      return (
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 border-2 border-primary/30 rounded-xl shadow-2xl flex items-center justify-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-primary/40 rounded-lg rotate-45" />
        </div>
      );
    case 'code':
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-slate-200 rounded-lg shadow-xl p-2 grid grid-cols-4 gap-1">
          {codeGridPattern.map((active, i) => (
            <div key={i} className={`h-full rounded-sm ${active ? 'bg-slate-800' : 'bg-slate-100'}`} />
          ))}
        </div>
      );
    case 'wire':
      return (
        <div className="h-4 w-24 sm:h-5 sm:w-28 bg-slate-800 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      );
  }
}

function ProductVisualCard({ product, codeGridPattern }: { product: ProductVisual; codeGridPattern: boolean[] }) {
  return (
    <div className="relative w-full aspect-square max-w-[220px] mx-auto flex items-center justify-center perspective-1000 p-2 overflow-visible">
      {/* 3D Wireframe Box */}
      <motion.div
        className="relative w-full h-full max-w-[190px] max-h-[190px] border-2 border-primary/20 rounded-2xl flex items-center justify-center bg-slate-50/50"
        initial={{ rotateY: -8 }}
        animate={{ rotateY: 8 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        {/* Object */}
        <div className="relative w-3/4 h-3/4 flex items-center justify-center">
          <InspectionObject object={product.object} codeGridPattern={codeGridPattern} />

          {/* Scan beam */}
          <motion.div
            className="absolute w-full h-[3px] bg-amber-400 shadow-[0_0_14px_rgba(251,187,13,1)] z-30"
            animate={{ top: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 bg-amber-400/10 z-20"
            animate={{ height: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>

      {/* Decorative rings */}
      <div className="absolute inset-0 border border-slate-200/50 rounded-full -z-10 scale-110 pointer-events-none" />
    </div>
  );
}

export const ProductVisualsGrid: React.FC = () => {
  const codeGridPattern = useMemo(
    () => [true, false, true, true, false, true, false, false, true, true, false, true, true, false, true, false],
    []
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            One Platform, Every Inspection
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Each Pixtron system runs its own dedicated inspection engine — live, in parallel, on your line.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 p-4 sm:p-6 flex flex-col items-center"
            >
              <ProductVisualCard product={product} codeGridPattern={codeGridPattern} />

              <div className="w-full mt-4 sm:mt-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                    {product.series}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 ml-1 ${statusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-primary truncate mb-1">
                  {product.label}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-amber-500">
                  {product.accuracy}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductVisualsGrid;