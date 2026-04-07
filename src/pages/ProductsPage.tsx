import React from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from '../components/PixtronArrows';

interface VisionProduct {
  name: string;
  category: string;
  description?: string;
  features?: string[];
}

const visionProducts: VisionProduct[] = [
  {
    name: 'Inspectra',
    category: 'Tetra Brik Inspection',
    description: 'Advanced vision system designed for high-speed liquid packaging lines with seal and print verification.',
    features: ['Seal integrity checks', 'Print verification', 'High-speed processing'],
  },
  {
    name: 'Rapid',
    category: 'Cable & Wire Inspection',
    description: 'Real-time surface defect detection and dimensional measurement for continuous extrusion processes.',
    features: ['Continuous profile tracking', 'Micron-level defect detection', 'Live alarms'],
  },
  {
    name: 'Codex',
    category: 'Code Reading',
    description: 'Ultra-fast reading and verification of 1D/2D codes, including pharma-grade traceability labels.',
    features: ['1D and 2D decoding', 'Pharma compatibility', 'Reject integration'],
  },
  {
    name: 'Opus',
    category: 'Geometry & Color Inspection',
    description: 'Precise shape, size, and color consistency verification for complex manufacturing components.',
    features: ['Dimensional checks', 'Color matching', 'Tolerance-based decisions'],
  },
  {
    name: 'Panorama',
    category: '360 Degree Inspection',
    description: 'Complete cylindrical surface inspection using multi-camera arrays for bottles, cans, and tubes.',
    features: ['360 degree coverage', 'Label and cap checks', 'High-throughput support'],
  },
];

export const ProductsPage: React.FC = () => {
  return (
    <main className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2 mb-16">
        <div className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Products</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">Pixtron Inspection Suite</h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          Explore the Pixtron portfolio built for speed, reliability, and actionable inspection insights.
        </p>
        <p className="text-slate-500 max-w-3xl mt-3">
          All listed products are part of the Pixtron Inspection Suite.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visionProducts.map((product, index) => {
            const isLastOddTile = visionProducts.length % 2 === 1 && index === visionProducts.length - 1;
            return (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className={`bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/60 ${
                isLastOddTile ? 'md:col-span-2 md:w-[calc(50%-1rem)] md:mx-auto' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <PixtronArrows size={18} />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{product.category}</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">{product.name}</h2>

              {product.description ? (
                <p className="text-slate-600 leading-relaxed mb-5">{product.description}</p>
              ) : (
                <p className="text-slate-500 italic mb-5">Core suite offering for modular inspection deployments.</p>
              )}

              {product.features && product.features.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-slate-700">
                      <PixtronArrows size={12} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-3">
                <a href="/products" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all">
                  Explore Product
                </a>
                <a href="/contact" className="border border-primary text-primary px-5 py-2.5 rounded-xl font-bold hover:bg-primary/5 transition-all">
                  Contact Sales
                </a>
              </div>
            </motion.article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
