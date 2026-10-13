import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderGit2,
  GitBranch,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  UserCheck,
  Edit3,
  Calendar,
  ShieldAlert,
  ArrowRight,
  Send,
  RefreshCw,
  Search,
  X,
  FileCode,
  ShieldCheck,
  Award,
  Layers,
  ArrowUpRight,
  AlertCircle,
  RotateCcw,
  Info,
  ArrowLeft,
  Sun,
  Moon,
  LogOut,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useReportData } from '../../context/ReportDataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  RoboticsProject,
  ProjectPhase,
  PhaseSubmission,
  ProjectPhaseType,
  UserApplicationProfile,
  UserRole,
} from '../../types';
import { StageCard } from './StageCard';
import { StageDrawer } from './StageDrawer';
import { StageActionBar } from './StageActionBar';

interface ProjectManagementPageProps {
  onBack: () => void;
  initialProjectId?: string | null;
}

export const ProjectManagementPage: React.FC<ProjectManagementPageProps> = ({
  onBack,
  initialProjectId,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const {
    googleUser,
    isAdminLoggedIn,
    currentUserProfile,
    users,
    showToast,
    logoutAdmin,
  } = useReportData();

  // 1. Strict Access Control: Accepted Users Only
  const isAcceptedUser = useMemo(() => {
    if (isAdminLoggedIn) return true;
    if (currentUserProfile && currentUserProfile.status === 'approved') return true;
    if (googleUser && googleUser.status === 'approved') return true;
    return false;
  }, [isAdminLoggedIn, currentUserProfile, googleUser]);

  // 2. Active Actor directly bound to authenticated session
  const activeActor = useMemo(() => {
    if (isAdminLoggedIn) {
      return {
        id: currentUserProfile?.id || 'user-admin-subho',
        name: currentUserProfile?.name || googleUser?.name || 'Subho Saha',
        role: 'admin' as UserRole,
        email: currentUserProfile?.email || googleUser?.email || 'subhoxsaha@gmail.com',
      };
    }
    if (currentUserProfile && currentUserProfile.status === 'approved') {
      return {
        id: currentUserProfile.id,
        name: currentUserProfile.name,
        role: currentUserProfile.role,
        email: currentUserProfile.email,
      };
    }
    if (googleUser && googleUser.profile && googleUser.profile.status === 'approved') {
      return {
        id: googleUser.profile.id,
        name: googleUser.profile.name,
        role: googleUser.profile.role,
        email: googleUser.profile.email,
      };
    }
    return {
      id: '',
      name: 'Guest',
      role: 'guest' as UserRole,
      email: '',
    };
  }, [isAdminLoggedIn, currentUserProfile, googleUser]);

  // Projects State
  const [projects, setProjects] = useState<RoboticsProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Audit log filter
  const [auditFilter, setAuditFilter] = useState<'all' | 'submissions' | 'team' | 'reviews'>('all');

  // Inline Banner Alerts & Workspace Error List
  const [workspaceErrors, setWorkspaceErrors] = useState<string[]>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  // Selected stage view state
  const [activeStageId, setActiveStageId] = useState<string | null>(null);

  // Stage Drawer State (Mobile Slide-Up Drawer / Modal)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'submit' | 'review' | 'configure'>('submit');
  const [targetPhaseForDrawer, setTargetPhaseForDrawer] = useState<ProjectPhase | null>(null);

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<RoboticsProject | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isManagingTeam, setIsManagingTeam] = useState(false);
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // Forms
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    description: '',
    mentorIds: [] as string[],
    memberIds: [] as string[],
  });

  const [editDetailsForm, setEditDetailsForm] = useState({
    title: '',
    description: '',
  });

  // Local state for Manage Team modal to avoid async race conditions
  const [tempMentorIds, setTempMentorIds] = useState<string[]>([]);
  const [tempMemberIds, setTempMemberIds] = useState<string[]>([]);

  // Fetch real registered users from backend for dynamic team assignment
  const [systemUsers, setSystemUsers] = useState<UserApplicationProfile[]>([]);
  useEffect(() => {
    if (!isAcceptedUser) return;
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users && Array.isArray(data.users)) {
          setSystemUsers(data.users);
        }
      })
      .catch(() => {
        if (users && users.length > 0) setSystemUsers(users);
      });
  }, [isAcceptedUser, users]);

  // Filter all approved users for mentor and member assignment options
  const eligibleMentors = useMemo(() => {
    const list = systemUsers.filter((u) => u.status === 'approved');
    if (list.length === 0 && activeActor.id) {
      return [{ id: activeActor.id, name: activeActor.name, role: activeActor.role, status: 'approved' as const, email: activeActor.email, phone: '', department: 'Robotics', yearOfStudy: 'Final Year', motivation: '', idCardUrl: '', createdAt: '' }];
    }
    return list;
  }, [systemUsers, activeActor]);

  const eligibleMembers = useMemo(() => {
    const list = systemUsers.filter((u) => u.status === 'approved');
    if (list.length === 0 && activeActor.id) {
      return [{ id: activeActor.id, name: activeActor.name, role: activeActor.role, status: 'approved' as const, email: activeActor.email, phone: '', department: 'Robotics', yearOfStudy: 'Final Year', motivation: '', idCardUrl: '', createdAt: '' }];
    }
    return list;
  }, [systemUsers, activeActor]);

  const resolveUserName = (userId: string) => {
    const match = systemUsers.find((u) => u.id === userId);
    if (match) return match.name;
    if (userId === activeActor.id) return activeActor.name;
    return userId.replace(/^user-/, '');
  };

  const addWorkspaceError = (err: string) => {
    setWorkspaceErrors((prev) => (prev.includes(err) ? prev : [...prev, err]));
  };

  const clearWorkspaceErrors = () => {
    setWorkspaceErrors([]);
  };

  // Fetch projects from server
  const fetchProjects = async () => {
    if (!isAcceptedUser || !activeActor.id) return;
    setLoading(true);
    clearWorkspaceErrors();
    try {
      const res = await fetch('/api/pm/projects', {
        headers: {
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else if (res.status === 401) {
        setProjects([]);
        addWorkspaceError('Unauthorized access: Project Management is available only for accepted KGEC Robotics society members.');
      } else {
        const data = await res.json().catch(() => ({}));
        addWorkspaceError(data.error || `Unable to load projects (HTTP ${res.status}).`);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      addWorkspaceError('Server connection issue. Could not load projects workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAcceptedUser && activeActor.id) {
      fetchProjects();
    }
  }, [isAcceptedUser, activeActor.id]);

  // Selected Project
  const selectedProject = useMemo(() => {
    if (!selectedProjectId) {
      return projects.length > 0 ? projects[0] : null;
    }
    return projects.find((p) => p.id === selectedProjectId) || (projects.length > 0 ? projects[0] : null);
  }, [projects, selectedProjectId]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, filterStatus]);

  // Permissions relative to selected project
  const isAdmin = activeActor.role === 'admin';
  const isCreator = useMemo(() => {
    if (!selectedProject) return false;
    return selectedProject.createdBy === activeActor.id;
  }, [selectedProject, activeActor.id]);

  const isAssignedMentor = useMemo(() => {
    if (!selectedProject) return false;
    return selectedProject.mentorIds.includes(activeActor.id);
  }, [selectedProject, activeActor.id]);

  const isAssignedMember = useMemo(() => {
    if (!selectedProject) return false;
    return selectedProject.memberIds.includes(activeActor.id);
  }, [selectedProject, activeActor.id]);

  // Active focus phase
  const activeFocusPhase = useMemo(() => {
    if (!selectedProject || !selectedProject.phases) return null;
    if (activeStageId) {
      return selectedProject.phases.find((p) => p.id === activeStageId) || selectedProject.phases[0];
    }
    return (
      selectedProject.phases.find(
        (p) => p.status === 'in_progress' || p.status === 'submitted' || p.status === 'changes_requested'
      ) || selectedProject.phases[0]
    );
  }, [selectedProject, activeStageId]);

  // Stage Actions Trigger
  const openSubmitDrawer = (phase: ProjectPhase) => {
    setActiveStageId(phase.id);
  };

  const openReviewDrawer = (phase: ProjectPhase) => {
    setTargetPhaseForDrawer(phase);
    setDrawerMode('review');
    setDrawerOpen(true);
  };

  const openConfigureDrawer = (phase: ProjectPhase) => {
    setTargetPhaseForDrawer(phase);
    setDrawerMode('configure');
    setDrawerOpen(true);
  };

  // Open Manage Team Modal
  const handleOpenManageTeamModal = () => {
    if (!selectedProject) return;
    setTempMentorIds([...selectedProject.mentorIds]);
    setTempMemberIds([...selectedProject.memberIds]);
    setIsManagingTeam(true);
  };

  // --- ACTIONS ---

  // 1. Admin Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!newProjectForm.title.trim()) {
      setModalError('Please enter a project title');
      showToast('Please enter a project title');
      return;
    }
    try {
      const res = await fetch('/api/pm/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify(newProjectForm),
      });
      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        showToast('Project created successfully with 3 sequential phases initialized.');
        setIsCreateModalOpen(false);
        setModalError(null);
        setNewProjectForm({
          title: '',
          description: '',
          mentorIds: [],
          memberIds: [],
        });
        await fetchProjects();
        if (data.project?.id) {
          setSelectedProjectId(data.project.id);
        }
      } else {
        const errMsg = data.error || 'Failed to create project';
        setModalError(errMsg);
        showToast(errMsg);
      }
    } catch {
      setModalError('Server connection failed');
      showToast('Server connection failed');
    }
  };

  // 2. Creator / Mentor / Admin Edit Project Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    setModalError(null);
    if (!editDetailsForm.title.trim()) {
      setModalError('Project title cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`/api/pm/projects/${selectedProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify(editDetailsForm),
      });
      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        showToast('Project title and description updated successfully.');
        setIsEditingDetails(false);
        setModalError(null);
        await fetchProjects();
      } else {
        const errMsg = data.error || 'Failed to update project details';
        setModalError(errMsg);
        addWorkspaceError(errMsg);
        showToast(errMsg);
      }
    } catch {
      setModalError('Server connection failed');
      addWorkspaceError('Server connection failed during project update.');
      showToast('Server connection failed');
    }
  };

  // 3. Creator / Mentor / Admin Save Team Assignments
  const handleSaveTeamAssignments = async () => {
    if (!selectedProject) return;
    setIsSavingTeam(true);
    try {
      const res = await fetch(`/api/pm/projects/${selectedProject.id}/team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify({ mentorIds: tempMentorIds, memberIds: tempMemberIds }),
      });
      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        showToast('Team roster updated successfully!');
        setIsManagingTeam(false);
        await fetchProjects();
      } else {
        const errMsg = data.error || 'Failed to update team assignments';
        addWorkspaceError(errMsg);
        showToast(errMsg);
      }
    } catch {
      addWorkspaceError('Server connection error while saving team members.');
      showToast('Server connection error');
    } finally {
      setIsSavingTeam(false);
    }
  };

  // 4. Mentor Update Phase Deadlines & Requirements
  const handleSavePhaseConfig = async (phaseId: string, form: { deadline: string; requirements: string }) => {
    if (!selectedProject) return;
    const res = await fetch(`/api/pm/projects/${selectedProject.id}/phases/${phaseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': activeActor.id,
        'x-user-role': activeActor.role,
        'x-user-name': activeActor.name,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Phase deadline and requirements updated');
      await fetchProjects();
    } else {
      throw new Error(data.error || 'Failed to update phase settings');
    }
  };

  // 5. Team Member Submit Work Deliverables
  const handleSubmitDeliverables = async (phaseId: string, form: { driveUrl: string; gitUrl: string; notes: string }) => {
    if (!selectedProject) return;
    const res = await fetch(`/api/pm/projects/${selectedProject.id}/phases/${phaseId}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': activeActor.id,
        'x-user-role': activeActor.role,
        'x-user-name': activeActor.name,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      showToast('Deliverables submitted successfully! Queued for mentor evaluation.');
      await fetchProjects();
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  };

  // 6. Mentor Review Submission (Approve or Request Changes)
  const handleReviewSubmission = async (
    phaseId: string,
    submissionId: string,
    form: { decision: 'approved' | 'changes_requested'; feedback: string }
  ) => {
    if (!selectedProject) return;
    const res = await fetch(
      `/api/pm/projects/${selectedProject.id}/phases/${phaseId}/submissions/${submissionId}/review`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify(form),
      }
    );
    const data = await res.json();
    if (res.ok && data.success) {
      showToast(
        form.decision === 'approved'
          ? 'Phase approved! Next engineering phase is now unlocked.'
          : 'Changes requested. Current phase remains open for revision.'
      );
      await fetchProjects();
    } else {
      throw new Error(data.error || 'Review submission failed');
    }
  };

  // 7. Admin Delete Project Permanently
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    if (deleteConfirmationInput.trim() !== projectToDelete.title.trim()) {
      showToast('Confirmation title does not match. Deletion aborted.');
      return;
    }
    try {
      const res = await fetch(`/api/pm/projects/${projectToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${projectToDelete.title}" and its phases permanently deleted.`);
        setProjectToDelete(null);
        setDeleteConfirmationInput('');
        setSelectedProjectId(null);
        await fetchProjects();
      } else {
        showToast(data.error || 'Failed to delete project');
      }
    } catch {
      showToast('Server connection failed');
    }
  };

  // Audit Logs Filtered
  const filteredAuditLogs = useMemo(() => {
    if (!selectedProject || !selectedProject.activities) return [];
    return selectedProject.activities.filter((act) => {
      if (auditFilter === 'all') return true;
      if (auditFilter === 'submissions') return act.action.includes('submitted');
      if (auditFilter === 'team') return act.action.includes('team') || act.action.includes('details');
      if (auditFilter === 'reviews') return act.action.includes('approved') || act.action.includes('changes');
      return true;
    });
  }, [selectedProject, auditFilter]);

  // Redirect non-accepted users/guests immediately back to home view
  useEffect(() => {
    if (!isAcceptedUser) {
      onBack();
    }
  }, [isAcceptedUser, onBack]);

  if (!isAcceptedUser) {
    return null;
  }

  // =========================================================================
  // WORKSPACE RENDER
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#111A10] text-[#1F2B1D] dark:text-[#F4EFE6] flex flex-col antialiased transition-colors duration-300 pb-12">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#152014]/95 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold text-[#3A4B37] dark:text-[#CBD7C7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portal</span>
          </button>

          <span className="text-[#243324]/20 dark:text-white/20 hidden sm:inline" aria-hidden="true">/</span>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#1F2B1D] dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Project Management Workspace</span>
            </h1>
          </div>
        </div>

        {/* Real User Identity & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
              {activeActor.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs text-[#1F2B1D] dark:text-white leading-tight">
                {activeActor.name}
              </span>
              <span className="block text-[10px] font-mono text-[#526340] dark:text-[#A3B59E] capitalize">
                {activeActor.role === 'teacherBody' ? 'Faculty Advisor' : activeActor.role}
              </span>
            </div>

            <button
              type="button"
              onClick={logoutAdmin}
              className="ml-1 p-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#243324]/15 dark:border-white/15 text-[#3A4B37] dark:text-[#CBD7C7] hover:bg-[#243324]/8 dark:hover:bg-white/8 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#3A4B37]" />}
          </button>
        </div>
      </header>

      {/* Main Page Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        {/* EXPLICIT WORKSPACE ERROR LIST BANNER */}
        {workspaceErrors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 px-4 py-3 rounded-xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                <span className="font-bold text-xs text-[#1F2B1D] dark:text-red-200">
                  Project Management System Issues Encountered ({workspaceErrors.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchProjects}
                  className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
                <button
                  type="button"
                  onClick={clearWorkspaceErrors}
                  className="p-1 rounded-md hover:bg-red-500/20 text-red-700 dark:text-red-300 cursor-pointer"
                  aria-label="Dismiss errors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <ul className="list-disc list-inside space-y-1 text-xs pl-1 text-red-800 dark:text-red-300">
              {workspaceErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Left Column: Projects Catalog List */}
          <div className="w-full lg:w-84 shrink-0 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E]">
                  Projects Catalog ({projects.length})
                </span>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Project</span>
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#526340] dark:text-[#8E9F89]" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-[#FAF7F0] dark:bg-[#10170F] border border-[#243324]/15 dark:border-white/15 text-xs placeholder:text-[#526340]/60"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#FAF7F0] dark:bg-[#10170F] border border-[#243324]/10 dark:border-white/10 text-xs">
                {(['all', 'active', 'completed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`flex-1 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer text-center ${
                      filterStatus === st
                        ? 'bg-white dark:bg-[#1E2B1D] text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                        : 'text-[#526340] dark:text-[#CBD7C7] hover:text-[#1F2B1D]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects List Container */}
            <div className="space-y-2.5">
              {loading ? (
                <div className="p-8 text-center text-xs text-[#526340] flex items-center justify-center gap-2 bg-white dark:bg-[#162114] rounded-2xl border border-[#243324]/10 dark:border-white/10">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Loading projects...</span>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#526340] dark:text-[#A3B59E] bg-white dark:bg-[#162114] rounded-2xl border border-dashed border-[#243324]/20 dark:border-white/15 space-y-2">
                  <FolderGit2 className="w-8 h-8 mx-auto text-emerald-600/40" />
                  <p className="font-semibold text-sm text-[#1F2B1D] dark:text-white">
                    No projects found
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#526340] dark:text-[#9FB19A]">
                    {isAdmin
                      ? "Click 'Create Project' above to initialize a new robotics build."
                      : 'No projects currently assigned.'}
                  </p>
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const isSelected = selectedProject?.id === p.id;
                  const completedPhasesCount = (p.phases || []).filter((ph) => ph.status === 'approved').length;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-600 dark:border-emerald-400 shadow-2xs'
                          : 'bg-white dark:bg-[#162114] border-[#243324]/12 dark:border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-[#1F2B1D] dark:text-white line-clamp-1">
                          {p.title}
                        </h3>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase ${
                            p.status === 'completed'
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : 'text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#526340] dark:text-[#9FB19A] line-clamp-2">
                        {p.description}
                      </p>

                      <div className="pt-2 border-t border-[#243324]/8 dark:border-white/8 flex items-center justify-between text-[11px] text-[#526340] dark:text-[#A3B59E]">
                        <span>
                          Phases: <strong>{completedPhasesCount}/3 approved</strong>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Project Detail & Phase Workflow */}
          <div className="flex-1 flex flex-col gap-6">
            {selectedProject ? (
              <>
                {/* Project Overview Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[#526340] dark:text-[#A3B59E]">
                        <span className="font-mono font-bold">PROJECT ID: {selectedProject.id}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize font-semibold text-emerald-700 dark:text-emerald-300">
                          {selectedProject.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[#1F2B1D] dark:text-white">
                        {selectedProject.title}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
                        {selectedProject.description || 'No description provided.'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {(isAdmin || isCreator || isAssignedMentor) && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditDetailsForm({
                                title: selectedProject.title,
                                description: selectedProject.description || '',
                              });
                              setModalError(null);
                              setIsEditingDetails(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOpenManageTeamModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            <span>Manage Team</span>
                          </button>
                        </>
                      )}

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setProjectToDelete(selectedProject);
                            setDeleteConfirmationInput('');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Team Roster Grid */}
                  <div className="pt-3 border-t border-[#243324]/8 dark:border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-500" />
                        <span>Assigned Mentors ({selectedProject.mentorIds.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedProject.mentorIds.length === 0 ? (
                          <span className="text-[11px] text-[#526340] italic">No mentors assigned</span>
                        ) : (
                          selectedProject.mentorIds.map((mId) => (
                            <span key={mId} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-900 dark:text-blue-300 font-semibold text-xs border border-blue-500/20">
                              {resolveUserName(mId)}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Assigned Team Members ({selectedProject.memberIds.length})</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedProject.memberIds.length === 0 ? (
                          <span className="text-[11px] text-[#526340] italic">No members assigned</span>
                        ) : (
                          selectedProject.memberIds.map((mId) => (
                            <span key={mId} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/20">
                              {resolveUserName(mId)}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>



                {/* 3 DEDICATED STAGE CARDS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Sequential Stage Workspace</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {(selectedProject.phases || []).map((phase, pIdx) => (
                      <StageCard
                        key={phase.id}
                        phase={phase}
                        phaseIndex={pIdx}
                        isSelectedStage={activeFocusPhase?.id === phase.id}
                        onSelectStage={() => setActiveStageId(phase.id)}
                        resolveUserName={resolveUserName}
                        isAdmin={isAdmin}
                        isAssignedMentor={isAssignedMentor}
                        isAssignedMember={isAssignedMember}
                        onOpenSubmitDrawer={openSubmitDrawer}
                        onOpenReviewDrawer={openReviewDrawer}
                        onOpenConfigureDrawer={openConfigureDrawer}
                        onSubmitWork={handleSubmitDeliverables}
                      />
                    ))}
                  </div>
                </div>

                {/* AUDIT & ACTIVITY LOG TRAIL */}
                <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#243324]/10 dark:border-white/10">
                    <h3 className="font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5 text-xs">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Project Activity Audit Trail ({filteredAuditLogs.length})</span>
                    </h3>

                    {/* Audit Filter Pills */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 text-[11px]">
                      {(['all', 'submissions', 'team', 'reviews'] as const).map((filter) => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setAuditFilter(filter)}
                          className={`px-2.5 py-0.5 rounded-md font-semibold capitalize cursor-pointer transition-colors ${
                            auditFilter === filter
                              ? 'bg-emerald-700 text-white shadow-2xs'
                              : 'text-[#526340] hover:text-[#1F2B1D] dark:text-[#A3B59E]'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filteredAuditLogs.length === 0 ? (
                      <p className="text-xs text-[#526340] py-3 text-center italic">No audit records match the selected filter.</p>
                    ) : (
                      filteredAuditLogs.map((act) => (
                        <div
                          key={act.id}
                          className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/8 dark:border-white/8 flex items-start justify-between gap-3 text-[11px]"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-[9.5px] uppercase border ${
                                  act.action.includes('submitted')
                                    ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30'
                                    : act.action.includes('approved')
                                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                                    : act.action.includes('team') || act.action.includes('details')
                                    ? 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30'
                                    : 'bg-neutral-500/15 text-neutral-800 dark:text-neutral-300 border-neutral-500/20'
                                }`}
                              >
                                {act.action.replace('_', ' ')}
                              </span>
                              <span className="font-semibold text-[#1F2B1D] dark:text-white truncate">
                                {act.details}
                              </span>
                            </div>
                            <span className="text-[#526340] dark:text-[#8E9F89] block text-[10.5px]">
                              Actor: <strong>{act.actorName || resolveUserName(act.actorId)}</strong>
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#526340] dark:text-[#A3B59E] shrink-0">
                            {new Date(act.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-xs text-[#526340] bg-white dark:bg-[#162114] rounded-2xl border border-[#243324]/10 dark:border-white/10">
                <FolderGit2 className="w-12 h-12 text-emerald-600/30 mb-3" />
                <h2 className="font-bold text-base text-[#1F2B1D] dark:text-white">
                  {projects.length === 0 ? 'No Projects Initialized' : 'Select a Project to Inspect'}
                </h2>
                <p className="text-[#526340] dark:text-[#8E9F89] max-w-sm mt-1 leading-relaxed">
                  {projects.length === 0
                    ? 'There are currently no active projects. As an Administrator, click "Create Project" to launch a project and assign mentors.'
                    : 'Select an active robotics project from the left catalog to review phases, deadlines, and stage uploads.'}
                </p>
                {isAdmin && projects.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Project</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SLIDE-UP DRAWER */}
      {targetPhaseForDrawer && selectedProject && (
        <StageDrawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setTargetPhaseForDrawer(null);
          }}
          mode={drawerMode}
          phase={targetPhaseForDrawer}
          projectTitle={selectedProject.title}
          latestSubmission={(targetPhaseForDrawer.submissions || [])[0] || null}
          activeActorRole={activeActor.role}
          onSubmitWork={handleSubmitDeliverables}
          onReviewWork={handleReviewSubmission}
          onSavePhaseConfig={handleSavePhaseConfig}
          resolveUserName={resolveUserName}
        />
      )}

      {/* MODAL 1: ADMIN CREATE PROJECT */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-2xl border border-[#243324]/15 dark:border-white/15 p-5 sm:p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10 dark:border-white/10">
              <h3 className="font-bold text-base text-[#1F2B1D] dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Create New Project</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-md text-[#526340] hover:bg-[#243324]/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              {modalError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 p-3 rounded-lg flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-semibold">{modalError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalError(null)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-700 dark:text-red-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Centurion 60kg Combat Bot Weapon Redesign"
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Hardware specifications, competition targets, and engineering objectives..."
                  value={newProjectForm.description}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs"
                />
              </div>

              {/* Mentors Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                    Assign Lead Mentors:
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Optional</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMentors.length === 0 ? (
                    <span className="text-[11px] text-[#526340] italic">No registered system users</span>
                  ) : (
                    eligibleMentors.map((m) => {
                      const isChecked = newProjectForm.mentorIds.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProjectForm({ ...newProjectForm, mentorIds: [...newProjectForm.mentorIds, m.id] });
                              } else {
                                setNewProjectForm({
                                  ...newProjectForm,
                                  mentorIds: newProjectForm.mentorIds.filter((id) => id !== m.id),
                                });
                              }
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>{m.name} ({m.department || m.role})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Members Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                    Assign Team Members:
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Optional</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMembers.length === 0 ? (
                    <span className="text-[11px] text-[#526340] italic">No registered system users</span>
                  ) : (
                    eligibleMembers.map((m) => {
                      const isChecked = newProjectForm.memberIds.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewProjectForm({ ...newProjectForm, memberIds: [...newProjectForm.memberIds, m.id] });
                              } else {
                                setNewProjectForm({
                                  ...newProjectForm,
                                  memberIds: newProjectForm.memberIds.filter((id) => id !== m.id),
                                });
                              }
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>{m.name} ({m.department || m.role})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 2: ADMIN DELETE CONFIRMATION */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-2xl border-2 border-red-500/40 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-base">Permanent Project Deletion</h3>
            </div>

            <p className="text-xs text-[#526340] dark:text-[#CBD7C7] leading-relaxed">
              This action permanently purges the project &ldquo;{projectToDelete.title}&rdquo;, its 3 phases, and all submissions.
            </p>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1.5">
              <span className="font-bold text-red-900 dark:text-red-300 block">
                Type the exact project title to confirm deletion:
              </span>
              <p className="font-mono text-[11px] text-red-700 dark:text-red-400 select-all font-semibold">
                {projectToDelete.title}
              </p>
              <input
                type="text"
                placeholder="Type project title here..."
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#0E150D] border border-red-500/30 text-xs mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#243324]/10">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-1.5 rounded-xl border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput.trim() !== projectToDelete.title.trim()}
                onClick={handleDeleteProject}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: EDIT DETAILS */}
      {isEditingDetails && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-2xl border border-[#243324]/15 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-500" />
                <span>Edit Project Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="p-1 rounded-md text-[#526340] hover:bg-[#243324]/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-3.5 text-xs">
              {modalError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 p-2.5 rounded-lg flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-semibold">{modalError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalError(null)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-700 dark:text-red-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={editDetailsForm.title}
                  onChange={(e) => setEditDetailsForm({ ...editDetailsForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Project Description
                </label>
                <textarea
                  rows={4}
                  value={editDetailsForm.description}
                  onChange={(e) => setEditDetailsForm({ ...editDetailsForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: MANAGE TEAM */}
      {isManagingTeam && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-2xl border border-[#243324]/15 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Manage Team Roster</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsManagingTeam(false)}
                className="p-1 rounded-md text-[#526340] hover:bg-[#243324]/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Mentors Selection */}
              <div className="space-y-1.5">
                <span className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Assign Mentors ({tempMentorIds.length}):
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto p-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMentors.length === 0 ? (
                    <p className="text-[11px] text-[#526340] italic py-1">No registered users available</p>
                  ) : (
                    eligibleMentors.map((m) => {
                      const isAssigned = tempMentorIds.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 cursor-pointer text-xs py-0.5">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempMentorIds((prev) => [...prev, m.id]);
                              } else {
                                setTempMentorIds((prev) => prev.filter((id) => id !== m.id));
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span>{m.name} ({m.department || m.role})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Members Selection */}
              <div className="space-y-1.5">
                <span className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Assign Team Members ({tempMemberIds.length}):
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto p-2 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMembers.length === 0 ? (
                    <p className="text-[11px] text-[#526340] italic py-1">No registered users available</p>
                  ) : (
                    eligibleMembers.map((m) => {
                      const isAssigned = tempMemberIds.includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 cursor-pointer text-xs py-0.5">
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTempMemberIds((prev) => [...prev, m.id]);
                              } else {
                                setTempMemberIds((prev) => prev.filter((id) => id !== m.id));
                              }
                            }}
                            className="rounded text-emerald-600"
                          />
                          <span>{m.name} ({m.department || m.role})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setIsManagingTeam(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSavingTeam}
                  onClick={handleSaveTeamAssignments}
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  {isSavingTeam ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Roster...</span>
                    </>
                  ) : (
                    <span>Save Team Assignments</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
