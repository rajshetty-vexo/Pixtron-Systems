import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { Camera, Cpu, Zap, CheckCircle, QrCode, Boxes, ScanLine, CloudUpload } from 'lucide-react';

type SuiteType = 'vision' | 'trackTrace';

const visionSteps = [
  {
    title: 'Image Acquisition',
    desc: 'High-speed cameras capture crystal-clear frames at extreme speeds',
    icon: <Camera size={24} />,
  },
  {
    title: 'Intelligent Processing',
    desc: 'Proprietary vision algorithms analyze patterns, dimensions, and defects in milliseconds.',
    icon: <Cpu size={24} />,
  },
  {
    title: 'Decision Logic',
    desc: 'System determines Pass/Fail status based on your configured inspection parameters.',
    icon: <Zap size={24} />,
  },
  {
    title: 'Action Trigger',
    desc: 'High-speed rejection systems ensure only perfect products proceed.',
    icon: <CheckCircle size={24} />,
  },
];

const trackTraceSteps = [
  { title: 'Code Generation', desc: 'Unique, tamper-proof serial numbers are generated per unit as per GS1/regulatory standards.', icon: <QrCode size={24} /> },
  { title: 'Print & Verify', desc: 'Codes are printed inline and instantly verified for grade and readability before packing.', icon: <ScanLine size={24} /> },
  { title: 'Aggregation', desc: 'Unit, case, and pallet-level codes are linked in a parent-child hierarchy for full traceability.', icon: <Boxes size={24} /> },
  { title: 'Cloud Reporting', desc: 'Serialization data syncs with your ERP/MES and regulatory systems in real time.', icon: <CloudUpload size={24} /> },
];

// 👇 activeSuite prop hataaya — Workflow ab apna khud ka toggle manage karta hai
export const Workflow: React.FC = () => {
  const [activeSuite, setActiveSuite] = useState<SuiteType>('vision');

  const steps = activeSuite === 'vision' ? visionSteps : trackTraceSteps;
  const heading = activeSuite === 'vision' ? 'The Inspection Lifecycle' : 'The Track & Trace Lifecycle';
  const subheading = activeSuite === 'vision'
    ? 'From high-speed capture to automated rejection, our process ensures that only flawless products reach your customers.'
    : 'From code generation to cloud reporting, our process ensures complete traceability across your supply chain.';

  return (
    <section id="workflow" className="py-14 lg:py-16 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
          <PixtronArrows size={800} />
        </div>

       <div className="text-center mb-10 sm:mb-14 relative z-10">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{heading}</h2>

  {/* 👇 Toggle ab yahan — heading aur subheading ke beech */}
  <div className={`inline-flex items-center bg-white/5 border rounded-full p-1 mb-6 transition-colors duration-300 ${
    activeSuite === 'vision' ? 'border-primary' : 'border-secondary'
  }`}>
    {(['vision', 'trackTrace'] as const).map((tab) => {
      const isActive = activeSuite === tab;
      const isVisionTab = tab === 'vision';

      return (
        <button
          key={tab}
          onClick={() => setActiveSuite(tab)}
          className={`relative px-5 sm:px-7 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors z-10 ${
            isActive
              ? isVisionTab ? 'text-white' : 'text-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="workflowToggleBg"
              className={`absolute inset-0 rounded-full -z-10 ${
                isVisionTab ? 'bg-primary' : 'bg-secondary'
              }`}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            />
          )}
          {tab === 'vision' ? 'Vision' : 'Track & Trace'}
        </button>
      );
    })}
  </div>

  <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
    {subheading}
  </p>
</div>

        <div className="relative z-10">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1 }}
                  whileTap={{ scale: 1 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary flex items-center justify-center mb-6 sm:mb-8 shadow-[0_0_30px_rgba(0,57,133,0.5)] relative z-20 group cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-secondary opacity-0"
                    whileHover={{ opacity: 1, scale: 1.25 }}
                    whileTap={{ opacity: 1, scale: 1.25 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-primary font-black flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="md:hidden mt-8 text-secondary">
                    <PixtronArrows size={32} />
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