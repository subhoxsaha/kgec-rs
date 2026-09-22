import React from 'react';
import { ArrowUp, Bot, Compass, MapPin } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_KRS_LOGO_DARK, DEFAULT_KRS_LOGO_LIGHT } from '../data/reportData';

export const RoadmapGratitudeSection: React.FC = () => {
  const { metadata } = useReportData();
  const { isDark } = useTheme();

  // Club logo with theme support fetched directly from /logos/ folder
  const mainLogoSrc = isDark ? '/logos/krs-logo-dark.svg' : '/logos/krs-logo-light.svg';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      id="site-footer"
      className="border-t border-[#243324]/10 dark:border-white/10 bg-[#FAF7F0] dark:bg-[#0E150D] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#243324]/10 dark:border-white/10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main Logo & Heading */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-black/80 border border-[#243324]/10 dark:border-white/10 shadow-2xs p-1"
                title="KGEC Robotics Society"
              >
                <img
                  src={mainLogoSrc}
                  alt="KGEC RS Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="font-semibold text-sm tracking-tight text-[#1F2B1D] dark:text-white">
                  KGEC Robotics Society
                </h3>
                <p className="text-xs text-[#657351] dark:text-[#A3B59E]">
                  Kalyani Government Engineering College
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#526340] dark:text-[#B4C2B0] leading-relaxed max-w-sm">
              Student-run robotics and autonomous systems society fostering
              practical engineering, competitive mechatronics, and STEM education since{' '}
              {metadata.establishedYear || '2012'}.
            </p>
          </div>

          {/* Technical Fleet & Domains */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Fleet &amp; Domains</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#526340] dark:text-[#B4C2B0]">
              <li>
                <a
                  href="#projects-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Autonomous AGVs &amp; Rovers
                </a>
              </li>
              <li>
                <a
                  href="#projects-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Combat Mechatronics &amp; Robowars
                </a>
              </li>
              <li>
                <a
                  href="#projects-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Aerial UAVs &amp; Quadcopters
                </a>
              </li>
              <li>
                <a
                  href="#projects-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Embedded IoT &amp; Telemetry
                </a>
              </li>
              <li>
                <a
                  href="#overview-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Interactive Mascot Lab
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Explore</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#526340] dark:text-[#B4C2B0]">
              <li>
                <a
                  href="#overview-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href="#projects-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Flagship Projects
                </a>
              </li>
              <li>
                <a
                  href="#events-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Techfest &amp; Hackathons
                </a>
              </li>
              <li>
                <a
                  href="#leadership-team-section"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  Society Mentors &amp; Team
                </a>
              </li>
              <li>
                <a
                  href="#techtix-zyro"
                  className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  TECHTIX &amp; ZYRO Arenas
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Coordinates */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Campus</span>
            </h4>
            <div className="space-y-1.5 text-xs text-[#526340] dark:text-[#B4C2B0] leading-relaxed">
              <p className="font-medium text-[#1F2B1D] dark:text-white">
                Kalyani Government Engineering College
              </p>
              <p>Kalyani, Nadia, West Bengal — 741235, India</p>
              <p className="text-[11px] text-[#657351] dark:text-[#8FA388] pt-1">
                MAKAUT Affiliated
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#657351] dark:text-[#8FA388]">
          <p>
            © {new Date().getFullYear()} KGEC Robotics Society (KGEC RS) • Kalyani Government Engineering College.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#243324]/15 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-[#1F2B1D] dark:text-[#F4EFE6] transition-all cursor-pointer font-medium text-xs shadow-2xs"
            title="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
