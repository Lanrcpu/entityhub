/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessInfo, ThemeConfig, ProductItem, ServiceItem, FAQItem } from '../types';

/**
 * Format hours for display
 */
function formatHours(open: string, close: string, closed: boolean): string {
  if (closed) return 'Closed';
  return `${open} - ${close}`;
}

/**
 * Map typography options to Google Fonts imports
 */
function getFontImport(typography: string): string {
  switch (typography) {
    case 'space-grotesk':
      return `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');`;
    case 'playfair':
      return `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500&display=swap');`;
    case 'mono':
      return `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500&display=swap');`;
    case 'inter':
    default:
      return `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');`;
  }
}

/**
 * Map typography choices to CSS variables
 */
function getFontFamilyVariables(typography: string): string {
  switch (typography) {
    case 'space-grotesk':
      return `
  --font-display: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
`;
    case 'playfair':
      return `
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
`;
    case 'mono':
      return `
  --font-display: 'JetBrains Mono', monospace;
  --font-body: 'JetBrains Mono', monospace;
`;
    case 'inter':
    default:
      return `
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
`;
  }
}

/**
 * Generate Linked JSON-LD Graph containing the absolute technical identity of the business
 */
export function generateGraphJsonLd(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  const logoUrl = info.logo.startsWith('http') ? info.logo : `${canonical}/favicon.svg`;

  const addressObj = {
    '@type': 'PostalAddress',
    'streetAddress': info.address.street,
    'addressLocality': info.address.city,
    'addressRegion': info.address.state,
    'postalCode': info.address.postalCode,
    'addressCountry': info.address.country || 'US'
  };

  const geoObj = info.coordinates.latitude && info.coordinates.longitude ? {
    '@type': 'GeoCoordinates',
    'latitude': info.coordinates.latitude,
    'longitude': info.coordinates.longitude
  } : undefined;

  const openingHoursSpecification = info.openingHours.map(oh => ({
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': oh.day,
    'opens': oh.closed ? '00:00' : oh.open,
    'closes': oh.closed ? '00:00' : oh.close,
    'closed': oh.closed ? true : undefined
  }));

  const contactPoint: any[] = [
    {
      '@type': 'ContactPoint',
      'telephone': info.phone,
      'contactType': 'customer service',
      'email': info.email,
      'availableLanguage': ['English']
    }
  ];

  if (info.phone2) {
    contactPoint.push({
      '@type': 'ContactPoint',
      'telephone': info.phone2,
      'contactType': 'alternative support',
      'email': info.email,
      'availableLanguage': ['English']
    });
  }

  const sameAs = [
    info.googleBusinessProfileUrl,
    info.googleMapsUrl,
    info.socials.facebook,
    info.socials.twitter,
    info.socials.instagram,
    info.socials.linkedin,
    info.socials.youtube
  ].filter(Boolean);

  const serviceAreaNodes = (info.serviceArea || [])
    .filter(Boolean)
    .map(area => ({
      '@type': 'AdministrativeArea',
      'name': area
    }));

  const reviewNodes = (info.reviews || [])
    // Only include Google reviews and limit to the most recent 5 (as displayed on Google Business)
    .filter(r => r && r.date && r.source === 'Google')
    .map(r => ({
      '@type': 'Review',
      'author': { '@type': 'Person', 'name': r.reviewer },
      'datePublished': r.date,
      'reviewBody': r.review,
      'reviewRating': { '@type': 'Rating', 'ratingValue': r.rating },
      ...(r.source ? { 'publisher': { '@type': 'Organization', 'name': r.source } } : {})
    }))
    .sort((a: any, b: any) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime())
    .slice(0, 5);

  const aggregateRating = reviewNodes.length > 0 ? {
    '@type': 'AggregateRating',
    'ratingValue': (info.reviews!.reduce((s, r) => s + (r.rating || 0), 0) / reviewNodes.length).toFixed(2),
    'reviewCount': reviewNodes.length
  } : undefined;

  const localBusinessNode = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${canonical}/#local-business`,
    'name': info.name,
    'image': info.images && info.images.length > 0 ? info.images : logoUrl,
    'logo': logoUrl,
    'url': canonical,
    'telephone': info.phone2 ? [info.phone, info.phone2] : info.phone,
    'email': info.email,
    'description': info.description,
    'address': addressObj,
    'geo': geoObj,
    'openingHoursSpecification': openingHoursSpecification,
    'contactPoint': contactPoint.length === 1 ? contactPoint[0] : contactPoint,
    'sameAs': sameAs,
    'priceRange': '$$',
    'knowsAbout': info.secondaryCategory ? [info.category, info.secondaryCategory] : info.category,
    ...(serviceAreaNodes.length ? { serviceArea: serviceAreaNodes } : {}),
    ...(reviewNodes.length ? { aggregateRating: aggregateRating, review: reviewNodes } : {})
  };

  const organizationNode = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${canonical}/#organization`,
    'name': info.name,
    'url': canonical,
    'logo': logoUrl,
    'sameAs': sameAs,
    'contactPoint': contactPoint.length === 1 ? contactPoint[0] : contactPoint,
    ...(serviceAreaNodes.length ? { serviceArea: serviceAreaNodes } : {})
  };

  const websiteNode = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonical}/#website`,
    'name': info.name,
    'url': canonical,
    'publisher': {
      '@id': `${canonical}/#organization`
    }
  };

  const webpageNode = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}/#webpage`,
    'url': canonical,
    'name': `${info.name} - ${info.category}`,
    'description': info.description,
    'isPartOf': {
      '@id': `${canonical}/#website`
    },
    'about': {
      '@id': `${canonical}/#local-business`
    }
  };

  const breadcrumbNode = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonical}/#breadcrumb`,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': canonical
      }
    ]
  };

  const servicesOffers = info.services.map((srv, idx) => ({
    '@type': 'Offer',
    'itemOffered': {
      '@type': 'Service',
      'name': srv.name,
      'description': srv.description,
      'category': srv.category
    },
    'price': srv.price.replace(/[^0-9.]/g, '') || undefined,
    'priceCurrency': srv.price ? 'USD' : undefined,
    'url': srv.ctaUrl || undefined,
    'name': srv.ctaLabel || undefined
  }));

  const productsOffers = info.products.map((prd, idx) => ({
    '@type': 'Offer',
    'itemOffered': {
      '@type': 'Product',
      'name': prd.name,
      'description': prd.description,
      'category': prd.category,
      'image': prd.image
    },
    'price': prd.price.replace(/[^0-9.]/g, '') || undefined,
    'priceCurrency': prd.price ? 'USD' : undefined,
    'url': prd.ctaUrl || prd.purchaseUrl || undefined,
    'name': prd.ctaLabel || undefined
  }));

  const offerCatalogNode = (servicesOffers.length > 0 || productsOffers.length > 0) ? {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    '@id': `${canonical}/#catalog`,
    'name': `${info.name} Services & Products Catalog`,
    'itemListElement': [
      ...(servicesOffers.length > 0 ? [{
        '@type': 'OfferCatalog',
        'name': 'Services Offered',
        'itemListElement': servicesOffers
      }] : []),
      ...(productsOffers.length > 0 ? [{
        '@type': 'OfferCatalog',
        'name': 'Products Catalog',
        'itemListElement': productsOffers
      }] : [])
    ]
  } : undefined;

  const faqNode = info.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonical}/#faq`,
    'mainEntity': info.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : undefined;

  const graph = [
    localBusinessNode,
    organizationNode,
    websiteNode,
    webpageNode,
    breadcrumbNode
  ];

  if (offerCatalogNode) graph.push(offerCatalogNode as any);
  if (faqNode) graph.push(faqNode as any);

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  }, null, 2);
}

