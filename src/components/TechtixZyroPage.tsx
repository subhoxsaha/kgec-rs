import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SlidersHorizontal,
  Navigation,
  Activity,
  Radio,
  Cpu,
  FileCode,
  PackageCheck,
  Hammer,
  Award,
} from 'lucide-react';
import beesVideo from '../assets/images/gorgeous-bees.webm';
import { TECHTIX_ZYRO_EVENTS } from '../data/techtixZyroEventsData';
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
} from '../data/eventsData';

interface TechtixZyroPageProps {
  onBack: () => void;
}

export const TechtixZyroPage: React.FC<TechtixZyroPageProps> = ({ onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const techtixScrollRef = useRef<HTMLDivElement>(null);
  const zyroScrollRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<string | null>(null);

  const { metadata, techfestPhotos, hackathonPhotos, isAdminLoggedIn, openEditor } = useReportData();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!ref.current) return;
    const offset = direction === 'left' ? -ref.current.clientWidth * 0.75 : ref.current.clientWidth * 0.75;
    ref.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const logo1Src =
    (isDark ? (metadata.logo1Dark || metadata.logo1) : (metadata.logo1Light || metadata.logo1)) ||
    (isDark ? DEFAULT_KGEC_LOGO_DARK : DEFAULT_KGEC_LOGO_LIGHT);
  const logo2Src =
    (isDark ? (metadata.logo2Dark || metadata.logo2) : (metadata.logo2Light || metadata.logo2)) ||
    (isDark ? DEFAULT_KRS_LOGO_DARK : DEFAULT_KRS_LOGO_LIGHT);

  const techtixEvents = TECHTIX_ZYRO_EVENTS.filter((e) => e.fest === 'TECHTIX');
  const zyroEvents = TECHTIX_ZYRO_EVENTS.filter((e) => e.fest === 'ZYRO' || e.fest === 'WORKSHOP');

  const techtixGallery = techfestPhotos && techfestPhotos.length > 0 ? techfestPhotos : DEFAULT_TECHFEST_PHOTOS;
  const zyroGallery = hackathonPhotos && hackathonPhotos.length > 0 ? hackathonPhotos : DEFAULT_HACKATHON_PHOTOS;

  // Track icons mapping
  const getTrackIcon = (eventId: string) => {
    if (eventId.includes('mobility') || eventId.includes('agv')) {
      return <Navigation className="w-6 h-6 text-amber-400" />;
    }
    if (eventId.includes('biomedical') || eventId.includes('assistive')) {
      return <Activity className="w-6 h-6 text-emerald-400" />;
    }
    if (eventId.includes('disaster') || eventId.includes('uav')) {
      return <Radio className="w-6 h-6 text-cyan-400" />;
    }
    return <Cpu className="w-6 h-6 text-purple-400" />;
  };

  return (
    <div className="relative min-h-screen w-full bg-[#070D08] text-[#F4EFE6] font-sans selection:bg-[#204022] selection:text-white">
      {/* ========================================================================= */}
      {/* FULL-PAGE BACKGROUND VIDEO & REFRACTIVE AMBIENT BACKDROP                   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          src={beesVideo}
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-110 saturate-110 scale-105"
        >
          <source src={beesVideo} type="video/webm" />
        </video>
        
        {/* Layered dark gradients for deep translucency */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D08]/85 via-[#070D08]/75 to-[#070D08]/92 backdrop-blur-[1px]" />
        
        {/* Glowing refractive glass light orbs */}
        <div className="absolute top-10 right-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-[150px]" />
        <div className="absolute top-2/3 right-10 w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.6px,transparent_0.6px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* ========================================================================= */}
      {/* GLASS TOP HEADER                                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/[0.06] backdrop-blur-2xl border-b border-white/[0.14] shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Glass Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-emerald-500/30 text-white font-medium text-xs sm:text-sm border border-white/[0.2] hover:border-emerald-400/60 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-emerald-300" />
            <span>Annual Report</span>
          </button>

          {/* Glass Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.06] backdrop-blur-2xl border border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <button
              type="button"
              onClick={() => scrollToSection('techtix-section')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 hover:text-white hover:bg-white/[0.15] transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>TECHTIX</span>
            </button>
            <span className="text-white/25">•</span>
            <button
              type="button"
              onClick={() => scrollToSection('zyro-section')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 hover:text-white hover:bg-white/[0.15] transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>ZYRO</span>
            </button>
          </div>

          {/* Right Utilities (Theme, Background Video Controls, Logos) */}
          <div className="flex items-center gap-2">
            {/* Background Video Glass Controls */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <button
                type="button"
                onClick={togglePlayPause}
                className="p-1.5 rounded-lg hover:bg-white/[0.18] text-neutral-300 hover:text-white transition-all cursor-pointer"
                title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                type="button"
                onClick={toggleAudio}
                className="p-1.5 rounded-lg hover:bg-white/[0.18] text-neutral-300 hover:text-white transition-all cursor-pointer"
                title={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] text-neutral-200 hover:text-white border border-white/[0.18] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-300" />}
            </button>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openEditor('photos')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700/50 hover:bg-emerald-600/70 text-white border border-emerald-400/40 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Edit Media</span>
              </button>
            )}

            {/* Logos with Glass Frame */}
            <div className="flex items-center gap-2 pl-2.5 border-l border-white/[0.18]">
              <div className="p-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/[0.15]">
                <img
                  src={logo1Src}
                  alt="KGEC Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter brightness-110"
                />
              </div>
              <div className="p-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/[0.15]">
                <img
                  src={logo2Src}
                  alt="KRS Logo"
                  className="w-6 h-6 sm:w-7 sm:h-7 object-contain filter brightness-110"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN GLASS CONTENT                                                        */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 space-y-20 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* SECTION 1: TECHTIX                                                        */}
        {/* ========================================================================= */}
        <section id="techtix-section" className="space-y-8 scroll-mt-20">
          {/* Glass Hero Panel */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-[0_16px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-mono font-semibold">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              <span>ANNUAL ROBOTICS CHAMPIONSHIP</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight">
              TECHTIX
            </h1>
            
            <p className="max-w-4xl text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
              Eastern India’s flagship inter-collegiate robotics championship organized by the KGEC Robotics Society. Featuring heavyweight combat robots in armored polycarbonate cages, autonomous line followers, agile soccer bots, micromouse mazes, and high-speed FPV drones in elimination matches.
            </p>
          </div>

          {/* Side-by-Side Glass Competitions Showcase */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
                Competitions
              </h3>

              {/* Glass Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollContainer(techtixScrollRef, 'left')}
                  className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-emerald-500/30 text-white border border-white/[0.2] hover:border-emerald-400/60 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollContainer(techtixScrollRef, 'right')}
                  className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-emerald-500/30 text-white border border-white/[0.2] hover:border-emerald-400/60 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Glass Cards Row */}
            <div
              ref={techtixScrollRef}
              className="flex gap-6 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scrollbar-none no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {techtixEvents.map((event) => (
                <div
                  key={event.id}
                  className="w-[310px] sm:w-[390px] lg:w-[430px] shrink-0 snap-start flex flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-[0_16px_40px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:border-emerald-400/50 hover:shadow-[0_20px_50px_0_rgba(16,185,129,0.15)] transition-all duration-300 p-5 space-y-4 group"
                >
                  {/* Photo with Glass Badge */}
                  <div className="relative w-full h-48 sm:h-54 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.15] shrink-0">
                    <img
                      src={event.bannerUrl}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    {/* Glass Prize Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-xl border border-white/[0.25] text-emerald-300 text-xs font-mono font-bold shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                        {event.prizePool}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 text-xs font-mono text-emerald-300/90 font-medium">
                      {event.arenaOrTrack}
                    </div>
                  </div>

                  {/* Clean 1-Para Description */}
                  <div className="space-y-2 flex-1">
                    <h4 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                      {event.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-200/90 font-light leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Glass Specifications Footer */}
                  <div className="pt-3 border-t border-white/[0.14] text-xs text-neutral-300 font-light flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] backdrop-blur-md border border-white/[0.12]">
                      {event.category}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">{event.teamSize}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glass Gallery */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
              Gallery
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {techtixGallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedGalleryPhoto(photo.imageUrl)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-white/[0.05] backdrop-blur-2xl border border-white/[0.16] hover:border-emerald-400/70 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.25)] cursor-pointer transition-all duration-300"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-mono text-white leading-tight line-clamp-2">
                        {photo.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ========================================================================= */}
        {/* SECTION 2: ZYRO                                                           */}
        {/* ========================================================================= */}
        <section id="zyro-section" className="space-y-8 scroll-mt-20 pt-8 border-t border-white/[0.16]">
          {/* Glass Hero Panel */}
          <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-[0_16px_48px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.25)] p-6 sm:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-mono font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>36-HOUR HARDWARE &amp; AI SPRINT</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-tight">
              ZYRO
            </h2>
            
            <p className="max-w-4xl text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
              A 36-hour physical mechatronics and AI hackathon where student teams design, fabricate, and program autonomous robotics systems from scratch with 24/7 access to KRS prototyping facilities and compute kits.
            </p>
          </div>

          {/* Monthly Phases Timeline */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
              Phases Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Phase 1 */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-amber-400/[0.25] shadow-[0_12px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] space-y-2.5 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">PHASE 01 • OCT</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
                    <FileCode className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">Problem Release &amp; Abstracts</h4>
                <p className="text-xs text-neutral-200/90 font-light leading-relaxed">
                  Track problem statement rollout, team registrations, and technical architecture abstracts.
                </p>
              </div>

              {/* Phase 2 */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-amber-400/[0.25] shadow-[0_12px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] space-y-2.5 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">PHASE 02 • NOV</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
                    <PackageCheck className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">Shortlisting &amp; Hardware Grants</h4>
                <p className="text-xs text-neutral-200/90 font-light leading-relaxed">
                  Top squad selections and distribution of compute loaner kits (NVIDIA Jetson, RPLIDAR, sensors).
                </p>
              </div>

              {/* Phase 3 */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-amber-400/[0.25] shadow-[0_12px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] space-y-2.5 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">PHASE 03 • DEC</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
                    <Hammer className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">36-Hour Rapid Fabrication</h4>
                <p className="text-xs text-neutral-200/90 font-light leading-relaxed">
                  All-night sprint in the makerspace with 3D printers, laser cutters, ROS2 tuning, and live breadboarding.
                </p>
              </div>

              {/* Phase 4 */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-500/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-amber-400/[0.25] shadow-[0_12px_32px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] space-y-2.5 hover:border-amber-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold tracking-wider">PHASE 04 • JAN</span>
                  <div className="p-2 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">Live Trials &amp; Grand Pitch</h4>
                <p className="text-xs text-neutral-200/90 font-light leading-relaxed">
                  Obstacle course runs, technical jury audits, prize announcements, and incubation onboarding.
                </p>
              </div>
            </div>
          </div>

          {/* Compact Glass Tracks with Single SVG and Small Text */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
                Problem Statement Tracks
              </h3>

              {/* Glass Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollContainer(zyroScrollRef, 'left')}
                  className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-amber-500/30 text-white border border-white/[0.2] hover:border-amber-400/60 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollContainer(zyroScrollRef, 'right')}
                  className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-amber-500/30 text-white border border-white/[0.2] hover:border-amber-400/60 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Horizontal Glass Tracks with SVG and Small Text */}
            <div
              ref={zyroScrollRef}
              className="flex gap-5 overflow-x-auto pb-6 pt-1 snap-x snap-mandatory scrollbar-none no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {zyroEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0 snap-start flex flex-col justify-between rounded-3xl bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-white/[0.02] backdrop-blur-3xl border border-white/[0.18] shadow-[0_16px_40px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:border-amber-400/50 hover:shadow-[0_20px_50px_0_rgba(245,158,11,0.15)] transition-all duration-300 p-5 space-y-4 group"
                >
                  {/* Top Bar with One SVG Icon and Prize Badge */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.2] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] group-hover:scale-110 transition-transform">
                      {getTrackIcon(event.id)}
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-xl border border-white/[0.25] text-amber-300 text-xs font-mono font-bold shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                      {event.prizePool}
                    </span>
                  </div>

                  {/* Track Details in Small Text */}
                  <div className="space-y-2 flex-1">
                    <div className="text-[11px] font-mono text-amber-400/90 uppercase tracking-wider font-semibold">
                      Track 0{idx + 1} • {event.category}
                    </div>
                    <h4 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
                      {(event.title || '').replace(/^ZYRO-TRACK \d+:\s*/, '')}
                    </h4>
                    <p className="text-xs text-neutral-200/90 font-light leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Sandbox Environment in Small Text */}
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-[11px] text-neutral-300 font-light">
                    <span className="text-amber-400 font-mono font-medium block text-[10px]">ENVIRONMENT:</span>
                    <span className="line-clamp-1">{event.arenaOrTrack}</span>
                  </div>

                  {/* Footer */}
                  <div className="pt-2 border-t border-white/[0.14] text-xs text-neutral-300 font-light flex items-center justify-between">
                    <span className="text-[11px] font-mono text-neutral-400">{event.teamSize}</span>
                    <span className="text-[11px] font-mono text-amber-400 font-medium">36h Continuous</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Glass Gallery */}
          <div className="space-y-4 pt-4">
            <h3 className="font-display text-2xl sm:text-3xl font-normal text-white">
              Gallery
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {zyroGallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedGalleryPhoto(photo.imageUrl)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-white/[0.05] backdrop-blur-2xl border border-white/[0.16] hover:border-amber-400/70 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.25)] cursor-pointer transition-all duration-300"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-mono text-white leading-tight line-clamp-2">
                        {photo.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* GLASS FOOTER                                                              */}
        {/* ========================================================================= */}
        <div className="pt-8 text-center border-t border-white/[0.16]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400/90 text-black font-semibold text-sm backdrop-blur-2xl border border-emerald-300/40 shadow-[0_12px_36px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all hover:scale-105 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Annual Report</span>
          </button>
        </div>
      </main>

      {/* Lightbox for Gallery Photos with Glass styling */}
      <AnimatePresence>
        {selectedGalleryPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGalleryPhoto(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden bg-white/[0.08] backdrop-blur-3xl border border-white/[0.25] shadow-[0_24px_64px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.3)] p-2"
            >
              <img
                src={selectedGalleryPhoto}
                alt="Event capture"
                className="w-full h-full object-contain max-h-[80vh] rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setSelectedGalleryPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
