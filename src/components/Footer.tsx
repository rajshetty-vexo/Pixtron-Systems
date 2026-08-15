import React from 'react';
import { Link } from 'react-router-dom';
import { PixtronArrows } from './PixtronArrows';
import { PixtronLogo } from './PixtronLogo';
import { Mail, Phone, MapPin, Linkedin, Youtube, Instagram,Facebook} from 'lucide-react';

const FOOTER_LOGO_MARGIN_LEFT = 0;

export const Footer: React.FC = () => {
  // Reusable Social Icons Component
  const SocialLinks = () => (
    <div className="flex items-center gap-3">
      <a 
        href="https://www.linkedin.com/in/pixtron-systems-5165aa427/"
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#fbbb0d] hover:text-slate-900 transition-all"
        aria-label="LinkedIn"
      >
        <Linkedin size={18} />
      </a>
       <a href="https://x.com/Pixtronsystems"  target="_blank" rel="noopener noreferrer" 
         className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#fbbb0d] hover:text-slate-900 transition-all"  aria-label="X (formerly Twitter)">
           <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
           <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
           </svg>
            </a>
          <a 
        href="https://www.facebook.com/people/Pixtron-Systems/61592436106112/"
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#fbbb0d] hover:text-slate-900 transition-all"
        aria-label="Facebook"
      >
         <Facebook size={18} />
      </a>
      <a 
        href="https://www.youtube.com/@PixtronSystems" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#fbbb0d] hover:text-slate-900 transition-all"
        aria-label="YouTube"
      >
        <Youtube size={18} />
      </a>
      
    </div>
  );

  return (
    <footer className="bg-primary text-white border-t border-primary/20 pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID LAYOUT: Mobile me 2 Columns (`grid-cols-2`), Desktop me 5 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 lg:gap-10 mb-8 sm:mb-12">
          
          {/* BRAND / LOGO COLUMN - Mobile: Full Width (`col-span-2`), Desktop: Single Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4 sm:gap-6 items-start">
            <Link
              to="/"
              className="inline-block"
              style={FOOTER_LOGO_MARGIN_LEFT !== 0 ? { marginLeft: `${FOOTER_LOGO_MARGIN_LEFT}px` } : undefined}
            >
              <PixtronLogo className="h-12 sm:h-14 w-auto" variant="white" />
            </Link>
            <p className="text-white/80 leading-relaxed text-sm max-w-sm lg:max-w-none">
              Leading the future of automated machine vision inspection. Fast, accurate, and reliable solutions for global industries.
            </p>
            
            {/* Desktop Only Social Media Links */}
            <div className="hidden lg:block">
              <SocialLinks />
            </div>
          </div>

          {/* 1. QUICK LINKS COLUMN */}
          {/* <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-6 border-b border-white/10 pb-2">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Solutions', to: '/solutions' },
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.to} 
                    className="group text-white/80 hover:text-[#fbbb0d] transition-colors flex items-center gap-1.5 sm:gap-2"
                  >
                    <PixtronArrows size={10} variant="white" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* 2. PRODUCTS COLUMN */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-6 border-b border-white/10 pb-2">Products</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              {[
                { label: 'Inspectra', id: 'inspectra' },
                { label: 'Rapid', id: 'rapid' },
                { label: 'Codex', id: 'codex' },
                { label: 'Opus', id: 'opus' },
                { label: 'Panorama', id: 'panorama' },
                { label: 'Blister Inspection', id: 'blister-inspection-system' },
              ].map((product) => (
                <li key={product.id}>
                  <Link 
                    to={`/products/${product.id}`} 
                    className="group text-white/80 hover:text-[#fbbb0d] transition-colors flex items-center gap-1.5 sm:gap-2"
                  >
                    <PixtronArrows size={10} variant="white" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span className="truncate">{product.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SOLUTIONS COLUMN */}
          <div className="col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-6 border-b border-white/10 pb-2">Solutions</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
              {[
                { name: 'Automotive' },
                { name: 'Electronics' },
                { name: 'Pharmaceuticals' },
                { name: 'Food & Beverage' },
                { name: 'Manufacturing' },
                { name: 'Logistics' },
              ].map((sol) => (
                <li key={sol.name}>
                  <Link 
                    to={`/solutions?industry=${encodeURIComponent(sol.name)}`} 
                    className="group text-white/80 hover:text-[#fbbb0d] transition-colors flex items-center gap-1.5 sm:gap-2"
                  >
                    <PixtronArrows size={10} variant="white" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    <span>{sol.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. COMPANY COLUMN (NEWLY ADDED) */}
<div className="col-span-1">
  <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-6 border-b border-white/10 pb-2">
    Company
  </h4>
  <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
    <li>
      <Link 
        to="/company#about" 
        className="group text-white/80 hover:text-[#fbbb0d] transition-colors flex items-center gap-1.5 sm:gap-2"
      >
        <PixtronArrows size={10} variant="white" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        <span>About Us</span>
      </Link>
    </li>
    <li>
      <Link 
        to="/company#careers" 
        className="group text-white/80 hover:text-[#fbbb0d] transition-colors flex items-center gap-1.5 sm:gap-2"
      >
        <PixtronArrows size={10} variant="white" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        <span>Careers</span>
      </Link>
    </li>
  </ul>
</div>

{/* 4. CONTACT US COLUMN (Mobile me full width `col-span-2`, Desktop me 1 column `lg:col-span-1`) */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-between pt-2 lg:pt-0">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-6 border-b border-white/10 pb-2">
                Contact Us
              </h4>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="text-[#fbbb0d] shrink-0 mt-0.5" size={15} />
                  <span className="text-white/80 text-sm sm:text-sm ">Head Office: Pune</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="text-[#fbbb0d] shrink-0 mt-0.5" size={15} />
                  <span className="text-white/80 text-sm sm:text-sm ">R&amp;D: Goa</span>
                </li>
                
                {/* PHONE LINK */}
                <li className="flex items-center gap-2">
                  <Phone className="text-[#fbbb0d] shrink-0 " size={15} />
                  <a 
                    href="tel:+919146707884" 
                    className="text-white/80 hover:text-[#fbbb0d] hover:underline transition-colors text-sm sm:text-sm"
                  >
                    +91 9146707884
                  </a>
                </li>

                {/* EMAIL LINK */}
                <li className="flex items-center gap-2">
                  <Mail className="text-[#fbbb0d] shrink-0" size={15} />
                  <a 
                    href="mailto:projects@pixtronsystems.com" 
                    className="text-white/80 hover:text-[#fbbb0d] hover:underline transition-colors text-sm sm:text-sm"
                  >
                    projects@pixtronsystems.com
                  </a>
                </li>
              </ul>
            </div>

  {/* Mobile Social Links */}
  <div className="mt-4 lg:hidden">
    <SocialLinks />
  </div>
</div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL SECTION */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-xs sm:text-sm text-center md:text-left">
            © 2026 Pixtron Systems. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs sm:text-sm">
            <Link to="/privacy-policy" className="text-white/60 hover:text-[#fbbb0d] transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="text-white/60 hover:text-[#fbbb0d] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};