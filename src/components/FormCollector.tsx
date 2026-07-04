/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  BusinessInfo, 
  OpeningHour, 
  ProductItem, 
  ServiceItem, 
  FAQItem, 
  ReviewItem,
  ThemeStyle, 
  ThemePresetName, 
  TypographyType 
} from '../types';
import { demoTemplates } from '../templates/demoData';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  HelpCircle, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle, 
  Download, 
  FileCode, 
  FileText, 
  Code2, 
  Globe, 
  Server, 
  Check, 
  FileCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import JSZip from 'jszip';
import {
  generateIndexHtml,
  generateStyleCss,
  generateMainJs,
  generateGraphJsonLd,
  generateSitemap,
  generateRobots,
  generateManifest,
  generateEntityJson,
  generateLlmsText,
  generateFavicon,
  generateReadme,
  generate404Html
} from '../utils/generator';
import BacsAssist, { getMissingCriticalFields } from './BacsAssist';

interface FormCollectorProps {
  info: BusinessInfo;
  onChange: (updated: BusinessInfo) => void;
}

type TabType = 'identity' | 'contact' | 'address' | 'hours' | 'services' | 'trust' | 'products' | 'faq' | 'branding' | 'images' | 'googleReviews' | 'review';

const themePresets: Record<ThemePresetName, {
  style: ThemeStyle;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  typography: TypographyType;
}> = {
  minimal: {
    style: 'minimal',
    primaryColor: '#18181b', // graphite
    secondaryColor: '#f4f4f5',
    bgColor: '#ffffff',
    textColor: '#18181b',
    typography: 'inter'
  },
  executive: {
    style: 'corporate',
    primaryColor: '#0f172a', // slate navy
    secondaryColor: '#f1f5f9',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    typography: 'inter'
  },
  boutique: {
    style: 'warm',
    primaryColor: '#854d0e', // amber brown
    secondaryColor: '#fef3c7', // warm gold
    bgColor: '#fdfbf7', // light cream
    textColor: '#292524',
    typography: 'playfair'
  },
  retail: {
    style: 'minimal',
    primaryColor: '#2563eb', // royal blue
    secondaryColor: '#eff6ff',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    typography: 'space-grotesk'
  },
  healthcare: {
    style: 'corporate',
    primaryColor: '#0d9488', // teal
    secondaryColor: '#f0fdfa',
    bgColor: '#ffffff',
    textColor: '#0f172a',
    typography: 'inter'
  },
  legal: {
    style: 'corporate',
    primaryColor: '#1e3a8a', // deep navy
    secondaryColor: '#f8fafc',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    typography: 'playfair'
  },
  restaurant: {
    style: 'warm',
    primaryColor: '#991b1b', // deep crimson
    secondaryColor: '#fffbeb', // cream yellow
    bgColor: '#fafaf9',
    textColor: '#1c1917',
    typography: 'space-grotesk'
  }
};

