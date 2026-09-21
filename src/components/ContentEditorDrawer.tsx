import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sliders,
  Type,
  Calendar,
  Download,
  Cpu,
  Image as ImageIcon,
  Camera,
  Bot,
  LayoutDashboard,
  Maximize2,
  Minimize2,
  MessageSquare,
  CheckCircle2,
  Users,
  UserCheck,
} from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { EditorTab } from '../store/useReportDataStore';
import { DashboardOverview } from './admin/DashboardOverview';
import { ProjectsEditor } from './admin/ProjectsEditor';
import { TeamEditor } from './admin/TeamEditor';
import { LogoThemeEditor } from './admin/LogoThemeEditor';
import { PhotosMediaEditor } from './admin/PhotosMediaEditor';
import { MetricsEditor } from './admin/MetricsEditor';
import { SectionTextsEditor } from './admin/SectionTextsEditor';
import { WingsEditor } from './admin/WingsEditor';
import { RoadmapEditor } from './admin/RoadmapEditor';
import { BotFaqEditor } from './admin/BotFaqEditor';
import { ToolsEditor } from './admin/ToolsEditor';
import { UserManagementTab } from './UserManagementTab';

export const ContentEditorDrawer: React.FC = () => {
  const { isEditorOpen, closeEditor, activeEditorTab, setActiveEditorTab, googleUser, users, isAdminLoggedIn } =
    useReportData();

  const [isMaximized, setIsMaximized] = useState(false);

  if (!isEditorOpen || !isAdminLoggedIn) return null;

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  const tabs: {
    id: EditorTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'users',
      label: 'User Applications & Roles',
      icon: UserCheck,
      badge: pendingCount,
    },
    {
      id: 'projects',
      label: 'Robotic Fleet',
      icon: Bot,
    },
    {
      id: 'team',
      label: 'Team & Mentors',
      icon: Users,
    },
    {
      id: 'logos',
      label: 'Brand & Hero',
      icon: ImageIcon,
    },
    {
      id: 'photos',
      label: 'Events & Arenas',
      icon: Camera,
    },
    {
      id: 'metrics',
      label: 'Key Figures',
      icon: Sliders,
    },
    {
      id: 'wings',
      label: 'Tech Wings',
      icon: Cpu,
    },
    {
      id: 'roadmap',
      label: 'Vision 2027',
      icon: Calendar,
    },
    {
      id: 'botfaq',
      label: 'Robot Mascot',
      icon: MessageSquare,
    },
    {
      id: 'texts',
      label: 'Section Texts & Pills',
      icon: Type,
    },
    {
      id: 'tools',
      label: 'Backup & Tools',
      icon: Download,
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeEditorTab) || tabs[0];
  const CurrentIcon = currentTab.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditor}
          className="fixed inset-0 bg-[#0A1009]/60 backdrop-blur-xs transition-opacity"
        />

        {/* Responsive Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className={`relative bg-[#FAF8F4] dark:bg-[#131D12] text-[#1F2B1D] dark:text-[#F4EFE6] h-full shadow-2xl flex flex-col z-10 border-l border-[#243324]/15 dark:border-white/10 transition-all duration-300 ${
            isMaximized ? 'w-full' : 'w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl'
          }`}
        >
          {/* Streamlined Header */}
          <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[#243324]/10 dark:border-white/10 bg-white/90 dark:bg-[#1A2619]/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-emerald-800 text-white shrink-0 shadow-2xs">
                <CurrentIcon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-[#1F2B1D] dark:text-[#F4EFE6] truncate">
                    {currentTab.label}
                  </h3>
                </div>
                {googleUser && (
                  <p className="text-[10px] text-[#657351] dark:text-[#9DAE9A] font-mono truncate">
                    Admin: {googleUser.email}
                  </p>
                )}
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Maximize / Normal Toggle */}
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-[#4A5D44] dark:text-[#A3B59E] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title={isMaximized ? 'Restore standard size' : 'Expand full width'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeEditor}
                className="p-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 text-[#4A5D44] dark:text-[#A3B59E] hover:bg-[#243324]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Close editor"
                aria-label="Close editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unified Section Navigation Bar */}
          <div className="flex border-b border-[#243324]/10 dark:border-white/10 bg-[#EFECE4] dark:bg-[#182417] px-1.5 sm:px-3 overflow-x-auto no-scrollbar shrink-0 touch-pan-x">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeEditorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditorTab(tab.id)}
                  className={`flex items-center gap-1.5 min-h-[44px] py-2.5 px-3 sm:px-3.5 text-xs font-medium whitespace-nowrap transition-all border-b-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'border-emerald-700 dark:border-emerald-400 text-emerald-950 dark:text-white font-semibold bg-white/70 dark:bg-white/10 shadow-2xs'
                      : 'border-transparent text-[#657351] dark:text-[#9DAE9A] hover:text-[#1F2B1D] dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            {activeEditorTab === 'overview' && (
              <DashboardOverview
                onNavigateTab={setActiveEditorTab}
                onPreviewSite={closeEditor}
              />
            )}
            {activeEditorTab === 'users' && <UserManagementTab />}
            {activeEditorTab === 'projects' && <ProjectsEditor />}
            {activeEditorTab === 'team' && <TeamEditor />}
            {activeEditorTab === 'logos' && <LogoThemeEditor />}
            {activeEditorTab === 'photos' && <PhotosMediaEditor />}
            {activeEditorTab === 'metrics' && <MetricsEditor />}
            {activeEditorTab === 'texts' && <SectionTextsEditor />}
            {activeEditorTab === 'wings' && <WingsEditor />}
            {activeEditorTab === 'roadmap' && <RoadmapEditor />}
            {activeEditorTab === 'botfaq' && <BotFaqEditor />}
            {activeEditorTab === 'tools' && <ToolsEditor />}
          </div>

          {/* Clean Master Footer */}
          <div className="px-4 py-2.5 border-t border-[#243324]/10 dark:border-white/10 bg-white/80 dark:bg-[#182417]/90 backdrop-blur-md flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 text-[11px] text-[#526340] dark:text-[#A3B59E]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Real-time persistence active</span>
            </div>

            <button
              type="button"
              onClick={closeEditor}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Done &amp; Close &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
