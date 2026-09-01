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
import { productAnimations } from "../components/Productanimations";
import {SmartMedia} from "../components/SmartMedia";
import { ProductHub } from '../components/ProductHub';

export const ProductDetailPage: React.FC = () => {

const { productId } = useParams<{ productId: string }>();

const [isModalOpen, setIsModalOpen] = useState(false);
// Find matching product or fallback to Inspectra
const product = productsData.find((p) => p.id === productId) || productsData[0];
const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

const AnimationComponent = productAnimations[product.id];
const hasRealImages = !!product.images && product.images.length > 0;
const productImages = hasRealImages ? product.images! : (AnimationComponent ? [] : ["/placeholder-image.jpg"]);
const showingAnimation = !!AnimationComponent && currentImageIndex === 0;
const totalSlides = productImages.length + (AnimationComponent ? 1 : 0);
const [selectedEdition, setSelectedEdition] = useState<'eco' | 'pro' | 'evo'>('pro'); 
const subProducts = productsData.filter((p) => p.parentId === product.id);
  
  // const productImages = product.images && product.images.length > 0 
  //   ? product.images 
  //   : ["/placeholder-image.jpg"];

 

  // 4. AUTO-SLIDE EFFECT
  useEffect(() => {
    if (isPaused || productImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, productImages.length]);

if (subProducts.length > 0) {
  return <ProductHub product={product} subProducts={subProducts} />;
}

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
  to={product.parentId ? `/products/${product.parentId}` : `/products?suite=${product.suite}`}
  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
>
  <ArrowLeft size={16} />
  {product.parentId
    ? `Back to ${productsData.find((p) => p.id === product.parentId)?.name ?? 'Products'}`
    : 'Back to Products'}
</Link>

</div>



{/* 1.HERO SECTION (Title, Brief Description, Download Button) */}

<section className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-16">

<motion.div

initial={{ opacity: 0, y: 15 }} 
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.3 }}
transition={{ duration: 0.7,ease:'easeOut' }}
className="relative w-full max-w-4xl mx-auto flex items-center justify-center gap-2"

>

