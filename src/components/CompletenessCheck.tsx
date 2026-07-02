/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BusinessInfo } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

interface CompletenessCheckProps {
  info: BusinessInfo;
}

interface ValidationItem {
  id: string;
  label: string;
  status: 'complete' | 'warning' | 'critical';
  desc: string;
}

export default function CompletenessCheck({ info }: CompletenessCheckProps) {
  // Validate fields to construct a completeness checklist
  const items: ValidationItem[] = [
    {
      id: 'name',
      label: 'Business Name',
      status: info.name ? 'complete' : 'critical',
      desc: 'Required to map LocalBusiness and Organization semantic properties.'
    },
    {
      id: 'category',
      label: 'Business Category',
      status: info.category ? 'complete' : 'critical',
      desc: 'Required to define LocalBusiness subtypes for search indexing.'
    },
    {
      id: 'description',
      label: 'Detailed Description',
      status: info.description.length > 20 ? 'complete' : info.description.length > 0 ? 'warning' : 'critical',
      desc: 'Supports Open Graph previews, WebPage schema, and machine-readable business summaries.'
    },
    {
      id: 'canonical',
      label: 'Canonical Live URL',
      status: info.canonicalUrl ? 'complete' : 'critical',
      desc: 'Establishes absolute resource endpoints for your sitemaps and graph.'
    },
    {
      id: 'street',
      label: 'Street Address',
      status: info.address.street ? 'complete' : 'critical',
      desc: 'Fills PostalAddress schema streetAddress.'
    },
    {
      id: 'city',
      label: 'City & State',
      status: (info.address.city && info.address.state) ? 'complete' : 'critical',
      desc: 'Maps LocalBusiness geographic region.'
    },
    {
      id: 'phone',
      label: 'Phone Contact',
      status: info.phone ? 'complete' : 'critical',
      desc: 'Crucial LocalBusiness direct helpline mapping.'
    },
    {
      id: 'email',
      label: 'Email Contact',
      status: info.email ? 'complete' : 'critical',
      desc: 'Fills contactPoint electronic channels.'
    },
    {
      id: 'gbp',
      label: 'Google Business Profile',
      status: info.googleBusinessProfileUrl ? 'complete' : 'warning',
      desc: 'Creates standard sameAs schema associations linking search ecosystems.'
    },
    {
      id: 'maps',
      label: 'Google Maps Navigation',
      status: info.googleMapsUrl ? 'complete' : 'warning',
      desc: 'Generates responsive embed frames and geographic anchors.'
    },
    {
      id: 'gps',
      label: 'GPS Coordinates',
      status: (info.coordinates.latitude && info.coordinates.longitude) ? 'complete' : 'warning',
      desc: 'Feeds GeoCoordinates schema so maps understand precise placement.'
    },
    {
      id: 'services',
      label: 'Services OfferCatalog',
      status: info.services.length > 0 ? 'complete' : 'warning',
      desc: 'Generates Linked OfferCatalog schema detailing available tasks.'
    },
    {
      id: 'products',
      label: 'Products Catalog',
      status: info.products.length > 0 ? 'complete' : 'warning',
      desc: 'Optional catalog entries for physical items.'
    },
    {
      id: 'faqs',
      label: 'FAQ Page Mapping',
      status: info.faqs.length > 0 ? 'complete' : 'warning',
      desc: 'Generates FAQPage schema so answers show up in search query cards.'
    },
    {
      id: 'images',
      label: 'Gallery Images',
      status: info.images.length > 0 ? 'complete' : 'warning',
      desc: 'Enables responsive carousel structures and imageObject schemas.'
    }
  ];

  // Calculate percentage of complete fields
  const completedCount = items.filter(i => i.status === 'complete').length;
  const criticalMissingCount = items.filter(i => i.status === 'critical').length;
  const completenessPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 p-5 space-y-4" id="publication-readiness-card">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Publication Readiness</h2>
          <p className="text-xs text-zinc-500">Checks whether the information required to generate a complete Entity Hub package is available.</p>
        </div>
        <div className="shrink-0">
          {criticalMissingCount > 0 ? (
            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg text-xs font-bold">
              <XCircle className="w-4 h-4" />
              <span>Needs Attention</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/30">
        <div
          className={`h-full transition-all duration-500 ${
            criticalMissingCount === 0
              ? 'bg-emerald-500'
              : 'bg-indigo-500'
          }`}
          style={{ width: `${completenessPercent}%` }}
        />
      </div>

      {/* Warning Alert if critical parameters missing */}
      {criticalMissingCount > 0 && (
        <div className="p-3 bg-red-50 border border-red-200/60 rounded-lg flex gap-2 text-red-800 text-xs animate-pulse">
          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Critical Information Missing:</strong> There are {criticalMissingCount} missing fields required to produce a valid Entity Hub sitemap or structured schema graph. Please provide them in the form.
          </div>
        </div>
      )}

      {/* Validation Checklist Items */}
      <div className="space-y-2.5 max-h-[220px] overflow-y-auto divide-y divide-zinc-100 pr-1 text-xs">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-start pt-2.5 first:pt-0 gap-3">
            <div className="flex gap-2.5">
              <div className="flex-shrink-0 mt-0.5">
                {item.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {item.status === 'critical' && <XCircle className="w-4 h-4 text-red-500" />}
              </div>
              <div>
                <span className="font-bold text-zinc-800">{item.label}</span>
                <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <div>
              {item.status === 'complete' && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-100">Ready</span>
              )}
              {item.status === 'warning' && (
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold border border-zinc-200">Optional</span>
              )}
              {item.status === 'critical' && (
                <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-100">Needs Attention</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-[10px] text-zinc-500">
        <Info className="w-3.5 h-3.5 text-zinc-400" />
        <span>No SEO scoring is performed here. This is purely a validation checklist for semantic accuracy.</span>
      </div>
    </div>
  );
}
