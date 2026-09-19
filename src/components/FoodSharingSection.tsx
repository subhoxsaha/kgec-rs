import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';
import { IMAGES } from '../assets/images';
import { useReportData } from '../context/ReportDataContext';
import { HeartHandshake, Box, School, BookOpen } from 'lucide-react';

export const FoodSharingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { metadata, sectionTexts } = useReportData();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section
      ref={containerRef}
      id="outreach-section"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10">
        {/* Headline */}
        <div className="space-y-3 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-wide uppercase text-[#526340] dark:text-[#A3B59E]">
              Community Outreach & Project Eklavya
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            {sectionTexts.foodTitle}
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            {sectionTexts.foodDescription}
          </p>
        </div>

        {/* Visual & Metric Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual */}
          <motion.div
            style={{ scale: imageScale }}
            className="lg:col-span-6 h-[360px] sm:h-[420px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-lg relative bg-[#1A2619]"
          >
            <img
              src={IMAGES.communityHarvest}
              alt="KGEC Robotics Society members demonstrating STEM robots to young students"
              className="w-full h-full object-cover filter contrast-105 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142114]/90 via-[#142114]/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                PROJECT EKLAVYA INITIATIVE
              </span>
              <p className="font-display text-2xl sm:text-3xl font-light">
                Bringing free hands-on robotics workshops and open hardware kits to government high schools across Bengal.
              </p>
            </div>
          </motion.div>

          {/* Impact Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                <Box className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Free Hardware Kits Distributed</span>
              </div>
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={metadata.stemKitsDistributed || 1250} suffix="+" />
              </div>
              <p className="text-lg font-medium text-[#243324] dark:text-[#F4EFE6]">
                Custom Arduino & STEM Prototyping Kits
              </p>
              <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Assembled by KRS members inside the Kalyani lab, featuring custom breadboard carriers, ultrasonic sensors, motor drivers, and beginner-friendly Bangla/English manuals.
              </p>
            </div>

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#F5F2EB] dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Students Mentored</span>
              </div>
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={metadata.schoolStudentsMentored || 3800} suffix="+" />
              </div>
              <p className="text-lg font-medium text-[#243324] dark:text-[#F4EFE6]">
                Rural School Students Reached
              </p>
              <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Conducted 24+ weekend outreach bootcamps across Nadia and neighboring districts, sparking lifelong curiosity in coding, mechatronics, and physical computing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
