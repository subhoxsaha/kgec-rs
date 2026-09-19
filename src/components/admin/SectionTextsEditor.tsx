import React from 'react';
import { Type, Sparkles } from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';

export const SectionTextsEditor: React.FC = () => {
  const { sectionTexts, updateSectionTexts } = useReportData();

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <p className="text-emerald-950 dark:text-emerald-200">
          Modify live copy across all public sections of the report. Changes apply instantaneously.
        </p>
      </div>

      {/* 1. Hero Section */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <Type className="w-3 h-3 text-emerald-600" />
          <span>Hero Banner Copy</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Hero Eyebrow Tagline
            </label>
            <input
              type="text"
              value={sectionTexts.heroTagline || ''}
              onChange={(e) => updateSectionTexts({ heroTagline: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Hero Main Headline
            </label>
            <input
              type="text"
              value={sectionTexts.heroTitle || ''}
              onChange={(e) => updateSectionTexts({ heroTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-display font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Hero Narrative Description
            </label>
            <textarea
              rows={3}
              value={sectionTexts.heroDescription || ''}
              onChange={(e) => updateSectionTexts({ heroDescription: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
            />
          </div>

          {/* Hero Quick Highlight / Stats Pills */}
          <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 space-y-2">
            <label className="block text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Hero Interactive Highlight Pills
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E]">Pill 1 (Trophy Icon)</span>
                <input
                  type="text"
                  value={sectionTexts.heroPill1Text || ''}
                  onChange={(e) => updateSectionTexts({ heroPill1Text: e.target.value })}
                  placeholder="e.g. 48+ National Podiums"
                  className="w-full px-2 py-1 text-xs rounded-md bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
                <input
                  type="text"
                  value={sectionTexts.heroPill1Target || ''}
                  onChange={(e) => updateSectionTexts({ heroPill1Target: e.target.value })}
                  placeholder="#overview-section"
                  className="w-full px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-black/40 border border-[#243324]/10 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E]">Pill 2 (Users Icon)</span>
                <input
                  type="text"
                  value={sectionTexts.heroPill2Text || ''}
                  onChange={(e) => updateSectionTexts({ heroPill2Text: e.target.value })}
                  placeholder="e.g. 180+ Active Engineers"
                  className="w-full px-2 py-1 text-xs rounded-md bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
                <input
                  type="text"
                  value={sectionTexts.heroPill2Target || ''}
                  onChange={(e) => updateSectionTexts({ heroPill2Target: e.target.value })}
                  placeholder="#wings-section"
                  className="w-full px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-black/40 border border-[#243324]/10 dark:border-white/10"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#526340] dark:text-[#A3B59E]">Pill 3 (Bot Icon)</span>
                <input
                  type="text"
                  value={sectionTexts.heroPill3Text || ''}
                  onChange={(e) => updateSectionTexts({ heroPill3Text: e.target.value })}
                  placeholder="e.g. 26 Flagship Bot Builds"
                  className="w-full px-2 py-1 text-xs rounded-md bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
                <input
                  type="text"
                  value={sectionTexts.heroPill3Target || ''}
                  onChange={(e) => updateSectionTexts({ heroPill3Target: e.target.value })}
                  placeholder="#projects-section"
                  className="w-full px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-black/40 border border-[#243324]/10 dark:border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overview & Motto Section */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <Type className="w-3 h-3 text-emerald-600" />
          <span>Overview &amp; Action Video</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Overview Lead Heading
            </label>
            <input
              type="text"
              value={sectionTexts.overviewHeading || ''}
              onChange={(e) => updateSectionTexts({ overviewHeading: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Motto Heading
            </label>
            <input
              type="text"
              value={sectionTexts.mottoHeading || ''}
              onChange={(e) => updateSectionTexts({ mottoHeading: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Motto Subtitle / Tagline
            </label>
            <textarea
              rows={2}
              value={sectionTexts.mottoTagline || ''}
              onChange={(e) => updateSectionTexts({ mottoTagline: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Action Video YouTube / Video Embed URL
            </label>
            <input
              type="url"
              value={sectionTexts.mottoVideoUrl || ''}
              onChange={(e) => updateSectionTexts({ mottoVideoUrl: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. About Us & Quote */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
          <Type className="w-3 h-3 text-emerald-600" />
          <span>About Us &amp; Philosophy Quote</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              About Heading
            </label>
            <input
              type="text"
              value={sectionTexts.aboutTitle || ''}
              onChange={(e) => updateSectionTexts({ aboutTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              About Paragraph 1
            </label>
            <textarea
              rows={3}
              value={sectionTexts.aboutParagraph1 || ''}
              onChange={(e) => updateSectionTexts({ aboutParagraph1: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              About Paragraph 2
            </label>
            <textarea
              rows={3}
              value={sectionTexts.aboutParagraph2 || ''}
              onChange={(e) => updateSectionTexts({ aboutParagraph2: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Philosophy Quote Text
            </label>
            <input
              type="text"
              value={sectionTexts.aboutQuote || ''}
              onChange={(e) => updateSectionTexts({ aboutQuote: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 italic"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Philosophy Quote Author
            </label>
            <input
              type="text"
              value={sectionTexts.aboutQuoteAuthor || ''}
              onChange={(e) => updateSectionTexts({ aboutQuoteAuthor: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
