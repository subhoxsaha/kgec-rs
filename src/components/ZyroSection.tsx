import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Activity, Bot } from 'lucide-react';
import type { FestEvent } from '../data/techtixZyroEventsData';

export interface PhaseItem {
  step: string;
  month: string;
  title: string;
  desc: string;
  aiNote?: string;
}

interface ZyroSectionProps {
  zyroEvents: FestEvent[];
  phases: PhaseItem[];
  trackPassages?: Record<string, { code: string; title: string; passage: string }>;
  onPhotoClick?: (url: string) => void;
}

/**
 * Concise Track Passages for Card Backs (Less detailed, crisp, fits square cards on all viewports)
 */
const TRACK_PASSAGES: Record<string, { code: string; title: string; passage: string }> = {
  agv: {
    code: 'TRACK 01 // AGV',
    title: 'Autonomous Navigation',
    passage:
      'Build dual-drive rovers with ROS2 and 360° LiDAR to autonomously map, compute optimal paths, and navigate unknown arenas without teleoperation.',
  },
  bionics: {
    code: 'TRACK 02 // BIONICS',
    title: 'Assistive Mechatronics',
    passage:
      'Engineer 3D-printed bionic limbs controlled through real-time EMG bio-signals and adaptive multi-finger tendon actuation for tactile dexterity.',
  },
  uav: {
    code: 'TRACK 03 // UAV',
    title: 'Aerial Reconnaissance',
    passage:
      'Deploy autonomous quadcopters with onboard optical flow and thermal cameras for GPS-denied indoor search, hazard detection, and live telemetry.',
  },
  industrial: {
    code: 'TRACK 04 // ROBOTICS',
    title: 'Industrial Manipulation',
    passage:
      'Design 6-DOF robotic arms with edge-AI computer vision for real-time defect sorting, closed-loop servo feedback, and kinematic conveyor pick-and-place.',
  },
};

/**
 * Clean Single-Sentence AI Directives for Timeline Selection
 */
const AI_DIRECTIVES: Record<string, string> = {
  '01': 'AI verification assesses kinematic models, CAD chassis integrity, and compute-to-payload ratios before grant clearance.',
  '02': 'Hardware distribution authorizes NVIDIA Jetson Orin Nano boards and RPLIDAR units for benchtop testing.',
  '03': '36 hours of continuous rapid prototyping, embedded ROS2 trajectory tuning, and edge vision optimization.',
  '04': 'Live arena qualification testing against randomized physical obstacles with zero manual intervention scoring.',
};

/**
 * Clean Vector SVG Icons for 4 Tracks
 */
const AgvIconSvg: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-transform duration-200 group-hover:scale-105"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="18" y="26" width="36" height="24" rx="5" fill="currentColor" fillOpacity="0.12" />
    <rect x="10" y="22" width="7" height="32" rx="3" fill="currentColor" />
    <rect x="55" y="22" width="7" height="32" rx="3" fill="currentColor" />
    <circle cx="36" cy="22" r="5" fill="currentColor" />
    <path d="M 28 11 A 10 10 0 0 1 44 11" strokeWidth="2" strokeDasharray="2.5 2" />
    <path d="M 22 6 A 16 16 0 0 1 50 6" strokeWidth="2" strokeDasharray="3 3" />
    <circle cx="36" cy="38" r="3.5" fill="currentColor" />
  </svg>
);

const HeartPulseIconSvg: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.55)] transition-transform duration-200 group-hover:scale-105"
    fill="currentColor"
  >
    <path d="M36 60s-20-13-27-25C2 23 8 9 22 9c8 0 14 6 14 6s6-6 14-6c14 0 20 14 13 26-7 12-27 25-27 25z" />
    <path
      d="M12 36 L24 36 L28 26 L36 46 L42 29 L47 39 L51 36 L60 36"
      fill="none"
      stroke="#0C120D"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DroneIconSvg: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-transform duration-200 group-hover:scale-105"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="18" x2="54" y2="54" />
    <line x1="18" y1="54" x2="54" y2="18" />
    <ellipse cx="18" cy="18" rx="10" ry="4" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="54" cy="18" rx="10" ry="4" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="18" cy="54" rx="10" ry="4" fill="currentColor" fillOpacity="0.25" />
    <ellipse cx="54" cy="54" rx="10" ry="4" fill="currentColor" fillOpacity="0.25" />
    <circle cx="36" cy="36" r="8" fill="currentColor" />
    <circle cx="36" cy="36" r="3.5" fill="#0C120D" />
  </svg>
);

