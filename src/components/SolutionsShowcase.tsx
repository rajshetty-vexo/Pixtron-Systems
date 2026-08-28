import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { PixtronArrows } from './PixtronArrows';
import { solutionsData } from '../data/Solutionsdata';
import { ArrowRight } from 'lucide-react';

// Curated homepage subset — no filters, no metrics, just the headline solutions
const featuredSolutionIds = [
  'tetra-pack-inspection',
  'cable-wire-inspection',
  'vial-counting-inspection',
  'blister-inspection',
  '1d-2d-code-pharma-ocr-inspection',
  'datamatrix-ocr-verification',
];

const featuredSolutions = solutionsData.filter((s) => featuredSolutionIds.includes(s.id));

// Only fire the left/right slide-in on desktop (matches the md: grid breakpoint below).
// On mobile/tablet, the section is a horizontal-scroll carousel, so an extra
// sideways slide-in fights with the user's own scroll gesture — disable it there.
function useIsDesktop(breakpoint = 768) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isDesktop;
}

export const SolutionsShowcase: React.FC = () => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  return (
    <section id="solutions" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <PixtronArrows size={22} />
            <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm">
              Solutions
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Application-Ready Solutions
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            From carton seal integrity to serialization-grade code verification — built for your exact line.
          </p>
        </div>

        {/* Horizontal scroll slider on mobile/tablet / Grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8 md:overflow-visible md:pb-0">
          {featuredSolutions.map((solution, index) => {
            const Icon = solution.icon;
            const fromLeft = index % 2 === 0;

            return (
              <motion.div
                key={solution.id}
                initial={
                  isDesktop
                    ? { opacity: 0, x: fromLeft ? -80 : 80, y: 0 }
                    : { opacity: 0, x: 0, y: 20 }
                }
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: (index % 3) * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/solutions/${solution.id}`)}
                className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 h-64 sm:h-72 w-[82%] md:w-auto md:min-w-0 snap-center shrink-0 cursor-pointer"
              >
                {/* Glow ring — the "explode/highlight" moment on hover/tap */}
                <motion.div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/25" />

                <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1.5">
                      {solution.name}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                      {solution.desc}
                    </p>

                    <div className="flex items-center gap-2 font-bold text-sm text-white pt-2">
                      <span>Learn More</span>
                      <div className="transition-transform duration-300 group-hover:translate-x-1">
                        <PixtronArrows variant="white" size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10 sm:mt-14">
          <Link
            to="/solutions"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            View All Solutions
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};