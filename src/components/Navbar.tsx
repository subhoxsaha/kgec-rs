import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  Cpu,
  LogOut,
  Sliders,
  Compass,
  LayoutDashboard,
  Layers,
  Trophy,
  GraduationCap,
  Users,
  Milestone,
  ChevronRight,
  Shield,
  X,
  Sparkles,
  Flame,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useReportData } from '../context/ReportDataContext';
import {
  DEFAULT_KGEC_LOGO,
  DEFAULT_KRS_LOGO,
  DEFAULT_KGEC_LOGO_DARK,
  DEFAULT_KGEC_LOGO_LIGHT,
  DEFAULT_KRS_LOGO_DARK,
  DEFAULT_KRS_LOGO_LIGHT,
} from '../data/reportData';

export const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const { isDark, toggleTheme } = useTheme();
  const {
    metadata,
    googleUser,
    isAdminLoggedIn,
    isStudentLoggedIn,
    logoutAdmin,
    openBackdoorModal,
    openEditor,
    currentUserProfile,
    setIsApplicationFormOpen,
  } = useReportData();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = lastScrollYRef.current;
    const diff = latest - prev;

    // Always keep visible when near the top of the page
    if (latest < 50) {
      setIsVisible(true);
    } else if (diff > 8) {
      // Scrolling down -> hide navbar (unless menu is open)
      if (!isMenuOpen) setIsVisible(false);
    } else if (diff < -8) {
      // Scrolling up -> reveal navbar
      setIsVisible(true);
    }

    lastScrollYRef.current = latest;

    const threshold = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 550;
    setIsScrolledPastHero(latest >= threshold);
  });

  const logo1Src =
    (isDark ? (metadata.logo1Dark || metadata.logo1) : (metadata.logo1Light || metadata.logo1)) ||
    (isDark ? DEFAULT_KGEC_LOGO_DARK : DEFAULT_KGEC_LOGO_LIGHT);
  const logo2Src =
    (isDark ? (metadata.logo2Dark || metadata.logo2) : (metadata.logo2Light || metadata.logo2)) ||
    (isDark ? DEFAULT_KRS_LOGO_DARK : DEFAULT_KRS_LOGO_LIGHT);

  const navLinks = [
    { label: 'Overview', href: '#overview-section', icon: LayoutDashboard },
    { label: 'Projects Showcase', href: '#projects-section', icon: Layers },
    { label: 'Techfest Sights', href: '#events-section', icon: Trophy },
    { label: 'TECHTIX & ZYRO Arenas', href: '#techtix-zyro', icon: Flame },
    { label: 'Mentors & Teams', href: '#leadership-team-section', icon: Users },
    { label: 'Roadmap & Future', href: '#roadmap-section', icon: Milestone },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : '-120%' }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
        className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-8 lg:px-12 pointer-events-none flex justify-between items-center transition-colors duration-500"
      >
        {/* Left: Single Combined Pill containing 3-Bar Trigger, Separator, Dual Logos & Brand Text */}
        <div className="pointer-events-auto flex items-center">
          <div
            className={`flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-3.5 py-1 rounded-full transition-all duration-300 ${
              isScrolledPastHero
                ? 'bg-white/90 dark:bg-[#151F14]/90 backdrop-blur-md border border-[#243324]/10 dark:border-white/10 shadow-xs'
                : 'bg-black/35 backdrop-blur-md border border-white/20'
            }`}
          >
            {/* Animated 3-Bar Hamburger Trigger inside the pill */}
            <button
              id="navbar-3bar-menu-btn"
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="relative w-8 h-8 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer shrink-0 hover:bg-[#243324]/10 dark:hover:bg-white/10"
              title={isMenuOpen ? 'Close menu' : 'Menu: Login, Theme & Navigation'}
            >
              {/* Bar 1 (Top) */}
              <motion.span
                animate={
                  isMenuOpen
                    ? { rotate: 45, y: 5.5 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                className={`w-3.5 h-[2px] rounded-full transition-colors duration-300 origin-center ${
                  isScrolledPastHero ? (isDark ? 'bg-white' : 'bg-[#1F2B1D]') : 'bg-white'
                }`}
              />

              {/* Bar 2 (Middle) */}
              <motion.span
                animate={
                  isMenuOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className={`w-3.5 h-[2px] rounded-full transition-colors duration-300 origin-center ${
                  isScrolledPastHero ? (isDark ? 'bg-white' : 'bg-[#1F2B1D]') : 'bg-white'
                }`}
              />

              {/* Bar 3 (Bottom) */}
              <motion.span
                animate={
                  isMenuOpen
                    ? { rotate: -45, y: -5.5 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                className={`w-3.5 h-[2px] rounded-full transition-colors duration-300 origin-center ${
                  isScrolledPastHero ? (isDark ? 'bg-white' : 'bg-[#1F2B1D]') : 'bg-white'
                }`}
              />
            </button>

            {/* Separator | */}
            <span
              className={`text-xs select-none transition-colors duration-300 ${
                isScrolledPastHero
                  ? isDark
                    ? 'text-white/25'
                    : 'text-[#243324]/25'
                  : 'text-white/35'
              }`}
              aria-hidden="true"
            >
              |
            </span>

            {/* Brand Link (Dual Logos + Organization Name) */}
            <a
              href="#overview-section"
              className="group flex items-center gap-2 sm:gap-2.5 focus:outline-none"
            >
              {/* Dual Logos separated by | */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Logo 1 (e.g. College Emblem) */}
                <div
                  id="navbar-logo-1"
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-white p-0.5 border border-white/40 shadow-xs shrink-0 transition-transform group-hover:scale-105"
                  title={metadata.logo1Alt || 'Kalyani Government Engineering College Logo'}
                >
                  {logo1Src ? (
                    <img
                      src={logo1Src}
                      alt={metadata.logo1Alt || 'Logo 1'}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[9px]">
                      KGEC
                    </div>
                  )}
                </div>

                {/* Separator | */}
                <span
                  className={`text-xs select-none transition-colors duration-300 ${
                    isScrolledPastHero
                      ? isDark
                        ? 'text-white/30'
                        : 'text-[#243324]/30'
                      : 'text-white/40'
                  }`}
                  aria-hidden="true"
                >
                  |
                </span>

                {/* Logo 2 (e.g. Robotics Society Emblem) */}
                <div
                  id="navbar-logo-2"
                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-white p-0.5 border border-white/40 shadow-xs shrink-0 transition-transform group-hover:scale-105"
                  title={metadata.logo2Alt || 'KGEC Robotics Society Logo'}
                >
                  {logo2Src ? (
                    <img
                      src={logo2Src}
                      alt={metadata.logo2Alt || 'Logo 2'}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Name & Subtext */}
              <div className="flex flex-col">
                <span
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ${
                    isScrolledPastHero
                      ? isDark
                        ? 'text-[#F4EFE6]'
                        : 'text-[#1F2B1D]'
                      : 'text-white'
                  }`}
                >
                  <span className="hidden lg:inline">
                    {(metadata?.organization || 'KGEC Robotics Society').replace(/\s*\((?:K)?RS\)/gi, '')}
                  </span>
                  <span className="inline lg:hidden">
                    KGEC RS
                  </span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-tight hidden sm:inline">
                  Est. {metadata.establishedYear || '2012'}
                </span>
              </div>
            </a>
          </div>
        </div>
      </motion.header>

      {/* 3-Bar Animated Flyout / Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs pointer-events-auto"
            />

            {/* Popover Card anchored from Left */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
              className="fixed top-15 sm:top-18 left-3 sm:left-6 z-50 w-64 sm:w-72 bg-[#FAF8F5]/98 dark:bg-[#141E13]/98 backdrop-blur-md rounded-2xl border border-[#243324]/15 dark:border-white/15 shadow-2xl p-3 sm:p-3.5 text-[#1F2B1D] dark:text-[#F4EFE6] pointer-events-auto overflow-hidden space-y-2.5"
            >
              {/* Compact Header: Menu label, Theme Switch & Close */}
              <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
                <span className="text-[11px] font-mono font-bold tracking-wider text-[#657351] dark:text-[#8FA388] uppercase">
                  Menu
                </span>

                <div className="flex items-center gap-1">
                  {/* Theme Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-1 rounded-md text-[#3A4B37] dark:text-[#CBD7C7] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title={isDark ? 'Light mode' : 'Dark mode'}
                    aria-label="Toggle theme"
                  >
                    {isDark ? (
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-[#3A4B37]" />
                    )}
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 rounded-md text-[#657351] hover:text-[#1F2B1D] dark:text-[#8FA388] dark:hover:text-white hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Compact Google Sign-in / User Card */}
              <div>
                {googleUser ? (
                  <div className="p-2 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      {googleUser.picture ? (
                        <img
                          src={googleUser.picture}
                          alt={googleUser.name}
                          referrerPolicy="no-referrer"
                          className={`w-7 h-7 rounded-full object-cover shrink-0 border ${
                            isAdminLoggedIn ? 'border-amber-400' : 'border-emerald-500'
                          }`}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-semibold text-xs shrink-0">
                          {googleUser.name?.charAt(0) || 'U'}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-[#1F2B1D] dark:text-white truncate">
                            {googleUser.name}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                            isAdminLoggedIn
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : currentUserProfile?.role === 'lead'
                              ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/30'
                              : currentUserProfile?.role === 'teacherBody'
                              ? 'bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/30'
                              : currentUserProfile?.role === 'intern'
                              ? 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/30'
                              : 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {isAdminLoggedIn
                              ? 'Admin'
                              : currentUserProfile?.role === 'teacherBody'
                              ? 'Faculty'
                              : currentUserProfile?.role === 'lead'
                              ? 'Lead'
                              : currentUserProfile?.role === 'intern'
                              ? 'Intern'
                              : currentUserProfile?.role === 'studentBody'
                              ? 'Student'
                              : 'Member'}
                          </span>
                        </div>
                        {currentUserProfile && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {currentUserProfile.department || currentUserProfile.rollOrId || 'KGEC RS'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-[#243324]/5 dark:border-white/5">
                      {isAdminLoggedIn ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            openEditor('projects');
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Admin CMS</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsApplicationFormOpen(true);
                          }}
                          className="flex-1 py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Cpu className="w-3 h-3 text-emerald-400" />
                          <span>My Application</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logoutAdmin();
                          setIsMenuOpen(false);
                        }}
                        className="py-1 px-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-medium text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      openBackdoorModal();
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-white dark:bg-[#1A2619] hover:bg-neutral-50 dark:hover:bg-[#223321] text-[#1F2B1D] dark:text-white border border-[#243324]/15 dark:border-white/15 text-xs font-medium transition-all shadow-2xs flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span className="font-medium text-xs">Sign in with Google</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#657351] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>

              {/* Compact Navigation Links */}
              <nav className="space-y-0.5 pt-0.5">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#3A4B37] dark:text-[#CBD7C7] hover:text-[#1F2B1D] dark:hover:text-white hover:bg-[#243324]/8 dark:hover:bg-white/8 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-[#657351]/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
