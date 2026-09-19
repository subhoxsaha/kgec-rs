import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Search, X, Bell } from 'lucide-react';
import { BOT_QUICK_QUESTIONS, BotQuickQuestion, BotFollowUpOption } from '../data/robotQuestions';
import { TypewriterText } from './TypewriterText';

const EVENT_NOTIFICATION_ITEM: BotQuickQuestion = {
  id: 'event-notification',
  label: 'Upcoming Event Alert',
  title: 'TECHTIX & ZYRO 2026',
  category: 'Event Alert',
  answer: 'TECHTIX & ZYRO 2026 is our upcoming annual flagship event! Featuring 60kg Mechatronics ROBO-CLASH combat, Autonomous Line Track, Drone Gauntlet, and the 36-hour ZYRO AI Hackathon with ₹1,50,000+ in prizes.',
  followUps: [
    {
      id: 'event-clash',
      label: 'Robo-Clash Arena',
      answer: 'High-intensity combat battles in 15kg & 30kg weight classes with custom weapon systems.',
    },
    {
      id: 'event-hack',
      label: 'ZYRO Hackathon',
      answer: '36 hours of non-stop prototyping in AI, Robotics, and IoT with ₹50,000+ prize pool.',
    },
    {
      id: 'event-reg',
      label: 'Registration & Perks',
      answer: 'Online portal registrations open soon for all engineering colleges across India with free entry for prelims.',
    },
  ],
};

interface HeroRobotCompanionProps {
  className?: string;
  mode?: 'desktop' | 'mobile' | 'auto';
}

