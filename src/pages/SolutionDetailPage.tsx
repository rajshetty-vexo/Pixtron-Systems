import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PixtronArrows } from '../components/PixtronArrows';
import { SeoMeta } from '../components/SeoMeta';
import { SmartMedia } from '../components/SmartMedia';
import { solutionsData } from '../data/Solutionsdata';
import { productsData } from '../data/productsData';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  BarChart3,
  Boxes,
  BookOpenCheck,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Solution detail page.
 *
 * Route: /solutions/:solutionId
 * Linked from SolutionsPage's "Learn More". Falls back to the first solution
 * if the slug doesn't match, same pattern ProductDetailPage uses.
 */

export const SolutionDetailPage: React.FC = () => {
  const { solutionId } = useParams<{ solutionId: string }>();
  const navigate = useNavigate();
  const solution = solutionsData.find((s) => s.id === solutionId) || solutionsData[0];
  const Icon = solution.icon;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasImages = !!solution.images && solution.images.length > 0;
  const images = hasImages ? solution.images! : [];

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const usedProducts = solution.productsUsed
    .map((pid) => productsData.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const currentUrl = `https://www.pixtronsystems.com/solutions/${solution.id}`;
  const pageDescription = solution.desc.slice(0, 156);

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.name,
    description: pageDescription,
    url: currentUrl,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.pixtronsystems.com/' },
      { '@type': 'ListItem', position: 2, name: 'Solutions', item: 'https://www.pixtronsystems.com/solutions' },
      { '@type': 'ListItem', position: 3, name: solution.name, item: currentUrl },
    ],
  };

  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1);
    else navigate('/solutions');
  };

  return (
    <main className="pt-28 sm:pt-36 pb-24 bg-white min-h-screen font-sans text-slate-900">
      <SeoMeta
        title={`${solution.name} | Pixtron Systems`}
        description={pageDescription}
        pathname={`/solutions/${solution.id}`}
        image="/og-image.svg"
        keywords={`${solution.name}, machine vision, Pixtron Systems`}
        structuredData={pageSchema}
        breadcrumbData={breadcrumbSchema}
      />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Solutions
        </button>
      </div>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full max-w-4xl mx-auto flex items-center justify-center gap-2"
        >
          <PixtronArrows size={20} />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Solutions</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-4"
        >
          {solution.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          {solution.tagline}
        </motion.p>
      </section>

      {/* HERO MEDIA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[3rem] bg-gradient-to-r from-primary/80 via-secondary/60 to-primary/90 opacity-75 blur-xl pointer-events-none animate-slow-glow" />

          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative rounded-[1.5rem] sm:rounded-[3rem] p-[3px] bg-gradient-to-r from-primary via-primary/90 to-secondary w-full aspect-video flex items-center justify-center overflow-hidden group cursor-pointer"
          >
            <div className="relative w-full h-full rounded-[calc(2rem-3px)] sm:rounded-[calc(3rem-3px)] overflow-hidden bg-slate-950 flex items-center justify-center">
              {hasImages ? (
                <>
                  <SmartMedia
                    key={currentImageIndex}
                    type="image"
                    src={images[currentImageIndex]}
                    alt={`${solution.name} visual ${currentImageIndex + 1}`}
                    className="w-full h-full [&>img]:object-cover z-0"
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                          }}
                          className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === currentImageIndex ? 'w-5 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#041A3A] via-[#052B65] to-[#041A3A]">
                  <div className="w-24 h-24 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center">
                    <Icon size={44} strokeWidth={1.5} className="text-[#FFD400]" />
                  </div>
                  <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
                    {solution.name}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* LONG DESCRIPTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium text-center"
        >
          {solution.longDesc}
        </motion.p>
      </section>

      {/* KEY METRICS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <BarChart3 className="text-primary" size={20} />
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Key Metrics</span>
          </div>
           <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">
            Performance Metrics
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {solution.keyMetrics.map((item, index) => {
              // splits values like "4 (scratch, insulation, diameter, print)"
              // into a big main number + a smaller detail line underneath
              const match = item.value.match(/^(.*?)\s*\((.*)\)\s*$/);
              const mainValue = match ? match[1].trim() : item.value;
              const detail = match ? match[2].trim() : null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-200/80 p-4 rounded-2xl min-h-[9.5rem] hover:border-primary/30 transition-colors"
                >
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {item.metric}
                  </p>
                  <p className="text-primary text-lg sm:text-xl font-black leading-tight">{mainValue}</p>
                  {detail && (
                    <p className="text-slate-500 text-[11px] font-medium mt-1.5 leading-snug">{detail}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* APPLICATIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <PixtronArrows size={20} />
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Applications</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">
            What This Solution Inspects
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solution.applications.map((app, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="flex items-start gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 hover:border-slate-300 hover:bg-slate-100/60 transition-all duration-200"
              >
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{app}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* INDUSTRIES USED IN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Building2 className="text-primary" size={20} />
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Industries</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">
            Industries Using This Solution
          </h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
  {solution.industriesUsed.map((industry, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 hover:border-slate-300 hover:bg-slate-100/60 transition-all duration-200"
    >
      <div className="shrink-0 p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
        <PixtronArrows size={16} />
      </div>
      <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{industry}</span>
    </motion.div>
  ))}
</div>
        </motion.div>
      </section>

      {/* PRODUCTS USED */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <Boxes className="text-primary" size={20} />
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Products</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">
            Products Behind This Solution
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {usedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Link
                  to={`/products/${product.id}`}
                  className="group flex flex-col h-full bg-primary rounded-2xl p-6 hover:bg-primary/90 transition-all duration-300 border border-primary/70"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-secondary font-black text-xl">{product.name}</span>
                    <ArrowUpRight
                      size={18}
                      className="text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3">
                    {product.category}
                  </span>
                  <p className="text-white/85 text-sm leading-relaxed">{product.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CASE STUDIES */}
      {solution.caseStudies && solution.caseStudies.length > 0 && (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpenCheck className="text-primary" size={20} />
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Case Studies</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mb-8 tracking-tight">
            Proven In Production
          </h2>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {(solution.caseStudies ?? []).map((cs, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/50 flex flex-col"
              >
                <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
                  {cs.industry}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">{cs.title}</h3>

                <div className="mb-4">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{cs.challenge}</p>
                </div>
                <div className="mb-5">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Result</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{cs.result}</p>
                </div>

                <div className="mt-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                  <span className="text-slate-900 font-bold text-sm">{cs.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      )}

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary rounded-[2.5rem] p-10 md:p-14 text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black mb-3">Need This On Your Line?</h3>
            <p className="text-primary/80 text-base sm:text-lg font-medium">
              Get a free feasibility study for {solution.name.toLowerCase()} using your actual parts
              and inspection specs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
            >
              Request Feasibility Study
            </Link>
            <Link
              to="/solutions"
              className="border border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all"
            >
              View All Solutions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};