/**
 * Generate CSS corresponding to chosen theme config and typography
 */
export function generateStyleCss(info: BusinessInfo): string {
  const fontImport = getFontImport(info.typography);
  const fontVars = getFontFamilyVariables(info.typography);
  const { style, primaryColor, secondaryColor, bgColor, textColor } = info.theme;

  let themeStyles = '';

  if (style === 'minimal') {
    themeStyles = `
  --radius: 8px;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
  --border: 1px solid rgba(228, 228, 231, 0.8);
  --card-bg: #ffffff;
  --header-bg: rgba(255, 255, 255, 0.8);
  --section-padding: 5rem 1.5rem;
  --button-hover-transform: translateY(-1px);
`;
  } else if (style === 'warm') {
    themeStyles = `
  --radius: 20px;
  --shadow: 0 10px 25px -5px rgba(124, 45, 18, 0.05);
  --border: 1px solid #f0eae1;
  --card-bg: #fefdfb;
  --header-bg: rgba(253, 251, 247, 0.85);
  --section-padding: 6rem 1.5rem;
  --button-hover-transform: scale(1.02);
`;
  } else if (style === 'corporate') {
    themeStyles = `
  --radius: 4px;
  --shadow: 0 1px 3px rgba(0,0,0,0.05), 0 10px 15px -5px rgba(0,0,0,0.03);
  --border: 1px solid #e5e7eb;
  --card-bg: #ffffff;
  --header-bg: #ffffff;
  --section-padding: 4.5rem 2rem;
  --button-hover-transform: none;
`;
  } else if (style === 'mono') {
    themeStyles = `
  --radius: 0px;
  --shadow: none;
  --border: 1px solid #000000;
  --card-bg: #ffffff;
  --header-bg: #ffffff;
  --section-padding: 4rem 1.5rem;
  --button-hover-transform: none;
`;
  } else if (style === 'brutalist') {
    themeStyles = `
  --radius: 0px;
  --shadow: 6px 6px 0px #000000;
  --border: 3px solid #000000;
  --card-bg: #ffffff;
  --header-bg: #ffffff;
  --section-padding: 5rem 1.5rem;
  --button-hover-transform: translate(-2px, -2px);
`;
  }

  return `/**
 * BACS Entity Hub v1.0 Generated Stylesheet
 * Architectural, high-readability, minimal CSS. No frameworks, purely static-optimized.
 */

${fontImport}

:root {
  ${fontVars}
  
  /* Palette */
  --primary: ${primaryColor};
  --primary-rgb: ${hexToRgb(primaryColor)};
  --secondary: ${secondaryColor};
  --bg: ${bgColor};
  --text: ${textColor};
  --text-muted: #6b7280;
  --accent: ${style === 'brutalist' ? '#f59e0b' : '#3b82f6'};

  /* Structural Defaults */
  ${themeStyles}
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text);
  letter-spacing: -0.025em;
}

h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.25rem); margin-bottom: 1.5rem; position: relative; }
h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }

p {
  margin-bottom: 1.25rem;
  color: var(--text-muted);
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  opacity: 0.85;
}

/* Layout */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background-color: var(--header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: var(--border);
  transition: all 0.3s ease;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background-color: var(--secondary);
  border: var(--border);
  border-radius: var(--radius);
  font-size: 1.25rem;
}

nav ul {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

nav a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
}

nav a:hover {
  color: var(--primary);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
}

/* Mobile Nav Open */
@media (max-width: 768px) {
  nav {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background-color: var(--bg);
    border-bottom: var(--border);
    padding: 1.5rem;
  }
  
  nav.active {
    display: block;
  }
  
  nav ul {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hamburger {
    display: block;
  }
}

/* Sections */
section {
  padding: var(--section-padding);
}

/* Hero Section */
.hero-section {
  padding-top: 160px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(85vh - 70px);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 992px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
}

.hero-tagline {
  display: inline-block;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.35rem 0.75rem;
  background-color: var(--secondary);
  border: var(--border);
  border-radius: calc(var(--radius) / 2);
  color: var(--primary);
  margin-bottom: 1.25rem;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.hero-desc {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.hero-location-note {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: rgba(0, 0, 0, 0.72);
}

.hero-ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 992px) {
  .hero-ctas {
    justify-content: center;
  }
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.6rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border: none;
  font-family: var(--font-body);
}

.btn-primary {
  background-color: var(--primary);
  color: #ffffff;
}

.btn-primary:hover {
  transform: var(--button-hover-transform);
  box-shadow: ${style === 'brutalist' ? '2px 2px 0px #000000' : '0 4px 12px rgba(var(--primary-rgb), 0.2)'};
}

.btn-secondary {
  background-color: var(--secondary);
  color: var(--text);
  border: var(--border);
}

.btn-secondary:hover {
  background-color: rgba(228, 228, 231, 0.5);
}

/* Hero Media Display */
.hero-media-wrapper {
  position: relative;
}

.hero-badge-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  background-color: var(--card-bg);
  border: var(--border);
  padding: 1.25rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 240px;
  text-align: left;
}

@media (max-width: 768px) {
  .hero-badge-card {
    display: none;
  }
}

/* Grid & Cards */
.card {
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: ${style === 'brutalist' ? 'translate(-3px, -3px)' : 'none'};
}

/* Facts Section */
.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.fact-item {
  display: flex;
  gap: 1rem;
}

.fact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: var(--secondary);
  border: var(--border);
  border-radius: var(--radius);
  color: var(--primary);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.fact-content h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

/* Services / Offer Catalog */
.catalog-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3.5rem;
}

.services-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.service-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow);
}

@media (max-width: 768px) {
  .service-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.service-info {
  flex-grow: 1;
}

.service-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
}

.service-badge {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.5rem;
  background-color: var(--secondary);
  border: var(--border);
  border-radius: 4px;
  color: var(--text);
}

.trust-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.trust-summary-card,
.trust-badges-card {
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.trust-summary-card h3,
.trust-badges-card h3 {
  margin-bottom: 1rem;
}

.trust-badge-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.trust-badge-list li {
  padding: 1rem;
  border: var(--border);
  border-radius: var(--radius);
  background-color: var(--secondary);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.review-card {
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-rating {
  font-size: 1rem;
  color: #f59e0b;
  letter-spacing: 0.05em;
}

.review-text {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text);
}

.review-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-muted);
}

.service-price {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
}

/* Products Section */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.product-card {
  display: flex;
  flex-direction: column;
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  height: 100%;
}

.product-img-wrapper {
  aspect-ratio: 4/3;
  width: 100%;
  overflow: hidden;
  background-color: #f4f4f5;
  border-bottom: var(--border);
}

.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img-wrapper img {
  transform: scale(1.05);
}

.product-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.product-title {
  font-size: 1.15rem;
  margin-bottom: 0.75rem;
}

.product-desc {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text);
}

/* Gallery Section */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  aspect-ratio: 16/10;
  border-radius: var(--radius);
  border: var(--border);
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
  box-shadow: var(--shadow);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.04);
}

/* Lightbox overlay */
.lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.lightbox.active {
  display: flex;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 85%;
}

.lightbox img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 4px;
  border: 2px solid #ffffff;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
}

/* FAQ Accordion */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item-card {
  background-color: var(--card-bg);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.faq-trigger {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.25rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  gap: 1rem;
}

.faq-icon-indicator {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.faq-item-card.open .faq-icon-indicator {
  transform: rotate(180deg);
}

.faq-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-content {
  padding: 0 1.75rem 1.25rem;
}

/* Contact & Hours Section */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

.hours-table {
  width: 100%;
  border-collapse: collapse;
}

.hours-table td {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(228, 228, 231, 0.5);
}

.hours-table tr:last-child td {
  border-bottom: none;
}

.hours-day {
  font-weight: 500;
  color: var(--text);
}

.hours-time {
  text-align: right;
  color: var(--text-muted);
}

.hours-time.closed {
  color: #ef4444;
  font-weight: 500;
}

.map-container {
  aspect-ratio: 16/10;
  border-radius: var(--radius);
  border: var(--border);
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-top: 1.5rem;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Footer */
footer {
  border-top: var(--border);
  background-color: var(--card-bg);
  padding: 4rem 1.5rem 2rem;
  font-size: 0.9rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.footer-column h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links a {
  color: var(--text-muted);
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-socials {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.footer-social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: var(--border);
  background-color: var(--secondary);
  color: var(--text);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(228, 228, 231, 0.5);
  padding-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 576px) {
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

.bacs-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.bacs-badge span {
  display: inline-block;
  padding: 0.15rem 0.4rem;
  background-color: #10b981;
  color: white;
  border-radius: 3px;
  font-weight: 700;
}

/* Utility Helpers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
`;
}

