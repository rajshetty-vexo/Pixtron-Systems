import {SmartMedia} from "../components/SmartMedia";
import React, { useState, useEffect, useRef } from 'react';
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
  { 
    name: 'Automotive', 
    icon: <Car size={40} />, 
    desc: 'Component verification and assembly inspection.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786685341/drilldown_vjdq9a.png"
  },
  { 
    name: 'Electronics', 
    icon: <Cpu size={40} />, 
    desc: 'PCB inspection and micro-component placement.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118113/Electronics_okmec4.png"
  },
  { 
    name: 'Pharmaceuticals', 
    icon: <FlaskConical size={40} />, 
    desc: 'Blister pack and pharmacode verification.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118093/Pharmaceuticals_fuouoq.jpg"
  },
  { 
    name: 'Food & Beverage', 
    icon: <Utensils size={40} />, 
    desc: 'Packaging integrity and label inspection.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118107/Food_Beverage_m8xqyy.png"
  },
  { 
    name: 'Manufacturing', 
    icon: <Factory size={40} />, 
    desc: 'General surface and dimensional inspection.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118115/Manufacturing_d4py81.png"
  },
  { 
    name: 'Logistics', 
    icon: <Truck size={40} />, 
    desc: 'High-speed sorting and barcode reading.',
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118101/Logistics_jrgwef.jpg"
  },
];

export const Industries: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setActiveCardIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleCardClick = (e: React.MouseEvent, index: number) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return;
    }
    e.stopPropagation();
    setActiveCardIndex((prev) => (prev === index ? null : index));
  };

  // Solution page par redirect karne ka logic
  const handleLearnMore = (e: React.MouseEvent, industryName: string) => {
    e.stopPropagation();
    window.location.href = `/solutions?industry=${encodeURIComponent(industryName)}`;
  };

  return (
    <section id="industries" ref={sectionRef} className="py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-4"
            >
              <PixtronArrows  size={24} />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Global Impact</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">Industries We Empower</h2>
          </div>
          <p className="text-slate-600 max-w-sm">
            Our vision systems are versatile enough to adapt to the most rigorous standards of diverse global sectors.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0">
          {industries.map((industry, i) => {
            const isActive = activeCardIndex === i;

            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={(e) => handleCardClick(e, i)}
                className="group relative min-w-[82vw] sm:min-w-[340px] md:min-w-0 snap-center p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-slate-900 overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* BACKGROUND IMAGE - Always Visible (Steady Position) */}
                <div className="absolute inset-0 pointer-events-none transition-transform duration-500 scale-100 group-hover:scale-105">
                  <SmartMedia
                    type="image"
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-full [&>img]:object-cover"
                  />
                </div>
                {/* DARK OVERLAY LAYER - Readability ke liye text overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-slate-900/80 pointer-events-none transition-opacity duration-500 group-hover:opacity-90" 
                />

                {/* CARD CONTENT LAYER */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* ICON */}
                    <div className={`mb-6 group-hover:scale-110 transition-all duration-300 text-white ${
                      isActive ? 'scale-110' : ''
                    }`}>
                      {industry.icon}
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-bold transition-colors duration-300 mb-3 text-white">
                      {industry.name}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="transition-colors duration-300 mb-6 leading-relaxed text-slate-200">
                      {industry.desc}
                    </p>
                  </div>

                  {/* LEARN MORE BUTTON */}
                  <div 
                    onClick={(e) => handleLearnMore(e, industry.name)}
                    className="flex items-center gap-2 font-bold text-sm transition-all duration-300 pt-2 cursor-pointer text-white"
                  >
                    <span>Learn More</span>
                    <div className={`transition-transform duration-300 ${
                      isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`}>
                      <PixtronArrows variant="white" size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};