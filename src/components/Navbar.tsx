import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixtronArrows } from './PixtronArrows';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Products', href: '#products' },
    { name: 'Industries', href: '#industries' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-primary' : 'text-primary'}`}>Pixtron</span>
              <PixtronArrows size={20} className="mt-1" />
            </div>
            <span className={`text-sm font-medium -mt-1 ${isScrolled ? 'text-slate-600' : 'text-slate-700'}`}>Systems</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold hover:text-secondary transition-colors ${isScrolled ? 'text-slate-700' : 'text-slate-800'}`}
            >
              {link.name}
            </a>
          ))}
          <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
            Get a Quote
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-semibold text-slate-800 hover:text-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-primary text-white px-6 py-3 rounded-xl text-center font-bold">
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
