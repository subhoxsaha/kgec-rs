import React, { useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Brain, ShieldCheck, CheckCircle2, Clock, X, Sparkles } from 'lucide-react';
import {
  useRobotMascotStore,
  RobotMessageData,
  DEFAULT_ROBOT_SPEECHES,
} from '../store/useRobotMascotStore';
import { useReportDataStore } from '../store/useReportDataStore';
import { ROLE_CONFIG } from '../types';

export type { RobotMessageData };

interface RobotMascotProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  bubbleAlign?: 'center' | 'left' | 'right';
  activeMessage?: RobotMessageData | string | null;
  triggerKey?: string | number;
}

const RobotMascotComponent: React.FC<RobotMascotProps> = ({
  className = '',
  size = 'sm',
  showBadge = false,
  bubbleAlign = 'center',
  activeMessage: propActiveMessage,
  triggerKey: propTriggerKey,
}) => {
  const uid = React.useId().replace(/:/g, '_');
  const bodyGradId = `robotBodyGrad_${uid}`;
  const armGradId = `armGrad_${uid}`;
  const headHighlightId = `headHighlight_${uid}`;
  const visorGradId = `visorGrad_${uid}`;
  const orbGlowId = `orbGlow_${uid}`;

  // Zustand robot mascot state (About section domain showcase)
  const storeActiveMessage = useRobotMascotStore((state) => state.activeMessage);
  const isWaving = useRobotMascotStore((state) => state.isWaving);
  const isThinking = useRobotMascotStore((state) => state.isThinking);
  const isBlinking = useRobotMascotStore((state) => state.isBlinking);
  const showSpeech = useRobotMascotStore((state) => state.showSpeech);
  const speechIndex = useRobotMascotStore((state) => state.speechIndex);
  const bubbleKey = useRobotMascotStore((state) => state.bubbleKey);
  const cycleNextSpeech = useRobotMascotStore((state) => state.cycleNextSpeech);
  const handleClickMascot = useRobotMascotStore((state) => state.handleClickMascot);
  const setWaving = useRobotMascotStore((state) => state.setWaving);
  const setBlinking = useRobotMascotStore((state) => state.setBlinking);
  const setShowSpeech = useRobotMascotStore((state) => state.setShowSpeech);

  // User notification from ReportDataStore
  const userNotification = useReportDataStore((state) => state.userNotification);
  const dismissUserNotification = useReportDataStore((state) => state.dismissUserNotification);
  const openEditor = useReportDataStore((state) => state.openEditor);
  const isAdminLoggedIn = useReportDataStore((state) => state.isAdminLoggedIn);

  const effectiveActiveMessage =
    propActiveMessage !== undefined
      ? typeof propActiveMessage === 'string'
        ? { text: propActiveMessage }
        : propActiveMessage
      : storeActiveMessage;

  // Direct SVG references for high-performance zero-rerender 60fps arm animations
  const leftArmRef = useRef<SVGGElement | null>(null);
  const rightArmRef = useRef<SVGGElement | null>(null);
  const leftAngleRef = useRef(0);
  const rightAngleRef = useRef(0);
  const isWavingRef = useRef(isWaving);
  isWavingRef.current = isWaving;
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  // Natural periodic greeting speech cycle when idle
  useEffect(() => {
    if (effectiveActiveMessage || isThinking) return;

    const timer = setInterval(() => {
      setShowSpeech(!showSpeech);
      setWaving(!showSpeech);
      if (!showSpeech) {
        cycleNextSpeech();
      }
    }, 4200);

    return () => clearInterval(timer);
  }, [effectiveActiveMessage, isThinking, showSpeech, cycleNextSpeech, setShowSpeech, setWaving]);

  // Periodic cute blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 160);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, [setBlinking]);

  // High-performance continuous frame loop: directly transforms SVG arms without React re-renders
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;

      // 1. Left Arm: Waves between 66° and 78° when greeting or thinking, returns to 0° when resting
      let targetLeftAngle = 0;
      if (isWavingRef.current || isThinkingRef.current) {
        const waveSway = Math.sin(elapsed * 0.0055) * 6.5;
        targetLeftAngle = 72 + waveSway;
      }

      // Smooth exponential lerp
      leftAngleRef.current += (targetLeftAngle - leftAngleRef.current) * 0.12;
      if (leftArmRef.current) {
        leftArmRef.current.setAttribute(
          'transform',
          `rotate(${leftAngleRef.current.toFixed(2)} 106 204)`
        );
      }

      // 2. Right Arm: subtle natural floating breathing sway
      const targetRightAngle = Math.sin(elapsed * 0.0028) * 2.2;
      rightAngleRef.current += (targetRightAngle - rightAngleRef.current) * 0.1;
      if (rightArmRef.current) {
        rightArmRef.current.setAttribute(
          'transform',
          `rotate(${rightAngleRef.current.toFixed(2)} 214 204)`
        );
      }

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMascotClick = () => {
    handleClickMascot();
  };

  const scaleClasses = {
    xs: 'w-24 h-24 sm:w-28 sm:h-28',
    sm: 'w-32 h-32 sm:w-36 sm:h-36',
    md: 'w-48 h-48 sm:w-56 sm:h-56',
    lg: 'w-72 sm:w-80 h-72 sm:h-80',
  }[size];

  const shadowClasses = {
    xs: 'w-16 sm:w-20 h-2 -mt-1.5',
    sm: 'w-24 sm:w-28 h-2.5 -mt-2',
    md: 'w-32 sm:w-36 h-3.5 -mt-3',
    lg: 'w-36 sm:w-44 h-4 -mt-4',
  }[size];

  const speechTextClass = {
    xs: 'text-[10px] leading-tight font-bold',
    sm: 'text-xs font-bold',
    md: 'text-sm font-bold',
    lg: 'text-sm sm:text-base font-bold',
  }[size];

  const messageText = effectiveActiveMessage
    ? effectiveActiveMessage.text
    : DEFAULT_ROBOT_SPEECHES[speechIndex] || 'Think, Build, Renovate.';
  const isLargePara = Boolean(effectiveActiveMessage || messageText.length > 40);

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={handleMascotClick}
      title="Click to wave!"
    >
      {/* Speech Bubble / Thinking Modal on Top */}
      <div
        className={`absolute bottom-full mb-2 sm:mb-2.5 z-30 pointer-events-auto flex flex-col ${
          bubbleAlign === 'right'
            ? 'right-0 items-end'
            : bubbleAlign === 'left'
            ? 'left-0 items-start'
            : 'left-1/2 -translate-x-1/2 items-center'
        }`}
      >
        <AnimatePresence>
          {showSpeech && (
            <motion.div
              layout
              key="speech-bubble-container"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{
                layout: { type: 'spring', damping: 28, stiffness: 320 },
                opacity: { duration: 0.18 },
                scale: { duration: 0.18 },
              }}
              className={`relative rounded-2xl bg-white/95 dark:bg-[#131F12]/95 backdrop-blur-xl border border-emerald-500/35 dark:border-emerald-400/45 shadow-2xl shadow-emerald-950/20 ${
                isThinking
                  ? 'px-4 py-2.5 whitespace-nowrap'
                  : isLargePara
                  ? 'w-[290px] xs:w-[330px] sm:w-[380px] md:w-[420px] max-w-[calc(100vw-2rem)] px-4 sm:px-5 py-3 sm:py-3.5 text-center sm:text-left whitespace-normal'
                  : 'px-3.5 py-2 text-center whitespace-nowrap'
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isThinking ? (
                  <motion.div
                    key="state-thinking"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.12 }}
                    className="flex items-center justify-center gap-2.5"
                  >
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300">
                      <Brain className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wide text-emerald-900 dark:text-emerald-200">
                      Thinking
                    </span>
                    <div className="flex items-center gap-1 pl-0.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '0ms', animationDuration: '0.45s' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '90ms', animationDuration: '0.45s' }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-bounce"
                        style={{ animationDelay: '180ms', animationDuration: '0.45s' }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`state-text-${bubbleKey || propTriggerKey || 'default'}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p
                      className={`${
                        isLargePara
                          ? 'text-xs sm:text-[13px] text-[#243324] dark:text-[#E0E7DE] leading-relaxed font-normal'
                          : `font-sans-clean font-semibold tracking-tight text-emerald-950 dark:text-emerald-50 ${speechTextClass}`
                      }`}
                    >
                      {messageText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bubble Tail pointing down to robot */}
              <div
                className={`absolute -bottom-1.5 w-3 h-3 bg-white/95 dark:bg-[#131F12]/95 border-r border-b border-emerald-500/35 dark:border-emerald-400/45 rotate-45 ${
                  bubbleAlign === 'right'
                    ? 'right-10'
                    : bubbleAlign === 'left'
                    ? 'left-10'
                    : 'left-1/2 -translate-x-1/2'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Robot Character Wrapper */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`relative flex items-center justify-center ${scaleClasses}`}
      >
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Robot Mint-to-Cyan Body Gradient */}
            <linearGradient id={bodyGradId} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="35%" stopColor="#34d399" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Arm Gradient */}
            <linearGradient id={armGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Glossy Head Highlight */}
            <linearGradient id={headHighlightId} x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Visor Screen Dark Gradient */}
            <linearGradient id={visorGradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B130E" />
              <stop offset="100%" stopColor="#040705" />
            </linearGradient>

            {/* Glowing Orb Gradient */}
            <radialGradient id={orbGlowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
          </defs>

          {/* ANTENNA STEM */}
          <rect x="156" y="24" width="8" height="30" rx="4" fill={`url(#${bodyGradId})`} />
          {/* ANTENNA GLOWING TIP */}
          <circle
            cx="160"
            cy="22"
            r={isThinking ? 14 : 12}
            fill={`url(#${orbGlowId})`}
            className={isThinking ? 'animate-pulse' : ''}
          />
          <circle cx="157" cy="19" r="4" fill="#ffffff" opacity="0.8" />

          {/* HEAD (Wide Pill / Rounded Capsule) */}
          <rect
            x="50"
            y="48"
            width="220"
            height="150"
            rx="75"
            fill={`url(#${bodyGradId})`}
            stroke="#ffffff"
            strokeWidth="3"
            strokeOpacity="0.6"
          />

          {/* Glossy Top Edge Reflection */}
          <path
            d="M80 62 C115 54 205 54 240 62 C230 54 180 50 140 50 C100 50 85 55 80 62 Z"
            fill={`url(#${headHighlightId})`}
            opacity="0.8"
          />

          {/* VISOR / SCREEN (Black glossy rounded screen) */}
          <rect
            x="76"
            y="76"
            width="168"
            height="96"
            rx="48"
            fill={`url(#${visorGradId})`}
            stroke="#10b981"
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* Visor Inner Glass Reflection Arc */}
          <path
            d="M92 90 C120 84 190 84 228 90 C220 86 180 82 150 82 C120 82 98 86 92 90 Z"
            fill="#ffffff"
            opacity="0.15"
          />

          {/* EYES GROUP */}
          <motion.g
            animate={{
              x: isThinking ? 0 : isWaving ? -4 : 0,
              y: isThinking ? -4 : 0,
              scaleY: isBlinking ? 0.1 : 1,
            }}
            transition={{
              x: { duration: 0.3, ease: 'easeOut' },
              y: { duration: 0.3, ease: 'easeOut' },
              scaleY: { duration: 0.1 },
            }}
            style={{ originY: '120px' }}
          >
            {/* Left Eye */}
            <g>
              <circle cx="122" cy="120" r="19" fill="#040805" />
              <circle cx="122" cy="120" r="18" fill="#134e4a" opacity="0.4" />
              <circle cx="126" cy="114" r="8.5" fill="#ffffff" />
              <circle cx="116" cy="126" r="4" fill="#ffffff" />
              <path
                d="M107 124 Q122 134 137 124"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </g>

            {/* Right Eye */}
            <g>
              <circle cx="198" cy="120" r="19" fill="#040805" />
              <circle cx="198" cy="120" r="18" fill="#134e4a" opacity="0.4" />
              <circle cx="202" cy="114" r="8.5" fill="#ffffff" />
              <circle cx="192" cy="126" r="4" fill="#ffffff" />
              <path
                d="M183 124 Q198 134 213 124"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
            </g>
          </motion.g>

          {/* BLUSH CHEEKS */}
          <ellipse cx="98" cy="136" rx="9" ry="4" fill="#34d399" opacity="0.35" />
          <ellipse cx="222" cy="136" rx="9" ry="4" fill="#34d399" opacity="0.35" />

          {/* HAPPY SMILE */}
          <path
            d="M148 134 Q160 146 172 134"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* FLOATING TORSO / BODY */}
          <path
            d="M110 200 C110 190 210 190 210 200 L216 238 C216 265 190 278 160 278 C130 278 104 265 104 238 Z"
            fill={`url(#${bodyGradId})`}
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.4"
          />

          {/* TORSO BELLY HIGHLIGHT */}
          <ellipse cx="160" cy="236" rx="32" ry="24" fill="#ffffff" opacity="0.18" />

          {/* OPPOSITE SIDE ARM (RIGHT ARM) */}
          <g ref={rightArmRef} transform="rotate(0 214 204)">
            <path
              d="M 214 204 C 226 210 240 226 236 242 C 234 250 224 252 214 244 C 206 236 208 220 214 204 Z"
              fill={`url(#${bodyGradId})`}
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
            <circle cx="225" cy="244" r="8" fill={`url(#${orbGlowId})`} opacity="0.75" />
            <circle cx="223" cy="242" r="2.5" fill="#ffffff" opacity="0.8" />
          </g>

          {/* LEFT WAVING ARM */}
          <g ref={leftArmRef} transform="rotate(0 106 204)">
            <path
              d="M 106 204 C 94 210 80 226 84 242 C 86 250 96 252 106 244 C 114 236 112 220 106 204 Z"
              fill={`url(#${armGradId})`}
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.4"
            />
            <circle cx="95" cy="244" r="8.5" fill={`url(#${orbGlowId})`} />
            <circle cx="93" cy="242" r="3" fill="#ffffff" opacity="0.9" />
            <ellipse
              cx="99"
              cy="236"
              rx="4"
              ry="2.5"
              transform="rotate(-20 99 236)"
              fill={`url(#${bodyGradId})`}
              opacity="0.9"
            />
          </g>

          {/* SHOULDER CORNER JOINTS */}
          <circle cx="106" cy="204" r="3" fill="#34d399" opacity="0.6" />
          <circle cx="214" cy="204" r="3" fill="#34d399" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Dynamic Ground Shadow */}
      <motion.div
        animate={{
          scaleX: [0.85, 1.15, 0.85],
          scaleY: [0.85, 1.15, 0.85],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`${shadowClasses} rounded-full bg-[#122216]/40 dark:bg-black/60 blur-xs pointer-events-none`}
      />

      {/* Optional Interactive helper badge */}
      {showBadge && (
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-[10px] font-mono text-emerald-800 dark:text-emerald-300">
          <MessageSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Click to Wave</span>
        </div>
      )}
    </div>
  );
};

export const RobotMascot = memo(RobotMascotComponent);
