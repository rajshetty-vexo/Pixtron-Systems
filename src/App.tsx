import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { SolutionPage } from './pages/SolutionPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CompanyPage } from './pages/CompanyPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsConditions } from "./pages/TermsConditions";
import { SeoMeta } from './components/SeoMeta';
import { ScrollToTop } from './components/ScrollToTop';
import { CookieConsent } from './components/CookieConsent';

const baseBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Pixtron Systems',
  image: '/favicon.png',
  url: 'https://www.pixtronsystems.com/',
  email: 'projects@pixtronsystems.com',
  telephone: '+91 9146707884',
  areaServed: 'IN',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressCountry: 'IN',
  },
  sameAs: [],
};

// Helper hook or component to get meta based on route
function getPageConfig(pathname: string) {
  switch (pathname) {
    case '/products':
      return {
        title: 'Pixtron Inspection Suite | Machine Vision Products in India',
        description:
          'Explore Pixtron Inspection Suite: dot print inspection, continuous flow production line inspection, OCR/OCV, code reading, geometry and 360-degree inspection systems.',
        keywords:
          'machine vision products India, computer vision inspection systems, dot print inspection, OCR OCV inspection, industrial vision system provider India',
        schema: {
          ...baseBusinessSchema,
          '@type': 'CollectionPage',
          name: 'Pixtron Inspection Suite',
        },
      };
    case '/solutions':
      return {
        title: 'Industrial Machine Vision Solutions | Pixtron Systems',
        description:
          'Automated optical inspection, surface defect detection, packaging verification, and custom AI computer vision solutions for manufacturing.',
        keywords:
          'machine vision solutions, automated optical inspection, surface defect detection, industrial AI quality control',
        schema: {
          ...baseBusinessSchema,
          '@type': 'Service',
          name: 'Computer Vision Solutions',
        },
      };
    case '/company':
    case '/about':
      return {
        title: 'About Pixtron Systems | Industrial Computer Vision Company',
        description:
          'Pixtron Systems is an India-based machine vision and computer vision solutions provider delivering high-speed inspection systems for modern manufacturing lines.',
        keywords:
          'about Pixtron Systems, machine vision company India, computer vision automation, industrial quality inspection company',
        schema: {
          ...baseBusinessSchema,
          '@type': 'AboutPage',
          name: 'About Pixtron Systems',
        },
      };
    case '/contact':
      return {
        title: 'Contact Pixtron Systems | Vision System Provider in India',
        description:
          'Contact Pixtron Systems for machine vision and computer vision inspection solutions. Head Office Pune, R&D Goa. Reach us for consultation and deployment support.',
        keywords:
          'contact Pixtron Systems, vision system provider India, machine vision integrator India, computer vision inspection support',
        schema: {
          ...baseBusinessSchema,
          openingHours: 'Mo-Sa 10:00-16:00',
        },
      };
    case '/privacy-policy':
      return {
        title: 'Privacy Policy | Pixtron Systems',
        description: 'Read the privacy policy and data protection terms for Pixtron Systems.',
        keywords: 'privacy policy, Pixtron Systems privacy',
        schema: baseBusinessSchema,
      };
    case '/terms-conditions':
      return {
        title: 'Terms & Conditions | Pixtron Systems',
        description: 'Review the terms and conditions for using Pixtron Systems services and products.',
        keywords: 'terms and conditions, Pixtron Systems terms',
        schema: baseBusinessSchema,
      };
    case '/':
    default:
      return {
        title: 'Pixtron Systems | Machine Vision and Computer Vision Solutions India',
        description:
          'Pixtron Systems delivers high-speed machine vision and computer vision inspection solutions including OCR/OCV, dot print inspection, code reading, and 360-degree quality checks.',
        keywords:
          'machine vision systems India, computer vision solutions India, vision inspection systems, quality inspection automation, vision system provider in India',
        schema: {
          ...baseBusinessSchema,
          '@type': 'WebSite',
          name: 'Pixtron Systems',
        },
      };
  }
}

export default function App() {
  const location = useLocation();
  const pageConfig = getPageConfig(location.pathname);

  return (
    <div className="min-h-screen font-sans flex flex-col relative">
      <ScrollToTop />
      <SeoMeta
        title={pageConfig.title}
        description={pageConfig.description}
        pathname={location.pathname}
        keywords={pageConfig.keywords}
        structuredData={pageConfig.schema}
      />
      <Navbar />
      <CookieConsent />
      <div className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/solutions" element={<SolutionPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          
          {/* Wildcard Route MUST be at the bottom */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}