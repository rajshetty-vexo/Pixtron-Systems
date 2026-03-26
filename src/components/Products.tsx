import React from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { CheckCircle2, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

const products = [
  {
    id: 'inspectra',
    name: 'Inspectra',
    tagline: 'Tetra Brik Inspection',
    description: 'Advanced vision system specifically designed for high-speed liquid packaging lines, ensuring perfect seals and print quality.',
    icon: <ShieldCheck className="text-primary" size={32} />,
  },
  {
    id: 'rapid',
    name: 'Rapid',
    tagline: 'Cable & Wire Inspection',
    description: 'Real-time surface defect detection and dimensional measurement for continuous extrusion processes.',
    icon: <Zap className="text-primary" size={32} />,
  },
  {
    id: 'codex',
    name: 'Codex',
    tagline: 'Code Reading (Pharma, 1D, 2D)',
    description: 'Ultra-fast reading and verification of complex codes, including pharmaceutical pharmacodes and high-density 2D matrices.',
    icon: <CheckCircle2 className="text-primary" size={32} />,
  },
  {
    id: 'opus',
    name: 'Opus',
    tagline: 'Geometry & Color Inspection',
    description: 'Precise shape, size, and color consistency verification for complex manufacturing components.',
    icon: <BarChart3 className="text-primary" size={32} />,
  },
  {
    id: 'panorama',
    name: 'Panorama',
    tagline: '360° Inspection',
    description: 'Complete cylindrical surface inspection using multi-camera arrays for bottles, cans, and tubes.',
    icon: <PixtronArrows size={32} />,
  },
];

const versions = [
  { name: 'ECO', desc: 'Essential inspection for standard production speeds.', color: 'bg-slate-100 text-slate-600' },
  { name: 'PRO', desc: 'High-performance processing for demanding environments.', color: 'bg-primary text-white' },
  { name: 'EVO', desc: 'Next-gen AI-powered inspection for ultra-high speeds.', color: 'bg-secondary text-primary' },
];

export const Products: React.FC = () => {
  return (
    <section id="products" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Precision Inspection Products</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Each of our systems is engineered for specific industrial challenges, available in three performance tiers to match your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                {product.icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                  <div className="h-px flex-grow bg-slate-100" />
                </div>
                <p className="text-primary font-semibold mb-3">{product.tagline}</p>
                <p className="text-slate-600 mb-6 leading-relaxed">{product.description}</p>
                
                <div className="grid grid-cols-3 gap-3">
                  {versions.map((v) => (
                    <div key={v.name} className={`px-3 py-2 rounded-lg text-center text-xs font-bold uppercase tracking-wider ${v.color}`}>
                      {v.name}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Version Comparison Table/Grid */}
        <div className="bg-primary rounded-[3rem] p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
             <PixtronArrows size={400} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-12 text-center">Version Performance Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {versions.map((v, i) => (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl mb-6 ${v.name === 'EVO' ? 'bg-secondary text-primary' : 'bg-white text-primary'}`}>
                    {v.name[0]}
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{v.name} Series</h4>
                  <p className="text-white/70 mb-6">{v.desc}</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <PixtronArrows size={14} className="shrink-0" />
                      <span>{i === 0 ? 'Up to 500 units/min' : i === 1 ? 'Up to 1200 units/min' : 'Up to 2500+ units/min'}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <PixtronArrows size={14} className="shrink-0" />
                      <span>{i === 0 ? 'Standard Optics' : i === 1 ? 'High-Res Global Shutter' : 'Ultra-HD Multi-Spectral'}</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <PixtronArrows size={14} className="shrink-0" />
                      <span>{i === 2 ? 'Deep Learning AI' : 'Rule-based Vision'}</span>
                    </li>
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
