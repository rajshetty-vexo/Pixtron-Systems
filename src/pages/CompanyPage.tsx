import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { AboutSection } from '../components/AboutSection'; 
import { CareersSection } from '../components/CareersSection';
import { PartnersSection } from '../components/PartnersSection';
// import  CodexAnimationProps  from '../components/CodexAnimation';
export const CompanyPage: React.FC = () => {
  const { hash } = useLocation();


  useEffect(() => {
    if (hash) {
     
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

        {/* 2. PARTNERS SECTION */}
      {/* <section id="Codex" className="scroll-mt-24 border-t border-slate-200/80">
        <CodexAnimationProps/>
      </section> */}

      <section id="partners" className="scroll-mt-24 border-t border-slate-200/80">
        <PartnersSection />
      </section>


      {/* 3. CAREERS SECTION */}
      <section id="careers" className="scroll-mt-24 border-t border-slate-200/80">
        <CareersSection />
      </section>

    
    </main>
  );
};