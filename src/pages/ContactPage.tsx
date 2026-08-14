import React from 'react';
import { motion, Variants } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { PixtronArrows } from '../components/PixtronArrows';
import { ContactForm } from '../components/ContactForm';

const offices = [
  { region: 'North', city: 'Chandigarh' },
  { region: 'East', city: 'Kolkata' },
  { region: 'South', city: 'Chennai' },
  { region: 'Head Office', city: 'Pune' },
  { region: 'R&D', city: 'Goa' },
];

// 🎨 Type-Safe Framer Motion Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const ContactPage: React.FC = () => {
  return (
    <main className="pt-28 sm:pt-32 bg-white min-h-screen overflow-hidden">
      
      {/* HEADER SECTION */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20}  />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Contact</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">
          Connect With Vision Experts
        </motion.h1>

        <motion.p variants={itemVariants} className="text-slate-600 max-w-3xl text-base sm:text-lg">
          Reach out to Pixtron Systems for high-speed inspection planning, deployment guidance, and support.
        </motion.p>
      </motion.section>

      {/* CONTACT & PRESENCE GRID */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* CONTACT DETAILS CARD */}
          <motion.article 
            variants={itemVariants}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-2xl font-black text-slate-900 mb-6">Contact Details</h2>
            <ul className="space-y-5">
              <li className="flex items-center gap-3 text-slate-700">
                <Mail size={20} className="text-primary shrink-0" />
                <span>projects@pixtronsystems.com</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Phone size={20} className="text-primary shrink-0" />
                <span>+91 9146707884</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>Head Office: Pune</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <Clock size={20} className="text-primary shrink-0" />
                <span>Office Hours: 10:00 AM - 4:00 PM IST</span>
              </li>
            </ul>
          </motion.article>

          {/* OUR PRESENCE CARD (With Inner Stagger for Office List) */}
          <motion.article 
            variants={itemVariants}
            className="bg-primary rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-primary/20"
          >
            <h2 className="text-2xl font-black mb-6">Our Presence</h2>
            <ul className="space-y-4">
              {offices.map((office) => (
                <li key={office.city} className="flex items-center gap-3 text-white/90">
                  <PixtronArrows size={14} variant="white" className="shrink-0" />
                  <span>
                    {office.city} ({office.region})
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>

        </div>
      </motion.section>

      {/* CONTACT FORM WITH ANIMATION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <ContactForm />
      </motion.div>

    </main>
  );
};