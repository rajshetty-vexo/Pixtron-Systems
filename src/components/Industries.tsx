import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Cpu, 
  FlaskConical, 
  Utensils, 
  Factory, 
  Truck,
  X,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { SmartMedia } from "../components/SmartMedia";

import automotiveImg from '../assets/Industries/Car automotive.jpeg';
import electronicsImg from '../assets/Industries/Electronics.png';
import foodBeverageImg from '../assets/Industries/Food & Beverage.png';
import logisticsImg from '../assets/Industries/Logistics.jpg';
import manufacturingImg from '../assets/Industries/Manufacturing.png';
import pharmaceuticalsImg from '../assets/Industries/Pharmaceuticals.jpeg';

interface SubIndustry {
  name: string;
  desc: string;
}

interface IndustryItem {
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
  image: string;
  longDesc: string;
  applications: string[];
  products: string[];
  subIndustries: SubIndustry[];
  keyMetrics: { metric: string; value: string }[]; 
}

const industriesList: IndustryItem[] = [
  { 
    name: 'Automotive', 
    icon: Car, 
    image: automotiveImg,
    desc: 'Component verification and assembly inspection.',
    longDesc: 'Advanced machine vision systems for automotive assembly lines ensure component presence, correct assembly, and dimension verification at high speed. We help Tier-1 manufacturers reduce recall rates to near zero through comprehensive inspection gates.',
    keyMetrics: [
      { metric: 'Inspection Accuracy', value: '99.98%' },
      { metric: 'Maximum Line Speed', value: '600 parts/min' },
      { metric: 'Defect Detection Rate', value: 'Sub-mm level' },
      { metric: 'Typical ROI Period', value: '< 9 Months' }
    ],
    applications: [
      'Chassis & powertrain assembly verification',
      'Weld bead profile inspection & surface defects check',
      'Fastener, screw, and O-ring presence checks',
      'Part number laser marking & 2D code verification'
    ],
    products: ['Inspectra', 'Opus', 'CodexQ'],
    subIndustries: [
      { name: 'EV Battery Assembly', desc: 'Inspects weld seam quality, cell dimensions, and alignment at high speeds.' },
      { name: 'Metal Press & Stampings', desc: 'Identifies structural cracks, wrinkles, and stamping defects dynamically.' }
    ]
  },
  { 
    name: 'Electronics', 
    icon: Cpu, 
    image: electronicsImg,
    desc: 'PCB inspection and micro-component placement.',
    longDesc: 'High-precision inspection solutions for electronic components, semiconductor packaging, and printed circuit boards (PCB). Our advanced cameras and algorithms inspect micron-level details at lightning speed to catch errors before reflow.',
    keyMetrics: [
      { metric: 'Placement Accuracy', value: '±5 microns' },
      { metric: 'AOI Inspection Speed', value: '45000 CPH' },
      { metric: 'Minimum Defect Size', value: '0.01mm' },
      { metric: 'Yield Improvement', value: 'Avg. 15%' }
    ],
    applications: [
      'Solder paste inspection (SPI) & defect verification',
      'Surface mount technology (SMT) component placement check',
      'Solder joint profiling & bridge detection',
      'Conformal coating presence and thickness inspection'
    ],
    products: ['Rapid', 'Opus'],
    subIndustries: [
      { name: 'Semiconductor Packaging', desc: 'Micro-scale alignment and silicon die inspection before casing.' },
      { name: 'Consumer Devices Assembly', desc: 'Verifies micro-component placement, battery casing, and screen alignment.' }
    ]
  },
  { 
    name: 'Pharmaceuticals', 
    icon: FlaskConical, 
    image: pharmaceuticalsImg,
    desc: 'Blister pack and pharmacode verification.',
    longDesc: 'FDA-compliant quality inspection systems designed to ensure 100% verification of pharma packaging, labels, and dosage integrity. We offer complete tracking solutions for serialization and compliance with industry standards.',
    keyMetrics: [
      { metric: 'Regulatory Compliance', value: 'FDA 21 CFR Part 11' },
      { metric: 'Inspection Rate', value: '800 blisters/min' },
      { metric: 'Label OCV Accuracy', value: '99.99%' },
      { metric: 'False Reject Rate (FRR)', value: '< 0.05%' }
    ],
    applications: [
      'Blister pack capsule presence, breakage, & color check',
      'Pharmacode, barcode, and 2D matrix validation',
      'Vial, syringe, and ampoule visual inspection',
      'Label matching and character inspection (OCR/OCV)'
    ],
    products: ['CodexQ', 'Inspectra', 'Panorama'],
    subIndustries: [
      { name: 'Medical Device Assembly', desc: 'High-precision verification of syringe needles, catheters, and drug delivery systems.' },
      { name: 'Serialization & Packaging', desc: 'FDA-compliant barcode reading and OCR verification for complete traceability.' }
    ]
  },
  { 
    name: 'Food & Beverage', 
    icon: Utensils, 
    image: foodBeverageImg,
    desc: 'Packaging integrity and label inspection.',
    longDesc: 'High-speed inspection systems for the F&B sector focusing on seal integrity, label correctness, packaging quality, and fill levels. Designed with food-grade sanitary standards to run in washdown environments.',
    keyMetrics: [
      { metric: 'Hygienic Design', value: 'IP69K Washdown' },
      { metric: 'Max. Throughput', value: '90,000 BPH' },
      { metric: 'Fill Level Precision', value: '±0.5mm' },
      { metric: 'Seal Integrity (Micro-leaks)', value: '>99.5%' }
    ],
    applications: [
      'Container cap presence, skew, and fill-level inspection',
      'Double seam & lid seal integrity verification',
      'Label placement, barcode readability, and expiry date OCR',
      'Foreign object detection in transparent containers'
    ],
    products: ['Panorama', 'CodexQ', 'Inspectra'],
    subIndustries: [
      { name: 'Canning & Bottling Lines', desc: 'High-speed double seam inspection, fill level check, and cap skew validation.' },
      { name: 'Carton & Box Packaging', desc: 'Checks print quality, label alignment, and barcode readability.' }
    ]
  },
  { 
    name: 'Manufacturing', 
    icon: Factory, 
    image: manufacturingImg,
    desc: 'General surface and dimensional inspection.',
    longDesc: 'General manufacturing inspection systems designed to check surface defects, tolerances, and dimensional compliance of parts in real-time. Boosts throughput and automates raw data reporting for statistical process control.',
    keyMetrics: [
      { metric: 'Surface Defect Rate (FRR)', value: '< 1%' },
      { metric: 'Measurement Tolerance', value: '±0.02mm' },
      { metric: 'System Availability', value: '>98%' },
      { metric: 'Inspection Cycle Time', value: '< 0.5s' }
    ],
    applications: [
      'Surface scratch, dent, and oxidation detection',
      'High-accuracy critical dimensions & geometry validation',
      'Part sorting, orientation, and robot guidance (VGR)',
      'Castings and stamped metal feature presence verification'
    ],
    products: ['Opus', 'Rapid'],
    subIndustries: [
      { name: 'Heavy Metal Fabrication', desc: 'Real-time inspection of structural integrity, weld profiles, and surface defects.' },
      { name: 'Plastics & Injection Molding', desc: 'Detects flash defects, shot size issues, and checks precise dimensions.' }
    ]
  },
  { 
    name: 'Logistics', 
    icon: Truck, 
    image: logisticsImg,
    desc: 'High-speed sorting and barcode reading.',
    longDesc: 'Automation solutions for logistics and distribution centers enabling rapid parcel sorting, volume measurement, and tracking. Handles variations in shape, material, and barcode placement at peak velocities.',
    keyMetrics: [
      { metric: 'Sorting Efficiency', value: '99.9%' },
      { metric: 'Scan Rate (Omnidirectional)', value: '15,000 pph' },
      { metric: 'Barcode Read Rate (1D/2D)', value: '>99.95%' },
      { metric: 'False Rejects', value: '< 0.01%' }
    ],
    applications: [
      'Multi-sided 1D/2D barcode tunnel scanning',
      'Package dimensioning (DWS systems) & weight verification',
      'Shipping label presence and OCR readability check',
      'De-palletizing and parcel singulation robot guidance'
    ],
    products: ['CodexQ', 'Rapid'],
    subIndustries: [
      { name: 'E-commerce Warehouses', desc: '3D package sizing, automated route sorting, and high-speed label scanning.' },
      { name: 'Supply Chain Sorting Gates', desc: 'Reads barcode data on damaged packages and logs sorting errors.' }
    ]
  },
];

