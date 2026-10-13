import React from 'react';
import { Type, Sparkles, FolderTree, BookOpen, Film, Quote } from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';

export const SectionTextsEditor: React.FC = () => {
  const { sectionTexts } = useReportData();

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-emerald-950 dark:text-emerald-200">
              Section Narratives &amp; Editorial Copy (Read-Only)
            </p>
            <p className="text-emerald-900/80 dark:text-emerald-300/80 text-[11px]">
              Review the hardcoded narrative headlines, philosophy statements, and interactive pills across all sections.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
          <FolderTree className="w-3.5 h-3.5" />
          <span>Hardcoded Content</span>
        </span>
      </div>

      {/* 1. Hero Section */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hero Banner &amp; Headline</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Section 1
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              Eyebrow Tagline
            </span>
            <p className="font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
              {sectionTexts.heroTagline || 'KALYANI GOVERNMENT ENGINEERING COLLEGE'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              Main Display Headline
            </span>
            <p className="text-sm font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {sectionTexts.heroTitle || 'KGEC ROBOTICS SOCIETY'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              Hero Narrative Description
            </span>
            <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
              {sectionTexts.heroDescription}
            </p>
          </div>

          {/* Hero Quick Highlight / Stats Pills */}
          <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 space-y-2">
            <span className="block text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Hero Highlight Navigation Pills
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E] block">Pill 1 (Trophy)</span>
                <p className="font-semibold text-xs mt-0.5">{sectionTexts.heroPill1Text || '48+ National Podiums'}</p>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">{sectionTexts.heroPill1Target || '#overview-section'}</span>
              </div>

              <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E] block">Pill 2 (Engineers)</span>
                <p className="font-semibold text-xs mt-0.5">{sectionTexts.heroPill2Text || '180+ Active Engineers'}</p>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">{sectionTexts.heroPill2Target || '#leadership-team-section'}</span>
              </div>

              <div className="p-2 rounded bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E] block">Pill 3 (Bots)</span>
                <p className="font-semibold text-xs mt-0.5">{sectionTexts.heroPill3Text || '26 Flagship Bot Builds'}</p>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 block mt-0.5">{sectionTexts.heroPill3Target || '#projects-section'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overview & Motto Section */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-emerald-600" />
            <span>Overview &amp; Action Reel</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Section 2
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              Overview Lead Heading
            </span>
            <p className="font-semibold text-xs text-[#1F2B1D] dark:text-white">
              {sectionTexts.overviewHeading || 'Engineering Tomorrow’s Autonomy Today'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              Motto Heading &amp; Tagline
            </span>
            <p className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
              {sectionTexts.mottoHeading || 'Innovation • Grit • Engineering Discipline'}
            </p>
            <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] mt-1 leading-relaxed">
              {sectionTexts.mottoTagline}
            </p>
          </div>

          {sectionTexts.mottoVideoUrl && (
            <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
              <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
                Action Reel Video URL
              </span>
              <p className="font-mono text-[11px] text-emerald-800 dark:text-emerald-400 truncate">
                {sectionTexts.mottoVideoUrl}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. About Us & Philosophy Quote */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>About Us &amp; Philosophy Quote</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            Section 3
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              About Heading
            </span>
            <p className="font-bold text-xs text-[#1F2B1D] dark:text-white">
              {sectionTexts.aboutTitle || 'A Legacy of Mechatronics Excellence'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              About Paragraph 1
            </span>
            <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
              {sectionTexts.aboutParagraph1}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10">
            <span className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] uppercase mb-0.5">
              About Paragraph 2
            </span>
            <p className="text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
              {sectionTexts.aboutParagraph2}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2">
            <Quote className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="italic text-[#1F2B1D] dark:text-[#F4EFE6] leading-relaxed">
                &ldquo;{sectionTexts.aboutQuote}&rdquo;
              </p>
              <p className="font-mono text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                — {sectionTexts.aboutQuoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
