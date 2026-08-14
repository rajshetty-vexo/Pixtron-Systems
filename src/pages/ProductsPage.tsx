import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { productsData } from '../data/productsData';
import { PixtronArrows } from '../components/PixtronArrows';

export const ProductsPage: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Screen size check for enabling Framer Motion animation only on Desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll event listener to sync dots index in mobile horizontal slider
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth : 300;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCardIndex(index);
    }
  };

  // Card click par redirect logic
  const handleCardClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <main className="pt-28 sm:pt-32 pb-20 sm:pb-24 bg-slate-50 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-4">
          <PixtronArrows size={20} />
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Products</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6">
          Pixtron Inspection Suite
        </h1>
        <p className="text-slate-600 max-w-3xl text-base sm:text-lg">
          Explore the Pixtron portfolio built for speed, reliability, and actionable inspection insights.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HORIZONTAL SLIDER ON MOBILE / GRID ON DESKTOP */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:overflow-visible lg:pb-0"
        >
          {productsData.map((product, index) => {
            const isLastOddTile = productsData.length % 2 === 1 && index === productsData.length - 1;
            return (
              <motion.article
                key={product.id}
             
                initial={isDesktop ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={isDesktop ? { delay: index * 0.05 } : { duration: 0 }}
                whileHover={isDesktop ? { y: -6 } : {}}
                onClick={() => handleCardClick(product.id)}
                className={`bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/60 flex flex-col justify-between h-auto lg:h-full min-w-[86vw] sm:min-w-[420px] lg:min-w-0 snap-center cursor-pointer transition-all ${
                  isLastOddTile ? 'lg:col-span-2 lg:w-[calc(50%-1rem)] lg:mx-auto' : ''
                }`}
              >
                {/* TOP CONTENT WRAPPER */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <PixtronArrows size={18} />
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                      {product.category}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">{product.name}</h2>

                  <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

                  {/* Main Feature List */}
                  <ul className="space-y-2.5 mb-8">
                    {product.mainFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-slate-700 font-medium">
                        <PixtronArrows size={12} />
                        <span>{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BUTTONS CONTAINER LOCKED AT BOTTOM */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto pt-4">
                  <Link
                    to={`/products/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-primary text-white px-5 sm:px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all text-center shrink-0 whitespace-nowrap text-sm sm:text-base"
                  >
                    Explore Product
                  </Link>
                  <Link
                    to="/contact"
                    onClick={(e) => e.stopPropagation()}
                    className="border border-primary text-primary px-5 sm:px-6 py-3 rounded-xl font-bold hover:bg-primary/5 transition-all text-center shrink-0 whitespace-nowrap text-sm sm:text-base"
                  >
                    Contact Sales
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* MOBILE PAGINATION DOTS (BLUE DOTS) */}
        <div className="flex lg:hidden justify-center items-center gap-2 mt-4">
          {productsData.map((_, dotIndex) => (
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
      </section>
    </main>
  );
};