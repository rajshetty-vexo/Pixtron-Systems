import React from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { 
  Car, 
  Cpu, 
  FlaskConical, 
  Utensils, 
  Factory, 
  Truck 
} from 'lucide-react';

const industries = [
  { name: 'Automotive', icon: <Car size={40} />, desc: 'Component verification and assembly inspection.' },
  { name: 'Electronics', icon: <Cpu size={40} />, desc: 'PCB inspection and micro-component placement.' },
  { name: 'Pharmaceuticals', icon: <FlaskConical size={40} />, desc: 'Blister pack and pharmacode verification.' },
  { name: 'Food & Beverage', icon: <Utensils size={40} />, desc: 'Packaging integrity and label inspection.' },
  { name: 'Manufacturing', icon: <Factory size={40} />, desc: 'General surface and dimensional inspection.' },
  { name: 'Logistics', icon: <Truck size={40} />, desc: 'High-speed sorting and barcode reading.' },
];

export const Industries: React.FC = () => {
  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <PixtronArrows size={24} />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Global Impact</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Industries We Empower</h2>
          </div>
          <p className="text-slate-600 max-w-sm">
            Our vision systems are versatile enough to adapt to the most rigorous standards of diverse global sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, i) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all"
            >
              <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {industry.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{industry.name}</h3>
              <p className="text-slate-600 mb-6">{industry.desc}</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <PixtronArrows size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
