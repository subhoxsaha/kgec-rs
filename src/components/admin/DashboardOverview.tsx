import React from 'react';
import {
  Bot,
  Image as ImageIcon,
  Camera,
  Sliders,
  Type,
  Cpu,
  Calendar,
  Download,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  MessageSquare,
  Users,
  UserCheck,
  Database,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { EditorTab } from '../../store/useReportDataStore';
import { MongoDbStatusWidget } from './MongoDbStatusWidget';

interface DashboardOverviewProps {
  onNavigateTab: (tab: EditorTab) => void;
  onPreviewSite: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  onPreviewSite,
}) => {
  const {
    metadata,
    botProjects,
    wings,
    techfestPhotos,
    activityPhotos,
    hackathonPhotos,
    teamMembers,
    roadmap,
    googleUser,
    users,
  } = useReportData();

  const totalPhotos =
    (techfestPhotos?.length || 0) + (activityPhotos?.length || 0) + (hackathonPhotos?.length || 0);

  const pendingUsersCount = users?.filter((u) => u.status === 'pending').length || 0;

  const modules = [
    {
      id: 'users' as EditorTab,
      name: 'User Applications & Roles',
      tag: 'Role Management',
      icon: UserCheck,
      count: `${users?.length || 0} Registered (${pendingUsersCount} Pending)`,
      description: 'Review student & faculty registrations, assign society roles (Intern, Member, Lead, Student/Teacher Body), and approve clearances.',
      color: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'projects' as EditorTab,
      name: 'Flagship Bots & Projects',
      tag: 'Section 3',
      icon: Bot,
      count: `${botProjects?.length || 26} Bots`,
      description: 'Fleet roster, combat middleweights, autonomous line solvers, telemetry & full specs.',
      color: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'team' as EditorTab,
      name: 'Team, Mentors & Leads',
      tag: 'Section 4',
      icon: Users,
      count: `${teamMembers?.length || 18} Members`,
      description: 'Faculty mentors, student body leadership, domain & tech leads, and alumni roster.',
      color: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/30 text-indigo-400',
    },
    {
      id: 'logos' as EditorTab,
      name: 'Hero & Brand Identity',
      tag: 'Section 1',
      icon: ImageIcon,
      count: '4 Theme Logos',
      description: 'KGEC & KRS high-resolution emblems in light/dark modes, hero tagline, and banner copy.',
      color: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30 text-blue-400',
    },
    {
      id: 'metrics' as EditorTab,
      name: 'Key Figures & Benchmarks',
      tag: 'Section 2',
      icon: Sliders,
      count: `${metadata.nationalPodiums || 48} Podiums`,
      description: 'IIT podium counts, active engineers (184+), STEM kits (1,250+), and leadership quotes.',
      color: 'from-amber-600/20 to-yellow-600/10 border-amber-500/30 text-amber-400',
    },
    {
      id: 'photos' as EditorTab,
      name: 'Events & Media Gallery',
      tag: 'Section 4',
      icon: Camera,
      count: `${totalPhotos} Photos`,
      description: 'Techfest showcases, 36hr ZYRO Hackathons, and rural outreach photo archives.',
      color: 'from-purple-600/20 to-pink-600/10 border-purple-500/30 text-purple-400',
    },
    {
      id: 'wings' as EditorTab,
      name: 'Technical Wings',
      tag: 'Section 5',
      icon: Cpu,
      count: `${wings?.length || 4} Divisions`,
      description: 'Mechatronics & Combat, Autonomous Systems, Aerial/UAV, and Embedded IoT divisions.',
      color: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30 text-cyan-400',
    },
    {
      id: 'roadmap' as EditorTab,
      name: 'Vision 2027 Strategic Roadmap',
      tag: 'Section 6',
      icon: Calendar,
      count: `${roadmap?.length || 4} Horizons`,
      description: 'University Rover Challenge 2027, Centre of Excellence, and hardware patent milestones.',
      color: 'from-emerald-600/20 to-green-600/10 border-emerald-500/30 text-emerald-400',
    },
    {
      id: 'botfaq' as EditorTab,
      name: 'Companion Robot FAQ & Q&A',
      tag: 'AI Mascot',
      icon: MessageSquare,
      count: 'Interactive Q&A',
      description: 'Questions, smart answers, and nested follow-up options for the live hero robot mascot.',
      color: 'from-teal-600/20 to-emerald-600/10 border-teal-500/30 text-teal-400',
    },
    {
      id: 'texts' as EditorTab,
      name: 'Section Narratives & Copy',
      tag: 'Editorial',
      icon: Type,
      count: '8 Narrative Blocks',
      description: 'Full editorial copy for About Us, Our Motto, STEM drives, and RoboFiesta bootcamps.',
      color: 'from-stone-600/20 to-zinc-600/10 border-stone-500/30 text-stone-300',
    },
    {
      id: 'tools' as EditorTab,
      name: 'Backup, JSON & System Tools',
      tag: 'Database',
      icon: Download,
      count: 'Export & Reset',
      description: 'Download whole site configuration as JSON, restore from backup, or factory reset.',
      color: 'from-rose-600/20 to-orange-600/10 border-rose-500/30 text-rose-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Admin Greeting */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1B291A] via-[#142013] to-[#0D160C] p-5 sm:p-6 text-white border border-emerald-500/30 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Unified Master CMS
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync Enabled
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
              Welcome back, {googleUser?.name || 'Administrator'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Manage the entire KGEC Robotics Society web platform from this unified console. Select
              any section below to open its dedicated edit window with real-time preview and safe
              confirmation controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onPreviewSite}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Preview the live website"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Site</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('projects')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Manage Bots</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            Active Bots
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {botProjects?.length || 26}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Operational fleet
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            Technical Wings
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {wings?.length || 4}
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
            Core divisions
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            Media Assets
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {totalPhotos}
          </div>
          <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
            Gallery captures
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            National Podiums
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {metadata.nationalPodiums || 48}+
          </div>
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            IIT & Techfests
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            Engineers
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {metadata.totalMembers || 184}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active members
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/10 dark:border-white/10 shadow-2xs">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#657351] dark:text-[#9DAE9A]">
            Roadmap Goals
          </div>
          <div className="text-lg font-bold text-[#1F2B1D] dark:text-[#F4EFE6] font-mono mt-0.5">
            {roadmap?.length || 4}
          </div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
            Vision 2027
          </div>
        </div>
      </div>

      {/* Live MongoDB Status & Sync Engine */}
      <MongoDbStatusWidget />

      {/* Unified Sections Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
            Website Subsystems &bull; Select Section to Open Edit Window
          </h3>
          <span className="text-[11px] text-[#657351] dark:text-[#8E9F89]">
            Unified Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab(mod.id)}
                className="group relative p-4 rounded-2xl bg-white dark:bg-[#182317] border border-[#243324]/15 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-[#FAF8F4] dark:bg-[#111910] border border-[#243324]/10 dark:border-white/10 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#526340] dark:text-[#A3B59E] font-medium">
                        {mod.tag}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {mod.count}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#1F2B1D] dark:text-[#F4EFE6] group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                    {mod.name}
                  </h4>
                  <p className="text-xs text-[#526340] dark:text-[#A3B59E] mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-[#243324]/10 dark:border-white/10 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Open Edit Window</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 rounded-xl bg-white/70 dark:bg-[#152014] border border-[#243324]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[#3D4F3B] dark:text-[#CBD5C8]">
            All updates made in this CMS are instantly persisted to your local browser storage and
            reflected live on the website.
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('tools')}
          className="text-emerald-700 dark:text-emerald-300 hover:underline font-semibold shrink-0 cursor-pointer"
        >
          Export Database Backup (.JSON) &rarr;
        </button>
      </div>
    </div>
  );
};
