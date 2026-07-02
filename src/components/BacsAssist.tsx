/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BACS Assist - Free Guidance Component
 * 
 * Purpose: Identifies missing critical fields and explains what structured data
 * will be incomplete. Does NOT offer AI refinement (that's premium consulting only).
 * 
 * Maintains focus on the Free Edition value proposition:
 * Transform verified business information into standards-based packages.
 * 
 * Premium refinement is offered via WhatsApp consultation only.
 */

import React, { useState, useEffect } from 'react';
import { BusinessInfo } from '../types';
import { MessageSquare, X, AlertCircle } from 'lucide-react';

interface BacsAssistProps {
  info: BusinessInfo;
}

interface MissingField {
  name: string;
  impact: string[];
}

/**
 * Identify missing critical fields that affect structured data generation
 */
export function getMissingCriticalFields(info: BusinessInfo): MissingField[] {
  const missing: MissingField[] = [];

  if (!info.name || !info.name.trim()) {
    missing.push({
      name: 'Business Name',
      impact: ['LocalBusiness schema', 'Organization identity', 'SEO title tags']
    });
  }

  if (!info.description || info.description.trim().length <= 20) {
    missing.push({
      name: 'Business Description',
      impact: [
        'Open Graph meta description',
        'WebPage schema summary',
        'LocalBusiness description',
        'Machine-readable business summary'
      ]
    });
  }

  if (!info.canonicalUrl || !info.canonicalUrl.trim()) {
    missing.push({
      name: 'Canonical URL',
      impact: ['Absolute resource endpoints', 'Sitemap URLs', 'SEO duplicate prevention']
    });
  }

  if (!info.address.street || !info.address.street.trim()) {
    missing.push({
      name: 'Street Address',
      impact: ['PostalAddress schema', 'LocalBusiness location mapping']
    });
  }

  if (!info.phone || !info.phone.trim()) {
    missing.push({
      name: 'Phone Contact',
      impact: ['LocalBusiness contact', 'Customer direct helpline']
    });
  }

  if (!info.googleMapsUrl || !info.googleMapsUrl.trim()) {
    missing.push({
      name: 'Google Maps URL',
      impact: ['Responsive map embedding', 'Geographic anchoring']
    });
  }

  const hasHours =
    info.openingHours && info.openingHours.length > 0 && info.openingHours.some(oh => !oh.closed);
  if (!hasHours) {
    missing.push({
      name: 'Business Hours',
      impact: ['OpeningHoursSpecification schema', 'Customer availability']
    });
  }

  if (!info.images || info.images.length === 0) {
    missing.push({
      name: 'Business Images',
      impact: ['Open Graph image', 'WebPage image metadata', 'Visual representation']
    });
  }

  if (!info.coordinates.latitude || !info.coordinates.longitude) {
    missing.push({
      name: 'GPS Coordinates',
      impact: ['GeoCoordinates schema', 'Precise geographic mapping']
    });
  }

  return missing;
}

export default function BacsAssist({ info }: BacsAssistProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const currentMissing = getMissingCriticalFields(info);

  useEffect(() => {
    // Read session storage to see if dismissed
    const dismissedFlag = sessionStorage.getItem('bacs_assist_dismissed') === 'true';
    const dismissedFieldsRaw = sessionStorage.getItem('bacs_assist_dismissed_fields');

    if (dismissedFlag && dismissedFieldsRaw) {
      try {
        const dismissedFields: string[] = JSON.parse(dismissedFieldsRaw);
        // Check if there are any NEW missing fields that were NOT missing when dismissed
        const newMissingFields = currentMissing.filter(
          field => !dismissedFields.includes(field.name)
        );

        if (newMissingFields.length > 0) {
          // A new critical field has become empty! Reset dismissal.
          sessionStorage.removeItem('bacs_assist_dismissed');
          sessionStorage.removeItem('bacs_assist_dismissed_fields');
          setIsDismissed(false);
        } else {
          setIsDismissed(true);
        }
      } catch (e) {
        setIsDismissed(false);
      }
    } else {
      setIsDismissed(false);
    }
  }, [info, currentMissing.length]);

  // Do not render BACS Assist if no critical fields are missing
  if (currentMissing.length === 0) {
    return null;
  }

  // Do not render if dismissed
  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    const fieldNames = currentMissing.map(f => f.name);
    sessionStorage.setItem('bacs_assist_dismissed', 'true');
    sessionStorage.setItem('bacs_assist_dismissed_fields', JSON.stringify(fieldNames));
    setIsDismissed(true);
  };

  const whatsappMessage = encodeURIComponent(
    'Hello, I am creating an Entity Hub and need assistance preparing my business information. Can you help?'
  );
  const whatsappUrl = `https://wa.me/2348065062418?text=${whatsappMessage}`;

  return (
    <div
      className="p-4 bg-amber-50/90 border border-amber-200/80 rounded-xl relative shadow-sm animate-fade-in text-zinc-800 my-4"
      id="bacs-assist-panel"
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/50 transition-all"
        title="Dismiss guidance"
        aria-label="Dismiss BACS Assist guidance"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-3">
        <div className="p-2 bg-amber-100 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>

        <div className="space-y-2.5 pr-6">
          <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
            Missing Information
          </h4>

          <p className="text-xs text-zinc-600 leading-relaxed">
            The following fields are missing. Your Entity Hub can still be exported, but some
            structured data will be incomplete:
          </p>

          {/* Missing fields with impact */}
          <div className="space-y-2 py-2 max-h-[180px] overflow-y-auto">
            {currentMissing.map((field, idx) => (
              <div key={idx} className="text-xs bg-white/60 rounded-lg p-2.5 border border-amber-100">
                <div className="font-semibold text-zinc-800 mb-1">
                  ⚠ {field.name}
                </div>
                <div className="text-zinc-600 text-[11px] space-y-0.5">
                  <div>Will affect:</div>
                  <ul className="list-disc list-inside ml-1">
                    {field.impact.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition-all text-center"
              id="whatsapp-chat-button"
            >
              <MessageSquare className="w-4 h-4" />
              Contact BACS via WhatsApp
            </a>

            <button
              onClick={handleDismiss}
              className="inline-flex items-center justify-center font-bold text-xs px-4 py-2 text-zinc-500 hover:text-zinc-700 transition-all rounded-lg hover:bg-zinc-100/50"
            >
              Dismiss
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 italic pt-1">
            ℹ️ A BACS specialist can help you prepare a complete, optimized Entity Hub for your
            business.
          </p>
        </div>
      </div>
    </div>
  );
}
