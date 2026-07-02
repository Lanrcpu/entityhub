/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BACS Draft Export Utility
 * 
 * Enables users to export and share incomplete Entity Hub drafts
 * without requiring any backend infrastructure.
 * 
 * Workflow:
 * 1. User clicks "Save Draft"
 * 2. Current BusinessInfo is serialized as .bacs JSON file
 * 3. User shares via WhatsApp/email with BACS consultant
 * 4. Consultant uploads file to secure dashboard
 * 5. Consultant refines using structured preparation workflows
 * 6. Final Entity Hub is delivered
 */

import { BusinessInfo, BacsDraft } from '../types';

/**
 * Generate a unique draft ID for reference purposes
 * Format: 9 alphanumeric characters (e.g., 9KX3M82A5)
 */
export function generateDraftId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 9; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Create a BACS draft from current business information
 */
export function createDraft(businessInfo: BusinessInfo, notes?: string): BacsDraft {
  return {
    version: '1.0',
    timestamp: Date.now(),
    businessInfo: JSON.parse(JSON.stringify(businessInfo)), // Deep clone
    draftId: generateDraftId(),
    notes: notes || undefined
  };
}

/**
 * Export draft as downloadable .bacs file
 * File contains compressed JSON of the entire draft
 */
export function exportDraftFile(businessInfo: BusinessInfo, notes?: string): void {
  const draft = createDraft(businessInfo, notes);
  
  // Serialize to JSON
  const jsonString = JSON.stringify(draft, null, 2);
  
  // Create blob
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Generate filename with draft ID
  const filename = `entity-hub-draft-${draft.draftId}.bacs`;
  
  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Upload draft file (user selects file from disk)
 * Returns parsed BusinessInfo if valid
 */
export async function importDraftFile(file: File): Promise<BusinessInfo | null> {
  try {
    const text = await file.text();
    const draft: BacsDraft = JSON.parse(text);
    
    // Validate draft structure
    if (draft.version !== '1.0' || !draft.businessInfo) {
      console.error('Invalid draft file format');
      return null;
    }
    
    return draft.businessInfo;
  } catch (err) {
    console.error('Failed to import draft file:', err);
    return null;
  }
}

/**
 * Get draft sharing information
 * Shows what data is included in the export
 */
export function getDraftShareInfo(businessInfo: BusinessInfo): {
  businessName: string;
  category: string;
  completeness: number;
  fieldsIncluded: number;
} {
  const totalFields = 25; // Rough count of main fields
  let filledFields = 0;
  
  if (businessInfo.name) filledFields++;
  if (businessInfo.category) filledFields++;
  if (businessInfo.description) filledFields++;
  if (businessInfo.address.street) filledFields++;
  if (businessInfo.address.city) filledFields++;
  if (businessInfo.phone) filledFields++;
  if (businessInfo.email) filledFields++;
  if (businessInfo.website) filledFields++;
  if (businessInfo.canonicalUrl) filledFields++;
  if (businessInfo.coordinates.latitude && businessInfo.coordinates.longitude) filledFields++;
  if (businessInfo.services.length > 0) filledFields++;
  if (businessInfo.products.length > 0) filledFields++;
  if (businessInfo.faqs.length > 0) filledFields++;
  if (businessInfo.images.length > 0) filledFields++;
  if (businessInfo.openingHours.length > 0) filledFields++;
  
  return {
    businessName: businessInfo.name || 'Unnamed Business',
    category: businessInfo.category || 'Not specified',
    completeness: Math.round((filledFields / totalFields) * 100),
    fieldsIncluded: filledFields
  };
}