export const HeroRobotCompanion: React.FC<HeroRobotCompanionProps> = ({
  className = '',
  mode = 'auto',
}) => {
  const uid = React.useId().replace(/:/g, '_');
  const bodyGradId = `heroRobotBodyGrad_${uid}`;
  const armGradId = `heroArmGrad_${uid}`;
  const headHighlightId = `heroHeadHighlight_${uid}`;
  const visorGradId = `heroVisorGrad_${uid}`;
  const orbGlowId = `heroOrbGlow_${uid}`;
  const alertOrbGlowId = `heroAlertOrbGlow_${uid}`;
  const coreGlowId = `heroCoreGlow_${uid}`;

  // Completely isolated local state (ZERO sync with About section bot)
  const [selectedQuestion, setSelectedQuestion] = useState<BotQuickQuestion | null>(null);
  const [activeFollowUp, setActiveFollowUp] = useState<BotFollowUpOption | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [replyKey, setReplyKey] = useState(0);
  const [clickedPillId, setClickedPillId] = useState<string | null>(null);

  // Smart question carousel & instant search state
  const [pageIndex, setPageIndex] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // SVG arm rotation references for 60fps smooth animation
  const leftArmRef = useRef<SVGGElement | null>(null);
  const rightArmRef = useRef<SVGGElement | null>(null);
  const leftAngleRef = useRef(0);
  const rightAngleRef = useRef(0);
  const isWavingRef = useRef(isWaving);
  isWavingRef.current = isWaving;
  const isThinkingRef = useRef(isThinking);
  isThinkingRef.current = isThinking;

  const thinkingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carousel questions: 3 items per page
  const pageSize = 3;
  const totalPages = Math.ceil(BOT_QUICK_QUESTIONS.length / pageSize);
  const currentPills = useMemo(() => {
    const start = pageIndex * pageSize;
    return BOT_QUICK_QUESTIONS.slice(start, start + pageSize);
  }, [pageIndex]);

  // Instant client-side fuzzy search results (no LLM, purely local & instant)
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return BOT_QUICK_QUESTIONS.slice(0, 4);

    return BOT_QUICK_QUESTIONS.filter((q) => {
      const matchLabel = q.label.toLowerCase().includes(query);
      const matchCategory = q.category.toLowerCase().includes(query);
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchAnswer = q.answer.toLowerCase().includes(query);
      const matchKeywords = q.keywords?.some((k) => k.toLowerCase().includes(query));
      return matchLabel || matchCategory || matchTitle || matchAnswer || matchKeywords;
    }).slice(0, 4);
  }, [searchQuery]);

  // Periodic cute blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Arm animation frame loop
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;

      let targetLeftAngle = 0;
      if (isWavingRef.current || isThinkingRef.current) {
        const waveSway = Math.sin(elapsed * 0.006) * 7.5;
        targetLeftAngle = 72 + waveSway;
      }

      leftAngleRef.current += (targetLeftAngle - leftAngleRef.current) * 0.12;
      if (leftArmRef.current) {
        leftArmRef.current.setAttribute(
          'transform',
          `rotate(${leftAngleRef.current.toFixed(2)} 106 204)`
        );
      }

      const targetRightAngle = Math.sin(elapsed * 0.003) * 2.5;
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

  // Handle clicking a suggestion question pill
  const handleSelectQuestion = (q: BotQuickQuestion) => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);

    // If clicking same question that's already open, dismiss reply
    if (selectedQuestion?.id === q.id && !isThinking) {
      setSelectedQuestion(null);
      setActiveFollowUp(null);
      setIsThinking(false);
      setIsWaving(false);
      setClickedPillId(null);
      return;
    }

    setClickedPillId(q.id);
    setIsSearchOpen(false);
    setSearchQuery('');
    setIsThinking(true);
    setIsWaving(true);
    setSelectedQuestion(q);
    setActiveFollowUp(null);
    setReplyKey((k) => k + 1);

    // Brief processing animation then reveal answer
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);
      setTimeout(() => {
        setIsWaving(false);
        setClickedPillId(null);
      }, 1200);
    }, 380);
  };

  // Handle clicking a nested follow-up option within an answer
  const handleSelectFollowUp = (opt: BotFollowUpOption) => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    setIsThinking(true);
    setIsWaving(true);
    setActiveFollowUp(opt);
    setReplyKey((k) => k + 1);

    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);
      setTimeout(() => {
        setIsWaving(false);
      }, 900);
    }, 280);
  };

  // Navigate back to the parent answer
  const handleBackToParent = () => {
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    setIsThinking(true);
    setActiveFollowUp(null);
    setReplyKey((k) => k + 1);
    thinkingTimeoutRef.current = setTimeout(() => {
      setIsThinking(false);
    }, 200);
  };

  const isEventActive = selectedQuestion?.id === EVENT_NOTIFICATION_ITEM.id;

  const handleToggleEventNotification = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isEventActive) {
      handleDismissReply(e || ({} as React.MouseEvent));
    } else {
      handleSelectQuestion(EVENT_NOTIFICATION_ITEM);
    }
  };

  const handleShuffleQuestions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    setPageIndex((prev) => (prev + 1) % totalPages);
    setTimeout(() => setIsRotating(false), 350);
  };

  const handleToggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 80);
      } else {
        setSearchQuery('');
      }
      return next;
    });
  };

  const handleDismissReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    setSelectedQuestion(null);
    setActiveFollowUp(null);
    setIsThinking(false);
    setIsWaving(false);
    setClickedPillId(null);
  };

  const handleRobotClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1600);
  };

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={`relative flex flex-row items-end justify-end gap-2 xs:gap-2.5 sm:gap-3.5 select-none pointer-events-auto w-full max-w-[calc(100vw-24px)] xs:max-w-[420px] sm:max-w-[520px] md:max-w-[580px] ${className}`}
    >
      {/* 1. LEFT CONTROLS (INPUT / SEARCH / PILLS / ACTIVE REPLY) ALIGNED TOWARDS ROBOT */}
      <div className="flex-1 min-w-0 flex flex-col items-end justify-end">
        {/* UNIFIED PRESENCE: PREVENTS OVERLAPPING AND VERTICAL JITTER */}
        <AnimatePresence mode="wait" initial={false}>
          {!selectedQuestion ? (
            /* IDLE: SEARCH INPUT OR QUESTION PILLS */
            <motion.div
              key="idle-controls"
              initial={{ opacity: 0, x: 14, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.94 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-end gap-1.5 sm:gap-2 w-full mb-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSearchOpen ? (
                  <motion.div
                    key="search-box-active"
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="w-full flex flex-col gap-1.5 items-end"
                  >
                    {/* Search Input Box */}
                    <div className="relative w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[320px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-400/70 pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setIsSearchOpen(false);
                          if (e.key === 'Enter' && searchResults.length > 0) {
                            handleSelectQuestion(searchResults[0]);
                          }
                        }}
                        placeholder="Search questions..."
                        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full bg-[#0b150d]/90 text-white border border-emerald-500/50 focus:border-emerald-400 focus:outline-hidden backdrop-blur-xl shadow-lg placeholder:text-stone-400"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Search Results Dropdown List */}
                    <div className="w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[320px] flex flex-col gap-1.5">
                      {searchResults.map((q) => (
                        <motion.button
                          key={q.id}
                          type="button"
                          onClick={() => handleSelectQuestion(q)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer backdrop-blur-xl shadow-md border flex items-center justify-between gap-2 ${
                            clickedPillId === q.id
                              ? 'bg-emerald-500/40 border-emerald-400 text-white'
                              : 'bg-black/75 hover:bg-emerald-950/70 text-[#E8EDEA] hover:text-white border-white/20 hover:border-emerald-400/60'
                          }`}
                        >
                          <span className="truncate">{q.label}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shrink-0">
                            {q.category}
                          </span>
                        </motion.button>
                      ))}
                      {searchResults.length === 0 && (
                        <div className="text-right text-[11px] text-stone-400 pr-2 py-1">
                          No matching question found
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* Question Pills Carousel with Staggered Cascading Animation */
                  <motion.div
                    key={`pills-page-${pageIndex}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.05, delayChildren: 0.02 },
                      },
                      exit: {
                        opacity: 0,
                        transition: { staggerChildren: 0.03, staggerDirection: -1 },
                      },
                    }}
                    className="flex flex-col items-end gap-1.5 sm:gap-2 w-full"
                  >
                    {currentPills.map((q) => (
                      <motion.button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectQuestion(q)}
                        variants={{
                          hidden: { opacity: 0, x: 14, scale: 0.94 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: { type: 'spring', stiffness: 360, damping: 26 },
                          },
                          exit: {
                            opacity: 0,
                            x: 12,
                            scale: 0.92,
                            transition: { duration: 0.14, ease: 'easeIn' },
                          },
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs xs:text-[12.5px] font-medium transition-colors duration-200 cursor-pointer select-none backdrop-blur-xl shadow-md border text-right ${
                          clickedPillId === q.id
                            ? 'bg-emerald-500/40 border-emerald-400 text-white shadow-emerald-500/30'
                            : 'bg-black/60 hover:bg-black/80 text-[#E8EDEA] hover:text-white border-white/20 hover:border-emerald-400/60'
                        }`}
                      >
                        <span className="whitespace-nowrap">{q.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ACTIVE: MAIN REPLY WITH NESTED OPTIONS AND SMALL CROSS (LEFT OF ROBOT) */
            <motion.div
              key={`chat-thread-${selectedQuestion.id}-${activeFollowUp?.id || 'root'}-${replyKey}`}
              initial={{ opacity: 0, x: 16, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full mb-1 origin-bottom-right"
            >
              <div className="relative w-full rounded-2xl rounded-br-xs bg-[#0b150d]/94 backdrop-blur-2xl border border-emerald-500/40 shadow-[0_14px_40px_rgba(0,0,0,0.7)] p-3 sm:p-3.5 pr-8 text-left">
                {/* Subtle ambient glow highlight */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Small cross button in top right */}
                <button
                  type="button"
                  onClick={handleDismissReply}
                  className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-full text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all cursor-pointer active:scale-90 z-10"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Active nested indicator if viewing follow-up */}
                {activeFollowUp && (
                  <div className="flex items-center justify-between gap-1.5 mb-1.5 pr-4 select-none">
                    <span className="text-[10.5px] font-mono tracking-tight text-emerald-400 font-medium truncate">
                      ↳ {activeFollowUp.label}
                    </span>
                    <button
                      type="button"
                      onClick={handleBackToParent}
                      className="text-[10px] text-emerald-300/80 hover:text-emerald-200 underline cursor-pointer shrink-0"
                    >
                      ‹ Back
                    </button>
                  </div>
                )}

                {isThinking ? (
                  /* Typing Indicator */
                  <div className="flex items-center gap-1.5 py-1 text-emerald-300">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: '120ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                      style={{ animationDelay: '240ms' }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Main / Nested reply with typewriter text */}
                    <p className="text-xs sm:text-[13.5px] text-[#E0E7DE] leading-relaxed font-normal">
                      <TypewriterText
                        text={activeFollowUp ? activeFollowUp.answer : selectedQuestion.answer}
                        speed={12}
                      />
                    </p>

                    {/* Inline section navigation option if answer relates to a specific section */}
                    {(() => {
                      const currentNavTarget = activeFollowUp?.navTarget || selectedQuestion.navTarget;
                      const currentNavLabel = activeFollowUp?.navLabel || selectedQuestion.navLabel;

                      if (!currentNavTarget) return null;

                      return (
                        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-start">
                          <button
                            type="button"
                            onClick={() => {
                              if (currentNavTarget.startsWith('#')) {
                                const id = currentNavTarget.replace('#', '');
                                const el = document.getElementById(id) || document.querySelector(currentNavTarget);
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                } else {
                                  window.location.hash = currentNavTarget;
                                }
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 hover:text-white border border-emerald-400/40 hover:border-emerald-400/70 shadow-xs transition-all cursor-pointer select-none active:scale-95"
                          >
                            <span>{currentNavLabel || 'Jump to Section →'}</span>
                          </button>
                        </div>
                      );
                    })()}

                    {/* Nested Follow-up Options - within answer ask something from given option */}
                    {(() => {
                      const availableOptions = activeFollowUp
                        ? (activeFollowUp.followUps && activeFollowUp.followUps.length > 0
                            ? activeFollowUp.followUps
                            : selectedQuestion.followUps?.filter((f) => f.id !== activeFollowUp.id))
                        : selectedQuestion.followUps;

                      if (!availableOptions || availableOptions.length === 0) return null;

                      return (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-1.5 select-none">
                          <span className="text-[10px] text-emerald-300/70 font-mono tracking-wide w-full">
                            Ask more:
                          </span>
                          {availableOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleSelectFollowUp(opt)}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-200 hover:text-white border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer active:scale-95 text-left"
                            >
                              <span>{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. ROBOT COLUMN (All buttons above robot + Robot Mascot) */}
      <div className="relative shrink-0 flex flex-col items-center justify-end self-end">
        {/* ALL BUTTONS ROW ABOVE ROBOT */}
        <div className="flex items-center justify-center gap-1.5 mb-1.5 sm:mb-2 select-none">
          {/* Notification alert button with small icon above robot */}
          <button
            type="button"
            onClick={handleToggleEventNotification}
            title="Event Notification: TECHTIX & ZYRO 2026"
            aria-label="Event Notification"
            className={`relative w-7 h-7 flex items-center justify-center rounded-full shadow-md backdrop-blur-xl transition-all cursor-pointer active:scale-90 border ${
              isEventActive
                ? 'bg-amber-500/30 text-amber-200 border-amber-400/90 ring-2 ring-amber-400/35 shadow-amber-500/40'
                : 'bg-black/65 hover:bg-black/85 text-amber-300 hover:text-amber-200 border-amber-500/50 hover:border-amber-400'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
          </button>

          {/* Shuffle questions button */}
          <button
            type="button"
            onClick={handleShuffleQuestions}
            title="Shuffle questions"
            aria-label="Shuffle questions"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-emerald-300 hover:text-emerald-200 border border-white/20 hover:border-emerald-400/60 shadow-md backdrop-blur-xl transition-all cursor-pointer active:scale-90"
          >
            <RotateCw
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isRotating ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Search questions toggle button */}
          <button
            type="button"
            onClick={handleToggleSearch}
            title={isSearchOpen ? 'Close search' : 'Search questions'}
            aria-label="Search questions"
            className={`w-7 h-7 flex items-center justify-center rounded-full shadow-md backdrop-blur-xl transition-all cursor-pointer active:scale-90 border ${
              isSearchOpen
                ? 'bg-emerald-500/30 text-white border-emerald-400/80'
                : 'bg-black/60 hover:bg-black/80 text-emerald-300 hover:text-emerald-200 border-white/20 hover:border-emerald-400/60'
            }`}
          >
            {isSearchOpen ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Robot Mascot */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative shrink-0 flex flex-col items-center justify-center cursor-pointer group"
          onClick={handleRobotClick}
          title="Click to wave!"
        >
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className={`relative flex items-center justify-center ${
              selectedQuestion
                ? 'w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28 md:w-32 md:h-32'
                : 'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40'
            }`}
          >
            {/* Ambient Glow Aura */}
            <div className="absolute inset-1 rounded-full bg-emerald-500/20 blur-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none" />

            <svg
              viewBox="0 0 320 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id={bodyGradId} x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#a7f3d0" />
                  <stop offset="30%" stopColor="#34d399" />
                  <stop offset="70%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>

                <linearGradient id={armGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d1fae5" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <linearGradient id={headHighlightId} x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                <linearGradient id={visorGradId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0B130E" />
                  <stop offset="100%" stopColor="#030704" />
                </linearGradient>

                <radialGradient id={orbGlowId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </radialGradient>

                <radialGradient id={alertOrbGlowId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fbbf24" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </radialGradient>

                <radialGradient id={coreGlowId} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#6ee7b7" />
                  <stop offset="85%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#042f2e" />
                </radialGradient>
              </defs>

              {/* ANTENNA */}
              <rect x="156" y="24" width="8" height="30" rx="4" fill={`url(#${bodyGradId})`} />
              <circle
                cx="160"
                cy="22"
                r={isThinking || isEventActive ? 14 : 12}
                fill={isEventActive ? `url(#${alertOrbGlowId})` : `url(#${orbGlowId})`}
                className={isThinking || isEventActive ? 'animate-pulse' : ''}
              />
              {isEventActive && (
                <circle
                  cx="160"
                  cy="22"
                  r="18"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeOpacity="0.7"
                  className="animate-ping"
                  style={{ transformOrigin: '160px 22px' }}
                />
              )}
              <circle cx="157" cy="19" r="4" fill="#ffffff" opacity="0.85" />

            {/* SIDE SENSOR EARS */}
            <rect x="38" y="96" width="14" height="48" rx="7" fill={`url(#${bodyGradId})`} stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="45" cy="120" r="3" fill={`url(#${orbGlowId})`} />
            <rect x="268" y="96" width="14" height="48" rx="7" fill={`url(#${bodyGradId})`} stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.4" />
            <circle cx="275" cy="120" r="3" fill={`url(#${orbGlowId})`} />

            {/* HEAD */}
            <rect
              x="50"
              y="48"
              width="220"
              height="150"
              rx="75"
              fill={`url(#${bodyGradId})`}
              stroke="#ffffff"
              strokeWidth="3"
              strokeOpacity="0.65"
            />
            <path
              d="M80 62 C115 54 205 54 240 62 C230 54 180 50 140 50 C100 50 85 55 80 62 Z"
              fill={`url(#${headHighlightId})`}
              opacity="0.85"
            />

            {/* VISOR */}
            <rect
              x="76"
              y="76"
              width="168"
              height="96"
              rx="48"
              fill={`url(#${visorGradId})`}
              stroke="#10b981"
              strokeWidth="2.5"
              strokeOpacity="0.5"
            />
            <line x1="98" y1="88" x2="222" y2="88" stroke="#34d399" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="4 4" />
            <path
              d="M92 90 C120 84 190 84 228 90 C220 86 180 82 150 82 C120 82 98 86 92 90 Z"
              fill="#ffffff"
              opacity="0.18"
            />

            {/* EYES */}
            <motion.g
              animate={{
                x: isThinking ? -3 : 0,
                y: isThinking ? -3 : 0,
                scaleY: isBlinking ? 0.1 : 1,
              }}
              transition={{ duration: 0.15 }}
              style={{ originY: '120px' }}
            >
              {/* Left Eye */}
              <g>
                <circle cx="122" cy="120" r="19" fill="#040805" />
                <circle cx="122" cy="120" r="18" fill="#134e4a" opacity="0.5" />
                <circle cx="126" cy="114" r="8.5" fill="#ffffff" />
                <circle cx="116" cy="126" r="4" fill="#ffffff" />
                <path d="M107 124 Q122 134 137 124" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              </g>

              {/* Right Eye */}
              <g>
                <circle cx="198" cy="120" r="19" fill="#040805" />
                <circle cx="198" cy="120" r="18" fill="#134e4a" opacity="0.5" />
                <circle cx="202" cy="114" r="8.5" fill="#ffffff" />
                <circle cx="192" cy="126" r="4" fill="#ffffff" />
                <path d="M183 124 Q198 134 213 124" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
              </g>
            </motion.g>

            {/* BLUSH */}
            <ellipse cx="98" cy="136" rx="9" ry="4" fill="#34d399" opacity="0.4" />
            <ellipse cx="222" cy="136" rx="9" ry="4" fill="#34d399" opacity="0.4" />

            {/* SMILE */}
            <path d="M148 134 Q160 146 172 134" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* BODY */}
            <path
              d="M110 200 C110 190 210 190 210 200 L216 238 C216 265 190 278 160 278 C130 278 104 265 104 238 Z"
              fill={`url(#${bodyGradId})`}
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.45"
            />
            <ellipse cx="160" cy="236" rx="34" ry="26" fill="#ffffff" opacity="0.16" />

            {/* CHEST REACTOR */}
            <circle cx="160" cy="236" r="13" fill="#061209" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="160" cy="236" r="9" fill={`url(#${coreGlowId})`} />
            <circle cx="160" cy="236" r="3.5" fill="#ffffff" opacity="0.9" />

            {/* RIGHT ARM */}
            <g ref={rightArmRef} transform="rotate(0 214 204)">
              <path
                d="M 214 204 C 226 210 240 226 236 242 C 234 250 224 252 214 244 C 206 236 208 220 214 204 Z"
                fill={`url(#${bodyGradId})`}
                stroke="#ffffff"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              <circle cx="225" cy="244" r="8" fill={`url(#${orbGlowId})`} opacity="0.8" />
              <circle cx="223" cy="242" r="2.5" fill="#ffffff" opacity="0.85" />
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
              <circle cx="93" cy="242" r="3" fill="#ffffff" opacity="0.95" />
            </g>

            {/* SHOULDER JOINTS */}
            <circle cx="106" cy="204" r="3.5" fill="#34d399" opacity="0.7" />
            <circle cx="214" cy="204" r="3.5" fill="#34d399" opacity="0.7" />
          </svg>
        </motion.div>

        {/* Ground Shadow */}
        <motion.div
          animate={{ scaleX: [0.85, 1.15, 0.85], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className={`h-2 sm:h-2.5 -mt-1.5 sm:-mt-2 rounded-full bg-[#122216]/40 dark:bg-black/60 blur-xs pointer-events-none ${
            selectedQuestion
              ? 'w-18 xs:w-20 sm:w-24 md:w-28'
              : 'w-22 xs:w-26 sm:w-30 md:w-34 lg:w-38'
          }`}
        />
        </motion.div>
      </div>
    </motion.div>
  );
};
