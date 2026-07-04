/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BACS Entity Hub v1.0 - Standards-Based Machine Readable Entity Package Generator
 * 
 * Product Positioning:
 * - Free Edition: Generator only - transforms verified business information into
 *   standards-based machine-readable packages for static hosting
 * - Premium: Professional consulting and internal preparation workflows
 * 
 * This application is client-side only. No backend required.
 * Users own all exported files.
 */

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
  open24?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  purchaseUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type ReviewSource = 'Google' | 'Facebook' | 'Trustpilot' | 'Yelp' | 'Website' | 'Manual Customer Review';

export interface ReviewItem {
  id: string;
  reviewer: string;
  rating: number;
  review: string;
  date: string;
  source: ReviewSource;
}

export interface TrustBadge {
  id: string;
  title: string;
  description?: string;
}

export interface GeoCoordinates {
  latitude: string;
  longitude: string;
}

export type ThemeStyle = 'minimal' | 'warm' | 'corporate' | 'mono' | 'brutalist';
export type ThemePresetName = 'minimal' | 'executive' | 'boutique' | 'retail' | 'healthcare' | 'legal' | 'restaurant';
export type TypographyType = 'inter' | 'space-grotesk' | 'playfair' | 'mono';

export interface ThemeConfig {
  style: ThemeStyle;
  preset?: ThemePresetName;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
}

export interface BusinessInfo {
  name: string;
  registeredBusinessName?: string;
  cacRegistered?: boolean;
  category: string;
  secondaryCategory?: string;
  description: string;
  tagline: string;
  address: Address;
  phone: string;
  phone2?: string;
  email: string;
  whatsapp: string;
  googleBusinessProfileUrl: string;
  googleMapsUrl: string;
  website: string;
  socials: SocialLinks;
  openingHours: OpeningHour[];
  products: ProductItem[];
  services: ServiceItem[];
  faqs: FAQItem[];
  reviews: ReviewItem[];
  trustBadges: TrustBadge[];
  images: string[];
  logo: string;
  coordinates: GeoCoordinates;
  canonicalUrl: string;
  serviceArea: string[];
  theme: ThemeConfig;
  typography: TypographyType;
  sectionOrder: string[];
}

/**
 * Publication Readiness Status
 * Used by CompletenessCheck to indicate data completeness
 * for export package generation
 */
export type ReadinessStatus = 'ready' | 'optional' | 'needs-attention';

export interface ReadinessItem {
  id: string;
  label: string;
  status: ReadinessStatus;
  description: string;
  isCritical: boolean;
  impact: string[];
}

/**
 * Draft File for client-side sharing
 * Users can export this as a .bacs file and share with consultants
 * via WhatsApp or email for collaborative refinement
 */
export interface BacsDraft {
  version: '1.0';
  timestamp: number;
  businessInfo: BusinessInfo;
  draftId?: string;
  notes?: string;
}
