import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Trash2,
  Shield,
  GraduationCap,
  Briefcase,
  Mail,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  X,
  AlertTriangle,
  Download,
  UserCheck,
  UserX,
  Sparkles,
} from 'lucide-react';
import { useReportDataStore } from '../store/useReportDataStore';
import { UserRole, UserStatus, ROLE_CONFIG, UserApplicationProfile } from '../types';
import { getUserAvatarUrl } from '../utils/avatarUtils';

export const UserManagementTab: React.FC = () => {
  const {
    users,
    fetchUsersList,
    updateUserRoleStatus,
    deleteUser,
    showToast,
    googleUser,
  } = useReportDataStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserApplicationProfile | null>(null);

  // Confirmation Modals State
  const [approveTarget, setApproveTarget] = useState<UserApplicationProfile | null>(null);
  const [approveSelectedRole, setApproveSelectedRole] = useState<UserRole>('member');

  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    user: UserApplicationProfile;
    newRole: UserRole;
  } | null>(null);

  const [rejectTarget, setRejectTarget] = useState<UserApplicationProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [deleteTargetUser, setDeleteTargetUser] = useState<UserApplicationProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsersList();
    setIsRefreshing(false);
    showToast('User roster refreshed from database');
  };

  // 1. Approve Handler with Confirmation
  const handleOpenApproveModal = (user: UserApplicationProfile) => {
    setApproveTarget(user);
    setApproveSelectedRole(user.role || 'member');
  };

  const handleConfirmApprove = async () => {
    if (!approveTarget) return;
    await updateUserRoleStatus(approveTarget.id, {
      status: 'approved',
      role: approveSelectedRole,
      reviewedBy: googleUser?.name || 'Administrator',
    });
    showToast(`Approved application for ${approveTarget.name} as ${ROLE_CONFIG[approveSelectedRole]?.label || approveSelectedRole}.`);
    if (selectedUser?.id === approveTarget.id) {
      setSelectedUser({ ...selectedUser, status: 'approved', role: approveSelectedRole });
    }
    setApproveTarget(null);
  };

  // 2. Role Change Handler with Confirmation
  const handlePromptRoleChange = (user: UserApplicationProfile, newRole: UserRole) => {
    if (user.role === newRole) return;
    setRoleChangeTarget({ user, newRole });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeTarget) return;
    const { user, newRole } = roleChangeTarget;
    await updateUserRoleStatus(user.id, {
      role: newRole,
      reviewedBy: googleUser?.name || 'Administrator',
    });
    showToast(`Updated role for ${user.name} to ${ROLE_CONFIG[newRole]?.label || newRole}.`);
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
    setRoleChangeTarget(null);
  };

  // 3. Reject Handler with Confirmation
  const handleOpenRejectModal = (user: UserApplicationProfile) => {
    setRejectTarget(user);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    await updateUserRoleStatus(rejectTarget.id, {
      status: 'rejected',
      rejectionReason: rejectionReason || 'Application criteria not fulfilled.',
      reviewedBy: googleUser?.name || 'Administrator',
    });
    showToast(`Application for ${rejectTarget.name} rejected.`);
    if (selectedUser?.id === rejectTarget.id) {
      setSelectedUser({ ...selectedUser, status: 'rejected' });
    }
    setRejectTarget(null);
  };

  // 4. Delete Handler with Confirmation
  const handlePromptDelete = (user: UserApplicationProfile) => {
    setDeleteTargetUser(user);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUser) return;
    setIsDeleting(true);
    const targetId = deleteTargetUser.id || deleteTargetUser.email;
    await deleteUser(targetId);
    if (selectedUser?.id === targetId || selectedUser?.email === deleteTargetUser.email) {
      setSelectedUser(null);
    }
    setIsDeleting(false);
    setDeleteTargetUser(null);
  };

  const handleExportRoster = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kgec_robotics_roster_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported user applications JSON.');
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.rollOrId && u.rollOrId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.technicalWing && u.technicalWing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const approvedCount = users.filter((u) => u.status === 'approved').length;
  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const teacherCount = users.filter((u) => u.role === 'teacherBody' || u.userType === 'teacher').length;
  const leadCount = users.filter((u) => u.role === 'lead').length;
  const internCount = users.filter((u) => u.role === 'intern').length;

  return (
    <div id="user-management-tab" className="space-y-6 animate-fade-in text-slate-200">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              User Roster & Security Clearance
            </h2>
          </div>
          <p className="text-xs text-slate-400 pl-11">
            Manage society registrations, verify member clearance tiers, and update executive roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="refresh-users-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700/80 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            Refresh Roster
          </button>
          <button
            id="export-users-btn"
            onClick={handleExportRoster}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-slate-400">Total Registered</span>
          <div className="text-2xl font-black text-white mt-1">{totalUsers}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{approvedCount}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-purple-400 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> Faculty Advisor
          </span>
          <div className="text-2xl font-black text-purple-300 mt-1">{teacherCount}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-800/40 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-blue-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Wing Leads
          </span>
          <div className="text-2xl font-black text-blue-300 mt-1">{leadCount}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-teal-950/20 border border-teal-800/40 flex flex-col justify-between shadow-lg">
          <span className="text-[11px] font-medium text-teal-400 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" /> Interns
          </span>
          <div className="text-2xl font-black text-teal-300 mt-1">{internCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="user-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search applicant name, email, roll number, department, or wing..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="user-role-filter"
              value={roleFilter || 'all'}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Roles</option>
              <option value="admin" className="bg-slate-900">Admin</option>
              <option value="teacherBody" className="bg-slate-900">Faculty Advisor</option>
              <option value="lead" className="bg-slate-900">Lead</option>
              <option value="member" className="bg-slate-900">Member</option>
              <option value="intern" className="bg-slate-900">Intern</option>
              <option value="studentBody" className="bg-slate-900">Student Body</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5">
            <select
              id="user-status-filter"
              value={statusFilter || 'all'}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Status</option>
              <option value="approved" className="bg-slate-900">Approved</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="rejected" className="bg-slate-900">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No registered users match your search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Member / Applicant</th>
                  <th className="py-3.5 px-3">Department & ID</th>
                  <th className="py-3.5 px-3">Assigned Role</th>
                  <th className="py-3.5 px-3">Clearance Status</th>
                  <th className="py-3.5 px-3">Applied Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((user) => {
                  const roleCfg = ROLE_CONFIG[user.role || 'studentBody'] || ROLE_CONFIG.studentBody;
                  const isApproved = user.status === 'approved';
                  const isPending = user.status === 'pending';
                  const isRejected = user.status === 'rejected';

                  return (
                    <tr key={user.id || user.email} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getUserAvatarUrl(user)}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'admin' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Roll */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-300 font-medium truncate max-w-[200px]">
                          {user.department || 'KGEC Engineering'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.rollOrId || (user.userType === 'teacher' ? 'Faculty' : 'Student')}
                          {user.yearOrSem ? ` • ${user.yearOrSem}` : ''}
                        </div>
                      </td>

                      {/* Role Selector (Triggers Confirmation) */}
                      <td className="py-3.5 px-3">
                        <select
                          value={user.role || 'studentBody'}
                          onChange={(e) => handlePromptRoleChange(user, e.target.value as UserRole)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer transition-colors ${roleCfg.bgColor} ${roleCfg.borderColor} ${roleCfg.textColor}`}
                        >
                          <option value="admin" className="bg-slate-900 text-amber-300">Admin</option>
                          <option value="teacherBody" className="bg-slate-900 text-purple-300">Faculty Advisor</option>
                          <option value="lead" className="bg-slate-900 text-blue-300">Lead</option>
                          <option value="member" className="bg-slate-900 text-cyan-300">Member</option>
                          <option value="intern" className="bg-slate-900 text-teal-300">Intern</option>
                          <option value="studentBody" className="bg-slate-900 text-slate-300">Student Body</option>
                        </select>
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-3">
                        {isApproved ? (
                          /* Approved Users: Clean Locked Active Badge (No status selector) */
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Active Member
                          </span>
                        ) : isPending ? (
                          /* Pending Applications: Amber Badge */
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            Pending Review
                          </span>
                        ) : (
                          /* Rejected Applications: Rose Badge */
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                        {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString() : 'Active Member'}
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/60"
                            title="Inspect Profile & Statement"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* For Non-Approved Users: Approve Button */}
                          {!isApproved && (
                            <button
                              type="button"
                              onClick={() => handleOpenApproveModal(user)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Approve Application"
                            >
                              <UserCheck className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}

                          {/* For Pending Users: Reject Button */}
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleOpenRejectModal(user)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reject Application"
                            >
                              <UserX className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}

                          {/* Delete User Button (Available for all) */}
                          <button
                            type="button"
                            onClick={() => handlePromptDelete(user)}
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/40 transition-colors cursor-pointer"
                            title="Delete User Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Confirm Application Approval */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Approve Society Application?</h3>
                <p className="text-xs text-slate-400">Grant member clearance and platform permissions.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1.5">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>{approveTarget.name}</span>
                <span className="text-[11px] text-slate-400">{approveTarget.email}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                {approveTarget.department || 'KGEC Engineering'} • {approveTarget.rollOrId || 'Student'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Confirm Assigned Society Role:
              </label>
              <select
                value={approveSelectedRole}
                onChange={(e) => setApproveSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="intern" className="bg-slate-900">Intern</option>
                <option value="member" className="bg-slate-900">Member</option>
                <option value="lead" className="bg-slate-900">Wing Lead</option>
                <option value="teacherBody" className="bg-slate-900">Faculty Advisor</option>
                <option value="admin" className="bg-slate-900">Administrator</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApproveTarget(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Confirm Role Change */}
      {roleChangeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Update User Role?</h3>
                <p className="text-xs text-slate-400">Modify permissions for this user record.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="font-semibold text-white">{roleChangeTarget.user.name}</div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Current Role:</span>
                <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-semibold">
                  {ROLE_CONFIG[roleChangeTarget.user.role]?.label || roleChangeTarget.user.role}
                </span>
                <span className="text-slate-500">→</span>
                <span className="text-amber-400 font-bold">
                  {ROLE_CONFIG[roleChangeTarget.newRole]?.label || roleChangeTarget.newRole}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to change the assigned clearance role for{' '}
              <span className="font-semibold text-white">{roleChangeTarget.user.name}</span> to{' '}
              <span className="font-semibold text-amber-300">
                {ROLE_CONFIG[roleChangeTarget.newRole]?.label || roleChangeTarget.newRole}
              </span>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRoleChangeTarget(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRoleChange}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                Confirm Role Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Confirm Application Rejection */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Reject Application?</h3>
                <p className="text-xs text-slate-400">Provide optional feedback for the applicant.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs">
              <div className="font-semibold text-white">{rejectTarget.name}</div>
              <div className="text-slate-400 text-[11px]">{rejectTarget.email}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Rejection Reason / Remarks:
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please register using your official @kgec.edu.in email address."
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs resize-none focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Confirm User Deletion */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete User?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="font-semibold text-white">{deleteTargetUser.name}</div>
              <div className="text-slate-400 text-[11px]">{deleteTargetUser.email}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-rose-300">{deleteTargetUser.name}</span> from the society roster and database?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteTargetUser(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isDeleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Drawer / Modal */}
      {selectedUser && (
        <div
          id="user-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={getUserAvatarUrl(selectedUser)}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {selectedUser.name}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_CONFIG[selectedUser.role]?.bgColor || 'bg-slate-800'} ${ROLE_CONFIG[selectedUser.role]?.textColor || 'text-slate-200'} ${ROLE_CONFIG[selectedUser.role]?.borderColor || 'border-slate-700'}`}>
                      {ROLE_CONFIG[selectedUser.role]?.label || selectedUser.role}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 font-medium">Department</span>
                  <p className="text-slate-200 font-semibold">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Roll / Faculty ID</span>
                  <p className="text-slate-200 font-semibold">{selectedUser.rollOrId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Primary Technical Wing</span>
                  <p className="text-cyan-400 font-semibold">{selectedUser.technicalWing || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Phone / WhatsApp</span>
                  <p className="text-slate-200">{selectedUser.phone || 'N/A'}</p>
                </div>
              </div>

              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div>
                  <span className="text-slate-400 font-medium">Technical Competencies</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedUser.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.statementOfPurpose && (
                <div className="bg-slate-800/20 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium">Statement of Purpose / Vision</span>
                  <p className="text-slate-300 mt-1 italic leading-relaxed">"{selectedUser.statementOfPurpose}"</p>
                </div>
              )}

              {/* Links */}
              <div className="flex items-center gap-3 pt-2">
                {selectedUser.githubUrl && (
                  <a
                    href={selectedUser.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedUser.linkedinUrl && (
                  <a
                    href={selectedUser.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs border border-blue-800/40"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedUser.scholarUrl && (
                  <a
                    href={selectedUser.scholarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-xs border border-purple-800/40"
                  >
                    Google Scholar <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              {selectedUser.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => {
                    handleOpenApproveModal(selectedUser);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Approve Clearance
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