/**
 * Helper to translate hex color codes into RGB values for styling shadows/opacities
 */
function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
    const g = parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
    const b = parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
    return `${r}, ${g}, ${b}`;
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '79, 70, 229'; // default blue
}

/**
 * Generate highly lightweight, performance-tuned vanilla javascript file
 */
export function generateMainJs(info: BusinessInfo): string {
  return `/**
 * BACS Entity Hub v1.0 Client-Side Scripting
 * Fully accessible, performance-focused vanilla JS. Zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initLightbox();
  initClipboardCopier();
  setupSmoothScrolling();
});

/**
 * Navigation burger controller for smaller screens
 */
function initMobileMenu() {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  
  if (!burger || !nav) return;
  
  burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    const expanded = burger.getAttribute('aria-expanded') === 'true' || false;
    burger.setAttribute('aria-expanded', !expanded);
  });
  
  // Close menu when navigation link is clicked
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * High-performance, keyboard-accessible accordion engine for FAQ tab
 */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.faq-item-card');
  
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    
    if (!trigger || !panel) return;
    
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherPanel = otherItem.querySelector('.faq-panel');
          if (otherPanel) otherPanel.style.maxHeight = null;
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Lightbox Gallery Handler
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (!galleryItems.length || !lightbox || !lightboxImg || !lightboxClose) return;
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Business Gallery Image';
        lightbox.classList.add('active');
        lightboxClose.focus();
      }
    });
    
    // Add keyboard trigger (Enter/Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
  
  const closeLightbox = () => {
    lightbox.classList.remove('active');
  };
  
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * Convenient factual helper for copying details to user's device clipboard
 */
function initClipboardCopier() {
  const copyButtons = document.querySelectorAll('.btn-copy-fact');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.style.backgroundColor = '#10b981';
        btn.style.color = '#ffffff';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 1500);
      });
    });
  });
}

/**
 * Clean scroll transitions
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
`;
}

/**
 * Generates sitemap.xml for static indexing
 */
