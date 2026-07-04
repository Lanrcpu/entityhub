/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BusinessInfo } from '../types';
import { generateIndexHtml, generateStyleCss, generateMainJs } from '../utils/generator';
import { Monitor, Tablet, Phone, RotateCw, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  info: BusinessInfo;
}

type ViewportType = 'desktop' | 'tablet' | 'mobile';

export default function LivePreview({ info }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportType>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compile full page for previewing
  const getCompiledSrcDoc = () => {
    let html = generateIndexHtml(info);
    const css = generateStyleCss(info);
    const js = generateMainJs(info);

    // Replace stylesheet link with inline styles for iframe compatibility
    html = html.replace(
      '<link rel="stylesheet" href="style.css">',
      `<style>${css}</style>`
    );

    // Replace javascript link with inline script for iframe compatibility
    html = html.replace(
      '<script src="main.js"></script>',
      `<script>${js}</script>`
    );

    return html;
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Re-trigger srcDoc update
      iframeRef.current.srcdoc = getCompiledSrcDoc();
    }
  };

  // Keep srcDoc updated with business changes
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = getCompiledSrcDoc();
    }
  }, [info]);

  // Width classes based on simulator option
  const getViewportWidthClass = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl border-[12px] border-zinc-900 rounded-[36px]';
      case 'tablet':
        return 'w-[768px] h-[1024px] shadow-2xl border-[8px] border-zinc-900 rounded-[24px]';
      case 'desktop':
      default:
        return 'w-full h-full rounded-lg border border-zinc-200';
    }
  };

  return (
    <div className="bg-zinc-100 rounded-xl border border-zinc-200/80 overflow-hidden flex flex-col h-full" id="live-preview-panel">
      {/* Simulation Controls Toolbar */}
      <div className="p-3 bg-white border-b border-zinc-200 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Exact Live Preview</h2>
        </div>

        {/* Viewport Toggles */}
        <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/40">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded-md transition-all ${viewport === 'desktop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
            title="Simulate Desktop Layout"
            aria-label="Desktop layout preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded-md transition-all ${viewport === 'tablet' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
            title="Simulate Tablet Viewport"
            aria-label="Tablet layout preview"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded-md transition-all ${viewport === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
            title="Simulate Mobile Experience"
            aria-label="Mobile layout preview"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-md transition-all"
            title="Reload Preview Environment"
            aria-label="Reload preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const win = window.open();
              if (win) {
                win.document.write(getCompiledSrcDoc());
                win.document.close();
              }
            }}
            className="p-1.5 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-md transition-all flex items-center gap-1 text-[10px] font-semibold"
            title="Open Sandbox in New Window"
            aria-label="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>New Tab</span>
          </button>
        </div>
      </div>

      {/* Embedded Render Stage */}
      <div className="flex-grow p-4 overflow-auto flex justify-center items-center bg-zinc-100/50 min-h-[400px]">
        <div className={`transition-all duration-300 overflow-hidden bg-white relative ${getViewportWidthClass()}`}>
          <iframe
            ref={iframeRef}
            srcDoc={getCompiledSrcDoc()}
            className="w-full h-full border-none"
            title="BACS Entity Hub Live Simulator"
            sandbox="allow-scripts allow-modals allow-same-origin"
          />
          {/* Subtle Watermark Overlay on Live Preview */}
          <div className="absolute bottom-3 right-3 pointer-events-none select-none text-[11px] font-bold text-zinc-950 bg-white/60 px-2 py-0.5 rounded border border-zinc-200/20" style={{ opacity: 0.15 }}>
            BACS Entity Hub™
          </div>
        </div>
      </div>

      {/* Responsive Info bar */}
      <div className="bg-white border-t border-zinc-200 p-2.5 text-[10px] text-zinc-500 flex justify-between items-center">
        <span>Active Theme Preset: <strong className="font-bold text-zinc-700 capitalize">{info.theme.style}</strong></span>
        <span>Active Typography: <strong className="font-bold text-zinc-700 capitalize">{info.typography}</strong></span>
      </div>
    </div>
  );
}
