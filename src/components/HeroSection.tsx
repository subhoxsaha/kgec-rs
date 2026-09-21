import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldAlert, Cpu, Sparkles, Edit3, Award, Users, Bot } from 'lucide-react';
import beesVideo from '../assets/images/gorgeous-bees.webm';
import { useReportData } from '../context/ReportDataContext';
import { HeroRobotCompanion } from './HeroRobotCompanion';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { sectionTexts, metadata, isAdminLoggedIn, openEditor } = useReportData();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay handled
        });
      }
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero-section"
      className="relative min-h-[100dvh] w-full flex flex-col justify-start items-center overflow-hidden px-4 sm:px-8 lg:px-12 text-center bg-[#0d140e] pt-36 xs:pt-40 sm:pt-32 md:pt-28 lg:pt-28 xl:pt-32 pb-12"
    >
      {/* Background Media with Dark Tech Tint */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src={beesVideo}
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.45] contrast-125 saturate-50"
      >
        <source src={beesVideo} type="video/webm" />
      </video>

      {/* Dark Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e160e]/60 via-[#101c10]/40 to-[#0e160e]/95 pointer-events-none z-10" />

      {/* Foreground Content in Sandstone Color - Shifted towards top */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-20 max-w-5xl mx-auto w-full flex flex-col items-center justify-start space-y-3 sm:space-y-4 text-[#F4EFE6] drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)]"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 22 }}
          className="space-y-3 sm:space-y-4 pt-1 sm:pt-2 md:pt-1"
        >
          <h1 className="font-display text-[2.75rem] xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.98] sm:leading-[0.95] text-[#F4EFE6] font-normal">
            {sectionTexts.heroTitle === 'KGEC Robotics Society' ? (
              <>
                <span className="block sm:inline">KGEC Robotics</span>{' '}
                <span className="block sm:inline">Society</span>
              </>
            ) : sectionTexts.heroTitle.includes('Robotics ') ? (
              <>
                <span className="block sm:inline">
                  {sectionTexts.heroTitle.substring(0, sectionTexts.heroTitle.indexOf('Robotics') + 8)}
                </span>{' '}
                <span className="block sm:inline">
                  {sectionTexts.heroTitle.substring(sectionTexts.heroTitle.indexOf('Robotics') + 9)}
                </span>
              </>
            ) : (
              sectionTexts.heroTitle
            )}
          </h1>

          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-[#E8EDEA]/90 font-light max-w-xl mx-auto pt-0.5 sm:pt-1 leading-relaxed">
            {sectionTexts.heroDescription}
          </p>

          {/* Quick Stats Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 pt-1 sm:pt-2 text-[11px] sm:text-xs font-mono text-emerald-300">
            <button
              type="button"
              onClick={() => {
                const target = sectionTexts.heroPill1Target || '#overview-section';
                if (target.startsWith('#')) {
                  const el = document.querySelector(target) || document.getElementById(target.replace('#', ''));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.hash = target;
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1 rounded-full bg-black/50 hover:bg-emerald-950/70 hover:text-white backdrop-blur-md border border-white/15 hover:border-emerald-400/50 shadow-xs transition-all cursor-pointer select-none group active:scale-95"
            >
              <Award className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span>{sectionTexts.heroPill1Text || '48+ National Podiums'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = sectionTexts.heroPill2Target || '#leadership-team-section';
                if (target.startsWith('#')) {
                  const el = document.querySelector(target) || document.getElementById(target.replace('#', ''));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.hash = target;
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1 rounded-full bg-black/50 hover:bg-emerald-950/70 hover:text-white backdrop-blur-md border border-white/15 hover:border-emerald-400/50 shadow-xs transition-all cursor-pointer select-none group active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span>{sectionTexts.heroPill2Text || '180+ Active Engineers'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const target = sectionTexts.heroPill3Target || '#projects-section';
                if (target.startsWith('#')) {
                  const el = document.querySelector(target) || document.getElementById(target.replace('#', ''));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else window.location.hash = target;
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1 rounded-full bg-black/50 hover:bg-emerald-950/70 hover:text-white backdrop-blur-md border border-white/15 hover:border-emerald-400/50 shadow-xs transition-all cursor-pointer select-none group active:scale-95"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
              <span>{sectionTexts.heroPill3Text || '26 Flagship Bot Builds'}</span>
            </button>
          </div>

          {isAdminLoggedIn && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => openEditor('logos')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-400/40 backdrop-blur-xs shadow-md cursor-pointer transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Section 1: Hero &amp; Theme Logos</span>
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Interactive Hero Robot Companion - Aligned at Bottom Right for Mobile & Desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        className="absolute bottom-3 right-3 xs:bottom-4 xs:right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:right-12 z-30 select-none pointer-events-auto max-w-[calc(100vw-24px)]"
      >
        <HeroRobotCompanion />
      </motion.div>
    </section>
  );
};
