import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  Zap,
  X,
  Sun,
  Moon,
  SlidersHorizontal,
  Navigation,
  Activity,
  Radio,
  Cpu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Wrench,
  Maximize2,
  Pause,
  Play,
  Camera,
  Layers,
} from 'lucide-react';
import { TECHTIX_ZYRO_EVENTS, FestEvent } from '../data/techtixZyroEventsData';
import { ZyroSection } from './ZyroSection';
import { ThemedLogo } from './ThemedLogo';
import { useReportData } from '../context/ReportDataContext';
import { useTheme } from '../context/ThemeContext';
import {
  DEFAULT_KGEC_LOGO_DARK,
  DEFAULT_KGEC_LOGO_LIGHT,
  DEFAULT_KRS_LOGO_DARK,
  DEFAULT_KRS_LOGO_LIGHT,
} from '../data/reportData';
import {
  DEFAULT_TECHFEST_PHOTOS,
  DEFAULT_HACKATHON_PHOTOS,
  DEFAULT_OTHER_ACTIVITIES_PHOTOS,
} from '../data/eventsData';
import { EventPhoto } from '../types';

interface TechtixZyroPageProps {
  onBack: () => void;
}

/**
 * Clean edge-to-edge photo carousel window without any top bar.
 * Controls & metadata are overlaid directly onto the image with zero separating header.
 */
interface AutoScrollPhotoWindowProps {
  photos: EventPhoto[];
  title: string;
  badge: string;
  accent: 'emerald' | 'amber';
  onPhotoClick: (url: string) => void;
}

