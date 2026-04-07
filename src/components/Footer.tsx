import React from 'react';
import { PixtronArrows } from './PixtronArrows';
import { PixtronLogo } from './PixtronLogo';
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-1 md:px-2 lg:px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="w-[240px] overflow-hidden">
              <PixtronLogo className="w-[280px] max-w-none -ml-[46px]" />
            </div>
            <p className="text-slate-600 leading-relaxed">
              Leading the future of automated machine vision inspection. Fast, accurate, and reliable solutions for global industries.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                    <PixtronArrows size={12} className="opacity-0 hover:opacity-100 transition-opacity" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-8">Products</h4>
            <ul className="space-y-4">
              {['Inspectra', 'Rapid', 'Codex', 'Opus', 'Panorama'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2">
                    <PixtronArrows size={12} className="opacity-0 hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-primary shrink-0" size={20} />
                <span className="text-slate-600">Head Office: Goa</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-primary shrink-0" size={20} />
                <span className="text-slate-600">+91 9637495512</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-primary shrink-0" size={20} />
                <span className="text-slate-600">projects@pixtronsystems.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            © 2026 Pixtron Systems. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-slate-500 text-sm hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-slate-500 text-sm hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
