import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  Mail,
  Linkedin,
  Github,
  GraduationCap,
  Search,
  RotateCcw,
  Check,
  Building2,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  FolderTree,
  FileJson,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { TeamCategory, TeamMember } from '../../types';
import { fetchStaticTeamMembers, getTeamMemberImageCandidates } from '../../utils/teamUtils';
import { OptimizedImage } from '../common/OptimizedImage';

const TeamEditorAvatar: React.FC<{ member: TeamMember }> = ({ member }) => {
  const candidates = React.useMemo(() => getTeamMemberImageCandidates(member.id), [member.id]);
  return (
    <OptimizedImage
      src={candidates[0]}
      candidates={candidates}
      fallbackSrc="/team/default-avatar.svg"
      alt={member.name}
      loading="lazy"
      className="w-full h-full object-cover"
    />
  );
};

const CATEGORY_CONFIG: Record<
  TeamCategory,
  { label: string; singular: string; icon: React.FC<{ className?: string }>; color: string }
> = {
  teacher: {
    label: 'Teacher Body (Mentors)',
    singular: 'Faculty Mentor',
    icon: GraduationCap,
    color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
  },
  student: {
    label: 'Student Body (Leadership)',
    singular: 'Student Body Lead',
    icon: Building2,
    color: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/25',
  },
  lead: {
    label: 'Domain & Tech Leads',
    singular: 'Technical Lead',
    icon: Sparkles,
    color: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/25',
  },
  alumni: {
    label: 'Alumni Network',
    singular: 'Alumni',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-800 dark:text-purple-400 border-purple-500/25',
  },
};

const SUGGESTED_ROLES: Record<TeamCategory, string[]> = {
  teacher: [
    'Chief Faculty Advisor & Professor',
    'Associate Faculty Mentor & Lab In-Charge',
    'Faculty Mentor (Control Systems & Mechatronics)',
    'Faculty Mentor (Embedded Computing & AI)',
  ],
  student: [
    'President & Student Convener',
    'Vice President (Technical & Operations)',
    'General Secretary',
    'Treasurer & Accounts Head',
    'Joint Convener (TECHTIX & ZYRO)',
  ],
  lead: [
    'Autonomous Navigation & AI Lead',
    'Combat Mechatronics & Hardware Lead',
    'Embedded Systems & IoT Lead',
    'Aeromodelling & UAV Dynamics Lead',
    'Web & Digital Platforms Lead',
    'Media, PR & Creative Design Lead',
    'Sponsorship & Event Operations Lead',
    'School STEM Outreach & Eklavya Lead',
  ],
  alumni: [
    'Robotics Systems Engineer • Former President',
    'Autonomous UAV Systems Lead • Former Tech Convener',
    'Embedded Hardware Architect • Former Hardware Lead',
    'Perception & Computer Vision Scientist • Former AI Lead',
  ],
};

