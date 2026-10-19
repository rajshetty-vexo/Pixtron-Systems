import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PixtronArrows } from './PixtronArrows';
import { CheckCircle2, Zap, ShieldCheck, BarChart3, Orbit, ArrowRight,ScanLine } from 'lucide-react';
import {SmartMedia} from "../components/SmartMedia";

type SuiteType = 'vision' | 'trackTrace';

const visionProducts = [
  {
    id: 'inspectra',
    name: 'Inspectra',
    tagline: 'Dot Print Inspection',
    description: 'High precision, ultra high-speed dot print inspection designed for complex packaging lines. Inspectra ensures 100% real-time defect verification without slowing production speeds.',
    inspections: [
      'OCR & OCV Intelligence',
      'Dot Print Inspection',
      'Inline High-Speed Processing',
    ],
    icon: <ShieldCheck className="text-primary" size={32} />,
    image:"https://res.cloudinary.com/owsr7mjw/image/upload/v1788022359/drilldown_qhk7g2.jpg",
  },
  {
    id: 'rapid',
    name: 'Rapid',
    tagline: 'Continuous Flow Production Line Inspection',
    description: 'Fast, accurate inspection with OCR/OCV for continuous flow production lines, with real-time monitoring and inspection of surface defects and dimensions.',
    inspections: [
      'Continuous Profile Tracking',
      'Micron-Level Defect Detection',
      'Live Alarms & Analytics'
    ],
    icon: <Zap className="text-primary" size={32} />,
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786101974/ChatGPT_Image_Aug_7_2026_04_55_04_PM_rgjonz.png",
  },
  {
    id: 'Codex',
    name: 'Codex',
    tagline: 'Code Reading & OCR',
    description: 'Ultra-fast reading and OCR-based verification of 1D/2D codes, including pharma-grade traceability labels.',
    inspections: [
      '1D & 2D Code Decoding',
      'Pharma Traceability Compliance',
      'High-Speed Industrial Processing'
    ],
    icon: <CheckCircle2 className="text-primary" size={32} />,
    image:"https://res.cloudinary.com/owsr7mjw/image/upload/v1792241752/IMG_20261017_182203_i5j6ty.jpg",
  },
  {
    id: 'opus',
    name: 'Opus',
    tagline: 'Geometry & Color Inspection',
    description: 'Precise shape, size, and color consistency verification for complex manufacturing components.',
    inspections: [
      'Dimensional Tolerance Checks',
      'Spectrum Color Matching',
      'Surface Defect Inspection'
    ],
    icon: <BarChart3 className="text-primary" size={32} />,
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786098904/file_00000000923c8208860b3fb1f3dbee50_pj5kiu.png",
  },
  {
    id: 'panorama',
    name: 'Panorama',
    tagline: '360° Inspection',
    description: 'Complete 360° surface inspection using synchronized multi-camera systems for bottles, cans, and tubes.',
    inspections: [
      '360° Seamless Coverage',
      'Cap & Label Alignment',
      'Panoramic Image Unwrapping'
    ],
    icon: <Orbit className="text-primary" size={32} />,
    image:"https://res.cloudinary.com/owsr7mjw/image/upload/v1786117786/IMG_20260807_211740_vtalnq.jpg",
  },
  // {
  //   id: 'blister-inspection-system',
  //   name: 'Blister Inspection System',
  //   tagline: 'Blister Packaging Inspection',
  //   description: 'High-speed, real-time vision inspection designed for pharmaceutical blister lines to detect missing tablets, damaged products, color variations, and seal defects.',
  //   inspections: [
  //     'Cavity & Product Integrity Verification',
  //     'Seal & Foil Quality Inspection'
  //   ],
  //   icon: <Eye className="text-primary" size={32} />,
  //   image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1786118093/Pharmaceuticals_fuouoq.jpg",
  // },
];

const trackTraceProducts = [
  {
    id: 'primus',
    name: 'Primus',
    tagline: 'Serialization & Track & Trace',
    description: 'End-to-end serialization, aggregation, and traceability platform that ensures product authenticity and regulatory compliance across the entire supply chain.',
    inspections: [
      'Primus-QR',
      'Primus-RF',
      'Primus-GUI',
    ],
    icon: <ScanLine className="text-primary" size={32} />,
    image: "https://res.cloudinary.com/owsr7mjw/image/upload/v1788259659/Primus_iej02l.png",
  },
];


interface ProductsProps {
  activeSuite: SuiteType;
  onToggle: (suite: SuiteType) => void;
}