export const Industries: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem | null>(null);
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

  const handleLearnMore = (e: React.MouseEvent, industry: IndustryItem) => {
    e.stopPropagation();
    setSelectedIndustry(industry);
  };

  return (
    <section id="industries" ref={sectionRef} className="py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-10 md:mb-12 gap-4 md:gap-6 text-center md:text-left">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4"
            >
              <PixtronArrows size={24} />
              <span className="text-primary font-bold tracking-widest uppercase text-sm">Global Impact</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Industries We Empower
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-base sm:text-lg font-medium">
            Our vision systems are versatile enough to adapt to the most rigorous standards of diverse global sectors.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0">
          {industriesList.map((industry, i) => {
            const IconComponent = industry.icon;
            const isActive = activeCardIndex === i;

            return (
            <div
  key={industry.name}
  onClick={(e) => handleCardClick(e, i)}
  className="group relative min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-between p-6 sm:p-8 shrink-0"
>
                {/* Background Image with Scale Animation */}
                <div className={`absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ${
                  isActive ? 'scale-105' : ''
                }`}>
                  <SmartMedia 
                    type="image"
                    src={industry.image} 
                    alt={industry.name} 
                    className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30 transition-opacity duration-500 group-hover:opacity-90" />
                </div>

                {/* Card Content Layer */}
                <div className="relative z-10 flex flex-col justify-end h-full">
                  <div>
                    {/* Icon Zoom Animation */}
                    <div className={`text-white mb-3 transition-all duration-300 group-hover:scale-110 w-fit ${
                      isActive ? 'scale-110' : ''
                    }`}>
                      <IconComponent size={36} />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2">{industry.name}</h3>

                    {/* Description */}
                    <p className="text-slate-200 text-xs sm:text-sm font-medium mb-4 line-clamp-2 leading-relaxed">
                      {industry.desc}
                    </p>
                  </div>

                  {/* Learn More Button */}
                  <div 
                    onClick={(e) => handleLearnMore(e, industry)}
                    className="flex items-center gap-2 font-bold text-sm text-white pt-2 cursor-pointer"
                  >
                    <span>Learn More</span>
                    <div className={`transition-transform duration-300 ${
                      isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                    }`}>
                      <PixtronArrows variant="white" size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal Popup Overlay */}
      <AnimatePresence>
        {selectedIndustry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={() => setSelectedIndustry(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-slate-100"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedIndustry(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto flex-1 no-scrollbar">
                {/* Image Header */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 pointer-events-none">
                    <SmartMedia 
                      type="image"
                      src={selectedIndustry.image} 
                      alt={selectedIndustry.name} 
                      className="w-full h-full [&_img]:object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
                  
                  <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white tracking-tight text-center px-4">
                    {selectedIndustry.name}
                  </h2>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8">
                  {/* Long Description */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6">
                    {selectedIndustry.longDesc}
                  </p>

                  <hr className="border-slate-100 my-6" />

                  {/* Metrics */}
                  {selectedIndustry.keyMetrics && selectedIndustry.keyMetrics.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-primary" />
                        Key Inspection Metrics
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedIndustry.keyMetrics.map((item, index) => (
                          <div key={index} className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-center">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 line-clamp-1">{item.metric}</p>
                            <p className="text-primary text-lg sm:text-xl font-black">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <hr className="border-slate-100 my-6" />

                  {/* Applications */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PixtronArrows size={16} />
                      Key Inspection Applications
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedIndustry.applications.map((app, index) => (
                        <li key={index} className="flex items-start gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100/80 text-slate-700 text-xs sm:text-sm font-medium">
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  {/* Products Used */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <PixtronArrows size={16} />
                      Products Used In This Solution
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedIndustry.products.map((prod) => (
                        <Link
                          key={prod}
                          to={`/products/${prod.toLowerCase().replace(/\s+/g, '-')}`}
                          className="bg-slate-100 hover:bg-primary hover:text-white text-slate-700 border border-slate-200/60 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer group/btn"
                        >
                          <PixtronArrows size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          {prod}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <hr className="border-slate-100 my-6" />

                  {/* Sub-Industries */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PixtronArrows size={16} />
                      Also Used In This Industry
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedIndustry.subIndustries.map((sub, index) => (
                        <div 
                          key={index} 
                          className="bg-slate-50/80 border border-slate-100 p-4 rounded-2xl hover:border-primary/20 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{sub.name}</h4>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed pl-3.5">
                            {sub.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
                <span className="text-xs text-slate-500 font-medium">
                  Need custom configuration? Talk to our engineers.
                </span>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button 
                    onClick={() => setSelectedIndustry(null)}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-xs sm:text-sm cursor-pointer text-center"
                  >
                    Explore More
                  </button>
                  <Link 
                    to="/contact"
                    className="flex-1 sm:flex-initial px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all text-xs sm:text-sm text-center shadow-md shadow-primary/20"
                  >
                    Get Link Quote
                  </Link>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Industries;