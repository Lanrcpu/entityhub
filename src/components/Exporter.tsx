/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusinessInfo } from '../types';
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
import { getMissingCriticalFields } from './BacsAssist';
import { FolderArchive, FileCode, CheckCircle, Download, FileText, Code2, Globe } from 'lucide-react';
import BacsAssist from './BacsAssist';

interface ExporterProps {
  info: BusinessInfo;
}

interface ExportFile {
  path: string;
  category: 'html' | 'css' | 'js' | 'json' | 'text' | 'schema';
  getContent: (info: BusinessInfo) => string;
}

export default function Exporter({ info }: ExporterProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const missingFields = getMissingCriticalFields(info);
  const isIncompletePackage = missingFields.length > 0;

  const exportFiles: ExportFile[] = [
    { path: 'index.html', category: 'html', getContent: generateIndexHtml },
    { path: '404.html', category: 'html', getContent: generate404Html },
    { path: 'style.css', category: 'css', getContent: generateStyleCss },
    { path: 'main.js', category: 'js', getContent: generateMainJs },
    { path: 'schema/graph.jsonld', category: 'schema', getContent: generateGraphJsonLd },
    { path: 'entity.json', category: 'json', getContent: generateEntityJson },
    { path: 'llms.txt', category: 'text', getContent: generateLlmsText },
    { path: 'robots.txt', category: 'text', getContent: generateRobots },
    { path: 'sitemap.xml', category: 'schema', getContent: generateSitemap },
    { path: 'manifest.webmanifest', category: 'json', getContent: generateManifest },
    { path: 'favicon.svg', category: 'schema', getContent: generateFavicon },
    { path: 'README.md', category: 'text', getContent: generateReadme }
  ];

  const activeFile = exportFiles[selectedFileIndex];
  const activeContent = activeFile ? activeFile.getContent(info) : '';

  // ZIP packaging handler
  const handleZipDownload = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Iterate through files and add them to the zip package
      exportFiles.forEach(file => {
        const content = file.getContent(info);
        zip.file(file.path, content);
      });

      // Generate ZIP archive file
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'entity-hub.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to bundle Entity Hub ZIP package:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200/80 overflow-hidden flex flex-col h-full" id="exporter-card-panel">
      {/* Header Banner */}
      <div className="p-5 bg-zinc-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-indigo-400" />
            Static Compilation &amp; Export
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Complies fully with GitHub Pages, Cloudflare Pages, Netlify, and all server hosts</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleZipDownload}
            disabled={isExporting}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-md ${
              exportSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/10'
            }`}
            id="btn-trigger-zip-download"
          >
            {exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Zip Package Exported!</span>
              </>
            ) : isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Bundling ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download entity-hub.zip</span>
              </>
            )}
          </button>

          {/* Save Draft removed per offline-only preference */}
        </div>
      </div>
      
      {isIncompletePackage && (
        <div className="px-5 pb-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <strong>Notice:</strong> This package was generated with incomplete business information. Some structured data has been omitted from the export.
          </div>
        </div>
      )}

      <div className="px-5 pt-2">
        <BacsAssist info={info} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
        {/* LEFT COLUMN: FILE TREE LIST */}
        <div className="lg:col-span-4 p-4 space-y-4 max-h-[500px] lg:max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Generated Package Architecture</h3>
          <div className="space-y-1">
            {exportFiles.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center transition-all ${
                  selectedFileIndex === idx
                    ? 'bg-zinc-100 font-bold text-indigo-600'
                    : 'hover:bg-zinc-50 font-medium text-zinc-600'
                }`}
                id={`file-tree-item-${idx}`}
              >
                <div className="flex items-center gap-2">
                  {file.category === 'html' && <FileCode className="w-4 h-4 text-orange-500" />}
                  {file.category === 'css' && <Code2 className="w-4 h-4 text-blue-500" />}
                  {file.category === 'js' && <Code2 className="w-4 h-4 text-yellow-500" />}
                  {file.category === 'json' && <FileText className="w-4 h-4 text-purple-500" />}
                  {file.category === 'schema' && <Globe className="w-4 h-4 text-emerald-500" />}
                  {file.category === 'text' && <FileText className="w-4 h-4 text-zinc-500" />}
                  <span className="font-mono">{file.path}</span>
                </div>
                {file.category === 'schema' && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider font-semibold">Schema</span>
                )}
                {file.path === 'llms.txt' && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wider font-semibold">AI Spider</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: RAW SOURCE VIEWER */}
        <div className="lg:col-span-8 flex flex-col max-h-[500px] lg:max-h-[600px] overflow-hidden bg-zinc-950 text-zinc-300">
          <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center px-4">
            <span className="font-mono text-xs text-indigo-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {activeFile?.path}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(activeContent);
                const btn = document.getElementById('btn-copy-source-viewer');
                if (btn) {
                  btn.innerText = 'Copied!';
                  setTimeout(() => { btn.innerText = 'Copy Raw'; }, 1500);
                }
              }}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1 text-white rounded transition-all font-bold"
              id="btn-copy-source-viewer"
            >
              Copy Raw
            </button>
          </div>
          <div className="p-4 overflow-auto flex-grow font-mono text-[11px] leading-relaxed select-all">
            <pre className="whitespace-pre-wrap">{activeContent}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
