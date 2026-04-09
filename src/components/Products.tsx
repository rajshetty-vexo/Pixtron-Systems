import React from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { CheckCircle2, Zap, ShieldCheck, BarChart3, Orbit } from 'lucide-react';

const products = [
  {
    id: 'inspectra',
    name: 'Inspectra',
    tagline: 'Dot Print Inspection',
    description: 'High precision, high speed dot print inspection.',
    inspections: ['OCR/OCV', 'Dot print verification', 'Seal integrity checks', 'Package damage detection', 'High-speed line integration'],
    icon: <ShieldCheck className="text-primary" size={32} />,
  },
  {
    id: 'rapid',
    name: 'Rapid',
    tagline: 'Continuous Flow Production Line Inspection',
    description: 'Fast, accurate inspection with OCR/OCV for continuous flow production lines, with real-time monitoring and inspection of surface defects and dimensions.',
    inspections: ['OCR/OCV', 'Surface defect detection', 'Diameter and concentricity checks', 'High-speed throughput', 'Inline alerts'],
    icon: <Zap className="text-primary" size={32} />,
  },
  {
    id: 'codex',
    name: 'Codex',
    tagline: 'Code Reading & OCR',
    description: 'Reliable decoding and OCR for QR, 1D, 2D and pharma codes with high-speed verification and compliance logging.',
    inspections: ['QR, 1D & 2D decoding', 'OCR for text and batch data', 'Pharma code support', 'Low-contrast reading', 'Verification reporting'],
    icon: <CheckCircle2 className="text-primary" size={32} />,
  },
  {
    id: 'opus',
    name: 'Opus',
    tagline: 'Geometry & Color Inspection',
    description: 'Advanced inspection for geometry, size, shape, surface and color consistency across production lines.',
    inspections: ['Shape and size inspection', 'Surface inspection', 'Color verification', 'Dimensional tolerance checks', 'Inline quality analytics'],
    icon: <BarChart3 className="text-primary" size={32} />,
  },
  {
    id: 'panorama',
    name: 'Panorama',
    tagline: '360° Inspection',
    description: 'Complete 360-degree inspection for containers and products with full surface coverage.',
    inspections: ['Full circumference inspection', 'Multi-camera synchronization', 'High-speed scanning', 'Defect localization'],
    icon: <Orbit className="text-primary" size={32} />,
  },
];

export const Products: React.FC = () => {
  return (
    <section id="products" className="py-14 lg:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <PixtronArrows size={24} />
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Our Solutions</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">Precision Inspection Products</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Each of our systems is engineered for specific industrial challenges with targeted inspection capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {products.map((product, index) => {
            const isLastOddTile = products.length % 2 === 1 && index === products.length - 1;
            return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-5 sm:gap-6 hover:shadow-2xl transition-all group ${
                isLastOddTile ? 'lg:col-span-2 lg:w-[calc(50%-1.5rem)] lg:mx-auto' : ''
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                {product.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{product.name}</h3>
                  <div className="h-px flex-grow bg-slate-100" />
                </div>
                <p className="text-primary font-semibold mb-3">{product.tagline}</p>
                <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>

                <ul className="space-y-2">
                  {product.inspections.map((inspection) => (
                    <li key={inspection} className="flex items-center gap-2 text-slate-700 text-sm">
                      <PixtronArrows size={12} />
                      <span>{inspection}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
