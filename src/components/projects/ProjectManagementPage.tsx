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
  Lock,
  LogOut,
  ExternalLink,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useReportData } from '../../context/ReportDataContext';
import { useTheme } from '../../context/ThemeContext';
import {
  RoboticsProject,
  ProjectPhase,
  PhaseSubmission,
  SubmissionReview,
  ProjectPhaseType,
  UserApplicationProfile,
  UserRole,
} from '../../types';

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
    openBackdoorModal,
    openApplicationForm,
    logoutAdmin,
    refreshUserProfile,
  } = useReportData();

  // 1. Strict Access Control: Accepted Users Only
  const isAcceptedUser = useMemo(() => {
    if (isAdminLoggedIn) return true;
    if (currentUserProfile && currentUserProfile.status === 'approved') return true;
    if (googleUser && googleUser.status === 'approved') return true;
    return false;
  }, [isAdminLoggedIn, currentUserProfile, googleUser]);

  const userStatus = useMemo(() => {
    if (isAdminLoggedIn) return 'approved';
    if (currentUserProfile) return currentUserProfile.status;
    if (googleUser?.status) return googleUser.status;
    return 'unauthenticated';
  }, [isAdminLoggedIn, currentUserProfile, googleUser]);

  // 2. Active Actor directly bound to authenticated session (No Mock Data)
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
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Inline Banner Alerts
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<RoboticsProject | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isManagingTeam, setIsManagingTeam] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

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

  const [submissionForm, setSubmissionForm] = useState({
    driveUrl: '',
    gitUrl: '',
    notes: '',
  });

  const [reviewForm, setReviewForm] = useState({
    decision: 'approved' as 'approved' | 'changes_requested',
    feedback: '',
  });

  const [phaseEditForm, setPhaseEditForm] = useState({
    deadline: '',
    requirements: '',
  });

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

  // Filter approved users for mentor and member roles
  const eligibleMentors = useMemo(() => {
    return systemUsers.filter(
      (u) =>
        u.status === 'approved' &&
        (u.role === 'admin' || u.role === 'lead' || u.role === 'teacherBody')
    );
  }, [systemUsers]);

  const eligibleMembers = useMemo(() => {
    return systemUsers.filter(
      (u) =>
        u.status === 'approved' &&
        (u.role === 'member' || u.role === 'intern' || u.role === 'studentBody')
    );
  }, [systemUsers]);

  const resolveUserName = (userId: string) => {
    const match = systemUsers.find((u) => u.id === userId);
    if (match) return match.name;
    if (userId === activeActor.id) return activeActor.name;
    return userId.replace(/^user-/, '');
  };

  // Fetch projects from server
  const fetchProjects = async () => {
    if (!isAcceptedUser || !activeActor.id) return;
    setLoading(true);
    setWorkspaceError(null);
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
        setWorkspaceError('Unauthorized access: Project Management is available only for accepted KGEC Robotics society members.');
      } else {
        const data = await res.json().catch(() => ({}));
        setWorkspaceError(data.error || `Unable to load projects (HTTP ${res.status}).`);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setWorkspaceError('Server connection issue. Could not load projects workspace.');
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
  const isAssignedMentor = useMemo(() => {
    if (!selectedProject) return false;
    return selectedProject.mentorIds.includes(activeActor.id);
  }, [selectedProject, activeActor.id]);

  const isAssignedMember = useMemo(() => {
    if (!selectedProject) return false;
    return selectedProject.memberIds.includes(activeActor.id);
  }, [selectedProject, activeActor.id]);

  // URL Scheme live validation helper
  const validateUrlFeedback = (url: string, type: 'drive' | 'git') => {
    if (!url.trim()) return null;
    let normalized = url.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }
    try {
      const parsed = new URL(normalized);
      const host = parsed.hostname.toLowerCase();
      if (type === 'drive') {
        const isDrive = host.includes('drive.google.com') || host.includes('docs.google.com');
        return isDrive ? { valid: true } : { valid: false, message: 'Must be a Google Drive or Google Docs URL' };
      }
      if (type === 'git') {
        const isGit = host.includes('github.com') || host.includes('gitlab.com') || host.includes('bitbucket.org');
        return isGit ? { valid: true } : { valid: false, message: 'Must be a GitHub or Git repository URL' };
      }
    } catch {
      return { valid: false, message: 'Invalid URL format' };
    }
    return null;
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

  // 2. Mentor / Admin Edit Project Details
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
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
        showToast('Project details updated successfully');
        setIsEditingDetails(false);
        await fetchProjects();
      } else {
        const errMsg = data.error || 'Failed to update details';
        setWorkspaceError(errMsg);
        showToast(errMsg);
      }
    } catch {
      setWorkspaceError('Server connection failed');
      showToast('Server connection failed');
    }
  };

  // 3. Mentor / Admin Update Team Assignments
  const handleUpdateTeam = async (mentorIds: string[], memberIds: string[]) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/pm/projects/${selectedProject.id}/team`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify({ mentorIds, memberIds }),
      });
      const data = await res.json().catch(() => ({ error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        showToast('Team roster updated successfully');
        await fetchProjects();
      } else {
        const errMsg = data.error || 'Failed to update team assignments';
        setWorkspaceError(errMsg);
        showToast(errMsg);
      }
    } catch {
      setWorkspaceError('Server connection failed');
      showToast('Server connection failed');
    }
  };

  // 4. Mentor Update Phase Deadlines & Requirements
  const handleSavePhaseConfig = async (phaseId: string) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/pm/projects/${selectedProject.id}/phases/${phaseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify(phaseEditForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Phase deadline and requirements updated');
        setEditingPhaseId(null);
        await fetchProjects();
      } else {
        showToast(data.error || 'Failed to update phase settings');
      }
    } catch {
      showToast('Server connection failed');
    }
  };

  // 5. Team Member Submit Work Deliverables
  const handleSubmitDeliverables = async (phaseId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (!submissionForm.driveUrl && !submissionForm.gitUrl && !submissionForm.notes.trim()) {
      showToast('Please provide a Google Drive link, GitHub link, or submission notes.');
      return;
    }

    if (submissionForm.driveUrl) {
      const check = validateUrlFeedback(submissionForm.driveUrl, 'drive');
      if (check && !check.valid) {
        showToast(check.message || 'Invalid Drive URL');
        return;
      }
    }

    if (submissionForm.gitUrl) {
      const check = validateUrlFeedback(submissionForm.gitUrl, 'git');
      if (check && !check.valid) {
        showToast(check.message || 'Invalid GitHub URL');
        return;
      }
    }

    try {
      const res = await fetch(`/api/pm/projects/${selectedProject.id}/phases/${phaseId}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': activeActor.id,
          'x-user-role': activeActor.role,
          'x-user-name': activeActor.name,
        },
        body: JSON.stringify(submissionForm),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Deliverables submitted successfully! Queued for mentor evaluation.');
        setSubmissionForm({ driveUrl: '', gitUrl: '', notes: '' });
        await fetchProjects();
      } else {
        showToast(data.error || 'Submission failed');
      }
    } catch {
      showToast('Server connection failed');
    }
  };

  // 6. Mentor Review Submission (Approve or Request Changes)
  const handleReviewSubmission = async (phaseId: string, submissionId: string) => {
    if (!selectedProject) return;
    try {
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
          body: JSON.stringify(reviewForm),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          reviewForm.decision === 'approved'
            ? 'Phase approved! Next engineering phase is now unlocked.'
            : 'Changes requested. Current phase remains open for revision.'
        );
        setReviewForm({ decision: 'approved', feedback: '' });
        await fetchProjects();
      } else {
        showToast(data.error || 'Review submission failed');
      }
    } catch {
      showToast('Server connection failed');
    }
  };

  // 7. Admin Delete Project Permanently (Confirmed with Project Title)
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

  // Refresh user profile status check
  const handleCheckApprovalStatus = async () => {
    if (!googleUser?.email) return;
    setCheckingStatus(true);
    try {
      const updated = await refreshUserProfile(googleUser.email);
      if (updated && updated.status === 'approved') {
        showToast('Congratulations! Your application is approved. Welcome to Project Management!');
      } else {
        showToast('Status check: Application is still under review by the Executive Committee.');
      }
    } catch {
      showToast('Unable to reach server. Please try again.');
    } finally {
      setCheckingStatus(false);
    }
  };

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
  // AUTHENTICATED & ACCEPTED MEMBER WORKSPACE PAGE
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#111A10] text-[#1F2B1D] dark:text-[#F4EFE6] flex flex-col antialiased transition-colors duration-300">
      {/* Top Navigation Bar with Real Verified Identity Card */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#152014]/95 backdrop-blur-md border-b border-[#243324]/10 dark:border-white/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold text-[#3A4B37] dark:text-[#CBD7C7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Society Portal</span>
          </button>

          <span className="text-[#243324]/20 dark:text-white/20 hidden sm:inline" aria-hidden="true">/</span>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-[#1F2B1D] dark:text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Project Management</span>
            </h1>
            <p className="text-[11px] text-[#526340] dark:text-[#9FB19A] hidden md:block">
              R&amp;D · Prototyping · Documentation Sequential Workflow
            </p>
          </div>
        </div>

        {/* Real User Identity & Theme Toggle (No Mock Persona Switcher) */}
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
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#3A4B37]" />}
          </button>
        </div>
      </header>

      {/* Role Notice Strip */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/15 px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <span className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Workspace &mdash; Project Creation, Team Assignment &amp; System Audits</span>
            </span>
          ) : isAssignedMentor ? (
            <span className="font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span>Assigned Mentor Workspace &mdash; Milestone Reviews &amp; Phase Approvals</span>
            </span>
          ) : isAssignedMember ? (
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assigned Team Member Workspace &mdash; Deliverable Submissions &amp; Feedback</span>
            </span>
          ) : (
            <span className="font-semibold text-[#526340] dark:text-[#CBD7C7] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-500" />
              <span>Society Member View</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#526340] dark:text-[#A3B59E]">
          <span>3 Phases: R&amp;D $\rightarrow$ Prototyping $\rightarrow$ Documentation</span>
          <span aria-hidden="true">·</span>
          <span>Drive &amp; GitHub Links Only</span>
        </div>
      </div>

      {/* Main Page Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-4">
        {/* Inline Error Banner Alert */}
        {workspaceError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-900 dark:text-red-200 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span className="font-semibold text-[#1F2B1D] dark:text-red-200">{workspaceError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setWorkspaceError(null);
                  fetchProjects();
                }}
                className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceError(null)}
                className="p-1 rounded-md hover:bg-red-500/20 text-red-700 dark:text-red-300 cursor-pointer"
                aria-label="Dismiss error banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 flex-1">
          {/* Left Column: Projects Catalog List */}
        <div className="w-full lg:w-84 shrink-0 flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3">
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
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-[#FAF7F0] dark:bg-[#10170F] border border-[#243324]/15 dark:border-white/15 text-xs placeholder:text-[#526340]/60"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#FAF7F0] dark:bg-[#10170F] border border-[#243324]/10 dark:border-white/10 text-xs">
              {(['all', 'active', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`flex-1 py-1 rounded-md capitalize font-medium transition-colors cursor-pointer text-center ${
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
              <div className="p-8 text-center text-xs text-[#526340] flex items-center justify-center gap-2 bg-white dark:bg-[#162114] rounded-xl border border-[#243324]/10 dark:border-white/10">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Loading projects...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#526340] dark:text-[#A3B59E] bg-white dark:bg-[#162114] rounded-xl border border-dashed border-[#243324]/20 dark:border-white/15 space-y-2">
                <FolderGit2 className="w-8 h-8 mx-auto text-emerald-600/40" />
                <p className="font-semibold text-sm text-[#1F2B1D] dark:text-white">
                  No projects found
                </p>
                <p className="text-[11px] leading-relaxed text-[#526340] dark:text-[#9FB19A]">
                  {isAdmin
                    ? "Click 'Create Project' above to initialize a new robotics build with R&D, Prototyping, and Documentation phases."
                    : 'No projects currently assigned to your account.'}
                </p>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Project</span>
                  </button>
                )}
              </div>
            ) : (
              filteredProjects.map((p) => {
                const isSelected = selectedProject?.id === p.id;
                const completedPhasesCount = (p.phases || []).filter((ph) => ph.status === 'approved').length;
                const hasLateSubmission = (p.phases || []).some((ph) =>
                  (ph.submissions || []).some((s) => s.isLate)
                );

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
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
                        Phase: <strong>{completedPhasesCount}/3 approved</strong>
                      </span>

                      {hasLateSubmission && (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 text-[10.5px]">
                          <Clock className="w-3 h-3" />
                          <span>Late Submissions</span>
                        </span>
                      )}
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
              {/* Project Title Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#526340] dark:text-[#A3B59E]">
                      <span className="font-mono font-bold">PROJECT ID: {selectedProject.id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize font-semibold text-emerald-700 dark:text-emerald-300">
                        {selectedProject.status === 'completed' ? '🏆 Completed' : '⚡ In Progress'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#1F2B1D] dark:text-white">
                      {selectedProject.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Actions for Authorized Roles */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(isAdmin || isAssignedMentor) && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditDetailsForm({
                              title: selectedProject.title,
                              description: selectedProject.description,
                            });
                            setIsEditingDetails(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                          <span>Edit Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsManagingTeam(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold cursor-pointer"
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Project</span>
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
                          <span
                            key={mId}
                            className="text-xs font-medium text-blue-900 dark:text-blue-300"
                          >
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
                          <span
                            key={mId}
                            className="text-xs font-medium text-emerald-900 dark:text-emerald-300"
                          >
                            {resolveUserName(mId)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-PHASE SEQUENTIAL TIMELINE */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>3-Phase Sequential Workflow</span>
                  </h3>
                  <span className="text-xs text-[#526340] dark:text-[#A3B59E]">
                    Sequential approval unlocks next stage
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(selectedProject.phases || []).map((phase) => {
                    const phaseLabels: Record<ProjectPhaseType, { title: string; subtitle: string }> = {
                      rd: { title: '1. R&D Phase', subtitle: 'Research, Math & Simulation' },
                      prototyping: { title: '2. Prototyping Phase', subtitle: 'CAD, CNC & Hardware Testing' },
                      documentation: { title: '3. Documentation Phase', subtitle: 'Final Reports & Verification' },
                    };

                    const info = phaseLabels[phase.phaseType];
                    const isApproved = phase.status === 'approved';
                    const isSubmitted = phase.status === 'submitted';
                    const isChangesRequested = phase.status === 'changes_requested';
                    const isInProgress = phase.status === 'in_progress';
                    const isDeadlinePassed = new Date() > new Date(phase.deadline);

                    return (
                      <div
                        key={phase.id}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all space-y-3 ${
                          isApproved
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-500/40'
                            : isSubmitted
                            ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-500/40'
                            : isChangesRequested
                            ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/40'
                            : isInProgress
                            ? 'bg-white dark:bg-[#1A2619] border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                            : 'bg-neutral-100/60 dark:bg-white/5 border-neutral-300 dark:border-white/10 opacity-70'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-sm text-[#1F2B1D] dark:text-white">
                              {info.title}
                            </h4>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-tight text-[#526340] dark:text-[#CBD7C7]">
                              {phase.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#526340] dark:text-[#9FB19A]">
                            {info.subtitle}
                          </p>
                        </div>

                        {/* Requirements */}
                        <div className="p-2.5 rounded-lg bg-white/80 dark:bg-black/20 border border-[#243324]/10 dark:border-white/10 space-y-1 text-xs">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#526340] dark:text-[#A3B59E]">
                            Requirements Checklist:
                          </span>
                          <p className="text-[11px] text-[#3F543C] dark:text-[#CBD7C7] line-clamp-3 leading-relaxed">
                            {phase.requirements}
                          </p>
                        </div>

                        {/* Deadline & Indicators */}
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-[#526340] dark:text-[#A3B59E]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Deadline:</span>
                            </span>
                            <strong className="font-mono">
                              {new Date(phase.deadline).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </strong>
                          </div>

                          {!isApproved && isDeadlinePassed && (
                            <div className="p-1.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[10.5px] flex items-center gap-1 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Late warning: Deadline has passed!</span>
                            </div>
                          )}

                          {isApproved && phase.approvedBy && (
                            <div className="p-1.5 rounded-md bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 text-[10.5px] flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Approved by {resolveUserName(phase.approvedBy)}</span>
                            </div>
                          )}
                        </div>

                        {/* Mentor / Admin Configure Button */}
                        {(isAdmin || isAssignedMentor) && !isApproved && (
                          <div className="pt-2 border-t border-[#243324]/10 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setPhaseEditForm({
                                  deadline: phase.deadline.slice(0, 10),
                                  requirements: phase.requirements,
                                });
                                setEditingPhaseId(phase.id);
                              }}
                              className="w-full py-1.5 px-2 rounded-lg border border-[#243324]/15 dark:border-white/15 hover:bg-[#243324]/8 dark:hover:bg-white/8 text-xs font-semibold text-[#526340] dark:text-[#CBD7C7] cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Configure Deadline / Reqs</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE PHASE WORKSPACE CONSOLE */}
              {(() => {
                const currentPhase = (selectedProject.phases || []).find(
                  (p) => p.status === 'in_progress' || p.status === 'submitted' || p.status === 'changes_requested'
                ) || (selectedProject.phases || [])[0];

                if (!currentPhase) return null;

                const submissions = currentPhase.submissions || [];
                const latestSubmission = submissions[0] || null;

                return (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#243324]/10 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <h3 className="font-bold text-base text-[#1F2B1D] dark:text-white">
                          Current Focus: {currentPhase.phaseType.toUpperCase()} Phase Workspace
                        </h3>
                      </div>

                      <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-emerald-300">
                        Status: {currentPhase.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Feedback Notice from Mentor if changes requested */}
                    {currentPhase.status === 'changes_requested' && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                          <AlertCircle className="w-4 h-4" />
                          <span>Mentor Revision Request: Changes Required</span>
                        </div>
                        {latestSubmission?.reviews && latestSubmission.reviews.length > 0 && (
                          <p className="text-xs text-[#3F543C] dark:text-[#CBD7C7] leading-relaxed pl-6">
                            &ldquo;{latestSubmission.reviews[0].feedback}&rdquo; &mdash;{' '}
                            <strong>{resolveUserName(latestSubmission.reviews[0].reviewedBy)}</strong>
                          </p>
                        )}
                      </div>
                    )}

                    {/* WORKSPACE SUBMISSION CONSOLE */}
                    {(isAdmin || isAssignedMentor || isAssignedMember) && (currentPhase.status === 'in_progress' || currentPhase.status === 'changes_requested') && (
                      <form
                        onSubmit={(e) => handleSubmitDeliverables(currentPhase.id, e)}
                        className="p-4 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/12 dark:border-white/10 space-y-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
                            <FileCode className="w-4 h-4 text-emerald-600" />
                            <span>
                              {currentPhase.status === 'changes_requested' ? 'Resubmit Work Deliverables' : 'Submit Phase Deliverables'}
                            </span>
                          </span>
                          <span className="text-[11px] text-[#526340] dark:text-[#A3B59E]">
                            External Google Drive &amp; GitHub links only
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1 text-xs">
                            <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                              Google Drive Folder / Document Link:
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/..."
                              value={submissionForm.driveUrl}
                              onChange={(e) => setSubmissionForm({ ...submissionForm, driveUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs font-mono"
                            />
                            {submissionForm.driveUrl && (() => {
                              const check = validateUrlFeedback(submissionForm.driveUrl, 'drive');
                              if (check && !check.valid) {
                                return <span className="text-[10px] text-red-500 font-medium block">{check.message}</span>;
                              }
                              return null;
                            })()}
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                              GitHub Code Repository Link:
                            </label>
                            <input
                              type="url"
                              placeholder="https://github.com/..."
                              value={submissionForm.gitUrl}
                              onChange={(e) => setSubmissionForm({ ...submissionForm, gitUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs font-mono"
                            />
                            {submissionForm.gitUrl && (() => {
                              const check = validateUrlFeedback(submissionForm.gitUrl, 'git');
                              if (check && !check.valid) {
                                return <span className="text-[10px] text-red-500 font-medium block">{check.message}</span>;
                              }
                              return null;
                            })()}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                            Progress Notes / Summary of Work:
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Outline deliverables completed, test outcomes, or revisions addressed..."
                            value={submissionForm.notes}
                            onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Deliverables to Mentor</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* MENTOR / ADMIN REVIEW CONSOLE */}
                    {(isAdmin || isAssignedMentor) && currentPhase.status === 'submitted' && latestSubmission && (
                      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border-2 border-blue-500/30 space-y-3.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-950 dark:text-blue-200 text-xs flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-blue-600" />
                            <span>Submission Awaiting Your Review</span>
                          </span>
                          <span className="text-[11px] text-[#526340] dark:text-[#A3B59E]">
                            By {latestSubmission.submittedByName} on{' '}
                            {new Date(latestSubmission.submittedAt).toLocaleString()}
                          </span>
                        </div>

                        {/* External Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {latestSubmission.driveUrl && (
                            <a
                              href={latestSubmission.driveUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-3 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/10 dark:border-white/10 hover:border-emerald-500 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <FolderGit2 className="w-4 h-4 shrink-0" />
                                <span className="truncate">Open Google Drive Submissions</span>
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          )}

                          {latestSubmission.gitUrl && (
                            <a
                              href={latestSubmission.gitUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-3 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/10 dark:border-white/10 hover:border-emerald-500 flex items-center justify-between text-xs text-indigo-800 dark:text-indigo-300 font-semibold"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <GitBranch className="w-4 h-4 shrink-0" />
                                <span className="truncate">Inspect GitHub Repository</span>
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          )}
                        </div>

                        {latestSubmission.notes && (
                          <div className="p-3 rounded-lg bg-white/70 dark:bg-black/20 border border-[#243324]/10 dark:border-white/10 text-xs">
                            <span className="text-[10px] font-mono text-[#526340] dark:text-[#A3B59E] block mb-0.5">
                              Member Notes:
                            </span>
                            <p className="text-[#3F543C] dark:text-[#CBD7C7]">
                              {latestSubmission.notes}
                            </p>
                          </div>
                        )}

                        {/* Review Feedback & Decision Controls */}
                        <div className="space-y-2 pt-2 border-t border-blue-500/20">
                          <label className="font-semibold text-blue-950 dark:text-blue-200 block">
                            Mentor Written Feedback:
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Write constructive evaluation, corrections, or approval notes..."
                            value={reviewForm.feedback}
                            onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#162114] border border-[#243324]/15 dark:border-white/15 text-xs"
                          />

                          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setReviewForm({ ...reviewForm, decision: 'changes_requested' });
                                handleReviewSubmission(currentPhase.id, latestSubmission.id);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Request Changes</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setReviewForm({ ...reviewForm, decision: 'approved' });
                                handleReviewSubmission(currentPhase.id, latestSubmission.id);
                              }}
                              className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Phase &amp; Advance</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBMISSIONS HISTORY */}
                    <div className="space-y-2.5 pt-2 border-t border-[#243324]/10 dark:border-white/10 text-xs">
                      <span className="font-mono font-bold uppercase tracking-wider text-[#526340] dark:text-[#A3B59E] block">
                        Submission Revisions History ({submissions.length})
                      </span>

                      {submissions.length === 0 ? (
                        <p className="text-xs text-[#526340] py-1 italic">
                          No submissions recorded yet for this phase.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {submissions.map((sub, sIdx) => (
                            <div
                              key={sub.id}
                              className="p-3 rounded-xl bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10 dark:border-white/10 space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#1F2B1D] dark:text-white">
                                    Revision #{submissions.length - sIdx} &mdash; {sub.submittedByName}
                                  </span>
                                  {sub.isLate && (
                                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                                      (LATE)
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10.5px] font-mono text-[#526340] dark:text-[#8E9F89]">
                                  {new Date(sub.submittedAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-3 text-[11px]">
                                {sub.driveUrl && (
                                  <a
                                    href={sub.driveUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                                  >
                                    <FolderGit2 className="w-3 h-3" />
                                    <span>Google Drive</span>
                                  </a>
                                )}
                                {sub.gitUrl && (
                                  <a
                                    href={sub.gitUrl}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-semibold hover:underline"
                                  >
                                    <GitBranch className="w-3 h-3" />
                                    <span>GitHub Repo</span>
                                  </a>
                                )}
                              </div>

                              {sub.notes && (
                                <p className="text-[11px] text-[#4A5D44] dark:text-[#CBD7C7] italic">
                                  &ldquo;{sub.notes}&rdquo;
                                </p>
                              )}

                              {/* Associated Reviews */}
                              {sub.reviews && sub.reviews.length > 0 && (
                                <div className="pt-2 border-t border-[#243324]/8 dark:border-white/8 space-y-1.5 pl-3 border-l-2 border-blue-500/40">
                                  {sub.reviews.map((rev) => (
                                    <div key={rev.id} className="text-[11px] space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`font-bold ${
                                            rev.decision === 'approved' ? 'text-emerald-600' : 'text-amber-600'
                                          }`}
                                        >
                                          {rev.decision === 'approved' ? '✓ Approved' : '↺ Changes Requested'}
                                        </span>
                                        <span className="text-[#526340] dark:text-[#8E9F89]">
                                          by {resolveUserName(rev.reviewedBy)} ({new Date(rev.reviewedAt).toLocaleDateString()})
                                        </span>
                                      </div>
                                      {rev.feedback && (
                                        <p className="text-[#3F543C] dark:text-[#CBD7C7]">
                                          {rev.feedback}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* PROJECT AUDIT & ACTIVITY LOG */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#162114] border border-[#243324]/12 dark:border-white/10 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#243324]/10 dark:border-white/10">
                  <h3 className="font-bold uppercase tracking-wider text-[#1F2B1D] dark:text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Project Audit Trail &amp; Activity Log</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#526340] dark:text-[#8E9F89]">
                    Auditable Records
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedProject.activities || []).length === 0 ? (
                    <p className="text-xs text-[#526340] py-2">No activity logged yet.</p>
                  ) : (
                    (selectedProject.activities || []).map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/8 dark:border-white/8 flex items-start justify-between gap-3 text-[11px]"
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-[#1F2B1D] dark:text-white">
                            {act.details}
                          </span>
                          <span className="text-[#526340] dark:text-[#8E9F89] block text-[10px]">
                            Actor: {act.actorName || resolveUserName(act.actorId)}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#526340] dark:text-[#A3B59E] shrink-0">
                          {new Date(act.createdAt).toLocaleDateString()}
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
                  : 'Select an active robotics project from the left catalog to review phases, deadlines, and submissions.'}
              </p>
              {isAdmin && projects.length === 0 && (
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
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
                <span>Create New Robotics Project</span>
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
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs font-semibold"
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
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 dark:border-white/15 text-xs"
                />
              </div>

              {/* Mentors Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                    Assign Lead Mentors (Faculty / Wing Leads):
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Optional</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMentors.length === 0 ? (
                    <span className="text-[11px] text-[#526340] italic">No approved mentors in system (Can be added later)</span>
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
                    Assign Team Members (Engineers / Interns):
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Optional</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto p-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMembers.length === 0 ? (
                    <span className="text-[11px] text-[#526340] italic">No approved members in system</span>
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
                  className="px-3.5 py-1.5 rounded-lg border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
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
              This action permanently purges the project &ldquo;{projectToDelete.title}&rdquo;, its 3 phases, and all submissions from the database.
            </p>

            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs space-y-1.5">
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
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E150D] border border-red-500/30 text-xs mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#243324]/10">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationInput.trim() !== projectToDelete.title.trim()}
                onClick={handleDeleteProject}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Permanently Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 3: MENTOR EDIT DETAILS */}
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
                <span>Edit Project Details (Mentor)</span>
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
              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editDetailsForm.title}
                  onChange={(e) => setEditDetailsForm({ ...editDetailsForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs font-semibold"
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
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL 4: MENTOR MANAGE TEAM */}
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
                <span>Manage Team Assignments</span>
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
              <div className="space-y-1.5">
                <span className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Mentors:
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto p-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMentors.map((m) => {
                    const isAssigned = selectedProject.mentorIds.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 cursor-pointer text-xs py-0.5">
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selectedProject.mentorIds, m.id]
                              : selectedProject.mentorIds.filter((id) => id !== m.id);
                            handleUpdateTeam(next, selectedProject.memberIds);
                          }}
                          className="rounded text-blue-600"
                        />
                        <span>{m.name} ({m.department || m.role})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Team Members:
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto p-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/10">
                  {eligibleMembers.map((m) => {
                    const isAssigned = selectedProject.memberIds.includes(m.id);
                    return (
                      <label key={m.id} className="flex items-center gap-2 cursor-pointer text-xs py-0.5">
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...selectedProject.memberIds, m.id]
                              : selectedProject.memberIds.filter((id) => id !== m.id);
                            handleUpdateTeam(selectedProject.mentorIds, next);
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span>{m.name} ({m.department || m.role})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setIsManagingTeam(false)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL 5: MENTOR CONFIGURE PHASE DEADLINE & REQUIREMENTS */}
      {editingPhaseId && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-[#182417] text-[#1F2B1D] dark:text-[#F4EFE6] rounded-2xl border border-[#243324]/15 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#243324]/10">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Configure Phase Settings (Mentor)</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingPhaseId(null)}
                className="p-1 rounded-md text-[#526340] hover:bg-[#243324]/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Phase Deadline Date (UTC):
                </label>
                <input
                  type="date"
                  value={phaseEditForm.deadline}
                  onChange={(e) => setPhaseEditForm({ ...phaseEditForm, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold block text-[#526340] dark:text-[#A3B59E]">
                  Phase Engineering Requirements Checklist:
                </label>
                <textarea
                  rows={4}
                  value={phaseEditForm.requirements}
                  onChange={(e) => setPhaseEditForm({ ...phaseEditForm, requirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF7F0] dark:bg-[#0E150D] border border-[#243324]/15 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#243324]/10">
                <button
                  type="button"
                  onClick={() => setEditingPhaseId(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#243324]/15 hover:bg-[#243324]/10 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePhaseConfig(editingPhaseId)}
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
