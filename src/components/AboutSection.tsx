import React from 'react';
import { Link } from 'react-router-dom';
import { motion,Variants } from 'framer-motion';
import { PixtronArrows } from '../components/PixtronArrows';

const values = [
  {
    title: 'Quality',
    description: 'Every deployment is engineered for precision, stability, and measurable production impact.',
  },
  {
    title: 'Innovation',
    description: 'We continuously evolve optical systems and machine-vision logic to solve real shop-floor problems.',
  },
  {
    title: 'Trust',
    description: 'Transparent process, accountable timelines, and long-term reliability define our partnerships.',
  },
  {
    title: 'Support',
    description: 'From feasibility to commissioning and beyond, our experts stay involved at every stage.',
  },
];

// 🎨 Explicit Variants Typing Add Ki Hai
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const AboutSection: React.FC = () => {
  return (
    <main className="pt-20 sm:pt-24 pb-16 sm:pb-20 bg-white min-h-screen overflow-hidden">
      
      {/* SECTION 1: HEADER & OVERVIEW */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">About</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-8">
          About Pixtron Systems
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left Card */}
          <motion.div variants={itemVariants} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Company Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Pixtron Systems designs and deploys high-speed machine vision platforms for modern manufacturing lines.
              Our mission is to bring dependable optical intelligence into everyday production decisions.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We combine strong domain understanding, robust hardware integration, and practical software workflows
              to deliver inspection systems that scale with real industrial needs.
            </p>
          </motion.div>

          {/* Right Card */}
          <motion.div variants={itemVariants} className="bg-primary rounded-3xl p-8 text-white shadow-lg shadow-primary/20">
            <h2 className="text-2xl font-black mb-4">Capabilities</h2>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-2">
                <PixtronArrows variant="white" size={14} className="mt-1 shrink-0" />
                <span>Multi-product vision deployment with rapid line adaptation</span>
              </li>
              <li className="flex items-start gap-2">
                <PixtronArrows variant="white" size={14} className="mt-1 shrink-0" />
                <span>High-speed defect detection, OCR and geometry validation</span>
              </li>
              <li className="flex items-start gap-2">
                <PixtronArrows variant="white" size={14} className="mt-1 shrink-0" />
                <span>PLC-ready rejection logic and production data reporting</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 2: VALUES & APPROACH (CARDS STAGGERED) */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.h3 variants={itemVariants} className="text-3xl font-black text-slate-900 mb-8">
          Values & Approach
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <motion.article
              key={value.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <PixtronArrows size={16} />
                <h4 className="text-xl font-black text-slate-900">{value.title}</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">{value.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      {/* SECTION 3: CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-secondary rounded-[2.5rem] p-10 md:p-14 text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl"
        >
          <div>
            <h3 className="text-3xl sm:text-4xl font-black mb-3">Build With Vision Experts</h3>
            <p className="text-primary/80 text-base sm:text-lg">
              Work with us to plan, validate, and deploy your inspection strategy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/contact" 
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md"
            >
              Work With Us
            </Link>
            <Link 
              to="/contact" 
              className="border border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all active:scale-95"
            >
              Contact
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
};