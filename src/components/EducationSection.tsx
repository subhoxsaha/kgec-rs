import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMAGES } from '../assets/images';
import { useReportData } from '../context/ReportDataContext';
import { AnimatedNumber } from './AnimatedNumber';
import { GraduationCap, Code, Flame, Award } from 'lucide-react';

export const EducationSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { metadata, sectionTexts } = useReportData();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-22%', '0%'], { clamp: true });

  return (
    <section
      ref={containerRef}
      id="workshops-section"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#F5F2EB] dark:bg-[#182417] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10">
        {/* Headline */}
        <div className="space-y-3 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-wide uppercase text-[#526340] dark:text-[#A3B59E]">
              Hands-On Engineering & Student Inductions
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            {sectionTexts.educationTitle}
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            {sectionTexts.educationDescription}
          </p>
        </div>

        {/* Visual & Education Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Metrics Column */}
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#223321] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400"
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Total Engineers Trained</span>
              </div>
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={metadata.studentsTrained || 5400} suffix="+" />
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Workshop & Bootcamp Attendees</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                Engineering students trained in real-world C/C++, STM32 firmware, ROS2, and circuit prototyping through peer-led mentorship tracks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 sm:p-10 rounded-[2.5rem] bg-white dark:bg-[#223321] border border-[#243324]/10 dark:border-white/12 shadow-sm space-y-3 transition-colors duration-400"
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Hands-on Sessions</span>
              </div>
              <div className="font-display text-5xl sm:text-6xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light tracking-tight">
                <AnimatedNumber value={metadata.workshopsHosted || 32} suffix=" Sessions" />
              </div>
              <p className="text-base text-[#1F2B1D] dark:text-[#F4EFE6] font-medium">Bootcamps, Sprints & RoboFiesta</p>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                From freshers’ bot-building hackathons to national tech symposium qualifiers held inside the Kalyani campus arena.
              </p>
            </motion.div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-7 h-[360px] sm:h-[420px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-lg relative order-1 lg:order-2 bg-[#1F2B1D]">
            <motion.img
              style={{ y: imageY }}
              src={IMAGES.studentsObservingHives}
              alt="Engineering students collaborating on robot motherboard soldering"
              className="absolute top-0 left-0 w-full h-[135%] object-cover object-center max-w-none will-change-transform filter contrast-105 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142114]/90 via-[#142114]/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
                PEER-TO-PEER LAB CULTURE
              </span>
              <p className="font-display text-2xl sm:text-3xl font-light">
                Senior robotics mentors guiding freshman cohorts from basic breadboard wiring to competitive autonomous bots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
