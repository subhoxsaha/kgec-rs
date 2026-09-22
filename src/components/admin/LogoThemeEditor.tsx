import React, { useState } from 'react';
import {
  Sun,
  Moon,
  FolderTree,
  Sparkles,
  Info,
  CheckCircle2,
  FileCode2,
  ExternalLink,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { STATIC_LOGOS } from '../../utils/logoUtils';

export const LogoThemeEditor: React.FC = () => {
  const { showToast } = useReportData();
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');

  const logosConfig = [
    {
      id: 'kgec',
      name: 'College Emblem (KGEC)',
      subtitle: 'Kalyani Government Engineering College Official Emblem',
      lightFile: 'kgec-logo-light.svg',
      darkFile: 'kgec-logo-dark.svg',
      lightSrc: STATIC_LOGOS.kgec.light,
      darkSrc: STATIC_LOGOS.kgec.dark,
    },
    {
      id: 'krs',
      name: 'Society Emblem (KRS)',
      subtitle: 'KGEC Robotics Society Official Insignia',
      lightFile: 'krs-logo-light.svg',
      darkFile: 'krs-logo-dark.svg',
      lightSrc: STATIC_LOGOS.krs.light,
      darkSrc: STATIC_LOGOS.krs.dark,
    },
  ];

  return (
    <div className="space-y-5 text-[#243324] dark:text-[#F4EFE6]">
      {/* Informative Header Banner */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-3">
        <FolderTree className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
            Static File-Based Logo Architecture (/logos/)
          </p>
          <p className="text-[#3F543C] dark:text-[#CBD7C7] text-xs leading-relaxed">
            Logos are loaded directly from the static <code className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-[11px] text-emerald-800 dark:text-emerald-200">/logos/</code> directory.
            To update any logo, simply upload or replace the file in the <code className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-[11px] text-emerald-800 dark:text-emerald-200">public/logos/</code> folder with the exact matching filename.
          </p>
        </div>
      </div>

      {/* Unified Live Preview Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
              Theme Simulation ({previewTheme.toUpperCase()} MODE)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle Button */}
            <div className="flex items-center rounded-lg bg-[#243324]/10 dark:bg-white/10 p-0.5">
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                  previewTheme === 'light'
                    ? 'bg-white text-emerald-800 shadow-2xs'
                    : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light Theme</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
                  previewTheme === 'dark'
                    ? 'bg-emerald-900 text-white shadow-2xs'
                    : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dark Theme</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Simulation Navbar Preview */}
        <div
          className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            previewTheme === 'light'
              ? 'bg-[#FAF7F0] border-[#243324]/15 text-[#1F2B1D]'
              : 'bg-[#0E150D] border-white/15 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Logo 1 */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-1 border shadow-xs bg-white">
              <img
                src={previewTheme === 'light' ? STATIC_LOGOS.kgec.light : STATIC_LOGOS.kgec.dark}
                alt="KGEC Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className={previewTheme === 'light' ? 'text-neutral-400 font-light' : 'text-white/40 font-light'}>|</span>
            {/* Logo 2 */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-1 border shadow-xs bg-white">
              <img
                src={previewTheme === 'light' ? STATIC_LOGOS.krs.light : STATIC_LOGOS.krs.dark}
                alt="KRS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">KGEC Robotics Society</p>
              <p className={`text-xs ${previewTheme === 'light' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                Kalyani Government Engineering College
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active in Navbar &amp; Footer
            </span>
          </div>
        </div>
      </div>

      {/* Directory File Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logosConfig.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
                {item.name}
              </h3>
              <p className="text-[11px] text-[#657351] dark:text-[#A3B59E]">
                {item.subtitle}
              </p>
            </div>

            {/* Two Theme Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Light Theme File */}
              <div className="p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <Sun className="w-3 h-3 text-amber-500" />
                    Light Theme
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live</span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-lg bg-white border border-neutral-200 dark:border-white/20 p-1 flex items-center justify-center shadow-xs">
                  <img src={item.lightSrc} alt={`${item.name} (Light)`} className="w-full h-full object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-emerald-800 dark:text-emerald-300 font-medium truncate" title={item.lightFile}>
                    /logos/{item.lightFile}
                  </p>
                </div>
              </div>

              {/* Dark Theme File */}
              <div className="p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                    <Moon className="w-3 h-3 text-emerald-400" />
                    Dark Theme
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Live</span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-lg bg-[#0d140e] border border-neutral-700 dark:border-white/20 p-1 flex items-center justify-center shadow-xs">
                  <img src={item.darkSrc} alt={`${item.name} (Dark)`} className="w-full h-full object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-emerald-800 dark:text-emerald-300 font-medium truncate" title={item.darkFile}>
                    /logos/{item.darkFile}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions Card */}
      <div className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#131E12] border border-[#243324]/10 dark:border-white/10 text-xs space-y-2.5">
        <h4 className="font-semibold text-xs text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>How to update logos:</span>
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
          <li>
            Prepare your logo in SVG or PNG format (recommended size: 512x512 with transparent background).
          </li>
          <li>
            Name your files exactly as listed above: <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">kgec-logo-light.svg</code>, <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">kgec-logo-dark.svg</code>, <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">krs-logo-light.svg</code>, <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">krs-logo-dark.svg</code>.
          </li>
          <li>
            Place or overwrite them directly into the <code className="font-mono font-bold text-emerald-700 dark:text-emerald-300">/public/logos/</code> folder.
          </li>
          <li>
            The website automatically displays the newly uploaded logo across all headers, navigation bars, and footers without requiring database queries.
          </li>
        </ol>
      </div>
    </div>
  );
};
