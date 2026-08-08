import { useEffect } from 'react';

interface SeoMetaProps {
  title: string;
  description: string;
  pathname: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown>;
  breadcrumbData?: Record<string, unknown>;
}

function upsertMetaByName(name: string, content: string): void {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function SeoMeta({
  title,
  description,
  pathname,
  keywords = '',
  image = '/og-image.png', // 👈 Fixed: OG Image fallback (Favicon vector is too small for social cards)
  type = 'website',
  structuredData,
  breadcrumbData,
}: SeoMetaProps) {
  
  // Serialize complex objects for safe useEffect dependencies
  const serializedSchema = structuredData ? JSON.stringify(structuredData) : null;
  const serializedBreadcrumbs = breadcrumbData ? JSON.stringify(breadcrumbData) : null;

  useEffect(() => {
    const absoluteUrl = new URL(pathname, window.location.origin).toString();
    const absoluteImage = new URL(image, window.location.origin).toString();

    // 1. Title & Primary Metas
    document.title = title;

    upsertMetaByName('description', description);
    if (keywords) {
      upsertMetaByName('keywords', keywords);
    }
    upsertMetaByName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertMetaByName('author', 'Pixtron Systems');

    // 2. OpenGraph Metas
    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:site_name', 'Pixtron Systems');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', absoluteUrl);
    upsertMetaByProperty('og:image', absoluteImage);

    // 3. Twitter Metas
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', absoluteImage);

    // 4. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteUrl);

    // 5. Dynamic Structured Data Schema (with Cleanup)
    let schema = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
    if (serializedSchema) {
      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'seo-structured-data';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }
      schema.textContent = serializedSchema;
    } else if (schema) {
      schema.remove(); // 👈 Removes stale schema on pages without structuredData
    }

    // 6. Dynamic Breadcrumb Schema (with Cleanup)
    let breadcrumbSchema = document.getElementById('seo-breadcrumb-data') as HTMLScriptElement | null;
    if (serializedBreadcrumbs) {
      if (!breadcrumbSchema) {
        breadcrumbSchema = document.createElement('script');
        breadcrumbSchema.id = 'seo-breadcrumb-data';
        breadcrumbSchema.type = 'application/ld+json';
        document.head.appendChild(breadcrumbSchema);
      }
      breadcrumbSchema.textContent = serializedBreadcrumbs;
    } else if (breadcrumbSchema) {
      breadcrumbSchema.remove(); // 👈 Removes stale breadcrumb data
    }

  }, [title, description, pathname, keywords, image, type, serializedSchema, serializedBreadcrumbs]);

  return null;
}