/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ThemeProvider } from './context/ThemeContext';
import { ReportDataProvider } from './context/ReportDataContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { OverviewSection } from './components/OverviewSection';
import { ProjectsShowcaseSection } from './components/ProjectsShowcaseSection';
import { TechfestEventsSection } from './components/TechfestEventsSection';
import { TeamDirectorySection } from './components/TeamDirectorySection';
import { RoadmapGratitudeSection } from './components/RoadmapGratitudeSection';
import { BackdoorLoginModal } from './components/BackdoorLoginModal';
import { ContentEditorDrawer } from './components/ContentEditorDrawer';
import { TechtixZyroPage } from './components/TechtixZyroPage';

function MainContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const [currentView, setCurrentView] = useState<'home' | 'techtix-zyro'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#techtix-zyro' ||
        hash === '#techtix' ||
        hash === '#zyro' ||
        hash === '#events-portal' ||
        hash === '#events-showcase'
      ) {
        setCurrentView('techtix-zyro');
        if (hash === '#zyro') {
          setTimeout(() => {
            document.getElementById('zyro-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else if (hash === '#techtix') {
          setTimeout(() => {
            document.getElementById('techtix-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToEvents = () => {
    window.location.hash = '#techtix-zyro';
    setCurrentView('techtix-zyro');
  };

  const handleBackToHome = () => {
    window.location.hash = '#events-section';
    setCurrentView('home');
    setTimeout(() => {
      document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  if (currentView === 'techtix-zyro') {
    return (
      <>
        <TechtixZyroPage onBack={handleBackToHome} />
        <BackdoorLoginModal />
        <ContentEditorDrawer />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] font-sans antialiased selection:bg-[#E8DCC4] dark:selection:bg-[#384F35] selection:text-[#1F2B1D] dark:selection:text-[#F4EFE6] transition-colors duration-400">
      {/* Top Floating Navigation with Sun/Moon Toggle */}
      <Navbar />

      {/* Top Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#3B4D36] dark:bg-[#4A6D47] origin-left z-50 pointer-events-none transition-colors duration-300"
      />

      {/* Main Report Flow */}
      <main className="w-full overflow-x-hidden">
        <HeroSection />
        <OverviewSection />
        <ProjectsShowcaseSection />
        <TechfestEventsSection onExploreMore={handleNavigateToEvents} />
        <TeamDirectorySection />
        <RoadmapGratitudeSection />
      </main>

      {/* Backdoor Content Editor Suite & Modals (Triggered ONLY from the last section footer) */}
      <BackdoorLoginModal />
      <ContentEditorDrawer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReportDataProvider>
        <MainContent />
      </ReportDataProvider>
    </ThemeProvider>
  );
}

