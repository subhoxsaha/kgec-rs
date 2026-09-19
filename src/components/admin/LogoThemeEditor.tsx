import React, { useState, useRef } from 'react';
import {
  Upload,
  RefreshCw,
  Sun,
  Moon,
  ArrowLeftRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { compressImageFile } from '../../utils/imageUtils';
import {
  DEFAULT_KGEC_LOGO_LIGHT,
  DEFAULT_KGEC_LOGO_DARK,
  DEFAULT_KRS_LOGO_LIGHT,
  DEFAULT_KRS_LOGO_DARK,
} from '../../data/reportData';

export const LogoThemeEditor: React.FC = () => {
  const { metadata, updateMetadata, showToast } = useReportData();
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');

  // Input states
  const [kgecUrl, setKgecUrl] = useState('');
  const [krsUrl, setKrsUrl] = useState('');

  // File input refs
  const kgecFileRef = useRef<HTMLInputElement>(null);
  const krsFileRef = useRef<HTMLInputElement>(null);

  const handleKgecUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, SVG, JPG, WebP)');
      return;
    }
    compressImageFile(file, 512, 512, 0.9)
      .then((dataUrl) => {
        if (dataUrl) {
          updateMetadata({
            logo1: dataUrl,
            logo1Light: dataUrl,
            logo1Dark: dataUrl,
          });
          showToast('KGEC Emblem updated successfully!');
        }
      })
      .catch(() => {
        showToast('Failed to process image file');
      });
  };

  const handleKrsUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, SVG, JPG, WebP)');
      return;
    }
    compressImageFile(file, 512, 512, 0.9)
      .then((dataUrl) => {
        if (dataUrl) {
          updateMetadata({
            logo2: dataUrl,
            logo2Light: dataUrl,
            logo2Dark: dataUrl,
            footerLogoLight: dataUrl,
            footerLogoDark: dataUrl,
          });
          showToast('KRS Emblem updated successfully!');
        }
      })
      .catch(() => {
        showToast('Failed to process image file');
      });
  };

  const applyKgecUrl = () => {
    if (!kgecUrl.trim()) return;
    const url = kgecUrl.trim();
    updateMetadata({
      logo1: url,
      logo1Light: url,
      logo1Dark: url,
    });
    setKgecUrl('');
    showToast('KGEC Emblem URL updated!');
  };

  const applyKrsUrl = () => {
    if (!krsUrl.trim()) return;
    const url = krsUrl.trim();
    updateMetadata({
      logo2: url,
      logo2Light: url,
      logo2Dark: url,
      footerLogoLight: url,
      footerLogoDark: url,
    });
    setKrsUrl('');
    showToast('KRS Emblem URL updated!');
  };

  // Compute currently active logos for preview
  const currentKgecPreview =
    previewTheme === 'light'
      ? metadata.logo1Light || metadata.logo1 || DEFAULT_KGEC_LOGO_LIGHT
      : metadata.logo1Dark || metadata.logo1 || DEFAULT_KGEC_LOGO_DARK;

  const currentKrsPreview =
    previewTheme === 'light'
      ? metadata.logo2Light || metadata.logo2 || DEFAULT_KRS_LOGO_LIGHT
      : metadata.logo2Dark || metadata.logo2 || DEFAULT_KRS_LOGO_DARK;

  const handleSwap = () => {
    updateMetadata({
      logo1Light: metadata.logo2Light || DEFAULT_KRS_LOGO_LIGHT,
      logo1Dark: metadata.logo2Dark || DEFAULT_KRS_LOGO_DARK,
      logo1: metadata.logo2 || DEFAULT_KRS_LOGO_DARK,
      logo2Light: metadata.logo1Light || DEFAULT_KGEC_LOGO_LIGHT,
      logo2Dark: metadata.logo1Dark || DEFAULT_KGEC_LOGO_DARK,
      logo2: metadata.logo1 || DEFAULT_KGEC_LOGO_DARK,
      logo1Alt: metadata.logo2Alt || 'KRS Logo',
      logo2Alt: metadata.logo1Alt || 'KGEC Logo',
    });
    showToast('Swapped College & Society logo positions');
  };

  return (
    <div className="space-y-5 text-[#243324] dark:text-[#F4EFE6]">
      {/* Informative Header Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200">
            Brand Emblems &amp; Logos
          </p>
          <p className="text-[#3F543C] dark:text-[#CBD7C7] text-[11px] leading-relaxed">
            Upload or link high-resolution emblems for Kalyani Government Engineering College and the KGEC Robotics Society. Changes sync seamlessly across navigation bars, headers, and footers.
          </p>
        </div>
      </div>

      {/* Unified Live Preview Bar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Live Preview ({previewTheme.toUpperCase()} MODE)
          </span>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle Button */}
            <div className="flex items-center rounded-lg bg-[#243324]/10 dark:bg-white/10 p-0.5">
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  previewTheme === 'light'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                  previewTheme === 'dark'
                    ? 'bg-emerald-900 text-white shadow-2xs'
                    : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
                }`}
              >
                <Moon className="w-3 h-3 text-emerald-300" />
                <span>Dark</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-[#243324]/15 dark:border-white/15 text-[#4A5D44] dark:text-[#CBD7C7] hover:bg-black/5 dark:hover:bg-white/5 font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="Swap Logo 1 and Logo 2"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>Swap Order</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Card */}
        <div
          className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between ${
            previewTheme === 'light'
              ? 'bg-[#FAF7F0] border-[#243324]/15 text-[#1F2B1D]'
              : 'bg-[#0E150D] border-white/15 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center p-0.5 border shadow-2xs bg-white/90">
              <img src={currentKgecPreview} alt="KGEC" className="w-full h-full object-contain" />
            </div>
            <span className={previewTheme === 'light' ? 'text-neutral-400 font-light' : 'text-white/40 font-light'}>•</span>
            <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center p-0.5 border shadow-2xs bg-white/90">
              <img src={currentKrsPreview} alt="KRS" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold">KGEC Robotics Society</p>
              <p className={`text-[10px] ${previewTheme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>Official Technical Report</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. College Logo (KGEC) Single Clean Section */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
              Logo 1: College Emblem (KGEC)
            </h3>
            <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
              Kalyani Government Engineering College emblem
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              updateMetadata({
                logo1Light: DEFAULT_KGEC_LOGO_LIGHT,
                logo1Dark: DEFAULT_KGEC_LOGO_DARK,
                logo1: DEFAULT_KGEC_LOGO_DARK,
              });
              showToast('Restored KGEC default emblem');
            }}
            className="text-[10px] px-2 py-1 rounded border border-[#243324]/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
          <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 dark:border-white/20 p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
            <img
              src={metadata.logo1 || metadata.logo1Dark || DEFAULT_KGEC_LOGO_DARK}
              alt="KGEC Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 space-y-2">
            <input
              type="file"
              ref={kgecFileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleKgecUpload(e.target.files[0]);
              }}
            />

            <div className="flex gap-1.5">
              <input
                type="url"
                placeholder="Paste logo image URL..."
                value={kgecUrl}
                onChange={(e) => setKgecUrl(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0D150C] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
              <button
                type="button"
                onClick={applyKgecUrl}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium cursor-pointer transition-colors shadow-2xs"
              >
                Apply URL
              </button>
              <button
                type="button"
                onClick={() => kgecFileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-[#243324]/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Upload image file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Society Logo (KRS) Single Clean Section */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
              Logo 2: Society Emblem (KRS)
            </h3>
            <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
              KGEC Robotics Society official insignia
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              updateMetadata({
                logo2Light: DEFAULT_KRS_LOGO_LIGHT,
                logo2Dark: DEFAULT_KRS_LOGO_DARK,
                logo2: DEFAULT_KRS_LOGO_DARK,
                footerLogoLight: DEFAULT_KRS_LOGO_LIGHT,
                footerLogoDark: DEFAULT_KRS_LOGO_DARK,
              });
              showToast('Restored KRS default emblem');
            }}
            className="text-[10px] px-2 py-1 rounded border border-[#243324]/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
          <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 dark:border-white/20 p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
            <img
              src={metadata.logo2 || metadata.logo2Dark || DEFAULT_KRS_LOGO_DARK}
              alt="KRS Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 space-y-2">
            <input
              type="file"
              ref={krsFileRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleKrsUpload(e.target.files[0]);
              }}
            />

            <div className="flex gap-1.5">
              <input
                type="url"
                placeholder="Paste logo image URL..."
                value={krsUrl}
                onChange={(e) => setKrsUrl(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0D150C] border border-[#243324]/15 dark:border-white/15 font-mono"
              />
              <button
                type="button"
                onClick={applyKrsUrl}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium cursor-pointer transition-colors shadow-2xs"
              >
                Apply URL
              </button>
              <button
                type="button"
                onClick={() => krsFileRef.current?.click()}
                className="px-3 py-1.5 rounded-lg border border-[#243324]/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Upload image file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
