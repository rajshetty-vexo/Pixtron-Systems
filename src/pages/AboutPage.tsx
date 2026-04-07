import React from 'react';
import { motion } from 'motion/react';
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

export const AboutPage: React.FC = () => {
  return (
    <main className="pt-32 pb-24 bg-white min-h-screen">
      <section className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2 mb-16">
        <div className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">About</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">About Pixtron Systems</h1>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-4">Company Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Pixtron Systems designs and deploys high-speed machine vision platforms for modern manufacturing lines.
              Our mission is to bring dependable optical intelligence into everyday production decisions.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We combine strong domain understanding, robust hardware integration, and practical software workflows
              to deliver inspection systems that scale with real industrial needs.
            </p>
          </div>
          <div className="bg-primary rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-black mb-4">Capabilities</h2>
            <ul className="space-y-3 text-white/90">
              <li className="flex items-start gap-2">
                <PixtronArrows size={14} />
                Multi-product vision deployment with rapid line adaptation
              </li>
              <li className="flex items-start gap-2">
                <PixtronArrows size={14} />
                High-speed defect detection, OCR and geometry validation
              </li>
              <li className="flex items-start gap-2">
                <PixtronArrows size={14} />
                PLC-ready rejection logic and production data reporting
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2 mb-16">
        <h3 className="text-3xl font-black text-slate-900 mb-8">Values & Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <PixtronArrows size={16} />
                <h4 className="text-xl font-black text-slate-900">{value.title}</h4>
              </div>
              <p className="text-slate-600 leading-relaxed">{value.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2">
        <div className="bg-secondary rounded-[2.5rem] p-10 md:p-14 text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-4xl font-black mb-3">Build With Vision Experts</h3>
            <p className="text-primary/80 text-lg">Work with us to plan, validate, and deploy your inspection strategy.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/contact" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
              Work With Us
            </a>
            <a href="/contact" className="border border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all">
              Contact
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
