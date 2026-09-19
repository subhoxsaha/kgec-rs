import React from 'react';
import { Edit3 } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { GravityDomainShowcase } from './GravityDomainShowcase';

export const OverviewSection: React.FC = () => {
  const { sectionTexts, isAdminLoggedIn, openEditor } = useReportData();

  return (
    <section
      id="overview-section"
      className="relative w-full pt-3.5 sm:pt-5 pb-5 sm:pb-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 bg-[#FBF9F5] dark:bg-[#121B11] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400 overflow-hidden border-b border-[#243324]/10 dark:border-white/10"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-600/10 to-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-indigo-500/10 to-emerald-600/10 blur-3xl pointer-events-none" />

      {/* FULL SCREEN WIDTH CONTENT */}
      <div className="w-full relative z-10 space-y-3.5 sm:space-y-4">
        {/* 1. TOP ROW: ABOUT US & MOTTO + NARRATIVE PARAGRAPHS (LEFT) + VIDEO (RIGHT) */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-8 pb-5 sm:pb-6 border-b border-[#243324]/10 dark:border-white/10">
          {/* Left: About Us Title, Motto & Paragraphs (Side by side to video for PC) */}
          <div className="flex-1 w-full text-center lg:text-left space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-[#1F2B1D] dark:text-[#F4EFE6] tracking-tight">
                {sectionTexts.aboutTitle || 'About Us'}
              </h2>
              {isAdminLoggedIn && (
                <button
                  type="button"
                  onClick={() => openEditor('metrics')}
                  className="inline-flex items-center gap-1 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
                  title="Edit Section 2 in Admin"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Sec 2</span>
                </button>
              )}
            </div>

            {/* Motto: Clean typography, no background box, no Est 2012 pill */}
            <div className="pt-0.5">
              <span className="font-serif italic text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-[#1F2B1D] via-emerald-800 to-[#1F2B1D] dark:from-[#E6F4E2] dark:via-emerald-300 dark:to-[#E6F4E2] bg-clip-text text-transparent tracking-wide">
                "{sectionTexts.mottoTagline || 'Think, Build, Renovate.'}"
              </span>
            </div>

            {/* Narrative text: Under motto, in one div without column separation */}
            <div className="pt-2 sm:pt-2.5 space-y-2 text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed text-center lg:text-left">
              <p>
                {sectionTexts.aboutParagraph1 ||
                  'And what else can best define our future if not robots. Robotics Society, Kgec believes that the future lies in the world of robotics and we strive forward to spread and act on it.'}
              </p>
              <p>
                {sectionTexts.aboutParagraph2 ||
                  'We work on domains like : Mechatronics, Robot Design, Machine Learning, Computer Vision, Electronics and IoT to build basic robotic systems. We also have a web team, a Content team and a Graphics Team to promote our belief.'}
              </p>
            </div>
          </div>

          {/* Right: Clean, Text-Free YouTube Video (Autoplays, loops, controls hidden & top title bar cropped out) */}
          <div className="w-full sm:w-[380px] lg:w-[420px] xl:w-[460px] shrink-0">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-[#243324]/15 dark:border-white/15 bg-black">
              {/* Scaled and shifted iframe clips top title bar & bottom watermark out of the frame */}
              <iframe
                src="https://www.youtube-nocookie.com/embed/_0xqFfpLjm4?autoplay=1&mute=1&loop=1&playlist=_0xqFfpLjm4&controls=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1"
                title="RS Lab Intro Video"
                className="w-full h-[128%] -top-[14%] left-0 absolute border-0 pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* 2. LOWER ROW: GRAVITY ORBIT SHOWCASE */}
        <div className="w-full flex flex-col items-center">
          {/* Central Orbit Showcase: Robot in dead center flanked by symmetrical 3-pill orbital wings */}
          <div className="w-full flex items-center justify-center pt-3 sm:pt-4">
            <GravityDomainShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};
