import React, { useState, useRef } from 'react';
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
  Upload,
  Search,
  RotateCcw,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useReportData } from '../../context/ReportDataContext';
import { TeamCategory, TeamMember } from '../../types';
import { compressImageFile } from '../../utils/imageUtils';

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

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
];

export const TeamEditor: React.FC = () => {
  const {
    teamMembers,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    reorderTeamMember,
    resetTeamToDefaults,
  } = useReportData();

  const [activeCategory, setActiveCategory] = useState<TeamCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New member form state
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    category: 'student',
    name: '',
    post: '',
    departmentOrBatch: '',
    avatarUrl: SAMPLE_AVATARS[0],
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    scholarUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);

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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isForNew = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file, 500, 500, 0.85);
      if (isForNew) {
        setNewMember((prev) => ({ ...prev, avatarUrl: dataUrl }));
      } else if (uploadTargetId) {
        updateTeamMember(uploadTargetId, { avatarUrl: dataUrl });
        setUploadTargetId(null);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (isForNew) {
          setNewMember((prev) => ({ ...prev, avatarUrl: dataUrl }));
        } else if (uploadTargetId) {
          updateTeamMember(uploadTargetId, { avatarUrl: dataUrl });
          setUploadTargetId(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name?.trim() || !newMember.post?.trim()) return;

    const memberCategory = (newMember.category as TeamCategory) || (activeCategory !== 'all' ? activeCategory : 'student');
    const created: TeamMember = {
      id: `member-${Date.now()}`,
      category: memberCategory,
      name: newMember.name.trim(),
      post: newMember.post.trim(),
      departmentOrBatch: newMember.departmentOrBatch?.trim() || '',
      avatarUrl: newMember.avatarUrl?.trim() || SAMPLE_AVATARS[0],
      email: newMember.email?.trim() || '',
      linkedinUrl: newMember.linkedinUrl?.trim() || '',
      githubUrl: newMember.githubUrl?.trim() || '',
      scholarUrl: newMember.scholarUrl?.trim() || '',
    };

    addTeamMember(created);
    setIsAdding(false);
    setNewMember({
      category: memberCategory,
      name: '',
      post: '',
      departmentOrBatch: '',
      avatarUrl: SAMPLE_AVATARS[Math.floor(Math.random() * SAMPLE_AVATARS.length)],
      email: '',
      linkedinUrl: '',
      githubUrl: '',
      scholarUrl: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs for Local Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleImageFileChange(e, true)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={editFileInputRef}
        onChange={(e) => handleImageFileChange(e, false)}
        accept="image/*"
        className="hidden"
      />

      {/* Header & Stats Strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3">
        {/* Independence Note Banner */}
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Public Showcase Roster:</strong> Members created here appear on the website&apos;s public Leadership &amp; Team cards. This list is managed completely independently from website user account registrations in the <em>User Applications &amp; Roles</em> tab.
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <h4 className="text-sm font-bold text-[#1F2B1D] dark:text-[#F4EFE6] flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              Leadership &amp; Mentorship Directory CMS
            </h4>
            <p className="text-xs text-[#526340] dark:text-[#A3B59E] mt-0.5">
              Edit faculty mentors, elected student office bearers, domain technical leads, and alumni roster.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all team members to initial KGEC default roster?')) {
                  resetTeamToDefaults();
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#657351] dark:text-[#9DAE9A] hover:bg-[#243324]/5 dark:hover:bg-white/5 border border-[#243324]/15 dark:border-white/15 cursor-pointer transition-colors"
              title="Reset Team Roster"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAdding(true);
                if (activeCategory !== 'all') {
                  setNewMember((prev) => ({ ...prev, category: activeCategory }));
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
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

      {/* Add New Member Drawer / Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateMember}
          className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border-2 border-emerald-500/30 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-100/10 pb-2.5">
            <h5 className="text-sm font-bold text-emerald-950 dark:text-emerald-300 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Team Member
            </h5>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#526340] dark:text-[#A3B59E] hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Category selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Category / Section *
              </label>
              <select
                value={newMember.category || 'student'}
                onChange={(e) => setNewMember({ ...newMember, category: e.target.value as TeamCategory })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-semibold text-[#1F2B1D] dark:text-[#F4EFE6]"
              >
                <option value="teacher">Teacher Body (Mentors &amp; Faculty)</option>
                <option value="student">Student Body (Leadership &amp; Office)</option>
                <option value="lead">Domain &amp; Technical Leads</option>
                <option value="alumni">Alumni Network</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Arindam Mukherjee or Debojyoti Ray"
                value={newMember.name || ''}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            {/* Post / Designation */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Post / Designation *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. President, Autonomous Lead, Faculty Advisor"
                value={newMember.post || ''}
                onChange={(e) => setNewMember({ ...newMember, post: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
              {/* Quick suggestions for current category */}
              {newMember.category && SUGGESTED_ROLES[newMember.category as TeamCategory] && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {SUGGESTED_ROLES[newMember.category as TeamCategory].slice(0, 3).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setNewMember({ ...newMember, post: r })}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-500/20 truncate max-w-[140px] cursor-pointer"
                      title={r}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Department / Batch */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Department / Batch / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Final Year ECE or Dept. of Mechanical Engg."
                value={newMember.departmentOrBatch || ''}
                onChange={(e) => setNewMember({ ...newMember, departmentOrBatch: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Official Email
              </label>
              <input
                type="email"
                placeholder="name@krs-kgec.in or name@kgec.edu.in"
                value={newMember.email || ''}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            {/* LinkedIn Profile */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={newMember.linkedinUrl || ''}
                onChange={(e) => setNewMember({ ...newMember, linkedinUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
              />
            </div>

            {/* GitHub or Scholar based on category */}
            {newMember.category === 'teacher' ? (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">
                  Google Scholar URL (Teachers)
                </label>
                <input
                  type="url"
                  placeholder="https://scholar.google.com/citations?user=..."
                  value={newMember.scholarUrl || ''}
                  onChange={(e) => setNewMember({ ...newMember, scholarUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-indigo-500/30"
                />
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={newMember.githubUrl || ''}
                  onChange={(e) => setNewMember({ ...newMember, githubUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15"
                />
              </div>
            )}

            {/* Avatar URL & Upload */}
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] mb-1">
                Profile Portrait Image URL / Upload
              </label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#243324]/20 shrink-0 bg-neutral-900">
                  <img
                    src={newMember.avatarUrl || SAMPLE_AVATARS[0]}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... or upload"
                  value={newMember.avatarUrl || ''}
                  onChange={(e) => setNewMember({ ...newMember, avatarUrl: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 font-mono"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-[#243324]/10 dark:bg-white/10 hover:bg-[#243324]/20 dark:hover:bg-white/20 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const identifier = newMember.email || newMember.name || 'Member';
                    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=0D9488&color=ffffff&bold=true&size=256`;
                    setNewMember({ ...newMember, avatarUrl: avatar });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-500/15 text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 border border-teal-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                  title="Generate avatar from email or name"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email PFP</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-900/10 dark:border-emerald-100/10">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#526340] dark:text-[#A3B59E] hover:bg-[#243324]/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Add Member</span>
            </button>
          </div>
        </form>
      )}

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
            const isEditing = editingId === member.id;
            const catInfo = CATEGORY_CONFIG[member.category] || CATEGORY_CONFIG.student;
            const CatIcon = catInfo.icon;

            return (
              <div
                key={member.id}
                className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3 transition-all"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar Portrait with Quick Upload Overlay */}
                    <div className="relative group w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden shrink-0 border border-[#243324]/15 bg-neutral-900 shadow-2xs">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadTargetId(member.id);
                          editFileInputRef.current?.click();
                        }}
                        title="Upload new photo"
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-semibold transition-opacity cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 mb-0.5" />
                        <span>Change</span>
                      </button>
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

                  {/* Actions & Reorder buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => reorderTeamMember(member.id, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-[#526340] dark:text-[#A3B59E] hover:bg-[#243324]/10 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => reorderTeamMember(member.id, 'down')}
                      disabled={idx === filteredMembers.length - 1}
                      className="p-1 rounded text-[#526340] dark:text-[#A3B59E] hover:bg-[#243324]/10 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(isEditing ? null : member.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isEditing
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#FAF7F0] dark:bg-[#111910] border border-[#243324]/15 dark:border-white/15 text-[#243324] dark:text-[#F4EFE6] hover:bg-[#243324]/10'
                      }`}
                      title={isEditing ? 'Close form' : 'Edit details'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${member.name} from the team roster?`)) {
                          deleteTeamMember(member.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

                {/* Inline Editing Card */}
                {isEditing && (
                  <div className="pt-3 border-t border-dashed border-[#243324]/15 dark:border-white/15 space-y-3 bg-[#FAF7F0] dark:bg-[#111910] p-3.5 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Category / Section
                        </label>
                        <select
                          value={member.category || 'student'}
                          onChange={(e) =>
                            updateTeamMember(member.id, { category: e.target.value as TeamCategory })
                          }
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 font-semibold"
                        >
                          <option value="teacher">Teacher Body (Mentors)</option>
                          <option value="student">Student Body (Leadership)</option>
                          <option value="lead">Domain &amp; Tech Leads</option>
                          <option value="alumni">Alumni Network</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Post / Designation
                        </label>
                        <input
                          type="text"
                          value={member.post}
                          onChange={(e) => updateTeamMember(member.id, { post: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Department / Batch
                        </label>
                        <input
                          type="text"
                          value={member.departmentOrBatch || ''}
                          onChange={(e) => updateTeamMember(member.id, { departmentOrBatch: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={member.email || ''}
                          onChange={(e) => updateTeamMember(member.id, { email: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={member.linkedinUrl || ''}
                          onChange={(e) => updateTeamMember(member.id, { linkedinUrl: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Google Scholar URL (Teachers)
                        </label>
                        <input
                          type="url"
                          value={member.scholarUrl || ''}
                          onChange={(e) => updateTeamMember(member.id, { scholarUrl: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          GitHub URL (Students/Leads)
                        </label>
                        <input
                          type="url"
                          value={member.githubUrl || ''}
                          onChange={(e) => updateTeamMember(member.id, { githubUrl: e.target.value })}
                          className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#526340] dark:text-[#A3B59E] mb-0.5">
                          Avatar Image URL
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={member.avatarUrl || ''}
                            onChange={(e) => updateTeamMember(member.id, { avatarUrl: e.target.value })}
                            className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-[#1A2619] border border-[#243324]/15 dark:border-white/15 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadTargetId(member.id);
                              editFileInputRef.current?.click();
                            }}
                            className="p-1 rounded bg-[#243324]/10 dark:bg-white/10 hover:bg-[#243324]/20 cursor-pointer"
                            title="Upload local photo"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const identifier = member.email || member.name || 'Member';
                              const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(identifier)}&background=0D9488&color=ffffff&bold=true&size=256`;
                              updateTeamMember(member.id, { avatarUrl: avatar });
                            }}
                            className="p-1 rounded bg-teal-500/20 text-teal-800 dark:text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 cursor-pointer"
                            title="Generate Email PFP Avatar"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 rounded bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        Done Editing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