export const TeamEditor: React.FC = () => {
  const {
    teamMembers,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    reorderTeamMember,
    resetTeamToDefaults,
    showToast,
  } = useReportData();

  const [activeCategory, setActiveCategory] = useState<TeamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const getSuggestedId = (cat: TeamCategory) => {
    const prefix = cat === 'teacher' ? 'tb' : cat === 'lead' ? 'ld' : cat === 'alumni' ? 'al' : 'sb';
    const count = teamMembers.filter((m) => m.category === cat).length;
    return `${prefix}-${count + 1}`;
  };

  // New member form state
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    id: '',
    category: 'student',
    name: '',
    post: '',
    departmentOrBatch: '',
    avatarUrl: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    scholarUrl: '',
  });

  // Filter members by category and query
  const filteredMembers = teamMembers.filter((member) => {
    const matchesCategory = activeCategory === 'all' || member.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      member.name.toLowerCase().includes(q) ||
      member.post.toLowerCase().includes(q) ||
      (member.departmentOrBatch && member.departmentOrBatch.toLowerCase().includes(q)) ||
      member.email.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  // Count stats
  const teacherCount = teamMembers.filter((m) => m.category === 'teacher').length;
  const studentCount = teamMembers.filter((m) => m.category === 'student').length;
  const leadCount = teamMembers.filter((m) => m.category === 'lead').length;
  const alumniCount = teamMembers.filter((m) => m.category === 'alumni').length;

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(teamMembers, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    showToast('Copied team.json to clipboard!');
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(teamMembers, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded team.json');
  };

  const handleSyncFromStatic = async () => {
    setIsSyncing(true);
    try {
      const staticList = await fetchStaticTeamMembers();
      if (staticList && staticList.length > 0) {
        // Reset or set team members to file on disk
        staticList.forEach((item) => {
          const exists = teamMembers.some((m) => m.id === item.id);
          if (exists) {
            updateTeamMember(item.id, item);
          } else {
            addTeamMember(item);
          }
        });
        showToast(`Synced ${staticList.length} members from /public/data/team.json`);
      }
    } catch {
      showToast('Could not reload from /public/data/team.json');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name?.trim() || !newMember.post?.trim()) return;

    const memberCategory =
      (newMember.category as TeamCategory) || (activeCategory !== 'all' ? activeCategory : 'student');
    const assignedId = (newMember.id?.trim() || getSuggestedId(memberCategory)).toLowerCase();

    const created: TeamMember = {
      id: assignedId,
      category: memberCategory,
      name: newMember.name.trim(),
      post: newMember.post.trim(),
      departmentOrBatch: newMember.departmentOrBatch?.trim() || '',
      avatarUrl: '', // Auto-resolved strictly by member ID (/public/team/[id].*)
      email: newMember.email?.trim() || '',
      linkedinUrl: newMember.linkedinUrl?.trim() || '',
      githubUrl: newMember.githubUrl?.trim() || '',
      scholarUrl: newMember.scholarUrl?.trim() || '',
    };

    addTeamMember(created);
    setIsAdding(false);
    setNewMember({
      id: '',
      category: memberCategory,
      name: '',
      post: '',
      departmentOrBatch: '',
      avatarUrl: '',
      email: '',
      linkedinUrl: '',
      githubUrl: '',
      scholarUrl: '',
    });
  };

  return (
    <div className="space-y-6">

      {/* Header & Stats Strip with Static File Integration */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3">
        {/* Static Architecture Banner */}
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200">
          <div className="flex items-start gap-2.5">
            <FolderTree className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">
                Hardcoded File-Based Architecture: <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/data/team.json</code> &amp; <code className="font-mono bg-emerald-500/20 px-1.5 py-0.5 rounded text-[11px]">public/team/</code>
              </p>
              <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed">
                All team members are loaded directly from the hardcoded source file. This view provides a read-only directory catalog with copy and export capabilities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleSyncFromStatic}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 cursor-pointer shadow-2xs"
              title="Reload data from /public/data/team.json"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Reload file</span>
            </button>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-[11px] font-semibold text-white cursor-pointer shadow-2xs"
              title="Copy JSON configuration for public/data/team.json"
            >
              {copiedJson ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="p-1 rounded bg-white dark:bg-[#20301F] border border-emerald-500/40 hover:bg-emerald-50 text-emerald-900 dark:text-emerald-200 cursor-pointer"
              title="Download team.json"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h4 className="text-sm font-bold text-[#1F2B1D] dark:text-[#F4EFE6] flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              Leadership &amp; Mentorship Directory (Read-Only)
            </h4>
            <p className="text-xs text-[#526340] dark:text-[#A3B59E] mt-0.5">
              Inspect faculty mentors, elected student office bearers, domain technical leads, and alumni roster.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>{teamMembers.length} Members Loaded</span>
            </span>
          </div>
        </div>

        {/* Quick Category Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'teacher' ? 'all' : 'teacher')}
            className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
              activeCategory === 'teacher'
                ? 'bg-indigo-500/15 border-indigo-500/40 dark:bg-indigo-950/30'
                : 'bg-[#FAF7F0] dark:bg-[#111910] border-[#243324]/10 dark:border-white/10 hover:border-indigo-400/40'
            }`}
          >
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block">
              Teacher Body
            </span>
            <span className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {teacherCount} <span className="text-xs font-normal text-[#657351] dark:text-[#9DAE9A]">Mentors</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'student' ? 'all' : 'student')}
            className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
              activeCategory === 'student'
                ? 'bg-emerald-500/15 border-emerald-500/40 dark:bg-emerald-950/30'
                : 'bg-[#FAF7F0] dark:bg-[#111910] border-[#243324]/10 dark:border-white/10 hover:border-emerald-400/40'
            }`}
          >
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">
              Student Body
            </span>
            <span className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {studentCount} <span className="text-xs font-normal text-[#657351] dark:text-[#9DAE9A]">Officers</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'lead' ? 'all' : 'lead')}
            className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
              activeCategory === 'lead'
                ? 'bg-amber-500/15 border-amber-500/40 dark:bg-amber-950/30'
                : 'bg-[#FAF7F0] dark:bg-[#111910] border-[#243324]/10 dark:border-white/10 hover:border-amber-400/40'
            }`}
          >
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
              Domain Leads
            </span>
            <span className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {leadCount} <span className="text-xs font-normal text-[#657351] dark:text-[#9DAE9A]">Tech Leads</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory(activeCategory === 'alumni' ? 'all' : 'alumni')}
            className={`p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
              activeCategory === 'alumni'
                ? 'bg-purple-500/15 border-purple-500/40 dark:bg-purple-950/30'
                : 'bg-[#FAF7F0] dark:bg-[#111910] border-[#243324]/10 dark:border-white/10 hover:border-purple-400/40'
            }`}
          >
            <span className="text-[10px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wider block">
              Alumni
            </span>
            <span className="text-base font-bold text-[#1F2B1D] dark:text-[#F4EFE6]">
              {alumniCount} <span className="text-xs font-normal text-[#657351] dark:text-[#9DAE9A]">Graduates</span>
            </span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 text-[#526340] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
            }`}
          >
            All Members ({teamMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('teacher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'teacher'
                ? 'bg-indigo-700 text-white font-semibold'
                : 'bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 text-[#526340] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
            }`}
          >
            Teachers ({teacherCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('student')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'student'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 text-[#526340] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
            }`}
          >
            Student Body ({studentCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('lead')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'lead'
                ? 'bg-amber-700 text-white font-semibold'
                : 'bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 text-[#526340] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
            }`}
          >
            Leads ({leadCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('alumni')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === 'alumni'
                ? 'bg-purple-700 text-white font-semibold'
                : 'bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 text-[#526340] dark:text-[#A3B59E] hover:text-[#1F2B1D]'
            }`}
          >
            Alumni ({alumniCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#526340] dark:text-[#A3B59E]" />
          <input
            type="text"
            placeholder="Search by name, role or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-white dark:bg-[#1A2619] border border-dashed border-[#243324]/20 dark:border-white/15 space-y-2">
            <p className="text-xs text-[#526340] dark:text-[#A3B59E]">
              No members found matching &quot;{searchQuery}&quot; in the selected filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredMembers.map((member, idx) => {
            const catInfo = CATEGORY_CONFIG[member.category] || CATEGORY_CONFIG.student;
            const CatIcon = catInfo.icon;

            return (
              <div
                key={`${member.id || 'member'}-${idx}`}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3 transition-all"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar Portrait: Strictly Auto-resolved by Member ID */}
                    <div className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-[#243324]/15 bg-neutral-900 shadow-2xs">
                      <TeamEditorAvatar member={member} />
                    </div>

                    {/* Basic info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="text-sm font-bold text-[#1F2B1D] dark:text-[#F4EFE6] truncate">
                          {member.name}
                        </h5>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${catInfo.color}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catInfo.singular}</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#526340] dark:text-[#A3B59E]">
                          ID: {member.id}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-emerald-800 dark:text-emerald-400 mt-0.5">
                        {member.post}
                      </p>

                      {member.departmentOrBatch && (
                        <p className="text-[11px] text-[#526340] dark:text-[#A3B59E] font-mono truncate mt-0.5">
                          {member.departmentOrBatch}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Read-Only Badge */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                      #{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Social Badges preview */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#243324]/8 dark:border-white/8 text-[11px] text-[#526340] dark:text-[#A3B59E] overflow-x-auto no-scrollbar">
                  {member.email && (
                    <span className="inline-flex items-center gap-1 truncate" title={member.email}>
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </span>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#0077b5] hover:underline shrink-0"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {member.scholarUrl && (
                    <a
                      href={member.scholarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#4285F4] hover:underline shrink-0"
                    >
                      <GraduationCap className="w-3 h-3" />
                      <span>Scholar</span>
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#24292e] dark:text-[#E6F4E2] hover:underline shrink-0"
                    >
                      <Github className="w-3 h-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