export function generateSitemap(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${canonical}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

/**
 * Generates robots.txt
 */
export function generateRobots(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  return `User-agent: *
Allow: /

Sitemap: ${canonical}/sitemap.xml
`;
}

/**
 * Generates manifest.webmanifest for PWA capability
 */
export function generateManifest(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  return JSON.stringify({
    'short_name': info.name || 'Entity Hub',
    'name': `${info.name || 'Entity'} Hub`,
    'description': info.description || 'Verified Business Entity Details',
    'icons': [
      {
        'src': 'favicon.svg',
        'type': 'image/svg+xml',
        'sizes': '512x512'
      }
    ],
    'start_url': '.',
    'scope': '.',
    'background_color': info.theme.bgColor || '#ffffff',
    'theme_color': info.theme.primaryColor || '#4f46e5',
    'display': 'standalone',
    'orientation': 'any'
  }, null, 2);
}

/**
 * Generates entity.json containing the highly structured facts for easy API consumption
 */
export function generateEntityJson(info: BusinessInfo): string {
  return JSON.stringify({
    'version': 'BACS-Entity-v1.0',
    'generated_at': new Date().toISOString(),
    'identity': {
      'name': info.name,
      'category': info.category,
      'secondary_category': info.secondaryCategory || undefined,
      'tagline': info.tagline,
      'description': info.description,
      'logo_symbol': info.logo
    },
    'contact': {
      'phone': info.phone,
      'phone_secondary': info.phone2 || undefined,
      'email': info.email,
      'whatsapp': info.whatsapp,
      'website': info.website
    },
    'address': info.address,
    'coordinates': info.coordinates,
    'service_area': info.serviceArea && info.serviceArea.length > 0 ? info.serviceArea : undefined,
    'social_links': info.socials,
    'opening_hours': info.openingHours,
    'services': info.services.map(srv => ({
      ...srv,
      ctaLabel: srv.ctaLabel || undefined,
      ctaUrl: srv.ctaUrl || undefined
    })),
    'products': info.products.map(prd => ({
      ...prd,
      ctaLabel: prd.ctaLabel || undefined,
      ctaUrl: prd.ctaUrl || prd.purchaseUrl || undefined
    })),
    // Expose only Google reviews (most recent 5) and corresponding aggregate rating for export
    'reviews': (() => {
      const google = (info.reviews || []).filter(r => r && r.date && r.source === 'Google')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      return google.length ? google : undefined;
    })(),
    'aggregate_rating': (() => {
      const google = (info.reviews || []).filter(r => r && r.date && r.source === 'Google');
      if (!google.length) return undefined;
      return {
        ratingValue: (google.reduce((s, r) => s + (r.rating || 0), 0) / google.length).toFixed(2),
        reviewCount: google.length
      };
    })(),
    'faqs': info.faqs,
    'schema_mappings': {
      'canonical_url': info.canonicalUrl,
      'google_business_profile_url': info.googleBusinessProfileUrl,
      'google_maps_url': info.googleMapsUrl
    },
    'generator': {
      'name': 'BACS Entity Hub',
      'version': '1.0',
      'edition': 'Standard',
      'generated': true
    }
  }, null, 2);
}

/**
 * Generates llms.txt standard representation for AI spiders/web crawlers
 */
export function generateLlmsText(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  
  let text = `# ${info.name}
> ${info.tagline || info.category}

${info.description}

## Business Identity Summary
- **Category:** ${info.category}${info.secondaryCategory ? ` (Secondary Category: ${info.secondaryCategory})` : ''}
- **Website/Canonical:** ${canonical}
- **Physical Address:** ${info.address.street}, ${info.address.city}, ${info.address.state} ${info.address.postalCode}, ${info.address.country}
- **Primary Phone:** ${info.phone}${info.phone2 ? ` (Secondary Phone: ${info.phone2})` : ''}
- **Primary Email:** ${info.email}
- **Service Area:** ${info.serviceArea && info.serviceArea.length > 0 ? info.serviceArea.join(', ') : 'Not specified'}
- **Google Business Profile:** ${info.googleBusinessProfileUrl || 'None specified'}
- **Google Maps Navigation:** ${info.googleMapsUrl || 'None specified'}

## Weekly Opening Hours
${info.openingHours.map(oh => `- **${oh.day}:** ${formatHours(oh.open, oh.close, oh.closed)}`).join('\n')}

`;

  if (info.services.length > 0) {
    text += `## Core Services Catalog
${info.services.map(srv => `- **${srv.name}** (${srv.price}): ${srv.description} [Category: ${srv.category}]`).join('\n')}\n\n`;
  }

  if (info.products.length > 0) {
    text += `## Selected Featured Products
${info.products.map(prd => `- **${prd.name}** (${prd.price}): ${prd.description} [Category: ${prd.category}]`).join('\n')}\n\n`;
  }

  if (info.faqs.length > 0) {
    text += `## Frequently Asked Questions (FAQ)
${info.faqs.map(faq => `### Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')}\n\n`;
  }

  text += `## Verified Technical Signatures
- **JSON-LD Schema Graph:** ${canonical}/schema/graph.jsonld
- **Structured Semantic Database Object:** ${canonical}/entity.json
- **System Web Manifest:** ${canonical}/manifest.webmanifest
`;

  return text;
}

/**
 * Generates favicon.svg - beautifully scaling SVG showing business initial or custom symbol
 */
export function generateFavicon(info: BusinessInfo): string {
  const initial = info.name ? info.name.charAt(0).toUpperCase() : 'B';
  const logoContent = info.logo || initial;
  const fontSize = logoContent.length > 3 ? 24 : logoContent.length > 1 ? 32 : 44;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${info.theme.style === 'minimal' ? '20' : info.theme.style === 'warm' ? '40' : '0'}" fill="${info.theme.primaryColor}" />
  <text x="50" y="58" font-family="${info.typography === 'mono' ? 'Courier' : 'sans-serif'}" font-weight="bold" font-size="${fontSize}" fill="#ffffff" text-anchor="middle" dominant-baseline="central">
    ${logoContent}
  </text>
</svg>
`;
}

/**
 * Generates README.md explaining deployment on static hosting sites (GitHub Pages, etc)
 */
export function generateReadme(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  return `# BACS Entity Hub for ${info.name || 'Your Business'}

This directory contains a complete, production-ready, search-optimized, and AI-ready **BACS Entity Hub** generated for **${info.name || 'Your Business'}**. It has been designed specifically for lightning-fast speeds and strict compliance with LLM spiders, local search criteria, and WCAG AA standards.

## 📦 What's Inside

- \`index.html\` — Semantic HTML5 web page with modern responsive styling. Includes embedded Linked JSON-LD Graph.
- \`404.html\` — Clean error page with rapid client-side redirect.
- \`robots.txt\` — Configured spiders instructions mapping the search index.
- \`sitemap.xml\` — Canonical sitemap mapping.
- \`llms.txt\` — Plaintext markdown mapping of all business details specifically engineered for AI LLM crawlers.
- \`manifest.webmanifest\` — Web app structure.
- \`entity.json\` — Pure machine-readable JSON structure detailing all business entities, links, coordinates, and catalogs.
- \`favicon.svg\` — Scalable vector mascot logo.
- \`/css/style.css\` — Bespoke theme CSS (Vanilla CSS, extremely fast).
- \`/js/main.js\` — Interaction handles, accordions, gallery lightbox, and accessibility parameters (Vanilla JS).
- \`/schema/graph.jsonld\` — Fully validated semantic database linking LocalBusiness, Organization, WebSite, and catalogs.

## 🚀 How to Host it for Free!

Since this package is entirely **static**, you can host it 100% free on any static host. Here are step-by-step instructions for the most popular systems:

### Option A: GitHub Pages (Recommended)
1. Create a free account at [GitHub](https://github.com).
2. Create a new repository named \`your-business-name\`.
3. Upload all the files inside this exported ZIP package directly into that repository.
4. Navigate to **Settings** > **Pages** inside your GitHub repository.
5. Under **Build and deployment**, set the Branch to \`main\` (or \`master\`) and the folder to \`/\` (root). Click **Save**.
6. Within a minute, your BACS Entity Hub will be live at: \`https://your-github-username.github.io/your-business-name/\`!

### Option B: Netlify
1. Go to [Netlify](https://www.netlify.com).
2. Log in and navigate to the **Sites** tab.
3. Drag and drop this entire unzipped folder directly into the designated "Drag and drop your site folder here" upload section at the bottom of the page.
4. Your site will immediately go live with a custom subdomain!

### Option C: Vercel
1. Sign up/log in at [Vercel](https://vercel.com).
2. Install the Vercel CLI, or connect your GitHub account.
3. Import the repository or drag the files into Vercel Projects.
4. Deploy instantly with one-click.

### Option D: Cloudflare Pages
1. Log in to your Cloudflare dashboard and click **Workers & Pages**.
2. Click **Create a project** > **Direct Upload**.
3. Name your project and upload this unzipped folder. Done!

---

Generated using
**BACS Entity Hub v1.0**
Standards-Based Machine Readable Entity Package Generator

Generated on:
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Export Profile:
- GitHub Pages Compatible
- Cloudflare Pages Compatible
- Netlify Compatible
- Vercel Compatible
`;
}

/**
 * Generates 404.html with automatic zero-delay redirect back to root index
 */
export function generate404Html(info: BusinessInfo): string {
  const fontVars = getFontFamilyVariables(info.typography);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found - Redirecting...</title>
  <meta http-equiv="refresh" content="3;url=index.html">
  <style>
    :root {
      ${fontVars}
    }
    body {
      font-family: var(--font-body);
      background-color: ${info.theme.bgColor};
      color: ${info.theme.textColor};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-family: var(--font-display);
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: ${info.theme.primaryColor};
    }
    p {
      color: #6b7280;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    .loader {
      width: 40px;
      height: 40px;
      border: 4px solid ${info.theme.secondaryColor};
      border-top: 4px solid ${info.theme.primaryColor};
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .btn-home {
      margin-top: 2rem;
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: ${info.theme.primaryColor};
      color: white;
      text-decoration: none;
      border-radius: ${info.theme.style === 'minimal' ? '8px' : info.theme.style === 'warm' ? '20px' : '0px'};
      font-weight: 500;
    }
  </style>
</head>
<body>
  <h1>Page Not Found</h1>
  <p>The page you are looking for does not exist. Redirecting you to the home page in a few seconds...</p>
  <div class="loader"></div>
  <a href="index.html" class="btn-home">Go Home Instantly</a>
</body>
</html>
`;
}

/**
 * Generates the master index.html file with beautiful responsive design,
 * semantic architecture, custom sections based on sectionOrder, and embedded graph links.
 */
export function generateIndexHtml(info: BusinessInfo): string {
  const canonical = info.canonicalUrl || 'https://example.com';
  const logoUrl = info.logo.startsWith('http') ? info.logo : `${canonical}/favicon.svg`;

  // HTML Head Meta Block
  const metaBlock = `  <title>${escapeHtml(info.name || 'Verified Entity')} - ${escapeHtml(info.category || 'Local Business')}</title>
  <meta name="description" content="${escapeHtml(info.description || '')}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(info.name || 'Verified Entity')} - ${escapeHtml(info.category || 'Local Business')}">
  <meta property="og:description" content="${escapeHtml(info.description || '')}">
  <meta property="og:image" content="${escapeHtml(info.images && info.images[0] ? info.images[0] : logoUrl)}">
  <meta property="og:url" content="${canonical}/">
  <meta property="og:site_name" content="${escapeHtml(info.name || '')}">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(info.name || 'Verified Entity')}">
  <meta name="twitter:description" content="${escapeHtml(info.description || '')}">
  <meta name="twitter:image" content="${escapeHtml(info.images && info.images[0] ? info.images[0] : logoUrl)}">
  
  <!-- Accessibility & Technical Standards -->
  <meta name="theme-color" content="${info.theme.primaryColor}">
  <link rel="canonical" href="${canonical}/">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="sitemap.xml">
  <link rel="alternate" type="application/json" title="Technical Entity JSON Facts" href="entity.json">
  <link rel="alternate" type="text/plain" title="AI Machine Profile" href="llms.txt">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">`;

  const sectionLabel = (sec: string): string => {
    switch (sec) {
      case 'trust': return 'Trust & Reputation';
      case 'faq': return 'FAQ';
      case 'products': return 'Products';
      case 'services': return 'Services';
      case 'gallery': return 'Gallery';
      case 'facts': return 'Facts';
      case 'contact': return 'Contact';
      default: return sec.charAt(0).toUpperCase() + sec.slice(1);
    }
  };

  // Navigation Links - Filter out 'hero' and 'contact' to avoid duplicate Contact links
  const navLinksMarkup = info.sectionOrder
    .filter(s => s !== 'hero' && s !== 'contact')
    .map(sec => `<li><a href="#${sec}">${sectionLabel(sec)}</a></li>`)
    .join('\n        ');

  // RENDER SECTIONS DYNAMICALLY
  const sectionsContent = info.sectionOrder.map(sectionId => {
    switch (sectionId) {
      case 'hero':
        return `  <!-- HERO SECTION -->
  <section class="hero-section" id="hero">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          ${info.tagline ? `<span class="hero-tagline">${escapeHtml(info.tagline)}</span>` : `<span class="hero-tagline">${escapeHtml(info.category)}</span>`}
          <h1 class="hero-title">${escapeHtml(info.name || 'Welcome to Our Entity Hub')}</h1>
          <p class="hero-desc">${escapeHtml(info.description || 'Provide a professional description of your business to get started.')}</p>
          ${info.serviceArea && info.serviceArea.length > 0 ? `<p class="hero-location-note">Serving customers in ${escapeHtml(info.serviceArea.join(', '))}.</p>` : ''}
          <div class="hero-ctas">
            ${info.phone ? `<a href="tel:${info.phone.replace(/\\s+/g, '')}" class="btn btn-primary" aria-label="Call Business Phone">Call Now</a>` : ''}
            ${info.googleMapsUrl ? `<a href="${info.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="Get Directions on Google Maps">Directions</a>` : ''}
            ${info.whatsapp ? `<a href="https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="Chat on WhatsApp">WhatsApp</a>` : ''}
          </div>
        </div>
        <div class="hero-media-wrapper">
          <div style="aspect-ratio: 16/11; width: 100%; border-radius: var(--radius); border: var(--border); overflow: hidden; background-color: #f4f4f5; box-shadow: var(--shadow);">
            <img src="${info.images && info.images[0] ? info.images[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'}" alt="${escapeHtml(info.name)} Headquarters Front" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="hero-badge-card">
            <h4 style="margin-bottom: 0.25rem;">Category</h4>
            <p style="font-size: 0.85rem; margin-bottom: 0.75rem; color: var(--primary); font-weight: 600;">
              ${escapeHtml(info.category || 'Verified Business')}
              ${info.secondaryCategory ? `<span style="opacity: 0.6; font-weight: 400; display: block; margin-top: 0.15rem; font-size: 0.8rem;">Secondary: ${escapeHtml(info.secondaryCategory)}</span>` : ''}
            </p>
            <h4 style="margin-bottom: 0.25rem;">Location</h4>
            <p style="font-size: 0.85rem; margin-bottom: 0.75rem; line-height: 1.4;">
              ${escapeHtml(info.address.street ? `${info.address.city || 'City'}, ${info.address.state || ''}` : (info.address.city || info.address.state ? `${info.address.city || ''}${info.address.city && info.address.state ? ', ' : ''}${info.address.state || ''}` : 'Available Nationwide'))}
            </p>
            ${info.serviceArea && info.serviceArea.length > 0 ? `
            <h4 style="margin-bottom: 0.25rem;">Service Area</h4>
            <p style="font-size: 0.85rem; margin-bottom: 0; line-height: 1.4;">${escapeHtml(info.serviceArea.join(', '))}</p>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  </section>`;

      case 'facts':
        return `  <!-- BUSINESS FACTS SECTION -->
  <section class="facts-section" id="facts" style="background-color: var(--secondary); border-top: var(--border); border-bottom: var(--border);">
    <div class="container">
      <h2 class="sr-only">Key Business Facts</h2>
      <div class="facts-grid">
        <!-- Fact 1: Address -->
        <div class="fact-item">
          <div class="fact-icon" aria-hidden="true">📍</div>
          <div class="fact-content">
            <h4>Physical Address</h4>
            <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">
              ${info.address.street ? `${escapeHtml(info.address.street)}<br>` : ''}
              ${escapeHtml(info.address.city || '')}${info.address.state ? `, ${escapeHtml(info.address.state)}` : ''} ${escapeHtml(info.address.postalCode || '')}<br>
              ${escapeHtml(info.address.country || '')}
            </p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              ${info.address.street ? `<a href="#contact-address" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; text-decoration: none;">Contact Address</a>` : ''}
              ${info.address.street ? `<button class="btn btn-secondary btn-copy-fact" data-copy="${info.address.street}, ${info.address.city}, ${info.address.state} ${info.address.postalCode}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; background-color: transparent; border-color: rgba(0,0,0,0.1); color: inherit;" aria-label="Copy Address">Copy</button>` : ''}
            </div>
          </div>
        </div>
        
        <!-- Fact 2: Hours Today -->
        <div class="fact-item">
          <div class="fact-icon" aria-hidden="true">🕒</div>
          <div class="fact-content">
            <h4>Hours of Operation</h4>
            <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">
              Monday - Friday: ${escapeHtml(formatHours(info.openingHours[0]?.open || '09:00', info.openingHours[0]?.close || '17:00', info.openingHours[0]?.closed || false))}<br>
              Saturday - Sunday: ${escapeHtml(formatHours(info.openingHours[5]?.open || '00:00', info.openingHours[5]?.close || '00:00', info.openingHours[5]?.closed || true))}
            </p>
            <a href="#opening-time" class="btn btn-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; text-decoration: none;">Opening Time</a>
          </div>
        </div>

        <!-- Fact 3: Contact Channels -->
        <div class="fact-item">
          <div class="fact-icon" aria-hidden="true">📞</div>
          <div class="fact-content">
            <h4>Direct Verification</h4>
            <p style="margin-bottom: 0.5rem; font-size: 0.95rem;">
              Phone: ${escapeHtml(info.phone || 'Contact via Email')}<br>
              Email: ${escapeHtml(info.email || 'None specified')}
            </p>
            ${info.phone ? `<button class="btn btn-secondary btn-copy-fact" data-copy="${info.phone}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" aria-label="Copy Phone Number">Copy Phone</button>` : ''}
          </div>
        </div>
      </div>
    </div>
  </section>`;

      case 'services':
        if (!info.services || info.services.length === 0) return '';
        return `  <!-- SERVICES CATALOG SECTION -->
  <section class="services-section" id="services">
    <div class="container">
      <div class="catalog-header">
        <span class="hero-tagline">Offerings</span>
        <h2>Services Catalog</h2>
        <p>A comprehensive outline of our professional services. Bound strictly under machine-readable OfferCatalog standards.</p>
      </div>
      <div class="services-list">
        ${info.services.map(srv => `
        <div class="service-card">
          <div class="service-info">
            <h3 style="margin-bottom: 0.25rem;">${escapeHtml(srv.name)}</h3>
            <p style="margin-bottom: 0; font-size: 0.95rem;">${escapeHtml(srv.description)}</p>
            <div class="service-meta">
              <span class="service-badge">${escapeHtml(srv.category)}</span>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; min-width: 180px;">
            <div class="service-price">${escapeHtml(srv.price)}</div>
            ${srv.ctaUrl ? `<a href="${srv.ctaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size:0.85rem; padding:0.7rem 1rem;">${escapeHtml(srv.ctaLabel || 'Request Quote')}</a>` : info.whatsapp ? `<a href="https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in your ${srv.name} service.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size:0.85rem; padding:0.7rem 1rem;">WhatsApp</a>` : ''}
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      case 'trust':
        return `  <!-- TRUST & REPUTATION SECTION -->
  <section class="trust-section" id="trust" style="background-color: var(--secondary); border-top: var(--border); border-bottom: var(--border);">
    <div class="container">
      <div class="catalog-header">
        <span class="hero-tagline">Trust</span>
        <h2>Google Reviews</h2>
        <p>Recent public reviews from your Google Business Profile. Displaying the most recent five Google reviews helps visitors and AI agents quickly assess recent customer experience. Keep responses constructive and factual.</p>
      </div>
      ${(() => {
        const google = (info.reviews || [])
          .filter(r => r && r.date && r.source === 'Google')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        if (!google || google.length === 0) {
          return `<div class="card" style="padding:1.5rem; text-align:center;">No Google reviews available. Encourage customers to leave honest feedback on your Google Business Profile.</div>`;
        }

        const avg = (google.reduce((s, r) => s + (r.rating || 0), 0) / google.length).toFixed(1);

        return `
      <div class="trust-grid">
        <div class="trust-summary-card">
          <h3>Ratings Overview</h3>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
            <div>
              <div style="font-size:2.5rem; font-weight:800;">${escapeHtml(String(avg))}</div>
              <div style="font-size:0.95rem; color:var(--text-muted);">Average rating from ${google.length} Google review${google.length === 1 ? '' : 's'}</div>
            </div>
            <div style="text-align:right; color:var(--text-muted); font-size:0.9rem;">Source: Google Business Profile</div>
          </div>
          <p style="margin-top:0.85rem; font-size:0.92rem; color:var(--text-muted);">These are the latest public reviews available on Google. Use them to identify areas for improvement and to respond to feedback professionally.</p>
        </div>
      </div>

      <div class="reviews-grid">
        ${google.map(review => `
        <article class="review-card">
          <div class="review-rating">${'★'.repeat(Math.round(review.rating))}${'☆'.repeat(5 - Math.round(review.rating))}</div>
          <p class="review-text">${escapeHtml(review.review)}</p>
          <div class="review-footer">
            <div><strong>${escapeHtml(review.reviewer)}</strong></div>
            <div>Google · ${escapeHtml(new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))}</div>
          </div>
        </article>`).join('')}
      </div>`;
      })()}
    </div>
  </section>`;

      case 'products':
        if (!info.products || info.products.length === 0) return '';
        return `  <!-- PRODUCTS PORTFOLIO SECTION -->
  <section class="products-section" id="products" style="background-color: var(--secondary); border-top: var(--border); border-bottom: var(--border);">
    <div class="container">
      <div class="catalog-header">
        <span class="hero-tagline">Collection</span>
        <h2>Featured Products</h2>
        <p>A selection of custom inventory items available at our verified establishment.</p>
      </div>
      <div class="products-grid">
        ${info.products.map(prd => `
        <div class="product-card">
          <div class="product-img-wrapper">
            <img src="${prd.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}" alt="${escapeHtml(prd.name)}" loading="lazy">
          </div>
          <div class="product-body">
            <span class="product-category">${escapeHtml(prd.category)}</span>
            <h3 class="product-title">${escapeHtml(prd.name)}</h3>
            <p class="product-desc">${escapeHtml(prd.description)}</p>
            <div class="product-footer" style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; width: 100%;">
              <span class="product-price">${escapeHtml(prd.price)}</span>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; align-items: center;">
                ${prd.ctaUrl ? `<a href="${prd.ctaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; text-decoration: none;">${escapeHtml(prd.ctaLabel || 'Learn More')}</a>` : prd.purchaseUrl ? `<a href="${prd.purchaseUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; text-decoration: none;">${escapeHtml(prd.ctaLabel || 'Buy Now')}</a>` : ''}
                ${!prd.ctaUrl && info.whatsapp ? `<a href="https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in your ${prd.name}.`)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; text-decoration: none;">Inquire</a>` : ''}
              </div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      case 'gallery':
        if (!info.images || info.images.length === 0) return '';
        return `  <!-- GALLERY SECTION -->
  <section class="gallery-section" id="gallery">
    <div class="container">
      <div class="catalog-header">
        <span class="hero-tagline">Vibe</span>
        <h2>Business Gallery</h2>
        <p>A visual look inside our office, workspaces, and production floor. Fully keyboard accessible.</p>
      </div>
      <div class="gallery-grid">
        ${info.images.map((imgUrl, idx) => `
        <div class="gallery-item" tabindex="0" aria-label="View larger business gallery image ${idx + 1}" role="button">
          <img src="${imgUrl}" alt="Corporate Asset Photo ${idx + 1}" loading="lazy">
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      case 'faq':
        if (!info.faqs || info.faqs.length === 0) return '';
        return `  <!-- ACCORDION FAQ SECTION -->
  <section class="faq-section" id="faq" style="background-color: var(--secondary); border-top: var(--border); border-bottom: var(--border);">
    <div class="container">
      <div class="catalog-header">
        <span class="hero-tagline">Answers</span>
        <h2>Frequently Asked Questions</h2>
        <p>Quick responses to client questions regarding scheduling, services, and corporate policy.</p>
        ${info.serviceArea && info.serviceArea.length > 0 ? `<p style="margin-top: 0.75rem; font-size: 0.95rem; color: var(--text-muted);">We serve customers across ${escapeHtml(info.serviceArea.join(', '))}. This FAQ helps visitors find answers for service coverage, bookings, and availability.</p>` : ''}
      </div>
      <div class="faq-list">
        ${info.faqs.map((faq, idx) => `
        <div class="faq-item-card" id="faq-item-${idx}">
          <button class="faq-trigger" aria-expanded="false" aria-controls="faq-panel-${idx}">
            <span>${escapeHtml(faq.question)}</span>
            <span class="faq-icon-indicator" aria-hidden="true">▼</span>
          </button>
          <div class="faq-panel" id="faq-panel-${idx}" role="region" aria-labelledby="faq-item-${idx}">
            <div class="faq-content">
              <p style="margin-bottom: 0;">${escapeHtml(faq.answer)}</p>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>`;

      case 'contact':
        return `  <!-- CONTACT & SCHEDULE SECTION -->
  <section class="contact-section" id="contact">
    <div class="container">
      <div class="contact-grid">
        <div class="contact-info-block">
          <span class="hero-tagline">Connect</span>
          <h2>Contact &amp; Navigation</h2>
          <p>Get in touch with us using any of our verified communication channels or find directions to our facility on Google Maps.</p>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem; margin: 2rem 0;">
            ${info.address.street ? `
            <div id="contact-address" style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.5rem;">📍</span>
              <div>
                <h4 style="margin-bottom: 0.1rem;">Physical Location</h4>
                <p style="margin: 0; font-size: 0.95rem; font-weight: 500; line-height: 1.4;">
                  ${escapeHtml(info.address.street)}<br>
                  ${escapeHtml(info.address.city || '')}${info.address.state ? `, ${escapeHtml(info.address.state)}` : ''} ${escapeHtml(info.address.postalCode || '')}<br>
                  ${escapeHtml(info.address.country || '')}
                </p>
              </div>
            </div>` : ''}

            ${info.serviceArea && info.serviceArea.length > 0 ? `
            <div style="display: flex; gap: 1rem; align-items: flex-start;">
              <span style="font-size: 1.5rem;">🌍</span>
              <div>
                <h4 style="margin-bottom: 0.1rem;">Service Area</h4>
                <p style="margin: 0; font-size: 0.95rem; font-weight: 500; line-height: 1.4;">
                  ${escapeHtml(info.serviceArea.join(', '))}
                </p>
              </div>
            </div>` : ''}

            ${info.phone ? `
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span style="font-size: 1.5rem;">📞</span>
              <div>
                <h4 style="margin-bottom: 0.1rem;">Phone</h4>
                <a href="tel:${info.phone.replace(/\\s+/g, '')}" style="font-weight: 500;">${escapeHtml(info.phone)}</a>
                ${info.phone2 ? `<br><a href="tel:${info.phone2.replace(/\\s+/g, '')}" style="font-weight: 500; font-size: 0.85rem; color: var(--primary);">${escapeHtml(info.phone2)} (Alternate)</a>` : ''}
              </div>
            </div>` : ''}
            
            ${info.email ? `
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span style="font-size: 1.5rem;">✉️</span>
              <div>
                <h4 style="margin-bottom: 0.1rem;">Email</h4>
                <a href="mailto:${info.email}" style="font-weight: 500;">${escapeHtml(info.email)}</a>
              </div>
            </div>` : ''}
            
            ${info.whatsapp ? `
            <div style="display: flex; gap: 1rem; align-items: center;">
              <span style="font-size: 1.5rem;">💬</span>
              <div>
                <h4 style="margin-bottom: 0.1rem;">WhatsApp Messenger</h4>
                <a href="https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" style="font-weight: 500;">Open Direct Message</a>
              </div>
            </div>` : ''}
          </div>

          ${info.googleMapsUrl ? `
          <div class="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000!2d${info.coordinates.longitude || '-122.65'}!3d${info.coordinates.latitude || '45.48'}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI5JzIwLjgiTiAxMjLCsDM5JzA1LjAiVw!5e0!3m2!1sen!2sus!4v1625123456789!5m2!1sen!2sus" 
              allowfullscreen="" 
              loading="lazy" 
              title="Interactive map location for ${escapeHtml(info.name)}">
            </iframe>
          </div>` : ''}
        </div>
        
        <div class="hours-info-block" id="opening-time">
          <span class="hero-tagline">Availability</span>
          <h2>Weekly Operating Hours</h2>
          <p>Our verified calendar schedule is maintained live for LLM crawlers. Factual hours are as follows:</p>
          
          <table class="hours-table" style="margin-top: 2rem;">
            <tbody>
              ${info.openingHours.map(oh => `
              <tr>
                <td class="hours-day">${escapeHtml(oh.day)}</td>
                <td class="hours-time ${oh.closed ? 'closed' : ''}">
                  ${escapeHtml(formatHours(oh.open, oh.close, oh.closed))}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>

          <div style="margin-top: 3rem; padding: 1.5rem; background-color: var(--secondary); border: var(--border); border-radius: var(--radius);">
            <h4 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">ℹ️ Search &amp; AI Information</h4>
            <p style="font-size: 0.85rem; margin-bottom: 0; line-height: 1.5;">
              This entity possesses a verified Linked JSON-LD Graph. AI assistants (ChatGPT, Gemini, Claude, etc.) can discover our raw facts, opening times, sitemap, and catalog details at <a href="entity.json" style="font-weight:600;">/entity.json</a> and our AI spider protocol at <a href="llms.txt" style="font-weight:600;">/llms.txt</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>`;

      default:
        return '';
    }
  }).join('\n\n');

  // Social Links List
  const socialIconsMarkup = `
            ${info.socials.facebook ? `<a href="${info.socials.facebook}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Visit Facebook Profile">FB</a>` : ''}
            ${info.socials.twitter ? `<a href="${info.socials.twitter}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Visit Twitter / X Profile">X</a>` : ''}
            ${info.socials.instagram ? `<a href="${info.socials.instagram}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Visit Instagram Profile">IG</a>` : ''}
            ${info.socials.linkedin ? `<a href="${info.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Visit LinkedIn Profile">LN</a>` : ''}
            ${info.socials.youtube ? `<a href="${info.socials.youtube}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="Visit YouTube Channel">YT</a>` : ''}
  `.trim();

  const stickyCtaAction = info.whatsapp
    ? {
        href: `https://wa.me/${info.whatsapp.replace(/[^0-9]/g, '')}`,
        label: 'Message on WhatsApp'
      }
    : info.phone
      ? {
          href: `tel:${info.phone.replace(/\s+/g, '')}`,
          label: 'Call Now'
        }
      : info.services.find(srv => srv.ctaUrl)
        ? {
            href: info.services.find(srv => srv.ctaUrl)!.ctaUrl!,
            label: info.services.find(srv => srv.ctaUrl)!.ctaLabel || 'Book Service'
          }
        : info.products.find(prd => prd.ctaUrl || prd.purchaseUrl)
          ? {
              href: info.products.find(prd => prd.ctaUrl || prd.purchaseUrl)!.ctaUrl || info.products.find(prd => prd.purchaseUrl)!.purchaseUrl!,
              label: info.products.find(prd => prd.ctaLabel || prd.purchaseUrl)!.ctaLabel || 'View Product'
            }
          : null;

  const stickyCtaMarkup = stickyCtaAction ? `
  <aside class="sticky-cta" role="region" aria-label="Primary contact action">
    <div>
      <p><strong>Ready to connect?</strong> Tap the button to reach us instantly.</p>
    </div>
    <a href="${stickyCtaAction.href}" target="_blank" rel="noopener noreferrer" class="btn btn-primary sticky-cta-btn">${escapeHtml(stickyCtaAction.label)}</a>
  </aside>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
${metaBlock}

  <!-- External Styles -->
  <link rel="stylesheet" href="css/style.css">

  <!-- Embedded Linked JSON-LD Graph -->
  <script type="application/ld+json">
${generateGraphJsonLd(info)}
  </script>
</head>
<body>

  <!-- ACCESSIBLE SKIP TO CONTENT -->
  <a href="#hero" class="sr-only" style="background: var(--primary); color: white; padding: 1rem; position: absolute; top: 0; left: 0; z-index: 1000;">Skip to main content</a>

  <!-- MASTER HEADER -->
  <header>
    <div class="container header-container">
      <a href="#hero" class="logo-area" aria-label="${escapeHtml(info.name)} Home">
        <span class="logo-badge" aria-hidden="true">${escapeHtml(info.logo || '🏢')}</span>
        <span>${escapeHtml(info.name || 'Entity Hub')}</span>
      </a>
      
      <button class="hamburger" aria-expanded="false" aria-label="Toggle navigation menu">
        ☰
      </button>

      <nav>
        <ul>
          <li><a href="#hero">Home</a></li>
          ${navLinksMarkup}
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- SECTIONS CONTAINER -->
  <main>
${sectionsContent}
  </main>

  <!-- MASTER FOOTER -->
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1.15rem; margin-bottom: 1rem;">
            <span class="logo-badge" aria-hidden="true" style="width:28px; height:28px; font-size:0.95rem;">${escapeHtml(info.logo || '🏢')}</span>
            <span>${escapeHtml(info.name || 'Entity Hub')}</span>
          </div>
          <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem;">${escapeHtml(info.description || 'Verified Business Entity Profile')}</p>
          ${socialIconsMarkup ? `
          <div>
            <h4 style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:0.5rem;">Social Connections</h4>
            <div class="footer-socials">
              ${socialIconsMarkup}
            </div>
          </div>` : ''}
        </div>
        
        <div class="footer-column">
          <h4>Technical Mappings</h4>
          <ul class="footer-links">
            <li><a href="schema/graph.jsonld" target="_blank">Linked Schema Graph</a></li>
            <li><a href="entity.json" target="_blank">Machine facts (JSON)</a></li>
            <li><a href="llms.txt" target="_blank">AI Agent crawlers (txt)</a></li>
            <li><a href="manifest.webmanifest" target="_blank">Web Manifest</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Directories</h4>
          <ul class="footer-links">
            ${info.googleBusinessProfileUrl ? `<li><a href="${info.googleBusinessProfileUrl}" target="_blank" rel="noopener noreferrer">Google Profile</a></li>` : ''}
            ${info.googleMapsUrl ? `<li><a href="${info.googleMapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps Page</a></li>` : ''}
            ${info.website ? `<li><a href="${info.website}" target="_blank" rel="noopener noreferrer">Official Website</a></li>` : ''}
            <li><a href="sitemap.xml" target="_blank">Sitemap</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Navigations</h4>
          <ul class="footer-links">
            <li><a href="#hero">Top</a></li>
            ${info.sectionOrder.filter(s => s !== 'hero').map(sec => `<li><a href="#${sec}">${sectionLabel(sec)}</a></li>`).join('\n            ')}
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p style="margin-bottom: 0; font-size: 0.8rem; color: var(--text-muted);">
          &copy; ${new Date().getFullYear()} ${escapeHtml(info.name || 'Verified Entity')}. All rights reserved.
        </p>
        <div class="bacs-badge" style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; text-align: right;">
          <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">
            Generated with <span style="font-weight: bold; color: var(--text-color);">BACS Entity Hub™</span>
          </div>
          <div style="font-size: 0.65rem; color: var(--text-muted); opacity: 0.85;">
            Standards-Based Machine Readable Entity Package
          </div>
        </div>
      </div>
    </div>
  </footer>

  ${stickyCtaMarkup}

  <!-- GALLERY LIGHTBOX OVERLAY -->
  <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image zoom view">
    <div class="lightbox-content">
      <button id="lightbox-close" class="lightbox-close" aria-label="Close zoom view">&times;</button>
      <img id="lightbox-img" src="" alt="Zoomed view">
    </div>
  </div>

  <!-- Vanilla Interaction Logic -->
  <script src="js/main.js"></script>
</body>
</html>`;
}

/**
 * Escapes HTML characters to prevent XSS in generated output
 */
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
