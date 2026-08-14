import React from 'react';
import { useState,useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { productsData } from '../data/productsData';
import { PixtronArrows } from '../components/PixtronArrows';
import {MainFeaturesSection} from '../components/MainFeaturesSection'
import { BrochureModal } from '../components/BrochureModal';
import { SeoMeta } from "../components/SeoMeta";
import { Download, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import {SmartMedia} from "../components/SmartMedia";

export const ProductDetailPage: React.FC = () => {

const { productId } = useParams<{ productId: string }>();
const [isModalOpen, setIsModalOpen] = useState(false);
// Find matching product or fallback to Inspectra
const product = productsData.find((p) => p.id === productId) || productsData[0];
const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ["/placeholder-image.jpg"];

  // 4. AUTO-SLIDE EFFECT
  useEffect(() => {
    if (isPaused || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, productImages.length]);


// 1. URLs & Description
const currentUrl = "https://www.pixtronsystems.com/your-page-path";
const pageDescription = "Page ki concise description (150-160 characters max).";

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": pageDescription,
  "url": currentUrl,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.pixtronsystems.com/" },
    { "@type": "ListItem", "position": 2, "name": "Current Page Name", "item": currentUrl }
  ]
};



return (

<main className="pt-28 sm:pt-36 pb-24 bg-white min-h-screen font-sans text-slate-900">
  <SeoMeta 
      title="Page Title | Pixtron Systems"
      description={pageDescription}
      pathname="/your-page-path"
      image="/og-image.png" 
      keywords="keyword1, keyword2, machine vision, Pixtron Systems"
      structuredData={pageSchema}
      breadcrumbData={breadcrumbSchema}
    />


{/* Back Button Navigation */}

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">

<Link

to="/products"

className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"

>

<ArrowLeft size={16} /> Back to Products

</Link>

</div>



{/* 1.HERO SECTION (Title, Brief Description, Download Button) */}

<section className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-16">

<motion.div

initial={{ opacity: 0, y: 15 }} 
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: 0.7,ease:'easeOut' }}
className="relative w-full max-w-4xl mx-auto"

>

<PixtronArrows size={14} />

<span className="text-xs font-bold uppercase tracking-widest text-primary">

{product.category}

</span>

</motion.div>



<motion.h1

initial={{ opacity: 0, y: 20 }}

animate={{ opacity: 1, y: 0 }}

transition={{ duration: 0.6, delay: 0.1 }}

className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-4"

>

{product.name}

</motion.h1>



<motion.p

initial={{ opacity: 0, y: 20 }}

animate={{ opacity: 1, y: 0 }}

transition={{ duration: 0.6, delay: 0.2 }}

className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal mb-8"

>

{product.description}

</motion.p>



{/* Download Brochure CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
        
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 bg-primary text-white font-bold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-slate-900/10 group cursor-pointer"
          >
            <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Download Brochure
          </button>
        </motion.div>
      </section>


{/* 2. HERO IMAGE SLIDER SECTION */}
<section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28 flex justify-center">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="relative w-full max-w-4xl mx-auto"
  >
    {/* DUAL GLOW SHADOW BACKDROP */}
    <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[3rem] bg-gradient-to-r from-primary/80 via-secondary/60 to-primary/90 opacity-75 blur-xl pointer-events-none animate-slow-glow" />

    {/* MAIN FRAME - Hover handler added */}
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-[1.5rem] sm:rounded-[3rem] p-[3px] bg-gradient-to-r from-primary via-primary/90 to-secondary w-full aspect-video flex items-center justify-center overflow-hidden group cursor-pointer"
    >
      {/* Inner Image Box */}
<div className="relative w-full h-full rounded-[calc(2rem-3px)] sm:rounded-[calc(3rem-3px)] overflow-hidden bg-slate-950 flex items-center justify-center">
  
<SmartMedia
                key={currentImageIndex}
                type="image"
                src={productImages[currentImageIndex]}
                alt={`${product.name} visual ${currentImageIndex + 1}`}
                className="w-full h-full [&>img]:object-cover z-0"
              />

  {/* Bottom Dot Indicators - z-20 & relative added for click priority */}
  {productImages.length > 1 && (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
      {productImages.map((_, idx) => (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Hover/Parent conflicts avoid karne ke liye
            setCurrentImageIndex(idx);
          }}
          className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
            idx === currentImageIndex 
              ? "w-5 bg-white" 
              : "w-2.5 bg-white/50 hover:bg-white/80"
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  )}

  {/* Minimal overlay vignette */}
  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-10" />
</div>
    </div>
  </motion.div>
</section>


<MainFeaturesSection product={product} />


{/* 4. INDUSTRIES USED SECTION (Clean Light Theme Match) */}

<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50"
>


{/* Tag */}

<div className="flex items-center gap-2.5 mb-4">

<Building2 className="text-primary" size={20} />

<span className="text-primary font-bold uppercase tracking-widest text-xs">

Applications

</span>

</div>


{/* Heading */}

<h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">

Where {product.name} is Used

</h2>



{/* Grid Cards */}

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

{product.industriesUsed.map((industry, index) => (

<motion.div
key={index}
initial={{ opacity: 0, y: 15 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.6 }}
transition={{ duration: 0.4, delay: index * 0.06 }}
className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 hover:border-slate-300 hover:bg-slate-100/60 transition-all duration-200"
>

{/* Pixtron Arrow Icon */}

<div className="shrink-0 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">

<PixtronArrows size={16} />

</div>


{/* Industry Text */}

<span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">

{industry}

</span>

</motion.div>

))}

</div>



</motion.div>

</section>

{/* 4. BROCHURE MODAL COMPONENT */}
      <BrochureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
        brochureUrl={product.brochureUrl}
      />

</main>

);

}; 

