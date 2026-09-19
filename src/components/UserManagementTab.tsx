import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  Trash2,
  Edit3,
  Shield,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Eye,
  Check,
  X,
  AlertTriangle,
  Download,
  Building,
} from 'lucide-react';
import { useReportDataStore } from '../store/useReportDataStore';
import { UserRole, UserStatus, ROLE_CONFIG, UserApplicationProfile } from '../types';

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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
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

  const handleApprove = async (userId: string) => {
    await updateUserRoleStatus(userId, {
      status: 'approved',
      reviewedBy: googleUser?.name || 'Administrator',
    });
    showToast('User application approved successfully!');
  };

  const handleOpenReject = (userId: string) => {
    setRejectTargetId(userId);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectTargetId) return;
    await updateUserRoleStatus(rejectTargetId, {
      status: 'rejected',
      rejectionReason: rejectionReason || 'Application criteria not fulfilled for requested tier.',
      reviewedBy: googleUser?.name || 'Administrator',
    });
    setIsRejectModalOpen(false);
    setRejectTargetId(null);
    showToast('Application marked as rejected.');
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRoleStatus(userId, {
      role: newRole,
      reviewedBy: googleUser?.name || 'Administrator',
    });
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete application for ${userName}?`)) {
      await deleteUser(userId);
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    }
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
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Society User Management & Clearance Roster
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review student registrations, assign society roles (Intern, Member, Lead, Student Body, Teacher Body), and enforce admin permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="refresh-users-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            id="export-users-btn"
            onClick={handleExportRoster}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Registered</span>
          <div className="text-2xl font-black text-white mt-1">{totalUsers}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
          <div className="text-2xl font-black text-emerald-300 mt-1">{approvedCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">{pendingCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-purple-400 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Faculty Body
          </span>
          <div className="text-2xl font-black text-purple-300 mt-1">{teacherCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-800/40 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-blue-400 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Wing Leads
          </span>
          <div className="text-2xl font-black text-blue-300 mt-1">{leadCount}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-800/40 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-teal-400 flex items-center gap-1">
            <GraduationCap className="w-3 h-3" /> Interns
          </span>
          <div className="text-2xl font-black text-teal-300 mt-1">{internCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="user-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, roll number, department, or wing..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="user-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Roles</option>
              <option value="admin" className="bg-slate-900">Admin</option>
              <option value="teacherBody" className="bg-slate-900">Teacher Body</option>
              <option value="lead" className="bg-slate-900">Lead</option>
              <option value="member" className="bg-slate-900">Member</option>
              <option value="intern" className="bg-slate-900">Intern</option>
              <option value="studentBody" className="bg-slate-900">Student Body</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <select
              id="user-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Status</option>
              <option value="approved" className="bg-slate-900">Approved</option>
              <option value="pending" className="bg-slate-900">Pending</option>
              <option value="rejected" className="bg-slate-900">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table / Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No registered users match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Applicant / Member</th>
                  <th className="py-3 px-3">Category & Department</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
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
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.picture ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate flex items-center gap-1.5">
                              {user.name}
                              {user.role === 'admin' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
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
                      <td className="py-3 px-3">
                        <div className="text-slate-300 font-medium truncate max-w-[200px]">
                          {user.department || 'KGEC Engineering'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {user.rollOrId || (user.userType === 'teacher' ? 'Faculty' : 'Student')}
                          {user.yearOrSem ? ` • ${user.yearOrSem}` : ''}
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="py-3 px-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${roleCfg.bgColor} ${roleCfg.borderColor} ${roleCfg.textColor}`}
                        >
                          <option value="admin" className="bg-slate-900 text-amber-300">Admin</option>
                          <option value="teacherBody" className="bg-slate-900 text-purple-300">Teacher Body</option>
                          <option value="lead" className="bg-slate-900 text-blue-300">Lead</option>
                          <option value="member" className="bg-slate-900 text-cyan-300">Member</option>
                          <option value="intern" className="bg-slate-900 text-teal-300">Intern</option>
                          <option value="studentBody" className="bg-slate-900 text-slate-300">Student Body</option>
                        </select>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-3">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Approved
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </td>

                      {/* Applied Date */}
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {user.appliedAt ? new Date(user.appliedAt).toLocaleDateString() : 'Active Member'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Modal */}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Inspect Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve */}
                          {!isApproved && (
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                              title="Approve Role Clearance"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {!isRejected && (
                            <button
                              onClick={() => handleOpenReject(user.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                              title="Reject Application"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Record"
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

      {/* Profile Detail Drawer / Modal */}
      {selectedUser && (
        <div
          id="user-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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
                  onClick={() => {
                    handleApprove(selectedUser.id);
                    setSelectedUser({ ...selectedUser, status: 'approved' });
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Approve Role
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Reject Application / Feedback
            </h3>
            <p className="text-xs text-slate-400">
              Specify a reason or feedback for rejecting this society application.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please register with your official @kgec.edu.in email or provide valid semester details."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
