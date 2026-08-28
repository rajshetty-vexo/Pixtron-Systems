import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixtronArrows } from '../components/PixtronArrows';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { solutionsData } from '../data/Solutionsdata';
import { productsData } from '../data/productsData';

/**
 * Solutions LISTING page only.
 *
 * Route: /solutions
 * Each card's "Learn More" links to /solutions/:solutionId, which is handled
 * by the separate SolutionDetailPage.tsx component (register that as its own
 * route — see routing note at the bottom of this file). This page no longer
 * tries to render the detail view inline; that's what caused metrics/
 * applications/industries/products/case-studies to go missing earlier —
 * that inline branch only ever rendered the name + desc and nothing else.
 */

const productName = (id: string) => productsData.find((p) => p.id === id)?.name ?? id;

export const SolutionsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('All');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');

  // Support deep-linking a filter via ?industry=... or ?product=...
  useEffect(() => {
    const industryParam = searchParams.get('industry');
    const productParam = searchParams.get('product');
    if (industryParam) setSelectedIndustryFilter(industryParam);
    if (productParam) setSelectedProductFilter(productParam);
  }, [searchParams, location]);

  const industryOptions = [
    'All',
    ...Array.from(new Set(solutionsData.flatMap((s) => s.industriesUsed))).sort(),
  ];
  const productOptions = ['All', ...productsData.map((p) => p.name)];

  const filteredSolutions = solutionsData.filter((solution) => {
    const matchesIndustry =
      selectedIndustryFilter === 'All' ||
      solution.industriesUsed.some((ind) => ind.toLowerCase() === selectedIndustryFilter.toLowerCase());

    const matchesProduct =
      selectedProductFilter === 'All' ||
      solution.productsUsed.some((pid) => productName(pid).toLowerCase() === selectedProductFilter.toLowerCase());

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
          Application-ready inspection solutions built on the Pixtron platform — from carton seal
          integrity to serialization-grade code verification, engineered for your exact packaging
          and production format.
        </p>
      </section>

      {/* Filters Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Filter Solutions</h3>
              <p className="text-slate-400 text-xs">Filter solutions by industry or the product behind them</p>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
              Filter by Industry
            </span>
            <div className="flex sm:flex-wrap items-center gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0">
              {industryOptions.map((ind) => (
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

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
              Filter by Product
            </span>
            <div className="flex sm:flex-wrap items-center gap-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0">
              {productOptions.map((prod) => (
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
        {filteredSolutions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-lg shadow-slate-200/40 text-center max-w-xl mx-auto mb-16 sm:mb-20">
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Matching Solutions</h3>
            <p className="text-slate-500 text-sm mb-6">
              No solutions match the selected filter combination. Adjust your selections or click reset.
            </p>
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
              {filteredSolutions.map((solution, index) => {
                const Icon = solution.icon;
                return (
                  <motion.article
                    layout
                    key={solution.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: (index % 2) * 0.15, ease: 'easeOut' }}
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300 w-fit">
                        <Icon size={40} strokeWidth={1.75} />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{solution.name}</h2>
                      <p className="text-slate-600 leading-relaxed font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                        {solution.desc}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {solution.productsUsed.slice(0, 3).map((pid) => (
                          <span
                            key={pid}
                            className="bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                          >
                            {productName(pid)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/solutions/${solution.id}`}
                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors cursor-pointer"
                      >
                        Learn More
                        <PixtronArrows size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="bg-secondary rounded-[2.5rem] p-10 md:p-14 text-primary flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black mb-3">Deploying a New Line?</h3>
            <p className="text-primary/80 text-base sm:text-lg font-medium">
              Get a free feasibility study using your actual parts and inspection specs.
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
              to="/contact"
              className="border border-primary text-primary px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

/**
 * ROUTING NOTE — add this to your router config (e.g. App.tsx):
 *
 *   import { SolutionsPage } from './pages/SolutionsPage';
 *   import { SolutionDetailPage } from './pages/SolutionDetailPage';
 *   ...
 *   <Route path="/solutions" element={<SolutionsPage />} />
 *   <Route path="/solutions/:solutionId" element={<SolutionDetailPage />} />
 *
 * Both routes are separate — the old inline "if (solutionId)" branch inside
 * this file has been removed, so this file only ever renders the grid now.
 */