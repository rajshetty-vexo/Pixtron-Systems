import React, { useState, useEffect,} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixtronArrows } from '../components/PixtronArrows';
import { Link,useSearchParams,useLocation } from 'react-router-dom';
import { 
  Car, 
  Cpu, 
  FlaskConical, 
  Utensils, 
  Factory, 
  Truck,
  X,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  BarChart3 
} from 'lucide-react';

import automotiveImg from '../assets/Industries/Car automotive.jpeg';
import electronicsImg from '../assets/Industries/Electronics.png';
import foodBeverageImg from '../assets/Industries/Food & Beverage.png';
import logisticsImg from '../assets/Industries/Logistics.jpg';
import manufacturingImg from '../assets/Industries/Manufacturing.png';
import pharmaceuticalsImg from '../assets/Industries/Pharmaceuticals.jpeg';
import {SmartMedia} from "../components/SmartMedia";

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
    desc: 'High-speed component verification, assembly alignment validation, and precision welding quality inspection systems.',
    longDesc: 'Advanced machine vision systems for automotive assembly lines ensure component presence, correct assembly, and dimension verification at line speed. We help Tier-1 manufacturers reduce recall rates to near zero through comprehensive inspection gates.',
     keyMetrics: [
      { metric: 'Inspection Accuracy', value: '99.98%' },
      { metric: 'Maximum Line Speed', value: '120 parts/min' },
      { metric: 'Defect Detection Rate', value: 'Sub-mm level' },
      { metric: 'Typical ROI Period', value: '< 9 Months' }
    ],
      applications: [
      'Chassis & powertrain assembly verification',
      'Weld bead profile inspection & surface defects check',
      'Fastener, screw, and O-ring presence checks',
      'Part number laser marking & 2D code verification'
    ],
    products: ['Inspectra', 'Opus', 'Codex'],
    subIndustries: [
      { name: 'EV Battery Assembly', desc: 'Inspects weld seam quality, cell dimensions, and alignment at high speeds.' },
      { name: 'Metal Press & Stampings', desc: 'Identifies structural cracks, wrinkles, and stamping defects dynamically.' }
    ]
  },
  { 
    name: 'Electronics', 
    icon: Cpu, 
    image: electronicsImg,
    desc: 'Sub-micron PCB defect detection, micro-component placement inspection, and solder joint validation.',
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
    desc: 'FDA-compliant blister pack integrity verification, pharmacode inspection, and batch number OCR reading.',
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
    products: ['Codex', 'Inspectra', 'Panorama','Blister Inspection System'],
    subIndustries: [
      { name: 'Medical Device Assembly', desc: 'High-precision verification of syringe needles, catheters, and drug delivery systems.' },
      { name: 'Serialization & Packaging', desc: 'FDA-compliant barcode reading and OCR verification for complete traceability.' }
    ]
  },
  { 
    name: 'Food & Beverage', 
    icon: Utensils, 
    image: foodBeverageImg,
    desc: 'High-throughput seal integrity validation, bottle fill level checking, and package label inspection.',
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
    products: ['Panorama', 'Codex', 'Inspectra'],
    subIndustries: [
      { name: 'Canning & Bottling Lines', desc: 'High-speed double seam inspection, fill level check, and cap skew validation.' },
      { name: 'Carton & Box Packaging', desc: 'Checks print quality, label alignment, and barcode readability.' }
    ]
  },
  { 
    name: 'Manufacturing', 
    icon: Factory, 
    image: manufacturingImg,
    desc: 'Continuous surface defect detection, scratch and dent validation, and precise dimensional check systems.',
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
    desc: 'Automated high-speed sorting, parcel dimensioning, and logistics shipping label OCR/barcode reading.',
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
    products: ['Codex', 'Rapid'],
    subIndustries: [
      { name: 'E-commerce Warehouses', desc: '3D package sizing, automated route sorting, and high-speed label scanning.' },
      { name: 'Supply Chain Sorting Gates', desc: 'Reads barcode data on damaged packages and logs sorting errors.' }
    ]
  },
];

export const SolutionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryItem | null>(null);
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('All');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);
  


useEffect(() => {
  const checkUrlForIndustry = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const industryParam = searchParams.get('industry');
    const hashParam = window.location.hash ? window.location.hash.substring(1) : null;
    
    const targetName = industryParam || hashParam;
    
    if (targetName) {
      const decodedName = decodeURIComponent(targetName).trim().toLowerCase();
      const match = industriesList.find(
        (ind) => ind.name.toLowerCase() === decodedName
      );
      if (match) {
        setSelectedIndustry(match);
        // Popup khulte hi page ko top par scroll karne ke liye
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
      }
    }
  };

  checkUrlForIndustry();

  window.addEventListener('hashchange', checkUrlForIndustry);
  return () => window.removeEventListener('hashchange', checkUrlForIndustry);

}, [location]);

