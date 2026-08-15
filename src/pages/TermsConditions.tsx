import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Last updated: August 2026
          </p>
        </div>

        {/* TERMS CONTENT */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
          
          {/* Website Purpose */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Website Purpose
            </h2>
            <p>
              This website is provided for general information about Pixtron Systems and its machine vision systems, automated inspection solutions, optical hardware, and related software products.
            </p>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Product Information
            </h2>
            <p>
              Product images, specifications, system architecture, and descriptions are provided for general reference and may change without prior notice as we continuously innovate and upgrade our systems.
            </p>
          </section>

          {/* Availability */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Availability
            </h2>
            <p>
              Availability of products, custom inspection modules, components, and accessories may vary depending on stock, lead times, and supplier availability.
            </p>
          </section>

          {/* Proper Use */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Proper Use
            </h2>
            <p>
              Users agree not to misuse the website, attempt unauthorized access, or use the website and its technical information for unlawful purposes.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Intellectual Property
            </h2>
            <p>
              All content on this website, including logos, product images, text, brochures, software details, and graphics, is the property of Pixtron Systems and may not be copied, reproduced, or distributed without explicit written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Limitation of Liability
            </h2>
            <p>
              While we try to keep the information on this website accurate and up to date, Pixtron Systems does not guarantee that all information is free from errors or omissions.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-3">
              Governing Law
            </h2>
            <p>
              These terms are governed by the laws of India.
            </p>
          </section>

          {/* CONTACT US BOX */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm mt-10">
            <h3 className="text-xl font-bold text-primary mb-4">
              Contact Us
            </h3>
            
            <p className="font-semibold text-slate-800 mb-3">
              Pixtron Systems
            </p>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Email:</span>
                <a 
                  href="mailto:projects@pixtronsystems.com" 
                  className="text-primary hover:text-[#fbbb0d] font-medium underline transition-colors"
                >
                  projects@pixtronsystems.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Phone:</span>
                <a 
                  href="tel:+919146707884" 
                  className="text-primary hover:text-[#fbbb0d] font-medium underline transition-colors"
                >
                  +91 9146707884
                </a>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <MapPin className="text-[#fbbb0d] shrink-0" size={18} />
                <span className="font-medium text-slate-600">Head Office:</span>
                <span className="text-slate-700">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};