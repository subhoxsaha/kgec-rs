import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Activity,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  ArrowUpRight,
  Edit3,
} from 'lucide-react';
import { FLAGSHIP_PROJECTS } from '../data/projectsData';
import { BotProject } from '../types';
import { useReportData } from '../context/ReportDataContext';

export const ProjectsShowcaseSection: React.FC = () => {
  const { botProjects, isAdminLoggedIn, openEditor } = useReportData();
  const projects = botProjects && botProjects.length > 0 ? botProjects : FLAGSHIP_PROJECTS;
  const [selectedProject, setSelectedProject] = useState<BotProject | null>(null);

  // Responsive Visible Cards Count (1 on mobile, 2 on tablet, 3 on desktop)
  const [visibleCount, setVisibleCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel State
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const totalProjects = projects.length;

  const handlePrev = () => {
    if (totalProjects <= 1) return;
    setSlideDirection('left');
    setActiveProjectIndex((prev) => (prev > 0 ? prev - 1 : totalProjects - 1));
  };

  const handleNext = () => {
    if (totalProjects <= 1) return;
    setSlideDirection('right');
    setActiveProjectIndex((prev) => (prev < totalProjects - 1 ? prev + 1 : 0));
  };

  // Compute visible projects based on circular wrap
  const visibleProjects = Array.from(
    { length: Math.min(visibleCount, totalProjects) },
    (_, i) => projects[(activeProjectIndex + i) % totalProjects]
  );

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 60 : -60,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      },
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -60 : 60,
      opacity: 0,
      scale: 0.97,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      },
    }),
  };

  return (
    <section
      id="projects-section"
      className="relative pt-3 sm:pt-5 pb-10 sm:pb-14 px-3 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#243324]/10 dark:border-white/10 bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto w-full space-y-5 sm:space-y-6">
        {/* Section Header: Center aligned */}
        <div className="w-full flex flex-col items-center text-center">
          <span className="text-sm sm:text-base font-light text-[#4A5D44] dark:text-[#CBD7C7] leading-none tracking-wide">
            Our
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal tracking-tight leading-none mt-0.5 sm:mt-1">
            Projects
          </h2>
          {isAdminLoggedIn && (
            <button
              type="button"
              onClick={() => openEditor('projects')}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
              title="Open Admin Projects Editor"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Projects &amp; Add New Bot</span>
            </button>
          )}
        </div>

        {/* Projects Display: Responsive Carousel with Flanking Buttons */}
        <div className="w-full">
          {totalProjects === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 text-sm font-mono text-[#657351]">
              No projects available.
            </div>
          ) : (
            <div className="relative max-w-7xl mx-auto px-7 sm:px-12 lg:px-14">
              {/* Left Side Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={totalProjects <= 1}
                aria-label="Previous project"
                className="absolute left-0 sm:left-1 lg:left-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 dark:bg-[#1E2E1D]/95 text-[#1F2B1D] dark:text-white border border-[#243324]/15 dark:border-white/15 shadow-md flex items-center justify-center hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-90"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Right Side Button */}
              <button
                type="button"
                onClick={handleNext}
                disabled={totalProjects <= 1}
                aria-label="Next project"
                className="absolute right-0 sm:right-1 lg:right-1.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-white/95 dark:bg-[#1E2E1D]/95 text-[#1F2B1D] dark:text-white border border-[#243324]/15 dark:border-white/15 shadow-md flex items-center justify-center hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-90"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Animated Responsive Grid (1 on mobile, 2 on tablet, 3 on desktop) */}
              <div className="overflow-hidden px-0.5 sm:px-1 py-2">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={`${activeProjectIndex}-${visibleCount}`}
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={`grid gap-4 sm:gap-5 lg:gap-6 ${
                      visibleCount === 1
                        ? 'grid-cols-1 max-w-md mx-auto'
                        : visibleCount === 2
                        ? 'grid-cols-2 max-w-4xl mx-auto'
                        : 'grid-cols-3'
                    }`}
                  >
                    {visibleProjects.map((bot) => (
                      <div
                        key={bot.id}
                        onClick={() => setSelectedProject(bot)}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10 shadow-xs hover:shadow-xl cursor-pointer hover:border-emerald-500/40 transition-all duration-400"
                      >
                        {/* Featured Image with Vignette Gradient & Title */}
                        <div className="relative w-full h-48 sm:h-52 lg:h-56 overflow-hidden bg-neutral-900 shrink-0">
                          {bot.imageUrl ? (
                            <img
                              src={bot.imageUrl}
                              alt={bot.imageAlt || bot.name}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1A2819] to-[#0B120A]" />
                          )}
                          {/* Smooth Bottom Vignette for High Text Contrast */}
                          <div className="absolute inset-x-0 bottom-0 h-3/4 pointer-events-none bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                          {/* Floating Action Chip */}
                          <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                            <div className="p-1.5 rounded-full bg-emerald-600 text-white shadow-md flex items-center justify-center">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Project Name Inside Picture (Pure White) */}
                          <div className="absolute bottom-3 left-4 right-4 pointer-events-none">
                            <h3
                              style={{ color: '#ffffff' }}
                              className="font-display text-xl sm:text-2xl text-white !text-white group-hover:text-white font-medium tracking-tight drop-shadow-md transition-colors"
                            >
                              {bot.name}
                            </h3>
                            {bot.codename && (
                              <p
                                style={{ color: '#ffffff' }}
                                className="text-[11px] sm:text-xs font-mono text-white !text-white opacity-95 tracking-wide mt-0.5 truncate drop-shadow-sm"
                              >
                                {bot.codename}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Content: Short Description */}
                        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                          <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed line-clamp-3">
                            {bot.description}
                          </p>

                          <div className="mt-3.5 pt-3 border-t border-[#243324]/5 dark:border-white/5 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            <span>Technical specifications</span>
                            <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-300">
                              <span className="font-semibold">View more</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Indicator Dots */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-3 sm:pt-4">
                {projects.map((bot, idx) => (
                  <button
                    key={bot.id}
                    type="button"
                    onClick={() => {
                      setSlideDirection(idx > activeProjectIndex ? 'right' : 'left');
                      setActiveProjectIndex(idx);
                    }}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeProjectIndex
                        ? 'w-6 sm:w-8 bg-emerald-600 dark:bg-emerald-400'
                        : 'w-1.5 sm:w-2 bg-[#243324]/20 dark:bg-white/20 hover:bg-[#243324]/40'
                    }`}
                    aria-label={`Go to project ${idx + 1}: ${bot.name}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Project Architecture Dossier Modal with Smooth Spring Transitions */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop with Smooth Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Dialog with Smooth Spring Scaling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#1C2C1B] border border-[#243324]/15 dark:border-white/15 shadow-2xl p-6 sm:p-10 space-y-6 text-[#243324] dark:text-[#F4EFE6] z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all duration-200 cursor-pointer z-20 active:scale-95"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Project Image */}
              {selectedProject.imageUrl && (
                <div className="relative w-full h-52 sm:h-72 overflow-hidden rounded-2xl bg-neutral-900 shadow-md">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.imageAlt || selectedProject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Modal Header */}
              <div className="space-y-2 border-b border-[#243324]/10 dark:border-white/10 pb-5 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    {selectedProject.category}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    {selectedProject.status}
                  </span>
                  <span className="text-xs font-mono text-[#657351] dark:text-[#9FB19A]">
                    {selectedProject.weightClass}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2B1D] dark:text-white">
                  {selectedProject.name}
                </h3>
                <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-300 font-mono">
                  Codename: {selectedProject.codename} • Division: {selectedProject.wingName}
                </p>
                {selectedProject.featuredAward && (
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>{selectedProject.featuredAward}</span>
                  </div>
                )}
              </div>

              {/* Project Narrative */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  Engineering Objective & Mission
                </h4>
                <p className="text-sm sm:text-base text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Subsystem Architecture Breakdown */}
              <div className="p-5 rounded-2xl bg-[#F5F2EB] dark:bg-[#243723] border border-[#243324]/10 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>Subsystem Architecture Overview</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3D4F38] dark:text-[#E2EBE0] font-mono leading-relaxed">
                  {selectedProject.architectureSummary}
                </p>
              </div>

              {/* Detailed Technical Specifications Sheet */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  Verified Hardware Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[#657351] dark:text-[#9FB19A] block text-[10px] uppercase">
                      Physical Mass & Envelope
                    </span>
                    <span className="font-bold text-[#1F2B1D] dark:text-white">
                      {selectedProject.specs.weight} ({selectedProject.specs.dimensions})
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[#657351] dark:text-[#9FB19A] block text-[10px] uppercase">
                      Chassis & Armor Material
                    </span>
                    <span className="font-bold text-[#1F2B1D] dark:text-white">
                      {selectedProject.specs.chassisMaterial}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[#657351] dark:text-[#9FB19A] block text-[10px] uppercase">
                      Power Delivery & Battery
                    </span>
                    <span className="font-bold text-[#1F2B1D] dark:text-white">
                      {selectedProject.specs.power}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-[#1E2E1D] border border-[#243324]/10 dark:border-white/10">
                    <span className="text-[#657351] dark:text-[#9FB19A] block text-[10px] uppercase">
                      Compute Core & Telemetry
                    </span>
                    <span className="font-bold text-[#1F2B1D] dark:text-white">
                      {selectedProject.specs.controller}
                    </span>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-xl bg-emerald-600/10 dark:bg-emerald-950/40 border border-emerald-500/20">
                    <span className="text-emerald-800 dark:text-emerald-300 block text-[10px] uppercase font-bold">
                      Primary Actuators, Weapon or Sensors
                    </span>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">
                      {selectedProject.specs.actuatorsOrWeapon}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Engineering Innovations */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#657351] dark:text-[#A3B59E]">
                  Critical Engineering Innovations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#243324]/5 dark:bg-white/5 border border-[#243324]/10 dark:border-white/10 text-xs flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-mono text-[#657351] dark:text-[#9FB19A]">
                  KGEC Robotics Society • Verified Lab Build
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#1F2B1D] dark:bg-[#2C422A] text-white text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Close Specification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
