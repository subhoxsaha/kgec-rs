import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BOT_SQUADS_DATA } from '../data/reportData';
import { RooftopCalculator } from './RooftopCalculator';
import { Shield, Cpu, Award, Zap, Users, Box } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';

export const SectorImpactSection: React.FC = () => {
  const { sectionTexts } = useReportData();
  const [selectedCategory, setSelectedCategory] = useState<string>(BOT_SQUADS_DATA[0].category);
  const selectedSquad = BOT_SQUADS_DATA.find((s) => s.category === selectedCategory) || BOT_SQUADS_DATA[0];

  return (
    <section
      id="squads-section"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#F5F2EB] dark:bg-[#182417] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-7 sm:space-y-8">
        {/* Headline */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-wide uppercase text-[#526340] dark:text-[#A3B59E]">
              Competition Squads & Robot Fleet
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            {sectionTexts.sectorTitle}
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            {sectionTexts.sectorDescription}
          </p>
        </div>

        {/* Squad Navigation Strip */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {BOT_SQUADS_DATA.map((squad) => {
            const isSelected = selectedCategory === squad.category;
            return (
              <button
                key={squad.category}
                type="button"
                onClick={() => setSelectedCategory(squad.category)}
                className={`px-5 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1F2B1D] dark:bg-[#384E36] text-white dark:text-[#F4EFE6] shadow-sm'
                    : 'bg-white dark:bg-[#263925] text-[#3B4D36] dark:text-[#E2EBE0] hover:bg-white/80 dark:hover:bg-[#30482F] border border-[#243324]/10 dark:border-white/12'
                }`}
              >
                {squad.category}
              </button>
            );
          })}
        </div>

        {/* Detailed Squad Spotlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSquad.category}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="p-8 sm:p-12 rounded-[2.5rem] bg-white dark:bg-[#243723] border border-[#243324]/10 dark:border-white/12 shadow-lg space-y-8 transition-colors duration-400"
          >
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#243324]/10 dark:border-white/10 pb-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 text-xs font-mono mb-2">
                  WEIGHT CLASS: {selectedSquad.weightClass}
                </div>
                <h3 className="font-display text-3xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {selectedSquad.category}
                </h3>
                <p className="text-base sm:text-lg text-[#4A5D44] dark:text-[#CBD7C7] font-light pt-1">
                  {selectedSquad.primaryRole}
                </p>
              </div>
              <div className="text-left md:text-right font-mono">
                <span className="font-display text-4xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {selectedSquad.botsBuilt}
                </span>
                <span className="block text-xs uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                  Combat & Custom Bots Built
                </span>
              </div>
            </div>

            {/* Squad Key Specs */}
            <div className="p-4 rounded-xl bg-[#F5F2EB] dark:bg-[#1A2819] border border-[#243324]/10 dark:border-white/10 space-y-1 font-mono text-xs sm:text-sm">
              <span className="text-[#526340] dark:text-[#9FB19A] uppercase tracking-wider block">
                Flagship Technical Specifications:
              </span>
              <p className="text-[#1F2B1D] dark:text-[#E2EBE0] font-medium">
                {selectedSquad.keySpecs}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2 font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#526340] dark:text-[#A3B59E]">
                  <Users className="w-3.5 h-3.5" />
                  <span>Cadre Size</span>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  {selectedSquad.squadSize}
                </span>
                <span className="block text-xs text-[#657351] dark:text-[#A3B59E]">
                  Engineers & Pilots
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#526340] dark:text-[#A3B59E]">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Championships</span>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400">
                  {selectedSquad.podiumsWon}
                </span>
                <span className="block text-xs text-[#657351] dark:text-[#A3B59E]">
                  Podium Victories
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#526340] dark:text-[#A3B59E]">
                  <Zap className="w-3.5 h-3.5 text-blue-500" />
                  <span>R&D Grant</span>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  ₹{(selectedSquad.sponsoredFundsInr / 100000).toFixed(1)}L
                </span>
                <span className="block text-xs text-[#657351] dark:text-[#A3B59E]">
                  Prototyping Grant
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#526340] dark:text-[#A3B59E]">
                  <Box className="w-3.5 h-3.5 text-purple-500" />
                  <span>Readiness</span>
                </div>
                <span className="font-display text-2xl sm:text-3xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                  100%
                </span>
                <span className="block text-xs text-[#657351] dark:text-[#A3B59E]">
                  Arena Verified
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Embedded Interactive Robot Specification & Build Configurator */}
        <div className="pt-8">
          <RooftopCalculator />
        </div>
      </div>
    </section>
  );
};
