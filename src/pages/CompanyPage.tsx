import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Tumhare already created components import ho jayenge
import { AboutSection } from '../components/AboutSection'; 
import { CareersSection } from '../components/CareersSection';

export const CompanyPage: React.FC = () => {
  const { hash } = useLocation();

  // Redirect hoke specific section par smooth scroll karne ke liye
  useEffect(() => {
    if (hash) {
      // Small timeout to ensure DOM render ho chuka hai
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <main className="pt-20 bg-slate-50 min-h-screen">
      
      {/* 1. ABOUT SECTION */}
      <section id="about" className="scroll-mt-24">
        <AboutSection />
      </section>

      {/* 2. CAREERS SECTION */}
      <section id="careers" className="scroll-mt-24 border-t border-slate-200/80">
        <CareersSection />
      </section>

    </main>
  );
};