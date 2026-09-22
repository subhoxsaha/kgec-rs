import React, { useState } from 'react';
import {
  Sun,
  Moon,
  FolderTree,
  Sparkles,
  Info,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { ThemedLogo } from '../ThemedLogo';
import { LogoType } from '../../utils/logoUtils';

export const LogoThemeEditor: React.FC = () => {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');

  const logosConfig: {
    id: LogoType;
    name: string;
    subtitle: string;
    lightFile: string;
    darkFile: string;
    supportedExts: string;
  }[] = [
    {
      id: 'kgec',
      name: 'College Emblem (KGEC)',
      subtitle: 'Kalyani Government Engineering College Official Emblem',
      lightFile: 'kgec-logo-light.(png/jpg/svg/webp)',
      darkFile: 'kgec-logo-dark.(png/jpg/svg/webp)',
      supportedExts: '.png, .jpg, .jpeg, .svg, .webp',
    },
    {
      id: 'krs',
      name: 'Society Emblem (KRS)',
      subtitle: 'KGEC Robotics Society Official Insignia',
      lightFile: 'krs-logo-light.(png/jpg/svg/webp)',
      darkFile: 'krs-logo-dark.(png/jpg/svg/webp)',
      supportedExts: '.png, .jpg, .jpeg, .svg, .webp',
    },
  ];

  return (
    <div className="space-y-5 text-[#243324] dark:text-[#F4EFE6]">
      {/* Informative Header Banner */}
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-3">
        <FolderTree className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">
            Multi-Format Static Logo Support (PNG, JPG, JPEG, SVG, WebP)
          </p>
          <p className="text-[#3F543C] dark:text-[#CBD7C7] text-xs leading-relaxed">
            Logos are loaded directly from the <code className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-mono text-[11px] text-emerald-800 dark:text-emerald-200">/logos/</code> directory.
            You can use <strong>.png</strong>, <strong>.jpg</strong>, <strong>.jpeg</strong>, <strong>.svg</strong>, or <strong>.webp</strong> formats interchangeably. The website automatically falls back and renders whichever format you upload.
          </p>
        </div>
      </div>

      {/* Unified Live Preview Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
              Live Simulation ({previewTheme.toUpperCase()} MODE)
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
              <ThemedLogo
                type="kgec"
                isDark={previewTheme === 'dark'}
                alt="KGEC Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className={previewTheme === 'light' ? 'text-neutral-400 font-light' : 'text-white/40 font-light'}>|</span>
            {/* Logo 2 */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-1 border shadow-xs bg-white">
              <ThemedLogo
                type="krs"
                isDark={previewTheme === 'dark'}
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
              Active across Navbar, Hero &amp; Footer
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
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
                  {item.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
                  PNG / JPG / SVG
                </span>
              </div>
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
                    Light Mode
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Ready</span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-lg bg-white border border-neutral-200 dark:border-white/20 p-1 flex items-center justify-center shadow-xs">
                  <ThemedLogo type={item.id} isDark={false} alt={`${item.name} (Light)`} className="w-full h-full object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-emerald-800 dark:text-emerald-300 font-medium truncate" title={item.lightFile}>
                    /logos/{item.id}-logo-light.(png/jpg/svg)
                  </p>
                </div>
              </div>

              {/* Dark Theme File */}
              <div className="p-3 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                    <Moon className="w-3 h-3 text-emerald-400" />
                    Dark Mode
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Ready</span>
                </div>
                <div className="w-12 h-12 mx-auto rounded-lg bg-[#0d140e] border border-neutral-700 dark:border-white/20 p-1 flex items-center justify-center shadow-xs">
                  <ThemedLogo type={item.id} isDark={true} alt={`${item.name} (Dark)`} className="w-full h-full object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-mono text-[10px] text-emerald-800 dark:text-emerald-300 font-medium truncate" title={item.darkFile}>
                    /logos/{item.id}-logo-dark.(png/jpg/svg)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supported formats checklist */}
      <div className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#131E12] border border-[#243324]/10 dark:border-white/10 text-xs space-y-3">
        <h4 className="font-semibold text-xs text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Accepted File Formats &amp; Naming Conventions:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#4A5D44] dark:text-[#CBD7C7]">
          <div className="p-2.5 rounded-lg bg-white/60 dark:bg-black/20 border border-[#243324]/5 dark:border-white/5 space-y-1">
            <p className="font-bold text-[#1F2B1D] dark:text-white">KGEC College Emblem:</p>
            <ul className="space-y-0.5 font-mono text-[10.5px]">
              <li>• <code className="text-emerald-700 dark:text-emerald-300">kgec-logo-light.png</code> / <code className="text-emerald-700 dark:text-emerald-300">.jpg</code> / <code className="text-emerald-700 dark:text-emerald-300">.svg</code></li>
              <li>• <code className="text-emerald-700 dark:text-emerald-300">kgec-logo-dark.png</code> / <code className="text-emerald-700 dark:text-emerald-300">.jpg</code> / <code className="text-emerald-700 dark:text-emerald-300">.svg</code></li>
            </ul>
          </div>
          <div className="p-2.5 rounded-lg bg-white/60 dark:bg-black/20 border border-[#243324]/5 dark:border-white/5 space-y-1">
            <p className="font-bold text-[#1F2B1D] dark:text-white">KRS Society Insignia:</p>
            <ul className="space-y-0.5 font-mono text-[10.5px]">
              <li>• <code className="text-emerald-700 dark:text-emerald-300">krs-logo-light.png</code> / <code className="text-emerald-700 dark:text-emerald-300">.jpg</code> / <code className="text-emerald-700 dark:text-emerald-300">.svg</code></li>
              <li>• <code className="text-emerald-700 dark:text-emerald-300">krs-logo-dark.png</code> / <code className="text-emerald-700 dark:text-emerald-300">.jpg</code> / <code className="text-emerald-700 dark:text-emerald-300">.svg</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
