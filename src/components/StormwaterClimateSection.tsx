import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Gauge, ShieldCheck, Cpu, Activity, Zap } from 'lucide-react';
import { IMAGES } from '../assets/images';
import { useReportData } from '../context/ReportDataContext';
import { AnimatedNumber } from './AnimatedNumber';

export const StormwaterClimateSection: React.FC = () => {
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
      id="specs-section"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-8 sm:space-y-10">
        {/* Section Headline */}
        <div className="space-y-3 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-xs sm:text-sm font-mono font-medium tracking-wide uppercase text-[#526340] dark:text-[#A3B59E]">
              Precision Hardware & Arena Testing Rig
            </p>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.02] tracking-tight">
            {sectionTexts.climateTitle}
          </h2>
          <p className="text-lg sm:text-xl text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            {sectionTexts.climateDescription}
          </p>
        </div>

        {/* Visual & Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Image with Parallax Scroll */}
          <div className="lg:col-span-7 h-[360px] sm:h-[420px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-lg relative bg-[#1F2B1D]">
            <motion.img
              style={{ y: imageY }}
              src={IMAGES.rooftopHaven}
              alt="KGEC Robotics Society High-Speed Prototyping and Proving Ground"
              className="absolute top-0 left-0 w-full h-[135%] object-cover object-center max-w-none will-change-transform filter contrast-110 brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142013]/90 via-[#142013]/30 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                <Activity className="w-4 h-4" />
                <span>DYNAMIC TELEMETRY & VIBRATION ANALYSIS</span>
              </div>
              <p className="font-display text-2xl sm:text-3xl font-light">
                Custom dynamometer rigs stress-testing brushless weapon drivetrains up to 14,000+ RPM.
              </p>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="p-8 rounded-[2rem] bg-white dark:bg-[#1C2C1B] border border-[#243324]/10 dark:border-white/10 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-mono text-[#526340] dark:text-[#A3B59E]">
                  Brushless Dyno Bench
                </span>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="font-display text-4xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                <AnimatedNumber value={14200} suffix=" RPM" />
              </div>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Peak rotational speed verified under full 8S LiPo electrical load without thermal throttle.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
              className="p-8 rounded-[2rem] bg-white dark:bg-[#1C2C1B] border border-[#243324]/10 dark:border-white/10 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-mono text-[#526340] dark:text-[#A3B59E]">
                  Armor Yield Tolerance
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="font-display text-4xl sm:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-light">
                <AnimatedNumber value={520} suffix=" kg" />
              </div>
              <p className="text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light">
                Kinetic impact resistance validated across Hardox 500 welded monocoque plates.
              </p>
            </motion.div>

            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 text-xs font-mono text-[#526340] dark:text-[#A3B59E] flex items-center justify-between">
              <span>CAN-Bus Telemetry Latency:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">&lt; 1.2 ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
