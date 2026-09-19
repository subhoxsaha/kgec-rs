import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  RotateCcw,
  LogOut,
  Upload,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { MongoDbStatusWidget } from './MongoDbStatusWidget';

export const ToolsEditor: React.FC = () => {
  const {
    exportConfigAsJson,
    importConfigFromJson,
    resetAllToDefaults,
    logoutAdmin,
    showToast,
  } = useReportData();

  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleCopy = () => {
    const json = exportConfigAsJson();
    navigator.clipboard.writeText(json);
    setCopied(true);
    showToast('Configuration copied to clipboard');
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

  const handleImport = () => {
    if (!importJson.trim()) return;
    const ok = importConfigFromJson(importJson);
    if (ok) {
      setImportJson('');
    }
  };

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Delete/Reset Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={showConfirmReset}
        title="Reset Entire CMS to Factory Defaults?"
        itemName="All Custom Content & Telemetry"
        itemType="CMS database"
        confirmButtonText="Yes, Factory Reset All"
        warningText="Are you sure you want to reset everything? All customized logos, custom robots, event photos, and modified narratives will be reverted back to initial factory defaults."
        onConfirm={() => {
          resetAllToDefaults();
          setShowConfirmReset(false);
        }}
        onCancel={() => setShowConfirmReset(false)}
      />

      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <p className="text-emerald-950 dark:text-emerald-200">
          MongoDB cloud persistence, JSON snapshots, and KGEC Robotics Society baseline telemetry controls.
        </p>
      </div>

      {/* Live MongoDB Status & Sync Widget */}
      <MongoDbStatusWidget />

      {/* Export & Backup */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
          Export Configuration Snapshot
        </h3>
        <p className="text-xs text-[#657351] dark:text-[#9FB19A]">
          Download or copy the full state (dual logos, photos, metrics, section texts, wings, roadmap) in JSON.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#243324]/10 dark:bg-white/10 hover:bg-[#243324]/20 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json File</span>
          </button>
        </div>
      </div>

      {/* Import Configuration */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
          Import / Restore From JSON
        </h3>
        <p className="text-xs text-[#657351] dark:text-[#9FB19A]">
          Paste a previously exported configuration JSON payload to restore all site telemetry and content.
        </p>
        <textarea
          rows={3}
          placeholder="Paste JSON configuration payload here..."
          value={importJson}
          onChange={(e) => setImportJson(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={!importJson.trim()}
          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import &amp; Apply JSON</span>
        </button>
      </div>

      {/* Factory Reset & Admin Session */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-rose-500/20 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Danger Zone: Reset &amp; Session</span>
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div>
            <p className="text-xs font-semibold">Factory Reset All Content</p>
            <p className="text-[11px] text-[#657351] dark:text-[#9FB19A]">
              Clears browser local storage and restores all original default values.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10 text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Defaults</span>
          </button>
        </div>

        <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Admin Authentication Session</p>
            <p className="text-[11px] text-[#657351] dark:text-[#9FB19A]">
              Authorized as subhoxsaha@gmail.com
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
