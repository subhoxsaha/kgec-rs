import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  ShieldAlert,
  Flame,
  Plane,
  Compass,
  Gauge,
  Layers,
  Wrench,
  Award,
  Zap,
  Users,
  Box,
  MapPin,
} from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';

export const BoroughCorridorSection: React.FC = () => {
  const { wings, metadata } = useReportData();
  const [activeWingIndex, setActiveWingIndex] = useState<number>(0);

  const activeWing = wings[activeWingIndex] || wings[0];

  const getWingIcon = (id: string) => {
    switch (id) {
      case 'combat':
        return ShieldAlert;
      case 'autonomous-ai':
        return Cpu;
      case 'uav-aerial':
        return Plane;
      case 'rovers-space':
        return Compass;
      case 'microrobotics-lfr':
        return Zap;
      case 'embedded-iot':
        return Layers;
      case 'underwater-auv':
        return Gauge;
      case 'mechanical-cad':
      default:
        return Wrench;
    }
  };

  const totalProjects = useMemo(() => {
    return wings.reduce((acc, w) => acc + (w.projectsCount || 0), 0);
  }, [wings]);

  const totalPodiums = useMemo(() => {
    return wings.reduce((acc, w) => acc + (w.podiums || 0), 0);
  }, [wings]);

  return (
    <section
      id="wings-section"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center bg-[#F8F6F0] dark:bg-[#152114] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-7 sm:space-y-8">
        {/* Section Headline */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-wide uppercase text-[#526340] dark:text-[#A3B59E]">
              Technical Divisions & Lab Infrastructure
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.05] tracking-tight">
            Specialized engineering wings collaborating under one roof.
          </h2>
          <p className="text-base sm:text-lg text-[#4A5D44] dark:text-[#D2CBBF] font-light leading-relaxed">
            From high-torque combat weapon mechanics to real-time SLAM neural pipelines, 8 technical divisions build custom hardware across electronics, firmware, and aerospace design.
          </p>
        </div>

        {/* Global Stats Overview Banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#1F2E1E] border border-[#243324]/10 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-mono text-[#3D4F38] dark:text-[#CBD7C7]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{metadata.totalMembers || 184} Student Engineers</span>
          </div>
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{totalProjects} Flagship Robot Builds</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{totalPodiums} National Arena Podiums</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <MapPin className="w-4 h-4" />
            <span>Kalyani Govt. Engineering College</span>
          </div>
        </div>

        {/* Interactive Dual-Panel System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Wing Selector List */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                Select Engineering Wing
              </span>
              <span className="text-xs font-mono text-[#526340] dark:text-[#A3B59E]">
                {wings.length} Active Divisions
              </span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {wings.map((wing, idx) => {
                const isSelected = activeWingIndex === idx;
                const IconComponent = getWingIcon(wing.id);

                return (
                  <button
                    key={wing.id || idx}
                    type="button"
                    onClick={() => setActiveWingIndex(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-white dark:bg-[#223321] border-emerald-500/50 shadow-md translate-x-1'
                        : 'bg-white/60 dark:bg-[#1B291A]/60 hover:bg-white dark:hover:bg-[#20301F] border-transparent dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/5 text-[#4A5D44] dark:text-[#A3B59E]'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold transition-colors ${
                              isSelected
                                ? 'text-[#1F2B1D] dark:text-[#F4EFE6]'
                                : 'text-[#3D4F38] dark:text-[#C7D4C4]'
                            }`}
                          >
                            {wing.name}
                          </p>
                          <p className="text-[11px] text-[#657351] dark:text-[#9FB19A] truncate max-w-[210px] sm:max-w-[260px]">
                            {wing.leadSpecialty}
                          </p>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {wing.podiums} Podiums
                        </span>
                        <span className="block text-[10px] text-[#657351] dark:text-[#8E9F89]">
                          {wing.members} Members
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Interactive Wing Telemetry Showcase */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWing.id || activeWing.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 rounded-[2rem] bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10 shadow-xl space-y-6"
              >
                {/* Header with Division Name and Hardware Badge */}
                <div className="space-y-2 border-b border-[#243324]/10 dark:border-white/10 pb-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                      DIVISION PROTOCOL • ACTIVE
                    </span>
                    <span className="text-xs font-mono text-[#657351] dark:text-[#9FB19A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeWing.labLocation}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6]">
                    {activeWing.name}
                  </h3>
                  <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-300 font-medium font-mono">
                    Specialty: {activeWing.leadSpecialty}
                  </p>
                </div>

                {/* Division Narrative Description */}
                <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                  {activeWing.description}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-xl bg-[#F5F2EB] dark:bg-[#253824] border border-[#243324]/5 dark:border-white/5 font-mono text-center">
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-[#1F2B1D] dark:text-white">
                      {activeWing.members}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#657351] dark:text-[#A3B59E] uppercase">
                      Engineers
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-[#1F2B1D] dark:text-white">
                      {activeWing.projectsCount}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#657351] dark:text-[#A3B59E] uppercase">
                      Bot Builds
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {activeWing.podiums}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#657351] dark:text-[#A3B59E] uppercase">
                      Podiums Won
                    </span>
                  </div>
                </div>

                {/* Focus Areas Badges */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                    Core Engineering Disciplines
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeWing.focusAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-[#243324]/5 dark:bg-white/10 text-[#243324] dark:text-[#F4EFE6] border border-[#243324]/10 dark:border-white/10"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hardware & Flagship Spotlight Card */}
                <div className="p-4 rounded-xl bg-[#20301F] text-white space-y-2 border border-white/10 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-300">
                    <span>FLAGSHIP MACHINE: {activeWing.flagshipBot}</span>
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <p className="text-xs text-white/80 font-mono leading-relaxed">
                    Stack: {activeWing.hardwareStack}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