export default function FormCollector({ info, onChange }: FormCollectorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const tabsList: { id: TabType; label: string }[] = [
    { id: 'identity', label: 'Identity' },
    { id: 'contact', label: 'Contact' },
    { id: 'address', label: 'Location' },
    { id: 'hours', label: 'Hours' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'faq', label: 'FAQ' },
    { id: 'branding', label: 'Branding' },
    { id: 'images', label: 'Images' },
    { id: 'googleReviews', label: 'Google Reviews' },
    { id: 'review', label: 'Review & Export' }
  ];

  // Helper to load templates
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    if (demoTemplates[key]) {
      onChange(JSON.parse(JSON.stringify(demoTemplates[key].data)));
    }
  };

  // Initialize scroll button visibility
  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };
    check();
    // listen for resizes
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener('scroll', check);
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', check);
    };
  }, []);

  const updateProp = (key: keyof BusinessInfo, value: any) => {
    onChange({ ...info, [key]: value });
  };

  const updateAddress = (field: keyof BusinessInfo['address'], value: string) => {
    onChange({
      ...info,
      address: { ...info.address, [field]: value }
    });
  };

  const updateServiceArea = (value: string) => {
    onChange({
      ...info,
      serviceArea: value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .slice(0, 10) // enforce maximum of 10 service area entries
    });
  };

  const updateCoords = (field: keyof BusinessInfo['coordinates'], value: string) => {
    onChange({
      ...info,
      coordinates: { ...info.coordinates, [field]: value }
    });
  };

  const updateSocials = (field: keyof BusinessInfo['socials'], value: string) => {
    onChange({
      ...info,
      socials: { ...info.socials, [field]: value }
    });
  };

  const updateTheme = (field: keyof BusinessInfo['theme'], value: any) => {
    onChange({
      ...info,
      theme: { ...info.theme, [field]: value }
    });
  };

  const updateHour = (index: number, field: keyof OpeningHour, value: any) => {
    const updatedHours = [...info.openingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    onChange({ ...info, openingHours: updatedHours });
  };

  const updateHourFields = (index: number, values: Partial<OpeningHour>) => {
    const updatedHours = [...info.openingHours];
    updatedHours[index] = { ...updatedHours[index], ...values };
    onChange({ ...info, openingHours: updatedHours });
  };

  // Theme preset application
  const applyPreset = (presetName: ThemePresetName) => {
    const p = themePresets[presetName];
    if (p) {
      onChange({
        ...info,
        typography: p.typography,
        theme: {
          style: p.style,
          preset: presetName,
          primaryColor: p.primaryColor,
          secondaryColor: p.secondaryColor,
          bgColor: p.bgColor,
          textColor: p.textColor
        }
      });
    }
  };

  // Services Catalog handlers
  const addService = () => {
    const newService: ServiceItem = {
      id: 'srv_' + Date.now(),
      name: 'New Custom Service',
      description: 'A professional description outlining what is included and details about the offering.',
      price: '$99.00',
      category: 'Consulting',
      ctaLabel: 'Request Quote',
      ctaUrl: ''
    };
    onChange({ ...info, services: [...info.services, newService] });
  };

  const updateService = (id: string, field: keyof ServiceItem, value: string) => {
    const updatedServices = info.services.map(s => s.id === id ? { ...s, [field]: value } : s);
    onChange({ ...info, services: updatedServices });
  };

  const removeService = (id: string) => {
    onChange({ ...info, services: info.services.filter(s => s.id !== id) });
  };

  // Products Catalog handlers
  const addProduct = () => {
    const newProduct: ProductItem = {
      id: 'prd_' + Date.now(),
      name: 'Featured Product',
      description: 'Specifications, features, and target user benefits.',
      price: '$45.00',
      category: 'Hardware',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      purchaseUrl: '',
      ctaLabel: 'Buy Now',
      ctaUrl: ''
    };
    onChange({ ...info, products: [...info.products, newProduct] });
  };

  // Reviews & Trust Badges handlers
  const addReview = () => {
    const newReview = {
      id: 'rev_' + Date.now(),
      reviewer: 'Anonymous',
      rating: 5,
      review: 'Excellent service.',
      date: new Date().toISOString().slice(0, 10),
      source: 'Manual Customer Review' as any
    };
    onChange({ ...info, reviews: [...(info.reviews || []), newReview] });
  };

  const addGoogleReview = () => {
    const googleReviews = (info.reviews || []).filter(r => r.source === 'Google');
    if (googleReviews.length >= 5) return;
    const newReview = {
      id: 'grev_' + Date.now(),
      reviewer: 'Google Reviewer',
      rating: 5,
      review: 'Great experience.',
      date: new Date().toISOString().slice(0, 10),
      source: 'Google' as any
    };
    onChange({ ...info, reviews: [...(info.reviews || []), newReview] });
  };

  const updateReview = (id: string, field: keyof any, value: any) => {
    const updated = (info.reviews || []).map(r => r.id === id ? { ...r, [field]: value } : r);
    onChange({ ...info, reviews: updated });
  };

  const removeReview = (id: string) => {
    onChange({ ...info, reviews: (info.reviews || []).filter(r => r.id !== id) });
  };


  const updateProduct = (id: string, field: keyof ProductItem, value: string) => {
    const updatedProducts = info.products.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange({ ...info, products: updatedProducts });
  };

  const removeProduct = (id: string) => {
    onChange({ ...info, products: info.products.filter(p => p.id !== id) });
  };

  // FAQ Page handlers
  const addFaq = () => {
    const newFaq: FAQItem = {
      id: 'faq_' + Date.now(),
      question: 'Frequently Asked Question?',
      answer: 'A comprehensive, clear explanation resolving common inquiries from clients.'
    };
    onChange({ ...info, faqs: [...info.faqs, newFaq] });
  };

  const updateFaq = (id: string, field: keyof FAQItem, value: string) => {
    const updatedFaqs = info.faqs.map(f => f.id === id ? { ...f, [field]: value } : f);
    onChange({ ...info, faqs: updatedFaqs });
  };

  const removeFaq = (id: string) => {
    onChange({ ...info, faqs: info.faqs.filter(f => f.id !== id) });
  };

  // Section ordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const updatedOrder = [...info.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updatedOrder.length) return;
    
    const temp = updatedOrder[index];
    updatedOrder[index] = updatedOrder[targetIndex];
    updatedOrder[targetIndex] = temp;
    onChange({ ...info, sectionOrder: updatedOrder });
  };

  // IMAGE PROCESSING AND OPTIMIZATION (HTML5 Canvas-based downscaler & WebP converter)
  const processImageFile = (file: File, indexToReplace?: number) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Downscale and compress to WebP format for optimal lightweight static load
          let dataUrl = canvas.toDataURL('image/webp', 0.8);
          if (dataUrl.startsWith('data:image/png') || dataUrl.startsWith('data:image/jpeg')) {
            // fallback if browser doesn't support WebP export in canvas
            dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          }

          if (indexToReplace !== undefined) {
            const updated = [...info.images];
            updated[indexToReplace] = dataUrl;
            onChange({ ...info, images: updated });
          } else {
            onChange({ ...info, images: [...info.images, dataUrl] });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          processImageFile(file);
        }
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          processImageFile(file);
        }
      });
    }
  };

  const handleReplaceClick = (index: number) => {
    replaceInputRefs.current[index]?.click();
  };

  const handleReplaceFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0], index);
    }
  };

  const removeImage = (index: number) => {
    onChange({ ...info, images: info.images.filter((_, idx) => idx !== index) });
  };

  // COMPLETE EXPORT GENERATOR & PACKAGER
  const handleZipDownload = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      const exportFiles = [
        { path: 'index.html', getContent: generateIndexHtml },
        { path: '404.html', getContent: generate404Html },
        { path: 'style.css', getContent: generateStyleCss },
        { path: 'main.js', getContent: generateMainJs },
        { path: 'schema/graph.jsonld', getContent: generateGraphJsonLd },
        { path: 'entity.json', getContent: generateEntityJson },
        { path: 'llms.txt', getContent: generateLlmsText },
        { path: 'robots.txt', getContent: generateRobots },
        { path: 'sitemap.xml', getContent: generateSitemap },
        { path: 'manifest.webmanifest', getContent: generateManifest },
        { path: 'favicon.svg', getContent: generateFavicon },
        { path: 'README.md', getContent: generateReadme }
      ];

      exportFiles.forEach(file => {
        zip.file(file.path, file.getContent(info));
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${info.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-entity-hub.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to bundle ZIP package:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // CHECKLIST CALCULATION
  const completenessChecks = [
    { id: 'name', label: 'Business Name', status: info.name ? 'complete' : 'critical' },
    { id: 'category', label: 'Primary Category', status: info.category ? 'complete' : 'critical' },
    { id: 'description', label: 'Detailed Description', status: info.description.length > 20 ? 'complete' : 'critical' },
    { id: 'canonical', label: 'Canonical Live URL', status: info.canonicalUrl ? 'complete' : 'critical' },
    {
      id: 'businessAddress',
      label: 'Business Address',
      status: (info.address.street && info.address.city && info.address.state && info.address.postalCode && info.address.country) ? 'complete' : 'critical'
    },
    {
      id: 'serviceArea',
      label: 'Service Area',
      status: info.serviceArea && info.serviceArea.length > 0 ? 'complete' : 'critical'
    },
    { id: 'phone', label: 'Phone Contact', status: info.phone ? 'complete' : 'critical' },
    { id: 'email', label: 'Email Contact', status: info.email ? 'complete' : 'critical' },
    { id: 'gbp', label: 'Google Business Profile', status: info.googleBusinessProfileUrl ? 'complete' : 'warning' },
    { id: 'maps', label: 'Google Maps Navigation', status: info.googleMapsUrl ? 'complete' : 'warning' },
    { id: 'services', label: 'Services Catalog', status: info.services.length > 0 ? 'complete' : 'warning' },
    { id: 'hours', label: 'Operating Hours', status: info.openingHours && info.openingHours.length === 7 ? 'complete' : 'critical' },
    { id: 'images', label: 'Gallery Images', status: info.images.length > 0 ? 'complete' : 'warning' }
  ];

  const completedCount = completenessChecks.filter(c => c.status === 'complete').length;
  const criticalCount = completenessChecks.filter(c => c.status === 'critical').length;
  const completenessPercent = Math.round((completedCount / completenessChecks.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden flex flex-col h-full" id="form-collector-sidebar">
      {/* Template selection header */}
      <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Demo Datasets</span>
          <p className="text-xs text-zinc-600">Populate instantaneous schema mappings</p>
        </div>
        <select
          onChange={handleTemplateSelect}
          defaultValue="coffeeShop"
          className="w-full sm:w-auto px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          id="template-preset-dropdown"
          aria-label="Select demo template to prefill business form"
        >
          <option value="coffeeShop">☕ The Daily Grind (Coffee &amp; Bakery)</option>
          <option value="agency">✨ PixelCraft Studio (Creative Agency)</option>
          <option value="plumber">🔧 FlowTech Denver (Local Plumbing)</option>
          <option value="consultant">📈 Solo Advisor (Vanguard Advisory)</option>
          <option value="blank">⬜ Blank Start / New Business</option>
        </select>
      </div>
      {/* Critical top review */}
      {(() => {
        const missing = getMissingCriticalFields(info);
        if (missing.length === 0) return null;
        return (
          <div className="p-3 bg-rose-50 border-l-4 border-rose-300 text-rose-800 text-sm font-semibold flex items-center justify-between gap-3">
            <div>
              <div><strong>Critical Information Missing:</strong> There {missing.length === 1 ? 'is' : 'are'} {missing.length} missing field{missing.length === 1 ? '' : 's'} required to produce a valid Entity Hub sitemap or structured schema graph. Please provide them in the form.</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // scroll to top of form so user can see the banner and then details
                  const el = document.getElementById('bacs-assist-panel');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-md font-bold"
              >
                Show details
              </button>
            </div>
          </div>
        );
      })()}

      {/* Tabs list index with scroll arrows */}
      <div className="relative">
        <div className="flex items-center border-b border-zinc-200 overflow-hidden bg-zinc-50/50">
          <button
            id="tabs-scroll-left"
            aria-label="Scroll tabs left"
            onClick={() => {
              const el = tabsContainerRef.current;
              if (!el) return;
              el.scrollBy({ left: -320, behavior: 'smooth' });
            }}
            className={`p-2 text-zinc-600 hover:bg-zinc-100 rounded-l-md ${canScrollLeft ? '' : 'invisible'}`}
            aria-hidden={!canScrollLeft}
            aria-disabled={!canScrollLeft}
          >
            ‹
          </button>
          <div
            ref={(el) => { tabsContainerRef.current = el; }}
            className="flex-1 overflow-x-auto scrollbar-none"
            style={{ scrollBehavior: 'smooth' }}
            onScroll={() => {
              const el = tabsContainerRef.current;
              if (!el) return;
              setCanScrollLeft(el.scrollLeft > 5);
              setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
            }}
          >
            <div className="flex">
              {tabsList.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex-grow text-center ${
              activeTab === t.id
                ? 'bg-white text-indigo-600 border-b-indigo-600 shadow-sm'
                : 'text-zinc-500 border-b-transparent hover:text-zinc-800 hover:bg-zinc-100/40'
            }`}
            role="tab"
            aria-selected={activeTab === t.id}
            id={`tab-trigger-${t.id}`}
          >
            {t.label}
          </button>
              ))}
            </div>
          </div>
          <button
            id="tabs-scroll-right"
            aria-label="Scroll tabs right"
            className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-r-md"
            onClick={() => {
              const el = tabsContainerRef.current;
              if (!el) return;
              el.scrollBy({ left: 320, behavior: 'smooth' });
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Tab Form Areas */}
      <div className="p-5 overflow-y-auto flex-grow space-y-6 max-h-[calc(100vh-290px)] min-h-[450px]">
        
        {/* IDENTITY TAB */}
        {activeTab === 'identity' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Business Core Identity</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Primary SEO Keys</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Google Business Name *</label>
                <input
                  type="text"
                  value={info.name}
                  onChange={e => updateProp('name', e.target.value)}
                  placeholder="e.g. Acme Corporation (as listed on Google)"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Category *</label>
                <input
                  type="text"
                  value={info.category}
                  onChange={e => updateProp('category', e.target.value)}
                  placeholder="e.g. Cafe, Plumber, Marketing"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Secondary Category <span className="text-zinc-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={info.secondaryCategory || ''}
                  onChange={e => updateProp('secondaryCategory', e.target.value)}
                  placeholder="e.g. Bakery, Heating Specialist"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Logo Emblem / Mascot Emoji *</label>
                <input
                  type="text"
                  value={info.logo}
                  onChange={e => updateProp('logo', e.target.value)}
                  placeholder="e.g. 🏢 or ☕ or ACME"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Slogan or Symmetrical Tagline</label>
              <input
                type="text"
                value={info.tagline}
                onChange={e => updateProp('tagline', e.target.value)}
                placeholder="e.g. Etically Sourced. Baked Fresh Daily."
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Canonical Live URL *</label>
                <input
                  type="url"
                  value={info.canonicalUrl}
                  onChange={e => updateProp('canonicalUrl', e.target.value)}
                  placeholder="e.g. https://mybusiness.github.io"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-[10px] text-zinc-400 mt-1 font-medium leading-normal">Establishes endpoints for sitemaps, crawlers and schema graph associations.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Registered Business Name <span className="text-zinc-400 font-normal">(Optional)</span></label>
                {info.cacRegistered ? (
                  <input
                    type="text"
                    value={info.registeredBusinessName || ''}
                    onChange={e => updateProp('registeredBusinessName', e.target.value)}
                    placeholder="e.g. Acme Corporation Ltd (Registered)"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={info.registeredBusinessName || ''}
                    onChange={e => updateProp('registeredBusinessName', e.target.value)}
                    placeholder="Hidden until 'CAC Registered' is checked"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-zinc-50"
                    disabled
                  />
                )}
                <div className="mt-2 text-[10px]">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!info.cacRegistered} onChange={e => updateProp('cacRegistered', e.target.checked)} />
                    <span className="text-xs">Business is CAC Registered</span>
                  </label>
                  <p className="text-[10px] text-zinc-400 mt-1">Registering your business improves credibility and enables additional authority signals. This is optional and will not block export.</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Alternative Website Link <span className="text-zinc-400 font-normal">(Optional)</span></label>
                <input
                  type="url"
                  value={info.website}
                  onChange={e => updateProp('website', e.target.value)}
                  placeholder="e.g. https://www.originalbrand.com"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Detailed Business Bio / Description *</label>
              <textarea
                value={info.description}
                onChange={e => updateProp('description', e.target.value)}
                placeholder="Write a clear, thorough corporate/business bio. Important for search results previews and AI LLM search groundings."
                rows={5}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        )}

        {/* GOOGLE REVIEWS TAB */}
        {activeTab === 'googleReviews' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Google Reviews (Last 5)</h3>
              <button
                onClick={addGoogleReview}
                disabled={((info.reviews || []).filter(r => r.source === 'Google').length) >= 5}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-md text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Google Review
              </button>
            </div>

            {((info.reviews || []).filter(r => r.source === 'Google').length) === 0 ? (
              <div className="text-center p-6 border border-dashed border-red-200 rounded-xl bg-red-50">
                <p className="text-xs text-red-700 italic">No Google reviews provided. This is critical information and should include the last 5 Google reviews from your Google Business profile.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(info.reviews || []).filter(r => r.source === 'Google').map(r => (
                  <div key={r.id} className="p-3 border border-zinc-200 rounded-xl bg-zinc-50/50">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={r.reviewer}
                          onChange={e => updateReview(r.id, 'reviewer', e.target.value)}
                          placeholder="Reviewer name"
                          className="w-full px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                        />
                        <div className="flex gap-2 mt-2">
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={r.rating}
                            onChange={e => updateReview(r.id, 'rating', Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                          />
                          <input
                            type="date"
                            value={r.date}
                            onChange={e => updateReview(r.id, 'date', e.target.value)}
                            className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                          />
                        </div>
                        <textarea
                          value={r.review}
                          onChange={e => updateReview(r.id, 'review', e.target.value)}
                          rows={3}
                          className="w-full mt-2 p-2 text-xs border border-zinc-200 rounded bg-white"
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => removeReview(r.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-zinc-500">Enter up to 5 Google reviews exactly as they appear on your public Google Business profile.</p>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Contact Channels</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Factual Channels</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Phone Number *</label>
                <input
                  type="text"
                  value={info.phone}
                  onChange={e => updateProp('phone', e.target.value)}
                  placeholder="e.g. +1 (503) 555-0143"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Secondary Phone <span className="text-zinc-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={info.phone2 || ''}
                  onChange={e => updateProp('phone2', e.target.value)}
                  placeholder="e.g. +1 (503) 555-9999"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Email Address *</label>
                <input
                  type="email"
                  value={info.email}
                  onChange={e => updateProp('email', e.target.value)}
                  placeholder="support@acme.com"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">WhatsApp Business (International) <span className="text-zinc-400 font-normal">(Optional)</span></label>
                <input
                  type="text"
                  value={info.whatsapp}
                  onChange={e => updateProp('whatsapp', e.target.value)}
                  placeholder="e.g. +15035550143"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800">Map & Ecosystem Connectivity</h4>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-600 mb-1">Google Business Profile URL *</label>
                <input
                  type="url"
                  value={info.googleBusinessProfileUrl}
                  onChange={e => updateProp('googleBusinessProfileUrl', e.target.value)}
                  placeholder="e.g. https://business.google.com/r/..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-zinc-600 mb-1">Google Maps Direct Link *</label>
                <input
                  type="url"
                  value={info.googleMapsUrl}
                  onChange={e => updateProp('googleMapsUrl', e.target.value)}
                  placeholder="e.g. https://maps.app.goo.gl/..."
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800">Social Signatures</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={info.socials.facebook}
                    onChange={e => updateSocials('facebook', e.target.value)}
                    placeholder="https://facebook.com/mybusiness"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={info.socials.instagram}
                    onChange={e => updateSocials('instagram', e.target.value)}
                    placeholder="https://instagram.com/mybusiness"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={info.socials.twitter}
                    onChange={e => updateSocials('twitter', e.target.value)}
                    placeholder="https://x.com/mybusiness"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={info.socials.linkedin}
                    onChange={e => updateSocials('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/mybusiness"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">YouTube</label>
                  <input
                    type="url"
                    value={info.socials.youtube}
                    onChange={e => updateSocials('youtube', e.target.value)}
                    placeholder="https://youtube.com/mybusiness"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Weekly Operating Hours</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Structured Schedule</span>
            </div>

            <p className="text-[11px] text-zinc-500">Configure your weekly operating schedule. Closed days are kept separate from open hours and will be reflected across the website, JSON-LD, entity.json, llms.txt and graph.jsonld exports.</p>

            <div className="space-y-3">
              {info.openingHours.map((oh, idx) => (
                <div key={oh.day} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50">
                  <div className="flex items-center justify-between gap-3 md:col-span-2">
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{oh.day}</div>
                      <div className="text-[10px] text-zinc-500">Toggle open/closed, optional 24-hour service, and edit the hourly window.</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
                        <input
                          type="checkbox"
                          checked={!oh.closed}
                          onChange={e => updateHourFields(idx, { closed: !e.target.checked, open24: false })}
                          className="h-4 w-4 text-indigo-600 border-zinc-300 rounded"
                        />
                        Open
                      </label>
                      <label className={`inline-flex items-center gap-2 text-xs font-semibold ${oh.closed ? 'text-zinc-400' : 'text-zinc-700'}`}>
                        <input
                          type="checkbox"
                          checked={!!oh.open24}
                          disabled={oh.closed}
                          onChange={e => {
                            const open24 = e.target.checked;
                            updateHourFields(idx, {
                              closed: false,
                              open24,
                              open: open24 ? '00:00' : oh.open || '09:00',
                              close: open24 ? '23:59' : oh.close || '17:00'
                            });
                          }}
                          className="h-4 w-4 text-indigo-600 border-zinc-300 rounded"
                        />
                        24 hours
                      </label>
                    </div>
                  </div>

                  {!oh.closed && !oh.open24 && (
                    <>
                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Open</label>
                        <input
                          type="time"
                          value={oh.open}
                          onChange={e => updateHour(idx, 'open', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Close</label>
                        <input
                          type="time"
                          value={oh.close}
                          onChange={e => updateHour(idx, 'close', e.target.value)}
                          className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-end md:col-span-2">
                    <p className={`text-xs font-medium ${oh.closed ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {oh.closed
                        ? 'Closed on this day'
                        : oh.open24
                          ? 'Open 24 hours'
                          : `Open ${oh.open}–${oh.close}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOCATION TAB */}
        {activeTab === 'address' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Physical Coordinates &amp; Address</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Schema PostalAddress</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Street Address *</label>
              <input
                type="text"
                value={info.address.street}
                onChange={e => updateAddress('street', e.target.value)}
                placeholder="e.g. 452 Linden Avenue"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">City *</label>
                <input
                  type="text"
                  value={info.address.city}
                  onChange={e => updateAddress('city', e.target.value)}
                  placeholder="e.g. Portland"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">State / Region *</label>
                <input
                  type="text"
                  value={info.address.state}
                  onChange={e => updateAddress('state', e.target.value)}
                  placeholder="e.g. OR"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Service Area *</label>
              <input
                type="text"
                value={info.serviceArea.join(', ')}
                onChange={e => updateServiceArea(e.target.value)}
                placeholder="e.g. Portland Metro, Beaverton, Nationwide"
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
              <p className="text-[10px] text-zinc-500 mt-1">Separate multiple cities or regions with commas.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Postal / Zip Code *</label>
                <input
                  type="text"
                  value={info.address.postalCode}
                  onChange={e => updateAddress('postalCode', e.target.value)}
                  placeholder="e.g. 97202"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Country *</label>
                <input
                  type="text"
                  value={info.address.country}
                  onChange={e => updateAddress('country', e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <h4 className="text-xs font-bold text-zinc-800 mb-2">GPS Metadata Mapping (Optional)</h4>
              <p className="text-[10px] text-zinc-500 mb-3">Enables precise micro-coordinates placement within the LocalBusiness schema graph.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={info.coordinates.latitude}
                    onChange={e => updateCoords('latitude', e.target.value)}
                    placeholder="e.g. 45.4891"
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={info.coordinates.longitude}
                    onChange={e => updateCoords('longitude', e.target.value)}
                    placeholder="e.g. -122.6514"
                    className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Services (OfferCatalog)</h3>
              <button
                onClick={addService}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Service
              </button>
            </div>

            {info.services.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
                <p className="text-xs text-zinc-500 italic">No services listed yet. Add services to build an interactive catalog sitemap.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {info.services.map(s => (
                  <div key={s.id} className="p-4 border border-zinc-200 rounded-xl space-y-3 bg-zinc-50/50">
                    <div className="flex justify-between gap-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                        <input
                          type="text"
                          value={s.name}
                          onChange={e => updateService(s.id, 'name', e.target.value)}
                          placeholder="Service Name"
                          className="px-2 py-1 text-xs font-bold border border-zinc-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          value={s.price}
                          onChange={e => updateService(s.id, 'price', e.target.value)}
                          placeholder="Price (e.g. $100)"
                          className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          value={s.category}
                          onChange={e => updateService(s.id, 'category', e.target.value)}
                          placeholder="Category"
                          className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                        />
                      </div>
                      <button
                        onClick={() => removeService(s.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={s.description}
                      onChange={e => updateService(s.id, 'description', e.target.value)}
                      placeholder="Describe standard parameters of this service."
                      rows={2}
                      className="w-full p-2 text-xs border border-zinc-200 rounded bg-white"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={s.ctaLabel || ''}
                        onChange={e => updateService(s.id, 'ctaLabel', e.target.value)}
                        placeholder="CTA Label (e.g. Book Appointment)"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                      <input
                        type="url"
                        value={s.ctaUrl || ''}
                        onChange={e => updateService(s.id, 'ctaUrl', e.target.value)}
                        placeholder="CTA URL (e.g. https://wa.me/...)"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Featured Products</h3>
              <button
                onClick={addProduct}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            {info.products.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
                <p className="text-xs text-zinc-500 italic">No products listed. Optional catalog section for retail or items.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {info.products.map(p => (
                  <div key={p.id} className="p-4 border border-zinc-200 rounded-xl space-y-3 bg-zinc-50/50">
                    <div className="flex justify-between gap-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                        <input
                          type="text"
                          value={p.name}
                          onChange={e => updateProduct(p.id, 'name', e.target.value)}
                          placeholder="Product Name"
                          className="px-2 py-1 text-xs font-bold border border-zinc-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          value={p.price}
                          onChange={e => updateProduct(p.id, 'price', e.target.value)}
                          placeholder="Price (e.g. $45)"
                          className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                        />
                        <input
                          type="text"
                          value={p.category}
                          onChange={e => updateProduct(p.id, 'category', e.target.value)}
                          placeholder="Category"
                          className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                        />
                      </div>
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={p.image}
                        onChange={e => updateProduct(p.id, 'image', e.target.value)}
                        placeholder="Image URL"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                      <input
                        type="url"
                        value={p.purchaseUrl || ''}
                        onChange={e => updateProduct(p.id, 'purchaseUrl', e.target.value)}
                        placeholder="Product Purchase / Payment Link"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={p.ctaLabel || ''}
                        onChange={e => updateProduct(p.id, 'ctaLabel', e.target.value)}
                        placeholder="CTA Label (e.g. Buy Now)"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                      <input
                        type="url"
                        value={p.ctaUrl || ''}
                        onChange={e => updateProduct(p.id, 'ctaUrl', e.target.value)}
                        placeholder="CTA URL (e.g. https://...)"
                        className="px-2 py-1 text-xs border border-zinc-200 rounded bg-white"
                      />
                    </div>

                    <textarea
                      value={p.description}
                      onChange={e => updateProduct(p.id, 'description', e.target.value)}
                      placeholder="Specifications, size details, or general description."
                      rows={2}
                      className="w-full p-2 text-xs border border-zinc-200 rounded bg-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">FAQ Page Mapping</h3>
              <button
                onClick={addFaq}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded-md text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>

            {info.faqs.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
                <p className="text-xs text-zinc-500 italic">No FAQ added. Including FAQPage metadata maps directly into Google search answer cards.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {info.faqs.map(f => (
                  <div key={f.id} className="p-4 border border-zinc-200 rounded-xl space-y-3 bg-zinc-50/50">
                    <div className="flex justify-between gap-2">
                      <input
                        type="text"
                        value={f.question}
                        onChange={e => updateFaq(f.id, 'question', e.target.value)}
                        placeholder="Question..."
                        className="w-full px-2 py-1 text-xs font-bold border border-zinc-200 rounded bg-white"
                      />
                      <button
                        onClick={() => removeFaq(f.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={f.answer}
                      onChange={e => updateFaq(f.id, 'answer', e.target.value)}
                      placeholder="Detailed response/answer."
                      rows={2}
                      className="w-full p-2 text-xs border border-zinc-200 rounded bg-white"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BRANDING TAB */}
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-fade-in">
            {/* Theme presets */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">SaaS Design Presets</h3>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Click to Apply</span>
              </div>
              <p className="text-[11px] text-zinc-500">Choose custom-tailored visual presets designed for instant aesthetic cohesion.</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.keys(themePresets) as ThemePresetName[]).map(pn => {
                  const pObj = themePresets[pn];
                  const isActive = info.theme.preset === pn;
                  return (
                    <button
                      key={pn}
                      onClick={() => applyPreset(pn)}
                      className={`p-3 text-left border rounded-xl transition-all relative ${
                        isActive 
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/15' 
                          : 'border-zinc-200 bg-white hover:bg-zinc-50/80'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold capitalize text-zinc-900">{pn}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <div className="flex gap-1.5 mt-2.5">
                        <span className="w-4 h-4 rounded-full border border-zinc-200 shadow-sm" style={{ backgroundColor: pObj.primaryColor }} title="Primary" />
                        <span className="w-4 h-4 rounded-full border border-zinc-200 shadow-sm" style={{ backgroundColor: pObj.secondaryColor }} title="Accent" />
                        <span className="w-4 h-4 rounded-full border border-zinc-200 shadow-sm" style={{ backgroundColor: pObj.bgColor }} title="Bg" />
                      </div>
                      <span className="text-[9px] text-zinc-400 capitalize block mt-1.5 font-mono">{pObj.typography} Pairing</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom colors */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800">Precision Theme Customization</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={info.theme.primaryColor}
                      onChange={e => updateTheme('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-200 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={info.theme.primaryColor}
                      onChange={e => updateTheme('primaryColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-zinc-200 rounded text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={info.theme.secondaryColor}
                      onChange={e => updateTheme('secondaryColor', e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-200 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={info.theme.secondaryColor}
                      onChange={e => updateTheme('secondaryColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-zinc-200 rounded text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Background Page</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={info.theme.bgColor}
                      onChange={e => updateTheme('bgColor', e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-200 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={info.theme.bgColor}
                      onChange={e => updateTheme('bgColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-zinc-200 rounded text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-700 mb-1">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={info.theme.textColor}
                      onChange={e => updateTheme('textColor', e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-200 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={info.theme.textColor}
                      onChange={e => updateTheme('textColor', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-zinc-200 rounded text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography selection */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800">Typography Choices</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'inter', name: 'Inter Sans', desc: 'Modern geometric' },
                  { id: 'space-grotesk', name: 'Space Grotesk', desc: 'Tech-forward display' },
                  { id: 'playfair', name: 'Playfair Serif', desc: 'Sophisticated editorial' },
                  { id: 'mono', name: 'JetBrains Mono', desc: 'Clean Brutalist' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateProp('typography', f.id as TypographyType)}
                    className={`p-2.5 text-left border rounded-lg transition-all ${
                      info.typography === f.id
                        ? 'border-indigo-600 bg-indigo-50/50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-950">{f.name}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{f.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Ordering */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-800">Sequence Re-Ordering</h4>
              <p className="text-[10px] text-zinc-500 leading-normal">Drag or move sitemap layout sequences to align with your key business priorities.</p>

              <div className="space-y-1.5 max-w-sm">
                {info.sectionOrder.map((sec, idx) => (
                  <div
                    key={sec}
                    className="flex justify-between items-center px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-zinc-200 text-zinc-500 w-4 h-4 flex items-center justify-center rounded-full font-bold">{idx + 1}</span>
                      <span className="capitalize font-medium">{sec}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-zinc-200 rounded disabled:opacity-45"
                        aria-label="Move Section Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === info.sectionOrder.length - 1}
                        className="p-1 hover:bg-zinc-200 rounded disabled:opacity-45"
                        aria-label="Move Section Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IMAGES TAB */}
        {activeTab === 'images' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Image Asset Manager</h3>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold border border-indigo-100">Auto Optimized</span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Drag images or click to upload. Files are automatically downscaled and converted to 
              highly optimized <strong className="font-semibold text-indigo-600">WebP</strong> data-URIs in real time to guarantee perfect load speeds.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-50/60' 
                  : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50'
              }`}
            >
              <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-indigo-600 animate-bounce' : 'text-zinc-400'}`} />
              <div>
                <p className="text-xs font-bold text-zinc-800">Drag &amp; drop images here, or browse</p>
                <p className="text-[10px] text-zinc-400 mt-1">PNG, JPG, WebP formats (Auto-optimized to local base64)</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload brand image assets"
              />
            </div>

            {/* Previews Grid */}
            {info.images.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-zinc-200 rounded-lg text-xs text-zinc-500 italic">No image assets uploaded. Standard fallback icons will display.</div>
            ) : (
              <div className="space-y-3">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Gallery Thumbnails ({info.images.length})</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {info.images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-video border border-zinc-200 rounded-xl overflow-hidden bg-zinc-100">
                      <img src={img} alt={`Gallery Asset ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-center items-center gap-1.5 p-1.5">
                        <button
                          onClick={() => handleReplaceClick(idx)}
                          className="w-full bg-white hover:bg-zinc-50 text-zinc-800 text-[10px] font-bold py-1 px-1.5 rounded transition-all shadow"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => removeImage(idx)}
                          className="w-full bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold py-1 px-1.5 rounded transition-all shadow"
                        >
                          Remove
                        </button>
                        <input
                          ref={el => { replaceInputRefs.current[idx] = el; }}
                          type="file"
                          accept="image/*"
                          onChange={e => handleReplaceFileChange(idx, e)}
                          className="hidden"
                          aria-label={`Replace asset ${idx + 1}`}
                        />
                      </div>
                      <span className="absolute bottom-1 right-1 text-[9px] bg-zinc-900/85 text-white px-1.5 py-0.5 rounded font-mono">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVIEW & EXPORT TAB */}
        {activeTab === 'review' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Export Readiness Diagnostic</h3>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                completenessPercent === 100 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}>
                {completenessPercent}% Complete
              </span>
            </div>

            {/* Diagnostic Alert */}
            {criticalCount > 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex gap-2.5 text-xs text-amber-800">
                <HelpCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Alternative schema missing:</strong> There are {criticalCount} required core sitemap elements missing. We recommend visiting other tabs first to fully populate your sitemap.
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-2.5 text-xs text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <strong className="font-bold">Perfect Export Status!</strong> Your business facts meet all necessary machine standards. Sitemaps, JSON-LD graphs, and robots protocols will bundle in perfect alignment.
                </div>
              </div>
            )}

            {/* Included files panel */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Included Output Assets</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  { path: 'index.html', label: 'Semantic Home', icon: FileCode, size: '22 KB' },
                  { path: '404.html', label: 'Redirect fallback', icon: FileCode, size: '2 KB' },
                  { path: 'style.css', label: 'Vanilla Styles', icon: Code2, size: '8 KB' },
                  { path: 'main.js', label: 'Interactive Handles', icon: Code2, size: '2 KB' },
                  { path: 'schema/graph.jsonld', label: 'Linked JSON-LD', icon: Globe, size: '12 KB' },
                  { path: 'entity.json', label: 'Pure Entity Schema', icon: FileText, size: '5 KB' },
                  { path: 'llms.txt', label: 'AI LLM Spider', icon: FileText, size: '3 KB' },
                  { path: 'robots.txt', label: 'Crawl Protocols', icon: FileText, size: '1 KB' },
                  { path: 'sitemap.xml', label: 'Search Index Map', icon: Globe, size: '1 KB' },
                  { path: 'README.md', label: 'Deploy Guides', icon: FileText, size: '4 KB' }
                ].map(file => (
                  <div key={file.path} className="flex justify-between items-center px-3 py-2 bg-zinc-50 border border-zinc-200/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <file.icon className="w-4 h-4 text-zinc-400" />
                      <div>
                        <span className="font-mono text-[10px] font-bold block text-zinc-800">{file.path}</span>
                        <span className="text-[9px] text-zinc-400">{file.label}</span>
                      </div>
                    </div>
                    <span className="text-[9px] bg-zinc-200 text-zinc-500 font-semibold px-1.5 py-0.5 rounded">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hosting compatibility check */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Hosting Compatibility Diagnostic</span>
              <div className="border border-zinc-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] text-zinc-500 font-bold uppercase">
                      <th className="p-2 pl-3">Static Platform</th>
                      <th className="p-2">Compatibility</th>
                      <th className="p-2 pr-3">Upload Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-[11px] font-medium text-zinc-700">
                    <tr>
                      <td className="p-2.5 pl-3 font-semibold text-zinc-900">GitHub Pages</td>
                      <td className="p-2.5 text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready
                      </td>
                      <td className="p-2.5 text-zinc-500">Root folder upload</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-3 font-semibold text-zinc-900">Netlify</td>
                      <td className="p-2.5 text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready
                      </td>
                      <td className="p-2.5 text-zinc-500">Drag &amp; Drop folder</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-3 font-semibold text-zinc-900">Vercel</td>
                      <td className="p-2.5 text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready
                      </td>
                      <td className="p-2.5 text-zinc-500">Direct CLI / Git deploy</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 pl-3 font-semibold text-zinc-900">Cloudflare Pages</td>
                      <td className="p-2.5 text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Ready
                      </td>
                      <td className="p-2.5 text-zinc-500">Direct upload</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BACS Assist Intelligence Guidance */}
            <BacsAssist info={info} />

            {/* ZIP export trigger */}
            <div className="pt-4 border-t border-zinc-100">
              <button
                onClick={handleZipDownload}
                disabled={isExporting}
                className={`w-full py-3 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md ${
                  exportSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/15'
                }`}
                id="btn-trigger-zip-download-form"
              >
                {exportSuccess ? (
                  <>
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Zip Package Exported!</span>
                  </>
                ) : isExporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Bundling Package...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5" />
                    <span>Download entity-hub.zip</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-zinc-400 text-center mt-2.5 font-medium leading-normal">
                Bundles sitemaps, robots rules, metadata tags, raw facts databases, and deployment guides inside a static package.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
