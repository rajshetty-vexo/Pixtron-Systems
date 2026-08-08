import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PixtronLogo } from './PixtronLogo';
import { Menu, X, ChevronDown } from 'lucide-react';

// Dropdown Items Data
const productsList = [
  { label: 'Inspectra', id: 'inspectra' },
  { label: 'Rapid', id: 'rapid' },
  { label: 'Codex', id: 'codex' },
  { label: 'Opus', id: 'opus' },
  { label: 'Panorama', id: 'panorama' },
  { label: 'Blister Inspection', id: 'blister-inspection-system' },
];

const solutionsList = [
  'Automotive',
  'Electronics',
  'Pharmaceuticals',
  'Food & Beverage',
  'Manufacturing',
  'Logistics',
];

const companyList = [
  { label: 'About Us', path: '/company#about' },
  { label: 'Careers', path: '/company#careers' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop Hover States
  const [activeDropdown, setActiveDropdown] = useState<'products' | 'solutions' | 'company'| null>(null);

  // Mobile Accordion States
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
<nav 
  className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[calc(100%-2.5rem)] max-w-6xl rounded-full border border-slate-200/80 px-6 py-3 ${
    isScrolled 
      ? 'bg-white/95 backdrop-blur-md shadow-xl shadow-slate-900/10 border-slate-300/80' 
      : 'bg-white/80 backdrop-blur-md shadow-lg shadow-slate-900/5'
  }`}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
    
    {/* LOGO - Fixed Height (Zero Layout Shift) */}
    <Link to="/" className="flex items-center shrink-0">
      <PixtronLogo className="h-9 sm:h-10" />
    </Link>
        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          
          <Link to="/" className="text-sm font-semibold text-slate-800 hover:text-primary transition-colors">
            Home
          </Link>

       {/* 1. PRODUCTS DROPDOWN */}
<div 
  className="relative"
  onMouseEnter={() => setActiveDropdown('products')}
  onMouseLeave={() => setActiveDropdown(null)}
>
  <Link 
    to="/products" 
    className="text-sm font-semibold text-slate-800 hover:text-primary flex items-center gap-1 py-2 transition-colors"
  >
    Products
    <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180 text-primary' : 'text-slate-500'}`} />
  </Link>

  <AnimatePresence>
    {activeDropdown === 'products' && (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 350 }}
        /* CENTER ALIGNMENT FIX */
        className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2.5 mt-3 z-50 overflow-hidden"
      >
        {/* TOP POINTER TRIANGLE */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />

        <div className="px-3 pt-1.5 pb-2 mb-1 border-b border-slate-100/80">
          <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">Vision Systems</p>
        </div>

        <div className="flex flex-col gap-0.5 relative z-10">
          {productsList.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              onClick={() => setActiveDropdown(null)}
              className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
            >
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                {product.label}
              </span>
              {/* HORIZONTAL CURIOSITY ARROW */}
              <span className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 font-bold text-xl leading-none">
                →
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* 2. SOLUTIONS DROPDOWN */}
<div 
  className="relative"
  onMouseEnter={() => setActiveDropdown('solutions')}
  onMouseLeave={() => setActiveDropdown(null)}
>
  <Link 
    to="/solutions" 
    className="text-sm font-semibold text-slate-800 hover:text-primary flex items-center gap-1 py-2 transition-colors"
  >
    Solutions
    <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180 text-primary' : 'text-slate-500'}`} />
  </Link>

  <AnimatePresence>
    {activeDropdown === 'solutions' && (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ type: 'spring', damping: 22, stiffness: 350 }}
        /* CENTER ALIGNMENT FIX */
        className="absolute top-full left-1/2 -translate-x-1/2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2.5 mt-3 z-50 overflow-hidden"
      >
        {/* TOP POINTER TRIANGLE */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />

        <div className="px-3 pt-1.5 pb-2 mb-1 border-b border-slate-100/80">
          <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">Industries</p>
        </div>

        <div className="flex flex-col gap-0.5 relative z-10">
          {solutionsList.map((sol) => (
            <Link
              key={sol}
              to={`/solutions?industry=${encodeURIComponent(sol)}`}
              onClick={() => setActiveDropdown(null)}
              className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
            >
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                {sol}
              </span>
              {/* HORIZONTAL CURIOSITY ARROW */}
              <span className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 font-bold text-xl leading-none">
                →
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* 3. COMPANY DROPDOWN (Replaced plain About) */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('company')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link 
              to="/about" 
              className="text-sm font-semibold text-slate-800 hover:text-primary flex items-center gap-1 py-2 transition-colors"
            >
              Company
              <ChevronDown size={15} className={`transition-transform duration-200 ${activeDropdown === 'company' ? 'rotate-180 text-primary' : 'text-slate-500'}`} />
            </Link>

            <AnimatePresence>
              {activeDropdown === 'company' && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2.5 mt-3 z-50 overflow-hidden"
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-t border-l border-slate-100" />

                  <div className="px-3 pt-1.5 pb-2 mb-1 border-b border-slate-100/80">
                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-wider">Organization</p>
                  </div>

                  <div className="flex flex-col gap-0.5 relative z-10">
                    {companyList.map((item) => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setActiveDropdown(null)}
                        className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                      >
                        <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                          {item.label}
                        </span>
                        <span className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 font-bold text-xl leading-none">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <Link to="/company#about" className="text-sm font-semibold text-slate-800 hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/company#careers" className="text-sm font-semibold text-slate-800 hover:text-primary transition-colors">
            Contact
          </Link> */}

          {/* CTA BUTTON */}
          <Link to="/contact" className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/20">
            Get Quote
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON */}
        <button 
          className="md:hidden text-primary p-1 focus:outline-none" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
      <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="md:hidden absolute top-full left-0 right-0 mt-3 bg-white/100 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-5"
    >
            <div className="max-w-7xl mx-auto px-5 py-2 flex flex-col gap-3">
              
              <Link
                to="/"
                className="text-base font-semibold text-slate-800 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

            {/* MOBILE PRODUCTS ACCORDION */}
<div className="border-b border-slate-100 pb-2">
  <div className="flex items-center justify-between py-1">
    <Link
      to="/products"
      className="text-base font-semibold text-slate-800 hover:text-primary"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      Products
    </Link>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setMobileProductsOpen(!mobileProductsOpen);
      }}
      className="p-1 text-slate-600 hover:text-primary focus:outline-none"
      aria-label="Toggle Products Submenu"
    >
      <ChevronDown 
        size={20} 
        className={`transition-transform duration-300 ${mobileProductsOpen ? 'rotate-180 text-primary' : ''}`} 
      />
    </button>
  </div>
  
  <AnimatePresence initial={false}>
    {mobileProductsOpen && (
      <motion.div
        key="mobile-products"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pl-4 pt-2 flex flex-col gap-2 overflow-hidden"
      >
        {productsList.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 hover:text-primary py-1"
          >
            {product.label}
          </Link>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* MOBILE SOLUTIONS ACCORDION */}
<div className="border-b border-slate-100 pb-2">
  <div className="flex items-center justify-between py-1">
    <Link
      to="/solutions"
      className="text-base font-semibold text-slate-800 hover:text-primary"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      Solutions
    </Link>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setMobileSolutionsOpen(!mobileSolutionsOpen);
      }}
      className="p-1 text-slate-600 hover:text-primary focus:outline-none"
      aria-label="Toggle Solutions Submenu"
    >
      <ChevronDown 
        size={20} 
        className={`transition-transform duration-300 ${mobileSolutionsOpen ? 'rotate-180 text-primary' : ''}`} 
      />
    </button>
  </div>

  <AnimatePresence initial={false}>
    {mobileSolutionsOpen && (
      <motion.div
        key="mobile-solutions"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pl-4 pt-2 flex flex-col gap-2 overflow-hidden"
      >
        {solutionsList.map((sol) => (
          <Link
            key={sol}
            to={`/solutions?industry=${encodeURIComponent(sol)}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 hover:text-primary py-1"
          >
            {sol}
          </Link>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>

{/* MOBILE COMPANY ACCORDION */}
<div className="border-b border-slate-100 pb-2">
  <div className="flex items-center justify-between py-1">
    <Link
      to="/company"
      className="text-base font-semibold text-slate-800 hover:text-primary"
      onClick={() => setIsMobileMenuOpen(false)}
    >
      Company
    </Link>

    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setMobileCompanyOpen(!mobileCompanyOpen);
      }}
      className="p-1 text-slate-600 hover:text-primary focus:outline-none"
      aria-label="Toggle Company Submenu"
    >
      <ChevronDown 
        size={20} 
        className={`transition-transform duration-300 ${mobileCompanyOpen ? 'rotate-180 text-primary' : ''}`} 
      />
    </button>
  </div>

  <AnimatePresence initial={false}>
    {mobileCompanyOpen && (
      <motion.div
        key="mobile-company"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pl-4 pt-2 flex flex-col gap-2 overflow-hidden"
      >
        {companyList.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-medium text-slate-600 hover:text-primary py-1"
          >
            {item.label}
          </Link>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>

<Link
  to="/contact"
  className="text-base font-semibold text-slate-800 py-1"
  onClick={() => setIsMobileMenuOpen(false)}
>
  Contact
</Link>

<Link 
  to="/contact" 
  onClick={() => setIsMobileMenuOpen(false)} 
  className="bg-primary text-white px-6 py-3 rounded-xl text-center font-bold mt-2 shadow-md"
>
  Get Quote
</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};