const filteredIndustries = industriesList.filter((industry) => {
  const matchesIndustry =
    selectedIndustryFilter === 'All' ||
    industry.name.toLowerCase() === selectedIndustryFilter.toLowerCase();

  const matchesProduct =
    selectedProductFilter === 'All' ||
    industry.products.some((prod) =>
      prod.toLowerCase().includes(selectedProductFilter.toLowerCase()) ||
      selectedProductFilter.toLowerCase().includes(prod.toLowerCase())
    );

  return matchesIndustry && matchesProduct;
});
  return (
    <main className="pt-28 sm:pt-32 pb-20 sm:pb-24 bg-slate-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-14">
        <div className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Solutions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">Our Solutions</h1>
        <p className="text-slate-600 max-w-3xl text-base sm:text-lg leading-relaxed font-medium">
          From concept validation in our lab to full mechanical commissioning on your shop floor, Pixtron Systems provides complete end-to-end machine vision integration.
        </p>
      </section>

     {/* Always Open Clean Filters Bar */}
<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
    
    {/* Header Title */}
    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <SlidersHorizontal size={18} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-base">Filter Solutions</h3>
        <p className="text-slate-400 text-xs">Filter solutions by industry or best suited product</p>
      </div>
    </div>

    {/* Filter by Industry */}
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
        Filter by Industry
      </span>
     <div className="flex sm:flex-wrap items-center gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0">
        {['All', 'Automotive', 'Electronics', 'Pharmaceuticals', 'Food & Beverage', 'Manufacturing', 'Logistics'].map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustryFilter(ind)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedIndustryFilter === ind
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>
    </div>

    {/* Filter by Best Suited Product */}
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
        Filter by Best Suited Product
      </span>
     <div className="flex sm:flex-wrap items-center gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0">
        {['All', 'Inspectra', 'Opus', 'Codex', 'Rapid', 'Panorama'].map((prod) => (
          <button
            key={prod}
            onClick={() => setSelectedProductFilter(prod)}
           className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedProductFilter === prod
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {prod === 'All' ? 'All Products' : prod}
          </button>
        ))}
      </div>
    </div>

  </div>
</section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredIndustries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-lg shadow-slate-200/40 text-center max-w-xl mx-auto mb-16 sm:mb-20">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Matching Industries</h3>
            <p className="text-slate-500 text-sm mb-6">No industries match the selected filter combination. Adjust your selections or click reset.</p>
            <button
              onClick={() => {
                setSelectedIndustryFilter('All');
                setSelectedProductFilter('All');
              }}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
            <AnimatePresence mode="popLayout">
              {filteredIndustries.map((industry,index) => {
                const Icon = industry.icon;
                return (
                  <motion.article
                   layout
                   key={industry.name}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{   
                   duration: 0.5, 
                   delay: (index % 2) * 0.15, // Ek-ek karke staggered delay se aayenge
                   ease: 'easeOut'
                }}
                 whileHover={{ y: -6 }}
                 className="group bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/60 flex flex-col justify-between">
                    <div>
                      <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300 w-fit">
                        <Icon size={40} />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{industry.name}</h2>
                      <p className="text-slate-600 leading-relaxed font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                        {industry.desc}
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button 
                        onClick={() => setSelectedIndustry(industry)}
                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        Learn More 
                        <PixtronArrows size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="bg-secondary rounded-[2.5rem] p-10 md:p-14 text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black mb-3">Deploying Link New Line?</h3>
            <p className="text-primary/80 text-base sm:text-lg font-medium">Get Link free feasibility study using your actual parts and inspection specs.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
              Request Feasibility Study
            </Link>
            <Link to="/contact" className="border border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

     {/* Modal Popup overlay */}
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
                {/* 1. FIXED: Compact Image Header with Sleek Title */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 pointer-events-none">
                <SmartMedia 
                type="image"
                src={selectedIndustry.image} 
                alt={selectedIndustry.name} 
                className="w-full h-full [&>img]:object-cover"
                />
                 </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
                  
                  <h2 className="relative z-10 text-2xl sm:text-3xl font-bold text-white tracking-tight text-center px-4">
                    {selectedIndustry.name}
                  </h2>
                </div>

                {/* Content body */}
                <div className="p-6 sm:p-8">
                  {/* Long Description */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-6">
                    {selectedIndustry.longDesc}
                  </p>

                  <hr className="border-slate-100 my-6" />

                  {/* 2. FIXED: Clean Metrics Grid */}
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

                  {/* 3. FIXED: Applications in 2-Column Grid */}
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

                  {/* 4. FIXED: Products Used - Sleek Pill Badges */}
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

                  {/* 5. FIXED: Sub-Industries 2-Column Card Grid */}
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

              {/* Modal Footer (fixed at bottom) */}
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
                <span className="text-xs text-slate-500 font-medium">
                  Need custom configuration? Talk to our engineers.
                </span>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button 
                    onClick={() => setSelectedIndustry(null)}
                    className="flex-1 sm:flex-initial px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-xs sm:text-sm cursor-pointer text-center"
                  >
                    Close
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
    </main>
  );
};