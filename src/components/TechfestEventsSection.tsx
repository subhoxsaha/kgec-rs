import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Zap, Edit3 } from 'lucide-react';
import { EventPhoto } from '../types';
import { useReportData } from '../context/ReportDataContext';
import {
  DEFAULT_TECHFEST_PHOTOS,
  DEFAULT_OTHER_ACTIVITIES_PHOTOS,
  DEFAULT_HACKATHON_PHOTOS,
} from '../data/eventsData';

interface StreamRowProps {
  photos: EventPhoto[];
  selectedPhoto: EventPhoto | null;
  onTogglePhoto: (photo: EventPhoto) => void;
  speedClass?: string;
}

const StreamRow: React.FC<StreamRowProps> = ({
  photos,
  selectedPhoto,
  onTogglePhoto,
  speedClass = 'animate-marquee-horizontal-ltr',
}) => {
  // Only pause if the currently selected photo belongs to THIS row
  const isPaused = selectedPhoto !== null && photos.some((p) => p.id === selectedPhoto.id);
  const infiniteList = [...photos, ...photos];

  return (
    <div className="relative w-full overflow-hidden select-none bg-transparent">
      {/* Horizontal stream strip flowing Left-to-Right with 0 gap */}
      <div
        className={`${speedClass} flex flex-row gap-0`}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {infiniteList.map((item, idx) => {
          const isSelected = selectedPhoto?.id === item.id;
          return (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onTogglePhoto(item)}
              className="relative w-48 sm:w-64 lg:w-72 h-32 sm:h-44 lg:h-52 shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:brightness-105"
            >
              <img
                src={item.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center block"
              />

              {/* Clean Bottom Text Overlay on Click (No blur, no green border, full text in small size) */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-8 pb-2 px-2 sm:pb-2.5 sm:px-3 text-center pointer-events-none"
                  >
                    <h4 className="font-display text-[10px] sm:text-[11px] lg:text-xs font-medium text-white drop-shadow-md leading-tight break-words">
                      {item.title}
                    </h4>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface TechfestEventsSectionProps {
  onExploreMore?: () => void;
}

export const TechfestEventsSection: React.FC<TechfestEventsSectionProps> = ({ onExploreMore }) => {
  const { techfestPhotos, activityPhotos, hackathonPhotos, isAdminLoggedIn, openEditor } = useReportData();
  const techtixPhotos = techfestPhotos && techfestPhotos.length > 0 ? techfestPhotos : DEFAULT_TECHFEST_PHOTOS;
  const otherPhotos = activityPhotos && activityPhotos.length > 0 ? activityPhotos : DEFAULT_OTHER_ACTIVITIES_PHOTOS;
  const hackPhotos = hackathonPhotos && hackathonPhotos.length > 0 ? hackathonPhotos : DEFAULT_HACKATHON_PHOTOS;

  const [selectedPhoto, setSelectedPhoto] = useState<EventPhoto | null>(null);

  const handleTogglePhoto = (photo: EventPhoto) => {
    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto(null);
    } else {
      setSelectedPhoto(photo);
    }
  };

  const handleExploreClick = () => {
    if (onExploreMore) {
      onExploreMore();
    } else {
      window.location.hash = '#techtix-zyro';
    }
  };

  return (
    <section
      id="events-section"
      className="relative py-8 sm:py-12 lg:py-16 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400 overflow-hidden"
    >
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Section Header: Centered & Clean */}
        <div className="w-full flex flex-col items-center text-center space-y-2 max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal tracking-tight leading-tight">
            Sights of Techfest & Hackathons
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            Continuous captures from TECHTIX arena battles, makerspace R&D bootcamps, and 36-hour ZYRO hackathons flowing left to right. Click any image to freeze and view details.
          </p>
          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => openEditor('photos')}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
              title="Edit Events & Media in Admin"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Section 4: Events &amp; Media</span>
            </button>
          )}
        </div>

        {/* 3 Horizontal Stream Rows stacked seamlessly with NO GAP between them */}
        <div className="flex flex-col gap-0 w-full overflow-hidden">
          {/* Row 1: TECHTIX (Techfest) */}
          <StreamRow
            photos={techtixPhotos}
            selectedPhoto={selectedPhoto}
            onTogglePhoto={handleTogglePhoto}
            speedClass="animate-marquee-horizontal-ltr"
          />

          {/* Row 2: Other Activities (Makerspace, Bootcamps, STEM) */}
          <StreamRow
            photos={otherPhotos}
            selectedPhoto={selectedPhoto}
            onTogglePhoto={handleTogglePhoto}
            speedClass="animate-marquee-horizontal-ltr-slow"
          />

          {/* Row 3: ZYRO (Hackathon) */}
          <StreamRow
            photos={hackPhotos}
            selectedPhoto={selectedPhoto}
            onTogglePhoto={handleTogglePhoto}
            speedClass="animate-marquee-horizontal-ltr-fast"
          />
        </div>

        {/* Explore Button Just After Photo Train (One Single Clean Button) */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2 px-4 text-center">
          <motion.button
            type="button"
            id="explore-techtix-zyro-btn"
            onClick={handleExploreClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96, y: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#263E24] via-[#2F4D2C] to-[#1E321C] hover:from-[#32522E] hover:via-[#3E653A] hover:to-[#284326] active:from-[#1E321C] text-white font-medium text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#131D12]/25 hover:shadow-xl border border-emerald-400/30 transition-all duration-300 cursor-pointer select-none"
          >
            {/* Ambient hover light sweep sheen */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

            <Flame className="w-4 h-4 text-emerald-400" />
            <span className="relative z-10 font-semibold tracking-wider">
              Explore TECHTIX &amp; ZYRO Arenas
            </span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