const RoboticArmIconSvg: React.FC = () => (
  <svg
    viewBox="0 0 72 72"
    className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-transform duration-200 group-hover:scale-105"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M 18 58 L 54 58" />
    <rect x="27" y="50" width="18" height="8" rx="2" fill="currentColor" fillOpacity="0.2" />
    <line x1="36" y1="50" x2="36" y2="38" />
    <circle cx="36" cy="38" r="4" fill="currentColor" />
    <line x1="36" y1="38" x2="48" y2="24" />
    <circle cx="48" cy="24" r="3.5" fill="currentColor" />
    <line x1="48" y1="24" x2="42" y2="16" />
    <path d="M 37 12 L 42 16 L 47 12" />
    <circle cx="42" cy="11" r="2" fill="currentColor" />
  </svg>
);

/**
 * Pixelated Dissolution Canvas Component
 */
interface PixelCanvasProps {
  isRevealing: boolean;
  onAnimationEnd?: () => void;
}

const PixelCanvasTransition: React.FC<PixelCanvasProps> = ({ isRevealing, onAnimationEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isRevealing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 160);
    const height = (canvas.height = canvas.offsetHeight || 160);

    const cols = 8;
    const rows = 8;
    const blockWidth = width / cols;
    const blockHeight = height / rows;

    const blocks: { x: number; y: number; delay: number }[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        blocks.push({
          x: c * blockWidth,
          y: r * blockHeight,
          delay: Math.random() * 120 + (r / rows) * 40,
        });
      }
    }

    let startTime: number | null = null;
    let animId: number;

    const render = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, width, height);

      let remaining = 0;
      for (const block of blocks) {
        if (elapsed < block.delay) {
          remaining++;
          ctx.fillStyle = 'rgba(12, 18, 13, 0.95)';
          ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
        } else if (elapsed < block.delay + 90) {
          remaining++;
          const progress = (elapsed - block.delay) / 90;
          ctx.fillStyle = `rgba(52, 211, 153, ${(1 - progress) * 0.7})`;
          const shrink = progress * (blockWidth / 2);
          ctx.fillRect(
            block.x + shrink,
            block.y + shrink,
            blockWidth - shrink * 2,
            blockHeight - shrink * 2
          );
        }
      }

      if (remaining > 0 && elapsed < 260) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onAnimationEnd) onAnimationEnd();
      }
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isRevealing, onAnimationEnd]);

  if (!isRevealing) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30 rounded-xl"
    />
  );
};

/**
 * Square Minimal Reveal Card
 * Responsive, optimal, fits concise track passage on back
 */
interface TrackRevealCardProps {
  track: FestEvent;
  customPassages?: Record<string, { code: string; title: string; passage: string }>;
}

