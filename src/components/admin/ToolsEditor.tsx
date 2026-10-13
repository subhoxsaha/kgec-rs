import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  LogOut,
  Sparkles,
  ShieldCheck,
  FolderTree,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { MongoDbStatusWidget } from './MongoDbStatusWidget';

export const ToolsEditor: React.FC = () => {
  const {
    exportConfigAsJson,
    logoutAdmin,
    showToast,
    googleUser,
  } = useReportData();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const json = exportConfigAsJson();
    navigator.clipboard.writeText(json);
    setCopied(true);
    showToast('Configuration snapshot copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const json = exportConfigAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kgec-robotics-cms-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded CMS snapshot');
  };

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-950 dark:text-emerald-200">
            System Architecture, Export Tools &amp; Telemetry Status
          </p>
          <p className="text-emerald-900/80 dark:text-emerald-300/80 text-[11px] mt-0.5">
            Download JSON snapshots, inspect MongoDB connection health, or manage active admin session.
          </p>
        </div>
      </div>

      {/* Live MongoDB Status & Sync Widget */}
      <MongoDbStatusWidget />

      {/* Export & Backup */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#243324]/10 dark:border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Configuration Snapshot</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            JSON Snapshot
          </span>
        </div>

        <p className="text-xs text-[#657351] dark:text-[#9FB19A] leading-relaxed">
          Download or copy the complete static configuration (bot fleet, mentors &amp; leadership directory, TECHTIX &amp; ZYRO events, media manifests) into a structured JSON payload for external analysis or archiving.
        </p>

        <div className="flex flex-wrap gap-2 pt-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-[#243324]/10 dark:bg-white/10 hover:bg-[#243324]/20 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json File</span>
          </button>
        </div>
      </div>

      {/* Hardcoded Data File Mapping Reference */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5 text-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <FolderTree className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hardcoded Asset Repository Mappings</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="text-[#526340] dark:text-[#A3B59E] block text-[9.5px]">Team Directory</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">/public/data/team.json</span>
          </div>
          <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="text-[#526340] dark:text-[#A3B59E] block text-[9.5px]">Bot Fleet</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">/public/data/projects.json</span>
          </div>
          <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="text-[#526340] dark:text-[#A3B59E] block text-[9.5px]">Fest Arenas</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">/public/data/events.json</span>
          </div>
          <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="text-[#526340] dark:text-[#A3B59E] block text-[9.5px]">Brand Logos</span>
            <span className="text-emerald-800 dark:text-emerald-300 font-bold">/public/logos/</span>
          </div>
        </div>
      </div>

      {/* Admin Session Strip */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Authentication Session</span>
            </p>
            <p className="text-[11px] text-[#657351] dark:text-[#9FB19A] font-mono mt-0.5">
              Authenticated as {googleUser?.email || 'subhoxsaha@gmail.com'}
            </p>
          </div>

          <button
            type="button"
            onClick={logoutAdmin}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock CMS &amp; Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
