import React from 'react';
import { motion } from 'motion/react';
import { VisionGraphic } from '../components/VisionGraphic';
import { Industries } from '../components/Industries';
import { Products } from '../components/Products';
import { Workflow } from '../components/Workflow';
import { PixtronArrows } from '../components/PixtronArrows';
import { ArrowRight, Play, Zap, ShieldCheck, BarChart3, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <>
      <section className="relative pt-24 pb-12 lg:pt-36 lg:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium text-xs mb-8 uppercase tracking-widest"
              >
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Next-Gen Machine Vision Systems
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-8 lg:mb-10 tracking-tighter"
              >
                Intelligence <br />
                <span className="text-primary italic whitespace-nowrap">In Every Frame.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-500 mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Pixtron Systems engineers high-speed automated inspection platforms. We bridge the gap between raw production data and actionable quality control through advanced optical intelligence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto"
              >
                <a
                  href="/products"
                  className="bg-primary text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-primary/95 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group w-full sm:w-auto"
                >
                  Explore Solutions
                  <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </a>
                <a
                  href="/about"
                  className="flex items-center justify-center sm:justify-start gap-4 px-6 sm:px-8 py-3 sm:py-4 text-slate-900 font-bold hover:text-primary transition-all group w-full sm:w-auto"
                >
                  <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <Play size={20} className="ml-1 text-primary" fill="currentColor" />
                  </div>
                  About Pixtron
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-14 lg:mt-20 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10 opacity-60 grayscale hover:grayscale-0 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-tighter">2500 FPS Speed</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-tighter">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-tighter">99.9% Accuracy</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full flex justify-center lg:justify-end relative"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      <Industries />
      <Products />
      <Workflow />

      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[4rem] p-8 sm:p-10 md:p-14 lg:p-20 text-primary flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 opacity-10 rotate-12">
              <PixtronArrows size={400} />
            </div>

            <div className="relative z-10 max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 leading-tight">Ready to Automate Your Inspection?</h2>
              <p className="text-base sm:text-lg md:text-xl font-medium opacity-80 mb-0">
                Talk to our vision experts for a custom feasibility study and tailored inspection recommendation for your production line.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4 w-full lg:w-auto">
              <a
                href="/contact"
                className="bg-primary text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg md:text-xl shadow-2xl hover:scale-105 transition-transform text-center w-full sm:w-auto"
              >
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