const MinimalRevealCard: React.FC<TrackRevealCardProps> = ({ track, customPassages }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isPixelating, setIsPixelating] = useState<boolean>(false);

  const handleToggleReveal = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPixelating(true);
    setIsRevealed((prev) => !prev);
  };

  const trackKey = useMemo(() => {
    if (track.id.includes('mobility') || track.id.includes('agv')) return 'agv';
    if (track.id.includes('biomedical') || track.id.includes('bionics')) return 'bionics';
    if (track.id.includes('disaster') || track.id.includes('uav')) return 'uav';
    return 'industrial';
  }, [track.id]);

  const passagesSource = customPassages || TRACK_PASSAGES;
  const passageData = passagesSource[trackKey] || TRACK_PASSAGES[trackKey] || TRACK_PASSAGES.agv;

  const renderMinimalSvg = () => {
    switch (trackKey) {
      case 'agv':
        return <AgvIconSvg />;
      case 'bionics':
        return <HeartPulseIconSvg />;
      case 'uav':
        return <DroneIconSvg />;
      case 'industrial':
      default:
        return <RoboticArmIconSvg />;
    }
  };

  const getShortTitle = () => {
    switch (trackKey) {
      case 'agv':
        return 'Autonomous AGV';
      case 'bionics':
        return 'Assistive Bionics';
      case 'uav':
        return 'Disaster UAV';
      case 'industrial':
      default:
        return 'Industrial AI';
    }
  };

  return (
    <div
      onClick={() => handleToggleReveal()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggleReveal();
        }
      }}
      aria-label={`Toggle challenge track ${getShortTitle()}`}
      className="group relative w-full aspect-square rounded-xl overflow-hidden bg-[#0C120D] border border-emerald-500/20 hover:border-emerald-400/60 transform-gpu hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ease-out shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.28),0_8px_16px_-6px_rgba(0,0,0,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 cursor-pointer flex flex-col justify-between select-none"
    >
      <PixelCanvasTransition
        isRevealing={isPixelating}
        onAnimationEnd={() => setIsPixelating(false)}
      />

      {/* FRONT OF CARD */}
      {!isRevealed ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2.5 sm:p-3 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0%,transparent_70%)] group-hover:opacity-100 opacity-60 transition-opacity duration-300 pointer-events-none" />

          {/* Centered Neon SVG Icon with smooth hover lift */}
          <div className="relative mb-2 flex items-center justify-center transform-gpu group-hover:scale-105 transition-transform duration-300 ease-out">
            {renderMinimalSvg()}
          </div>

          {/* Track Title */}
          <h4 className="text-white group-hover:text-emerald-200 text-xs sm:text-[13px] font-medium tracking-wide leading-tight text-center px-1 transition-colors duration-200">
            {getShortTitle()}
          </h4>
        </div>
      ) : (
        /* BACK OF CARD: ONLY TRACK-RELATED SMALL PASSAGE */
        <div className="w-full h-full relative flex flex-col justify-between p-2.5 sm:p-3 bg-[#0A100C] text-left overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,transparent_70%)] group-hover:opacity-100 opacity-75 transition-opacity duration-300 pointer-events-none" />

          {/* Top Code */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-emerald-400 tracking-wider">
              {passageData.code}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </div>

          {/* Middle: Track-Related Small Passage */}
          <div className="relative z-10 my-auto py-0.5">
            <p className="text-[10.5px] sm:text-[11.5px] text-white/95 leading-relaxed font-normal">
              {passageData.passage}
            </p>
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-emerald-400/80 pt-1 border-t border-emerald-500/15">
            <span className="truncate">{passageData.title}</span>
            <span className="text-[8px] text-emerald-400/70 font-mono">flip ↻</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Main ZYRO Section Component
 * Stream timeline on scroll + selection changes + selected related text display under that within AI
 */
export const ZyroSection: React.FC<ZyroSectionProps> = ({ zyroEvents, phases, trackPassages }) => {
  const [activeTimelineStep, setActiveTimelineStep] = useState<string>('01');
  const [scrollProgress, setScrollProgress] = useState<number>(0.15);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isTickingRef = useRef<boolean>(false);

  // 4 Tracks for 4 square cards
  const fourTracks = useMemo(() => zyroEvents.slice(0, 4), [zyroEvents]);

  // Combined phases with concise single-sentence AI directives
  const enrichedPhases = useMemo(() => {
    return phases.map((p) => ({
      ...p,
      aiNote: p.aiNote || AI_DIRECTIVES[p.step] || AI_DIRECTIVES['01'],
    }));
  }, [phases]);

  // Handle stream timeline on scroll with smooth RAF throttle
  const handleScroll = useCallback(() => {
    if (isTickingRef.current) return;
    isTickingRef.current = true;

    requestAnimationFrame(() => {
      isTickingRef.current = false;
      const container = timelineContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Calculate progress of timeline through viewport
      const totalHeight = rect.height;
      if (totalHeight > 0) {
        const rawProgress = (windowHeight * 0.6 - rect.top) / totalHeight;
        const currentProgress = Math.min(1, Math.max(0.08, rawProgress));
        setScrollProgress(currentProgress);
      }

      // Determine active phase based on nearest element to trigger line
      const triggerLine = windowHeight * 0.52;
      let closestStep = enrichedPhases[0]?.step || '01';
      let smallestDistance = Infinity;

      for (const phase of enrichedPhases) {
        const el = stepRefs.current[phase.step];
        if (el) {
          const elRect = el.getBoundingClientRect();
          const elCenter = elRect.top + elRect.height / 2;
          const distance = Math.abs(elCenter - triggerLine);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestStep = phase.step;
          }
        }
      }

      setActiveTimelineStep(closestStep);
    });
  }, [enrichedPhases]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <section id="zyro-hackathon" className="space-y-4 pt-3 border-t border-[#243324]/10 dark:border-white/10">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-display text-lg sm:text-xl font-normal text-[#1F2B1D] dark:text-[#F4EFE6]">
            ZYRO Hackathon
          </h2>
          <span className="text-xs font-mono text-[#4A5D44] dark:text-[#CBD7C7]">
            • 36H Prototyping
          </span>
        </div>
      </div>

      {/* PART 1: FOUR SQUARE CARDS (WHOLE BACK = ONLY CONCISE TRACK PASSAGE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold text-[#1F2B1D] dark:text-white uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Challenge Tracks</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
            Click to view track mission
          </span>
        </div>

        {/* 4 Square Cards Grid: 2 cols on mobile, 4 cols on tablet & desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {fourTracks.map((track) => (
            <MinimalRevealCard
              key={track.id}
              track={track}
              customPassages={trackPassages}
            />
          ))}
        </div>
      </div>

      {/* PART 2: EXTENDED VERTICAL TIMELINE WITH STREAM ANIMATION ON SCROLL */}
      <div
        ref={timelineContainerRef}
        className="space-y-2.5 pt-2"
      >
        {/* Timeline Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
          <span className="text-xs font-mono font-semibold text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Sprint Timeline</span>
          </span>
          <span className="text-[10px] font-mono text-[#4A5D44] dark:text-[#CBD7C7]">
            {enrichedPhases.length} Phases
          </span>
        </div>

        {/* Vertically Extended Timeline Rail with Stream Animation */}
        <div className="relative pl-7 sm:pl-9 py-1 space-y-3.5 sm:space-y-4">
          
          {/* Static Background Rail */}
          <div className="absolute left-3 sm:left-3.5 top-2.5 bottom-2.5 w-0.5 bg-[#243324]/10 dark:bg-white/10 rounded-full" />

          {/* Active Glowing Stream Beam that flows vertically on scroll */}
          <div
            className="absolute left-3 sm:left-3.5 top-2.5 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-400 rounded-full shadow-[0_0_8px_#10b981] transition-all duration-200 ease-out"
            style={{
              height: `${Math.min(100, Math.max(10, scrollProgress * 100))}%`,
            }}
          />

          {/* Timeline Nodes */}
          {enrichedPhases.map((phase) => {
            const isSelected = activeTimelineStep === phase.step;
            const phaseNum = parseInt(phase.step, 10) || 1;
            const currentStepNum = parseInt(activeTimelineStep, 10) || 1;
            const isPassed = currentStepNum >= phaseNum;

            return (
              <div
                key={phase.step}
                ref={(el) => {
                  stepRefs.current[phase.step] = el;
                }}
                onClick={() => setActiveTimelineStep(phase.step)}
                className={`relative group cursor-pointer transition-all duration-200 select-none ${
                  isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-95'
                }`}
              >
                {/* Node Marker along the Stream Rail - solid opaque with mask ring to completely cover line behind */}
                <div
                  className={`absolute -left-7 sm:-left-9 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-200 z-10 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-2 border-emerald-300 shadow-xs ring-4 ring-[#FAF8F4] dark:ring-[#131D12]'
                      : isPassed
                      ? 'bg-emerald-800 text-white border-2 border-emerald-700 ring-4 ring-[#FAF8F4] dark:ring-[#131D12]'
                      : 'bg-[#FAF8F4] dark:bg-[#131D12] text-[#243324]/60 dark:text-[#CBD7C7] border-2 border-[#243324]/20 dark:border-white/20 ring-4 ring-[#FAF8F4] dark:ring-[#131D12]'
                  }`}
                >
                  {phase.step}
                </div>

                {/* Milestone Card */}
                <div
                  className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/35 shadow-xs'
                      : 'bg-transparent hover:bg-[#243324]/5 dark:hover:bg-white/5 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1F2B1D] dark:text-white leading-tight">
                        {phase.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-[#243324]/60 dark:text-white/50 shrink-0 font-medium">
                      {phase.month}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-snug pt-1">
                    {phase.desc}
                  </p>

                  {/* AI directive text displayed cleanly under selected milestone */}
                  <AnimatePresence>
                    {isSelected && phase.aiNote && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 pt-2 border-t border-emerald-500/20 flex items-start gap-2">
                          <div className="p-1 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-[11px] sm:text-xs text-[#243324]/90 dark:text-white/90 leading-relaxed font-mono">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">AI Directive: </span>
                            {phase.aiNote}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
