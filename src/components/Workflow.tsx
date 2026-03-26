import React from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { Camera, Cpu, Zap, CheckCircle } from 'lucide-react';

const steps = [
  {
    title: 'Image Acquisition',
    desc: 'High-speed global shutter cameras capture crystal clear frames at up to 2500 FPS.',
    icon: <Camera size={24} />,
  },
  {
    title: 'AI Processing',
    desc: 'Proprietary vision algorithms analyze patterns, dimensions, and defects in milliseconds.',
    icon: <Cpu size={24} />,
  },
  {
    title: 'Decision Logic',
    desc: 'System determines Pass/Fail status based on pre-defined EVO/PRO parameters.',
    icon: <Zap size={24} />,
  },
  {
    title: 'Action Trigger',
    desc: 'High-speed rejection systems or PLC signals ensure only perfect products proceed.',
    icon: <CheckCircle size={24} />,
  },
];

export const Workflow: React.FC = () => {
  return (
    <section id="workflow" className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-6 relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
          <PixtronArrows size={800} />
        </div>

        <div className="text-center mb-20 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Inspection Lifecycle</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From high-speed capture to automated rejection, our process ensures that only flawless products reach your customers.
          </p>
        </div>

        <div className="relative z-10">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,57,133,0.5)] relative z-20 group">
                  <div className="absolute inset-0 rounded-full border-2 border-secondary opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                  <div className="text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-primary font-black flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                
                {/* Arrow Connector (Mobile/Tablet) */}
                {i < steps.length - 1 && (
                  <div className="lg:hidden mt-8 text-secondary">
                    <PixtronArrows size={32} className="rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
