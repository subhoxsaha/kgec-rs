import React from 'react';
import { Sparkles } from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';

export const MetricsEditor: React.FC = () => {
  const { metadata, updateMetadata } = useReportData();

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Banner */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        <p className="text-emerald-950 dark:text-emerald-200">
          Key figures update dynamically across hero statistics, overview counters, and leadership benchmarks.
        </p>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            National Podiums
          </label>
          <input
            type="number"
            value={metadata.nationalPodiums || 48}
            onChange={(e) => updateMetadata({ nationalPodiums: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">IITs & National Meets</p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Active Engineers
          </label>
          <input
            type="number"
            value={metadata.totalMembers || 184}
            onChange={(e) => updateMetadata({ totalMembers: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">Enrolled Student Members</p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Active Projects
          </label>
          <input
            type="number"
            value={metadata.activeProjects || 14}
            onChange={(e) => updateMetadata({ activeProjects: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">Robots in Active R&amp;D</p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Lab Workspace (Sq Ft)
          </label>
          <input
            type="number"
            value={metadata.labAreaSqFt || 2400}
            onChange={(e) => updateMetadata({ labAreaSqFt: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">Makerspace Floor Area</p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Students Mentored
          </label>
          <input
            type="number"
            value={metadata.studentsTrained || 1450}
            onChange={(e) => updateMetadata({ studentsTrained: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">STEM Workshops & Camps</p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            STEM Kits Distributed
          </label>
          <input
            type="number"
            value={metadata.stemKitsDistributed || 320}
            onChange={(e) => updateMetadata({ stemKitsDistributed: Number(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-sm font-mono font-bold"
          />
          <p className="text-[9px] text-[#657351] dark:text-[#9FB19A]">Microcontrollers & Sensors</p>
        </div>
      </div>

      {/* Leadership & Identity Card */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white">
          Society Leadership &amp; Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              President / Lead Name
            </label>
            <input
              type="text"
              value={metadata.president || ''}
              onChange={(e) => updateMetadata({ president: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              President Title / Batch
            </label>
            <input
              type="text"
              value={metadata.presidentTitle || ''}
              onChange={(e) => updateMetadata({ presidentTitle: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Established Year
            </label>
            <input
              type="text"
              value={metadata.establishedYear || '2014'}
              onChange={(e) => updateMetadata({ establishedYear: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-[#526340] dark:text-[#A3B59E] mb-1">
              Leadership Quote / Statement
            </label>
            <input
              type="text"
              value={metadata.leadershipQuote || ''}
              onChange={(e) => updateMetadata({ leadershipQuote: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
