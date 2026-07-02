/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusinessInfo } from './types';
import { demoTemplates } from './templates/demoData';
import FormCollector from './components/FormCollector';
import CompletenessCheck from './components/CompletenessCheck';
import LivePreview from './components/LivePreview';
import Exporter from './components/Exporter';
import { ShieldCheck, HelpCircle, Code, Layout, Globe, ArrowRight, Server, FileCheck } from 'lucide-react';

export default function App() {
  // Use coffee shop as the default pre-populated demo template
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(
    JSON.parse(JSON.stringify(demoTemplates.coffeeShop.data))
  );

  // Right-hand panel active view selection
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'export'>('preview');

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans" id="bacs-app-root">
      
      {/* GLOBAL ENTERPRISE TOP BAR */}
      <header className="bg-zinc-900 text-white border-b border-zinc-800" id="bacs-top-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white text-lg border border-indigo-400/30 shadow-lg">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">BACS Entity Hub</h1>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-500/30">v1.0 Standard Edition</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Standards-Based Machine Readable Entity Package Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Product Context</span>
              <p className="text-xs text-zinc-300 font-semibold">Generates Static Assets Only • Zero Host Dependencies</p>
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fiduciary Compliant</span>
            </div>
          </div>
        </div>
      </header>

      {/* COMPANION EXPLANATORY INTRO BANNER */}
      <div className="bg-indigo-600 text-white" id="bacs-explanatory-intro">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-indigo-200 flex-shrink-0" />
            <span>
              <strong>BACS Hub Generator Scope:</strong> This application generates standard metadata packages (sitemaps, robot protocols, LLM spiders, JSON-LD schemas) for free static web hosting. It does <strong>not</strong> score businesses or audit AI visibility (which are premium Audit Suite tasks).
            </span>
          </div>
          <a
            href="#bacs-workspace-grid"
            onClick={() => {
              const tab = document.getElementById('tab-trigger-branding');
              if (tab) tab.click();
            }}
            className="font-bold underline text-indigo-100 hover:text-white flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>Configure styling presets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* CORE WORKSPACE GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-6" id="bacs-workspace-grid">
        
        {/* LEFT COMPARTMENT: INPUTS & COMPLETENESS CHECK (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="workspace-inputs-column">
          
          {/* Data collector tab-forms */}
          <div className="flex-grow">
            <FormCollector info={businessInfo} onChange={setBusinessInfo} />
          </div>

          {/* Validation Checklist widget */}
          <div>
            <CompletenessCheck info={businessInfo} />
          </div>
        </div>

        {/* RIGHT COMPARTMENT: PREVIEW SIMULATOR & COMPILING ZIP EXPORT (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-full" id="workspace-interactive-column">
          
          {/* Output Selector tabs */}
          <div className="flex bg-zinc-200/60 p-1 rounded-xl border border-zinc-200/50 self-start w-full sm:w-auto">
            <button
              onClick={() => setRightPanelTab('preview')}
              className={`flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                rightPanelTab === 'preview'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              id="tab-view-preview"
              role="tab"
              aria-selected={rightPanelTab === 'preview'}
            >
              <Layout className="w-4 h-4 text-indigo-600" />
              <span>Interactive Live Simulator</span>
            </button>
            <button
              onClick={() => setRightPanelTab('export')}
              className={`flex-grow sm:flex-grow-0 px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                rightPanelTab === 'export'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              id="tab-view-exporter"
              role="tab"
              aria-selected={rightPanelTab === 'export'}
            >
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Inspect Source &amp; Export ZIP</span>
            </button>
          </div>

          {/* Render Area */}
          <div className="flex-grow h-full min-h-[500px]">
            {rightPanelTab === 'preview' ? (
              <LivePreview info={businessInfo} />
            ) : (
              <Exporter info={businessInfo} />
            )}
          </div>

          {/* Deploy Guidance box */}
          <div className="p-4 bg-white rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex gap-2.5 items-start">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-100 flex-shrink-0">
                <Server className="w-5 h-5 text-zinc-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">Immediate Free Hosting Support</h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Simply unzip the exported package and upload files to GitHub Pages, Netlify, Cloudflare Pages, or Vercel.</p>
              </div>
            </div>
            <a 
              href="#tab-view-exporter"
              onClick={() => setRightPanelTab('export')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 flex-shrink-0"
            >
              <span>Read Deployment Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="bg-white border-t border-zinc-200 py-6" id="bacs-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span>Empowering small businesses to control their digital identities under strict machine standards.</span>
          </div>
          <div className="text-right">
            <p className="font-medium text-zinc-600">Generated with BACS Entity Hub v1.0</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">&copy; {new Date().getFullYear()} • Standards Compliant WCAG AA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
