import React, { useState } from "react";
import { motion } from "framer-motion";
import { PixtronArrows } from "./PixtronArrows";
import { Handshake, Building2, ShieldCheck, Sparkles } from "lucide-react";

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
}

const partners: Partner[] = [
  { id: "1", name: "Lite-Banana", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80", category: "Packaging" },
  { id: "2", name: "Wellness Foods", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=300&q=80", category: "FMCG" },
  { id: "3", name: "Sunrise Beverages", logo: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?auto=format&fit=crop&w=300&q=80", category: "Pharma" },
  { id: "4", name: "Nova Pack", logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=300&q=80", category: "Automotive" },
  { id: "5", name: "Cognex Vision", logo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80", category: "Robotics" },
  { id: "6", name: "TechVision Inc", logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80", category: "Automation" },
];

const stats = [
  { label: "Global Partners", value: "50+", icon: Handshake },
  { label: "Inspection Accuracy", value: "99.9%", icon: ShieldCheck },
  { label: "Enterprise Deployment", value: "200+", icon: Building2 },
];

export const PartnersSection: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-10 sm:py-14 bg-white text-slate-900 relative overflow-hidden font-sans border-t border-slate-100">
      
      {/* CSS Keyframes for Smooth Marquee */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marqueeScroll 30s linear infinite;
          will-change: transform;
        }
        .marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Light Theme Background Accents */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
  {/* Section Header */}
  <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      // 👇 'border border-slate-200' removed from here
      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-primary mb-2.5"
    >
      <div className="inline-flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-widest text-[#003882]">
        <PixtronArrows size={14} />
        Strategic Collaborations
      </div>
    </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight"
          >
            Empowering Industry Pioneers
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed"
          >
            We partner with leading manufacturing and automation enterprises to deliver state-of-the-art vision inspection solutions.
          </motion.p>
        </div>

        {/* 🚀 INFINITE AUTO-SCROLL LOGO MARQUEE 🚀 */}
        <div 
          className="relative w-full overflow-hidden my-6 py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Fade Shadows */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

          {/* Marquee Track */}
          <div className={`animate-marquee gap-4 sm:gap-6 ${isPaused ? "marquee-paused" : ""}`}>
            {duplicatedPartners.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="group relative flex items-center gap-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#fbbb0d] p-4 sm:p-5 rounded-2xl w-72 sm:w-80 lg:w-96 shrink-0 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200/80 p-1 shadow-2xs">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="overflow-hidden">
                  <h4 className="text-slate-900 font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 block truncate mt-0.5">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 TRUST STATS GRID (With Icon Lift & Scale on Hover) 📊 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4 hover:border-slate-300 hover:bg-white transition-all duration-300 shadow-2xs hover:shadow-sm cursor-pointer"
              >
                {/* 🌟 Icon Container: Hover karne par scale bada hokar upar float karega 🌟 */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 transition-all duration-300 ease-out group-hover:scale-115 group-hover:-translate-y-1.5 group-hover:shadow-sm group-hover:bg-primary/15">
                  <Icon size={22} className="transition-transform duration-300 group-hover:scale-105" />
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 text-xs sm:text-sm font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};