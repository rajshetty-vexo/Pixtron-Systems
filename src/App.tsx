import { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SeoMeta } from './components/SeoMeta';

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

const baseBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Pixtron Systems',
  image: '/favicon.svg',
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

export default function App() {
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePathname(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const pageConfig = useMemo(() => {
    switch (pathname) {
      case '/products':
        return {
          page: <ProductsPage />,
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
      case '/about':
        return {
          page: <AboutPage />,
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
          page: <ContactPage />,
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
      case '/':
      default:
        return {
          page: <HomePage />,
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
  }, [pathname]);

  return (
    <div className="min-h-screen font-sans">
      <SeoMeta
        title={pageConfig.title}
        description={pageConfig.description}
        pathname={pathname}
        keywords={pageConfig.keywords}
        structuredData={pageConfig.schema}
      />
      <Navbar />
      {pageConfig.page}
      <Footer />
    </div>
  );
}
