import { useEffect } from 'react';

interface SeoMetaProps {
  title: string;
  description: string;
  pathname: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown>;
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
  image = '/favicon.svg',
  type = 'website',
  structuredData,
}: SeoMetaProps) {
  useEffect(() => {
    const absoluteUrl = new URL(pathname, window.location.origin).toString();
    const absoluteImage = new URL(image, window.location.origin).toString();

    document.title = title;

    upsertMetaByName('description', description);
    upsertMetaByName('keywords', keywords);
    upsertMetaByName('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    upsertMetaByName('author', 'Pixtron Systems');

    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:site_name', 'Pixtron Systems');
    upsertMetaByProperty('og:title', title);
    upsertMetaByProperty('og:description', description);
    upsertMetaByProperty('og:url', absoluteUrl);
    upsertMetaByProperty('og:image', absoluteImage);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', title);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', absoluteImage);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteUrl);

    if (structuredData) {
      let schema = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'seo-structured-data';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, pathname, keywords, image, type, structuredData]);

  return null;
}