export const Products: React.FC<ProductsProps> = ({ activeSuite, onToggle }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const products = activeSuite === 'vision' ? visionProducts : trackTraceProducts;

  // reset the mobile slider position whenever the tab changes
  useEffect(() => {
    setActiveCardIndex(0);
    scrollContainerRef.current?.scrollTo({ left: 0 });
  }, [activeSuite]);
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth + 16 // +16 for the gap-4
        : 300;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCardIndex(index);
    }
  };

  const headingContent = activeSuite === 'vision'
  ? {
      title: 'Pixtron Inspection Suite',
      subtitle: 'Each of our systems is engineered for specific industrial challenges with targeted inspection capabilities.',
    }
  : {
      title: 'Pixtron Track & Trace Suite', 
      subtitle: 'End-to-end serialization and traceability solutions that secure your products from production to shelf.', 
    };
  

  return (
    <section id="products" className="py-10 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="text-center mb-10 sm:mb-16">
  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
    <PixtronArrows size={20} />
    <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm">Our Products</span>
  </div>

<div className={`inline-flex items-center bg-slate-100 border rounded-full p-1 mb-4 sm:mb-6 transition-colors duration-300 ${
  activeSuite === 'vision' ? 'border-primary' : 'border-secondary'
}`}>
  {(['vision', 'trackTrace'] as const).map((tab) => {
    const isActive = activeSuite === tab;
    const isVisionTab = tab === 'vision';

    return (
      <button
        key={tab}
        onClick={() => onToggle(tab)}
        className={`relative px-5 sm:px-7 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors z-10 ${
          isActive
            ? isVisionTab ? 'text-white' : 'text-slate-800'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="suiteToggleBg"
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

  <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6">
    {headingContent.title}
  </h2>
  <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
    {headingContent.subtitle}
  </p>
</div>

        {/* 6 Products Grid on Desktop / Horizontal Scroll Slider on Mobile */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:gap-y-10 lg:overflow-visible lg:pb-0"
        >
          {products.map((product, index) => {
            const isHovered = hoveredCard === product.id;
            const isLastOddTile = products.length % 2 === 1 && index === products.length - 1;

            return (
              <div
                key={product.id}
                className={`relative h-auto sm:h-[380px] md:h-[400px] min-w-[86vw] sm:min-w-[420px] lg:min-w-0 w-full group snap-center shrink-0 ${
                  isLastOddTile ? 'lg:col-span-2 lg:w-[calc(50%-1rem)] lg:mx-auto' : ''
                }`}
                style={{ perspective: 1200 }}
                onMouseEnter={() => setHoveredCard(product.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* FLIPPING CONTAINER */}
                <motion.div
                  className="w-full h-full relative pointer-events-none"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isHovered ? -180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  {/* FRONT SIDE */}
                  <div 
                    className="sm:absolute sm:inset-0 w-full h-full bg-white p-5 sm:p-7 md:p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col justify-between overflow-hidden pointer-events-auto"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div>
                      {/* Subtitle / Tagline */}
                      <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-xs uppercase mb-2">
                        <PixtronArrows size={14} />
                        <span>{product.tagline}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed text-xs sm:text-sm md:text-base mb-3 sm:mb-5">
                        {product.description}
                      </p>

                      {/* Inspections List */}
                      <ul className="space-y-2 mb-4 sm:mb-6">
                        {product.inspections.map((inspection) => (
                          <li key={inspection} className="flex items-center gap-2.5 text-slate-800 text-xs sm:text-sm font-medium">
                            <PixtronArrows size={13} className="text-primary shrink-0" />
                            <span>{inspection}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* FRONT BUTTONS DISPLAY */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:pt-2 mt-auto">
                      <Link
                        to={`/products/${product.id}`}
                        className="inline-flex items-center justify-center bg-[#003882] hover:bg-[#002860] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md shadow-blue-900/10 transition-all"
                      >
                        Explore {product.name}
                      </Link>

                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center border-2 border-slate-300 hover:border-slate-400 text-[#003882] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white transition-all"
                      >
                        Contact Sales
                      </Link>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 pointer-events-auto"
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
              <SmartMedia 
              type="image"
              src={product.image} 
              alt={product.name} 
              className="w-full h-full [&>img]:object-cover opacity-80"
                />
                    
                    {/* Backside Content + Interactive Buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-350 via-slate-350/60 to-transparent p-5 sm:p-7 md:p-8 flex flex-col justify-between">
                      <div>
                        <span className="text-secondary font-bold text-xs uppercase tracking-widest mb-1 block">Visual Showcase</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white">{product.name}</h3>
                        <p className="text-slate-200 text-xs sm:text-sm font-medium mt-1">{product.tagline}</p>
                      </div>

                      {/* Backside Working Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to={`/products/${product.id}`}
                          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-primary/30 active:scale-95 cursor-pointer group/btn"
                        >
                          <span>Explore {product.name}</span>
                          <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center border border-white/30 hover:border-white text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl backdrop-blur-md bg-white/10 transition-all active:scale-95 cursor-pointer"
                        >
                          Contact Sales
                        </Link>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

        {/* MOBILE BLUE PAGINATION DOTS */}
        <div className="flex lg:hidden justify-center items-center gap-2 mt-6">
          {products.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const cardWidth = scrollContainerRef.current.firstElementChild
                    ? (scrollContainerRef.current.firstElementChild as HTMLElement).offsetWidth + 16
                    : 300;
                  scrollContainerRef.current.scrollTo({
                    left: dotIndex * cardWidth,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeCardIndex === dotIndex
                  ? 'w-7 bg-primary'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};