<PixtronArrows size={20} />

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
 
    {/* MAIN FRAME - Hover handler added.
        When the live animation is showing we DROP the fixed aspect-video
        ratio and let the frame size itself around the animation's own
        natural height (stage keeps its own aspect-ratio internally, panel
        sizes to its content) — this is what stops it clipping/hiding on
        mobile and stops the stray scrollbar on desktop. Real image/video
        slides keep the original fixed aspect-video box. */}
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative rounded-[1.5rem] sm:rounded-[3rem] p-[3px] bg-gradient-to-r from-primary via-primary/90 to-secondary w-full flex items-center justify-center group cursor-pointer ${
        showingAnimation ? "overflow-hidden" : "aspect-video overflow-hidden"
      }`}
    >
      {/* Inner Image Box */}
<div className={`relative w-full rounded-[calc(2rem-3px)] sm:rounded-[calc(3rem-3px)] overflow-hidden bg-slate-950 flex items-center justify-center ${
        showingAnimation ? "" : "h-full"
      }`}>
 
  {/* Live product animation, when this product has one registered.
      IMPORTANT: this renders in normal flow (no position:absolute) so its
      real content height is what the auto-height frame above measures
      itself against — an absolutely positioned element here would collapse
      to zero height and either get clipped or force the whole frame flat. */}
  {showingAnimation && AnimationComponent && (
    <div className="w-full z-0">
      <AnimationComponent variant="compact" />
    </div>
  )}
 
  {/* Real images / video — if an animation is registered it sits in slide 0
      as a "virtual" slide, so real media starts from currentImageIndex 1 */}
  {!showingAnimation && (
    <SmartMedia
                key={currentImageIndex}
                type="image"
                src={productImages[AnimationComponent ? currentImageIndex - 1 : currentImageIndex]}
                alt={`${product.name} visual ${currentImageIndex + 1}`}
                className="w-full h-full [&>img]:object-cover z-0"
              />
  )}

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
{/* PRODUCT EDITIONS SECTION (Reusable for Inspectra, Rapid, etc.) */}
{product.editions && (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
    <div className="bg-slate-50 rounded-3xl p-4 sm:p-8 lg:p-12 border border-slate-200/80 shadow-sm overflow-hidden">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14 px-2">
        <span className="text-[#003882] font-extrabold uppercase text-xs tracking-widest bg-blue-100/70 text-[#003882] px-3.5 py-1.5 rounded-full border border-blue-200">
          AVAILABLE EDITIONS
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
          Choose the Right Edition for Your Line
        </h2>
        <p className="text-slate-600 text-sm sm:text-base mt-2">
          From standard thresholding to micron-level precision and custom client workflows.
        </p>
      </div>

      {/* Cards Scroll View till Tablet (lg: grid) */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0 [perspective:1000px] no-scrollbar">

        {/* 1. ECO TIER */}
        <div className="w-[82vw] sm:w-[310px] sm:flex-1 md:w-auto lg:max-w-none shrink-0 snap-center group bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-slate-500 active:border-slate-600 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all duration-200 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] [transform:translateZ(0)] will-change-transform hover:[transform:translateZ(30px)] active:scale-[0.98] md:active:scale-100 hover:z-20 cursor-pointer select-none">
          <div>
            <div className="inline-block bg-slate-100 text-slate-800 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider mb-4 group-hover:bg-slate-800 group-hover:text-white group-active:bg-slate-800 group-active:text-white transition-colors duration-300">
              ECO
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
              {product.editions.eco.title}
            </h3>
            <p className="text-black text-xs sm:text-sm leading-relaxed mb-6">
              {product.editions.eco.description}
            </p>
            <hr className="border-slate-100 my-4" />
            <ul className="space-y-3 text-xs sm:text-sm text-black font-medium">
              {product.editions.eco.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. PRO TIER */}
        <div className="w-[82vw] sm:w-[310px] sm:flex-1 md:w-auto lg:max-w-none shrink-0 snap-center group bg-primary/90 text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-300 hover:border-blue-500 active:border-blue-400 shadow-xl hover:shadow-2xl hover:shadow-blue-900/30 flex flex-col justify-between relative transition-all duration-200 ease-out hover:[transform:translateZ(30px)] active:scale-[0.98] md:active:scale-100 hover:z-20 cursor-pointer select-none antialiased [transform-style:preserve-8d] [will-change:transform]">
          
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-tr-[14px] rounded-bl-xl uppercase tracking-wider pointer-events-none">
            Ultra Precision
          </div>

          <div>
            <div className="inline-block bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider mb-4 group-hover:bg-blue-600 group-hover:text-white group-active:bg-blue-600 group-active:text-white transition-colors duration-300">
              PRO
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 transform-gpu">
              {product.editions.pro.title}
            </h3>
            <p className="text-white text-xs sm:text-sm leading-relaxed mb-6 transform-gpu">
              {product.editions.pro.description}
            </p>
            <hr className="border-slate-100 my-4" />
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium transform-gpu">
              {product.editions.pro.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

    {/* 3. EVO TIER */}
<div className="w-[82vw] sm:w-[310px] sm:flex-1 md:w-[calc(50%-12px)] md:col-span-2 md:justify-self-center lg:w-auto lg:col-span-1 shrink-0 snap-center group bg-gradient-to-br from-primary via-primary to-[#002860] rounded-2xl p-6 sm:p-8 border-2 border-[#FFD400] hover:border-amber-500 active:border-amber-600 relative shadow-md hover:shadow-2xl hover:shadow-amber-500/15 flex flex-col justify-between transition-all duration-200 ease-out [transform-style:preserve-3d] [backface-visibility:hidden] [transform:translateZ(0)] will-change-transform hover:[transform:translateZ(30px)] active:scale-[0.98] md:active:scale-100 hover:z-20 cursor-pointer select-none">
  <div className="absolute top-0 right-0 bg-[#FFD400] text-slate-900 text-[10px] font-black px-3 py-1 rounded-tr-[14px] rounded-bl-xl uppercase tracking-wider">
    Customizable
  </div>
  <div>
    <div className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider mb-4 group-hover:bg-[#FFD400] group-active:bg-[#FFD400] transition-colors duration-300">
      EVO
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
      {product.editions.evo.title}
    </h3>
    <p className="text-white text-xs sm:text-sm leading-relaxed mb-6">
      {product.editions.evo.description}
    </p>
    <hr className="border-slate-100 my-4" />
    <ul className="space-y-3 text-xs sm:text-sm text-white font-medium">
      {product.editions.evo.features.map((feat, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-blue-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
          <span>{feat}</span>
        </li>
      ))}
    </ul>
  </div>
</div>

      </div>
    </div>
  </section>
)}
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

