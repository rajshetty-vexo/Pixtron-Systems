import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { VisionGraphic } from './components/VisionGraphic';
import { Industries } from './components/Industries';
import { Products } from './components/Products';
import { Workflow } from './components/Workflow';
import { Footer } from './components/Footer';
import { PixtronArrows } from './components/PixtronArrows';
import { ArrowRight, Play, Zap, ShieldCheck, BarChart3, CheckCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 overflow-hidden bg-white">
        {/* Technical Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
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
                className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.95] mb-10 tracking-tighter"
              >
                Intelligence <br />
                <span className="text-primary italic">In Every Frame.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg text-slate-500 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Pixtron Systems engineers high-speed automated inspection platforms. We bridge the gap between raw production data and actionable quality control through advanced optical intelligence.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
              >
                <button className="bg-primary text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-primary/95 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3 group">
                  Explore Solutions 
                  <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </button>
                <button className="flex items-center gap-4 px-8 py-4 text-slate-900 font-bold hover:text-primary transition-all group">
                  <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
                    <Play size={20} className="ml-1 text-primary" fill="currentColor" />
                  </div>
                  Watch Technology
                </button>
              </motion.div>

              {/* Trust Badges / Mini Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-20 flex flex-wrap justify-center lg:justify-start gap-12 opacity-60 grayscale hover:grayscale-0 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-tighter">2500 FPS Speed</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-sm font-bold uppercase tracking-tighter">ISO Certified</span>
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
              
              {/* Floating Technical Labels */}
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
      
      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-secondary rounded-[4rem] p-12 md:p-20 text-primary flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 opacity-10 rotate-12">
              <PixtronArrows size={400} />
            </div>
            
            <div className="relative z-10 max-w-2xl text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Ready to Automate Your Inspection?</h2>
              <p className="text-xl font-medium opacity-80 mb-0">
                Contact our engineers today for a custom feasibility study of your production line.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col gap-4 w-full lg:w-auto">
              <button className="bg-primary text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition-transform">
                Get Started Now
              </button>
              <p className="text-center text-sm font-bold opacity-60">No commitment required.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