const AutoScrollPhotoWindow: React.FC<AutoScrollPhotoWindowProps> = ({
  photos,
  title,
  accent,
  onPhotoClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (photos.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [photos.length, isPaused]);

  if (!photos || photos.length === 0) return null;
  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const isEmerald = accent === 'emerald';
  const dotActiveClasses = isEmerald ? 'bg-emerald-400 w-5' : 'bg-amber-400 w-5';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-xl overflow-hidden border border-[#243324]/15 dark:border-white/15 bg-black shadow-md group transition-all"
    >
      {/* Edge-to-Edge Photo Canvas (NO top dividing bar) */}
      <div
        onClick={() => onPhotoClick(currentPhoto.imageUrl)}
        className="relative h-60 sm:h-64 md:h-72 w-full overflow-hidden cursor-pointer bg-neutral-900"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPhoto.id || currentIndex}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

        {/* Floating Top Floating Overlays (Directly over the image) */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-20 pointer-events-none">
          {/* Live Ping & Title Badge */}
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15 text-white pointer-events-auto shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEmerald ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isEmerald ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </span>
            <span className="font-mono text-[10px] uppercase font-semibold text-white/90">
              {title}
            </span>
          </div>

          {/* Controls: Count, Pause/Play, Expand */}
          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-xs px-2 py-1 rounded-md border border-white/15 text-white pointer-events-auto shadow-xs">
            <span className="text-[10px] font-mono text-white/70">
              {String(currentIndex + 1).padStart(2, '0')}/{String(photos.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-0.5 rounded text-white/70 hover:text-white transition-colors cursor-pointer"
              title={isPaused ? 'Resume scroll' : 'Pause scroll'}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
            <div className="w-[1px] h-2.5 bg-white/25" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPhotoClick(currentPhoto.imageUrl);
              }}
              className="p-0.5 rounded text-white/70 hover:text-white transition-colors cursor-pointer"
              title="Expand photo"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Manual Left/Right Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/65 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/10 z-20"
          title="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/65 text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-white/10 z-20"
          title="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Metadata Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 text-white z-10 space-y-0.5">
          <span className={`text-[9px] font-mono uppercase font-bold tracking-wider ${isEmerald ? 'text-emerald-300' : 'text-amber-300'}`}>
            {currentPhoto.category || 'Arena Capture'}
          </span>
          <h4 className="text-xs font-semibold text-white/95 truncate">
            {currentPhoto.title}
          </h4>

          {/* Slide Progress Indicators */}
          <div className="flex items-center gap-1 pt-1">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? dotActiveClasses : 'bg-white/30 hover:bg-white/60 w-1.5'
                }`}
                title={`Capture ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TechtixZyroPage: React.FC<TechtixZyroPageProps> = ({ onBack }) => {
  const {
    metadata,
    techfestPhotos,
    hackathonPhotos,
    activityPhotos,
    isAdminLoggedIn,
    openEditor,
    festEvents,
    festPhases,
    trackPassages,
  } = useReportData();
  const { isDark, toggleTheme } = useTheme();

  const eventsList = festEvents && festEvents.length > 0 ? festEvents : TECHTIX_ZYRO_EVENTS;

  const [activeNav, setActiveNav] = useState<'all' | 'techtix' | 'zyro' | 'workshops' | 'gallery'>('all');
  const [selectedTechtixId, setSelectedTechtixId] = useState<string>(eventsList[0]?.id || 'tt-robowars-heavy');
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);
  const [isTechtixExpanded, setIsTechtixExpanded] = useState<boolean>(false);
  const [activeTechtixImgIdx, setActiveTechtixImgIdx] = useState<number>(0);
  const techtixImgScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const logo1Src =
    (isDark ? (metadata.logo1Dark || metadata.logo1) : (metadata.logo1Light || metadata.logo1)) ||
    (isDark ? DEFAULT_KGEC_LOGO_DARK : DEFAULT_KGEC_LOGO_LIGHT);
  const logo2Src =
    (isDark ? (metadata.logo2Dark || metadata.logo2) : (metadata.logo2Light || metadata.logo2)) ||
    (isDark ? DEFAULT_KRS_LOGO_DARK : DEFAULT_KRS_LOGO_LIGHT);

  const techtixEvents = eventsList.filter((e) => e.fest === 'TECHTIX');
  const zyroEvents = eventsList.filter((e) => e.fest === 'ZYRO');
  const workshopEvents = eventsList.filter((e) => e.fest === 'WORKSHOP');

  const currentTechtixIndex = techtixEvents.findIndex((e) => e.id === selectedTechtixId);
  const activeTechtixIdx = currentTechtixIndex >= 0 ? currentTechtixIndex : 0;
  const selectedTechtixEvent = techtixEvents[activeTechtixIdx] || techtixEvents[0];

  const handlePrevTechtix = () => {
    const prevIdx = (activeTechtixIdx - 1 + techtixEvents.length) % techtixEvents.length;
    setSelectedTechtixId(techtixEvents[prevIdx].id);
  };

  const handleNextTechtix = () => {
    const nextIdx = (activeTechtixIdx + 1) % techtixEvents.length;
    setSelectedTechtixId(techtixEvents[nextIdx].id);
  };

  const techtixImages = selectedTechtixEvent.images && selectedTechtixEvent.images.length > 0
    ? selectedTechtixEvent.images
    : [selectedTechtixEvent.bannerUrl];

  // Reset image scroll on competition change
  useEffect(() => {
    setActiveTechtixImgIdx(0);
    if (techtixImgScrollRef.current) {
      techtixImgScrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [selectedTechtixEvent.id]);

  // Smoothly scroll through multiple images inside existing container without any extra UI
  useEffect(() => {
    const container = techtixImgScrollRef.current;
    if (!container || techtixImages.length <= 1) return;

    const timer = setInterval(() => {
      if (!container) return;
      const nextIdx = (activeTechtixImgIdx + 1) % techtixImages.length;
      container.scrollTo({
        left: nextIdx * container.clientWidth,
        behavior: 'smooth',
      });
      setActiveTechtixImgIdx(nextIdx);
    }, 3400);

    return () => clearInterval(timer);
  }, [activeTechtixImgIdx, techtixImages.length, selectedTechtixEvent.id]);

  const handleTechtixImgScroll = () => {
    const container = techtixImgScrollRef.current;
    if (!container || !container.clientWidth) return;
    const idx = Math.round(container.scrollLeft / container.clientWidth);
    if (idx >= 0 && idx < techtixImages.length && idx !== activeTechtixImgIdx) {
      setActiveTechtixImgIdx(idx);
    }
  };

  const techtixGallery = techfestPhotos && techfestPhotos.length > 0 ? techfestPhotos : DEFAULT_TECHFEST_PHOTOS;
  const zyroGallery = hackathonPhotos && hackathonPhotos.length > 0 ? hackathonPhotos : DEFAULT_HACKATHON_PHOTOS;
  const outreachGallery = activityPhotos && activityPhotos.length > 0 ? activityPhotos : DEFAULT_OTHER_ACTIVITIES_PHOTOS;

  // Unified seamless album without gaps
  const unifiedAlbum: EventPhoto[] = [
    ...techtixGallery,
    ...zyroGallery,
    ...outreachGallery,
  ];

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const phases = [
    {
      step: '01',
      month: 'OCT',
      title: 'Abstract Submissions',
      desc: 'Hardware architectures & squad registrations.',
    },
    {
      step: '02',
      month: 'NOV',
      title: 'Kits & Grants',
      desc: 'Jetson Orin Nano & RPLIDAR hardware issued.',
    },
    {
      step: '03',
      month: 'DEC',
      title: '36H Sprint',
      desc: 'Continuous fabrication, 3D printing & ROS2 coding.',
    },
    {
      step: '04',
      month: 'JAN',
      title: 'Arena Trials & Pitch',
      desc: 'Obstacle benchmarking & jury evaluation.',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] font-sans antialiased transition-colors duration-400 selection:bg-[#204022] selection:text-white">
      {/* Subtle Precision Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#243324_0.75px,transparent_0.75px)] dark:bg-[radial-gradient(#ffffff_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 dark:opacity-8" />

      {/* ========================================================================= */}
      {/* 1. COMPACT INSTITUTIONAL HEADER                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/95 dark:bg-[#131D12]/95 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 px-3 sm:px-6 lg:px-8 py-2 transition-colors duration-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#243324] dark:text-[#F4EFE6] hover:bg-[#243324]/5 dark:hover:bg-white/5 border border-[#243324]/10 dark:border-white/10 transition-colors cursor-pointer shrink-0"
              title="Return to Annual Report"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Report</span>
            </button>
            <span className="hidden sm:inline-block text-xs text-[#243324]/30 dark:text-white/20">/</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#243324]/80 dark:text-white/80 font-mono font-medium truncate">
              Arenas &amp; Hackathons
            </span>
          </div>

          {/* Center: In-Page Quick Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#243324]/5 dark:bg-white/5 p-1 rounded-lg border border-[#243324]/10 dark:border-white/10 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveNav('all');
                scrollToAnchor('overview-dossier');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeNav === 'all'
                  ? 'bg-white dark:bg-[#1D2B1C] text-[#243324] dark:text-white shadow-xs font-semibold'
                  : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('techtix');
                scrollToAnchor('techtix-arena');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeNav === 'techtix'
                  ? 'bg-white dark:bg-[#1D2B1C] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                  : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              TECHTIX
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('zyro');
                scrollToAnchor('zyro-hackathon');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                activeNav === 'zyro'
                  ? 'bg-white dark:bg-[#1D2B1C] text-amber-700 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              ZYRO 36H
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('workshops');
                scrollToAnchor('workshops-section');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeNav === 'workshops'
                  ? 'bg-white dark:bg-[#1D2B1C] text-[#243324] dark:text-white shadow-xs font-semibold'
                  : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
              }`}
            >
              Workshops
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('gallery');
                scrollToAnchor('album-section');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                activeNav === 'gallery'
                  ? 'bg-white dark:bg-[#1D2B1C] text-[#243324] dark:text-white shadow-xs font-semibold'
                  : 'text-[#243324]/70 dark:text-white/70 hover:text-[#243324] dark:hover:text-white'
              }`}
            >
              Field Album
            </button>
          </nav>

          {/* Right: Actions & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openEditor('photos')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#243324]/5 dark:bg-white/5 hover:bg-[#243324]/10 dark:hover:bg-white/10 text-[#243324] dark:text-white border border-[#243324]/10 dark:border-white/10 transition-colors cursor-pointer"
                title="Edit Media via CMS"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CMS</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-[#243324] dark:text-white hover:bg-[#243324]/5 dark:hover:bg-white/5 border border-[#243324]/10 dark:border-white/10 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-700" />}
            </button>

            {/* Dual Logos */}
            <div className="flex items-center gap-1.5 pl-1.5 sm:pl-2 border-l border-[#243324]/10 dark:border-white/10">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-2xs">
                <ThemedLogo type="kgec" isDark={isDark} alt="KGEC" className="w-full h-full object-contain" />
              </div>
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-2xs">
                <ThemedLogo type="krs" isDark={isDark} alt="KRS" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN STRUCTURED CONTAINER                                              */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8 sm:space-y-10">
        {/* SECTION: OVERVIEW DOSSIER */}
        <section id="overview-dossier" className="space-y-3 pt-1">
          {/* Editorial Title Block - Shortened */}
          <div className="border-b border-[#243324]/10 dark:border-white/10 pb-3 sm:pb-4 space-y-1">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
              <span>KGEC Robotics Society</span>
              <span className="text-[#243324]/30 dark:text-white/20">•</span>
              <span>Flagship Arenas</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6] tracking-tight">
              TECHTIX &amp; ZYRO Arenas
            </h1>
            <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
              Mechatronics combat championship &amp; 36-hour continuous edge-AI hardware hackathon.
            </p>
          </div>

          {/* Showcase: TECHTIX Overview & Video (Side-by-side, Direct Display) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center pt-2">
            {/* Left: Small Passage about TECHTIX */}
            <div className="lg:col-span-6 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-emerald-700 dark:text-emerald-400">
                <Flame className="w-3.5 h-3.5" />
                <span>ABOUT TECHTIX</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
                Eastern India's Premier Robotics Arena
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                TECHTIX is the flagship annual mechatronics championship organized by the KGEC Robotics Society. Bringing together mechanical grit, high-torque combat bots, autonomous path-planning rovers, and micro-drone racers, the festival transforms the campus into an electrifying proving ground for engineering talent across the country.
              </p>
              <p className="text-xs text-[#243324]/80 dark:text-white/80 font-normal leading-relaxed">
                Every discipline is calibrated with strict international weight and RF compliance standards—fostering relentless innovation, sportsmanship, and practical mechatronics mastery under high-stakes arena conditions.
              </p>
            </div>

            {/* Right: YouTube Video Embed (Autoplay in loop, no touch controls) */}
            <div className="lg:col-span-6">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#243324]/10 dark:border-white/10 shadow-xs bg-black pointer-events-none select-none">
                <iframe
                  src="https://www.youtube.com/embed/ESrFtRcL0KY?autoplay=1&mute=1&loop=1&playlist=ESrFtRcL0KY&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1"
                  title="TECHTIX Official Video"
                  className="w-full h-full border-0 pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: TECHTIX ARENA COMPETITIONS - CLEAN SINGLE CONTROL & OPTIMAL UI */}
        {/* ========================================================================= */}
        <section id="techtix-arena" className="space-y-3 pt-3 border-t border-[#243324]/10 dark:border-white/10">
          {/* Section Header with Single Unified Arrow Navigation Control */}
          <div className="flex items-center justify-between gap-2.5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-emerald-700 dark:text-emerald-400">
                <Flame className="w-3.5 h-3.5" />
                <span>TECHTIX CHAMPIONSHIP</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
                Competitions
              </h2>
            </div>

            {/* Single Unified Arrow Switcher */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-[#162215]/80 p-1 rounded-xl border border-[#243324]/10 dark:border-white/10 shadow-xs">
              <button
                type="button"
                onClick={handlePrevTechtix}
                className="p-1.5 rounded-lg text-[#243324] dark:text-[#F4EFE6] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous Competition"
                aria-label="Previous Competition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-semibold px-2 text-emerald-800 dark:text-emerald-400 select-none">
                0{activeTechtixIdx + 1} / 0{techtixEvents.length}
              </span>

              <button
                type="button"
                onClick={handleNextTechtix}
                className="p-1.5 rounded-lg text-[#243324] dark:text-[#F4EFE6] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Next Competition"
                aria-label="Next Competition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Master Competition Showcase: Directly Displayed Without Outer Div Background */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Dedicated High-Resolution Event Image */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                {/* Event Visual Canvas */}
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden border border-[#243324]/10 dark:border-white/10 shadow-xs group bg-[#111A10]">
                    {/* Horizontal Smooth Scroll Track */}
                    <div
                      ref={techtixImgScrollRef}
                      onScroll={handleTechtixImgScroll}
                      className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {techtixImages.map((imgUrl, imgIdx) => (
                        <div
                          key={`${selectedTechtixEvent.id}-img-${imgIdx}`}
                          className="w-full h-full shrink-0 snap-center relative overflow-hidden"
                        >
                          <img
                            src={imgUrl}
                            alt={`${selectedTechtixEvent.title} shot ${imgIdx + 1}`}
                            className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-700 hover:scale-103"
                            onClick={() => setSelectedGalleryPhoto(imgUrl)}
                            referrerPolicy="no-referrer"
                            loading={imgIdx === 0 ? 'eager' : 'lazy'}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-white/15">
                        {selectedTechtixEvent.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedGalleryPhoto(techtixImages[activeTechtixImgIdx] || selectedTechtixEvent.bannerUrl)}
                        className="pointer-events-auto p-1.5 rounded-md bg-black/65 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-md border border-white/15 transition-colors cursor-pointer"
                        title="Expand High-Res Photo"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Metadata on Image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-emerald-600/90 text-white text-[10px] font-mono font-bold shadow-xs">
                        Prize: {selectedTechtixEvent.prizePool}
                      </span>
                      <span className="text-[10px] font-mono text-white/90 font-medium">
                        Team: {selectedTechtixEvent.teamSize}
                      </span>
                    </div>
                  </div>

                  {/* Arena Specifications Box */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Arena Environment
                    </span>
                    <p className="text-xs text-[#243324]/90 dark:text-white/90 leading-relaxed font-normal">
                      {selectedTechtixEvent.arenaOrTrack}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Event Info - Directly Displayed Without Box Background */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTechtixEvent.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* Event Header */}
                    <div className="border-b border-[#243324]/10 dark:border-white/10 pb-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Track 0{activeTechtixIdx + 1} of 0{techtixEvents.length} • {selectedTechtixEvent.duration}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {selectedTechtixEvent.prizePool}
                        </span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-[#1F2B1D] dark:text-white">
                        {selectedTechtixEvent.title}
                      </h3>
                      <p className="text-xs text-emerald-700/80 dark:text-emerald-400/90 font-mono">
                        {selectedTechtixEvent.tagline}
                      </p>
                    </div>

                    {/* Concise Core Objective */}
                    <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                      {selectedTechtixEvent.description}
                    </p>

                    {/* Key Highlights Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#243324]/80 dark:text-white/80">
                      <span className="px-2 py-1 rounded bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10">
                        Squad: {selectedTechtixEvent.teamSize}
                      </span>
                      <span className="px-2 py-1 rounded bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10">
                        Match: {selectedTechtixEvent.duration}
                      </span>
                    </div>

                    {/* Expandable Rules and Limits Section */}
                    {isTechtixExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1"
                      >
                        {/* Mandatory Rules Card */}
                        <div className="p-3 rounded-xl bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 space-y-1.5">
                          <h4 className="text-[10px] font-bold text-[#1F2B1D] dark:text-white uppercase font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>Mandatory Rules</span>
                          </h4>
                          <ul className="space-y-1 text-[11px] text-[#243324]/85 dark:text-white/85">
                            {selectedTechtixEvent.rulesHighlights.slice(0, 3).map((rule, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-tight">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">•</span>
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Hardware Caps Card */}
                        <div className="p-3 rounded-xl bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 space-y-1.5">
                          <h4 className="text-[10px] font-bold text-[#1F2B1D] dark:text-white uppercase font-mono flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Hardware &amp; Limits</span>
                          </h4>
                          <ul className="space-y-1 text-[11px] text-[#243324]/85 dark:text-white/85">
                            {selectedTechtixEvent.specsRequirements.slice(0, 3).map((spec, i) => (
                              <li key={i} className="flex items-start gap-1.5 leading-tight">
                                <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {/* Single Action Button: View More / View Less */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsTechtixExpanded(!isTechtixExpanded)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                      >
                        <span>{isTechtixExpanded ? 'View Less' : 'View More & Rules'}</span>
                        {isTechtixExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: ZYRO HACKATHON (3 PARTS: ABOUT, PREVIOUS TRACKS SVG REVEAL, VERTICAL TIMELINE) */}
        {/* ========================================================================= */}
        <ZyroSection
          zyroEvents={zyroEvents}
          phases={festPhases}
          trackPassages={trackPassages}
          onPhotoClick={(url) => setSelectedGalleryPhoto(url)}
        />

        {/* ========================================================================= */}
        {/* SECTION 3: WORKSHOPS & BOOTCAMPS - SHORTENED                              */}
        {/* ========================================================================= */}
        <section id="workshops-section" className="space-y-3 pt-4 border-t border-[#243324]/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono text-[#243324]/70 dark:text-white/70">
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>LABORATORY SESSIONS</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
              Hands-On Technical Bootcamps
            </h2>
          </div>

          <div className="border border-[#243324]/10 dark:border-white/10 rounded-xl overflow-hidden bg-white/70 dark:bg-[#162215]/70 p-3.5 sm:p-4 space-y-3">
            {workshopEvents.map((ws) => (
              <div key={ws.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold">
                      {ws.category} • {ws.duration}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1F2B1D] dark:text-white">
                      {ws.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#243324]/70 dark:text-white/70 px-2 py-0.5 rounded bg-[#243324]/5 dark:bg-white/10 self-start sm:self-auto">
                    {ws.prizePool}
                  </span>
                </div>

                <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                  {ws.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[9px] font-mono uppercase text-emerald-700 dark:text-emerald-400 font-semibold block">
                      Curriculum:
                    </span>
                    <span className="text-[11px] text-[#243324]/85 dark:text-white/85">
                      {ws.rulesHighlights.join(' • ')}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[9px] font-mono uppercase text-amber-700 dark:text-amber-400 font-semibold block">
                      Tooling:
                    </span>
                    <span className="text-[11px] text-[#243324]/85 dark:text-white/85">
                      {ws.specsRequirements.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: UNIFIED GAPLESS ALBUM (GAP-0)                                  */}
        {/* ========================================================================= */}
        <section id="album-section" className="space-y-3 pt-4 border-t border-[#243324]/10 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-display text-lg sm:text-xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
                Championship Field Album
              </h2>
            </div>
            <span className="text-[10px] text-[#243324]/60 dark:text-white/50 font-mono">
              {unifiedAlbum.length} Captures
            </span>
          </div>

          {/* GAPLESS UNIFIED MOSAIC (gap-0) */}
          <div className="rounded-xl overflow-hidden border border-[#243324]/15 dark:border-white/15 bg-black shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0">
              {unifiedAlbum.map((photo, idx) => (
                <div
                  key={photo.id || idx}
                  onClick={() => setSelectedGalleryPhoto(photo.imageUrl)}
                  className="group relative aspect-4/3 overflow-hidden cursor-pointer bg-neutral-900 border-r border-b border-white/10"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-400 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2">
                    <span className="text-[8px] font-mono text-emerald-300 uppercase tracking-wider font-semibold">
                      {photo.category || 'Archive'}
                    </span>
                    <p className="text-[10px] font-semibold text-white leading-tight line-clamp-1">
                      {photo.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INSTITUTIONAL FOOTER                                                   */}
        {/* ========================================================================= */}
        <footer className="pt-4 pb-10 text-center border-t border-[#243324]/10 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 bg-white dark:bg-[#162215] hover:bg-[#243324]/5 dark:hover:bg-white/5 text-xs font-semibold text-[#243324] dark:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Society Annual Report</span>
            </button>
          </div>
          <p className="text-[10px] text-[#243324]/50 dark:text-white/40 font-mono">
            KRS Mechatronics Arenas Committee • Kalyani Government Engineering College • West Bengal, India
          </p>
        </footer>
      </main>

      {/* Lightbox for Fullscreen Photo Viewing */}
      <AnimatePresence>
        {selectedGalleryPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGalleryPhoto(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl max-h-[85vh] rounded-xl overflow-hidden bg-black/95 border border-white/20 p-2 shadow-2xl"
            >
              <img
                src={selectedGalleryPhoto}
                alt="Championship capture"
                className="w-full h-full object-contain max-h-[80vh] rounded-lg"
              />
              <button
                type="button"
                onClick={() => setSelectedGalleryPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                title="Close Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
