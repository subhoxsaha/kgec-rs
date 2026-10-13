import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Hammer,
  Code,
  FolderTree,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import {
  DEFAULT_TECHFEST_PHOTOS,
  DEFAULT_OTHER_ACTIVITIES_PHOTOS,
  DEFAULT_HACKATHON_PHOTOS,
} from '../../data/eventsData';

type PhotoSubTab = 'techfest' | 'hackathon' | 'activities';

export const PhotosMediaEditor: React.FC = () => {
  const {
    techfestPhotos,
    activityPhotos,
    hackathonPhotos,
  } = useReportData();

  const [activeSubTab, setActiveSubTab] = useState<PhotoSubTab>('techfest');

  const techfest = techfestPhotos && techfestPhotos.length > 0 ? techfestPhotos : DEFAULT_TECHFEST_PHOTOS;
  const activities = activityPhotos && activityPhotos.length > 0 ? activityPhotos : DEFAULT_OTHER_ACTIVITIES_PHOTOS;
  const hackathons = hackathonPhotos && hackathonPhotos.length > 0 ? hackathonPhotos : DEFAULT_HACKATHON_PHOTOS;

  const currentPhotos =
    activeSubTab === 'techfest' ? techfest : activeSubTab === 'hackathon' ? hackathons : activities;

  return (
    <div className="space-y-4 text-[#243324] dark:text-[#F4EFE6]">
      {/* Informative Header */}
      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              Event Galleries &amp; Media Archives (Read-Only)
            </p>
            <p className="text-[#3F543C] dark:text-[#CBD7C7] text-[11px] leading-relaxed">
              Browse hardcoded photography captures for TECHTIX Techfest arenas, ZYRO Hackathons, and outreach workshops.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 shrink-0">
          <FolderTree className="w-3.5 h-3.5" />
          <span>3 Folders Active</span>
        </span>
      </div>

      {/* Sub-tabs Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#E8E4DA] dark:bg-[#121B11] rounded-xl border border-[#243324]/10 dark:border-white/10 text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('techfest')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'techfest'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>TECHTIX Techfest ({techfest.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('hackathon')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'hackathon'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-purple-500" />
          <span>ZYRO Hackathon ({hackathons.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activities')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeSubTab === 'activities'
              ? 'bg-white dark:bg-[#1E2C1D] text-emerald-800 dark:text-emerald-300 shadow-2xs font-semibold'
              : 'text-[#657351] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
          }`}
        >
          <Hammer className="w-3.5 h-3.5 text-cyan-500" />
          <span>Workshops &amp; Labs ({activities.length})</span>
        </button>
      </div>

      {/* Dedicated Folder Location Indicator */}
      <div className="px-3 py-2 rounded-lg bg-[#EFECE4] dark:bg-[#152014] border border-[#243324]/10 dark:border-white/10 text-[11px] text-[#4A5D44] dark:text-[#A3B59E] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <span>Local asset directory: </span>
          <code className="font-mono font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 px-1.5 py-0.5 rounded">
            {activeSubTab === 'techfest'
              ? '/public/events/techfest/'
              : activeSubTab === 'hackathon'
              ? '/public/events/hackathon/'
              : '/public/events/workshop/'}
          </code>
        </div>
        <span className="text-[10.5px] opacity-80">Images load strictly from filesystem and JSON metadata</span>
      </div>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1">
        {currentPhotos.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-2.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="relative h-44 rounded-lg overflow-hidden bg-black/10 border border-[#243324]/10">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-white backdrop-blur-xs">
                  {item.category}
                </span>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/80 dark:bg-black/80 text-black dark:text-white font-semibold backdrop-blur-xs">
                  #{idx + 1}
                </span>
              </div>

              <div>
                <h5 className="font-bold text-xs text-[#1F2B1D] dark:text-white line-clamp-1">
                  {item.title}
                </h5>
                <p className="text-[11px] text-[#657351] dark:text-[#A3B59E] line-clamp-2 leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between text-[10.5px] font-mono text-[#526340] dark:text-[#A3B59E]">
              <span>ID: {item.id}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Verified Asset</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
