import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
  GraduationCap,
  Briefcase,
  Shield,
  Cpu,
  Layers,
  Sparkles,
  Send,
  Phone,
  BookOpen,
  Github,
  Linkedin,
  FileText,
  Building,
  Clock,
  XCircle,
} from 'lucide-react';
import { useReportDataStore } from '../store/useReportDataStore';
import { UserRole, ROLE_CONFIG, UserApplicationProfile } from '../types';

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Applied Electronics & Instrumentation (AEIE)',
  'Master of Computer Applications (MCA)',
  'Physics / Applied Sciences',
  'Other / Interdisciplinary',
];

const TECHNICAL_WINGS = [
  'Mechatronics & Combat Robotics',
  'Autonomous AI & Computer Vision',
  'Drone Systems & Aerial Robotics',
  'Embedded Systems & IoT Hardware',
  'Software Systems & Web Architecture',
  'Operations, Sponsorships & Media',
  'General Student Body / Open-Labs',
];

export const UserRegistrationModal: React.FC = () => {
  const {
    isApplicationFormOpen,
    closeApplicationForm,
    googleUser,
    currentUserProfile,
    submitUserApplication,
    showToast,
  } = useReportDataStore();

  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [role, setRole] = useState<UserRole>('member');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [rollOrId, setRollOrId] = useState('');
  const [yearOrSem, setYearOrSem] = useState('2nd Year (4th Sem)');
  const [phone, setPhone] = useState('');
  const [technicalWing, setTechnicalWing] = useState(TECHNICAL_WINGS[0]);
  const [skillsText, setSkillsText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [scholarUrl, setScholarUrl] = useState('');
  const [designation, setDesignation] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [statementOfPurpose, setStatementOfPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Sync with current user or profile if existing
  useEffect(() => {
    if (googleUser) {
      setName(googleUser.name || '');
    }
    if (currentUserProfile) {
      setUserType(currentUserProfile.userType || 'student');
      setRole(currentUserProfile.role || (currentUserProfile.userType === 'teacher' ? 'teacherBody' : 'member'));
      setName(currentUserProfile.name || googleUser?.name || '');
      setDepartment(currentUserProfile.department || DEPARTMENTS[0]);
      setRollOrId(currentUserProfile.rollOrId || '');
      setYearOrSem(currentUserProfile.yearOrSem || '2nd Year (4th Sem)');
      setPhone(currentUserProfile.phone || '');
      setTechnicalWing(currentUserProfile.technicalWing || TECHNICAL_WINGS[0]);
      setSkillsText(currentUserProfile.skills ? currentUserProfile.skills.join(', ') : '');
      setGithubUrl(currentUserProfile.githubUrl || '');
      setLinkedinUrl(currentUserProfile.linkedinUrl || '');
      setScholarUrl(currentUserProfile.scholarUrl || '');
      setDesignation(currentUserProfile.designation || '');
      setSpecialization(currentUserProfile.specialization || '');
      setStatementOfPurpose(currentUserProfile.statementOfPurpose || '');
      
      setIsEditingProfile(currentUserProfile.status !== 'approved');
    } else {
      setIsEditingProfile(true);
    }
  }, [googleUser, currentUserProfile, isApplicationFormOpen]);

  if (!isApplicationFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserProfile?.status === 'approved') {
      showToast('Your application is already approved and locked. Role adjustments must be made via the Admin Portal.');
      return;
    }
    if (!name.trim()) {
      showToast('Please provide your full official name.');
      return;
    }
    if (!rollOrId.trim()) {
      showToast(userType === 'teacher' ? 'Please provide Employee ID / Faculty Code' : 'Please provide College Roll Number');
      return;
    }

    setIsSubmitting(true);

    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const targetRole = userType === 'teacher' ? 'teacherBody' : role;

    const payload: Partial<UserApplicationProfile> = {
      id: currentUserProfile?.id,
      email: googleUser?.email || currentUserProfile?.email || 'applicant@kgec.edu.in',
      name: name.trim(),
      picture: googleUser?.picture || currentUserProfile?.picture,
      role: targetRole,
      status: currentUserProfile?.status || 'pending',
      userType,
      department,
      rollOrId: rollOrId.trim(),
      yearOrSem: userType === 'student' ? yearOrSem : undefined,
      phone: phone.trim(),
      technicalWing,
      skills: skillsArray,
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      scholarUrl: scholarUrl.trim() || undefined,
      designation: userType === 'teacher' ? designation.trim() : undefined,
      specialization: userType === 'teacher' ? specialization.trim() : undefined,
      statementOfPurpose: statementOfPurpose.trim(),
    };

    const success = await submitUserApplication(payload);
    setIsSubmitting(false);
    if (success) {
      closeApplicationForm();
    }
  };

  // Once approved, application is locked from alteration or resubmission by the user
  const isApprovedAndCard = currentUserProfile?.status === 'approved';

  return (
    <div
      id="user-registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 dark:bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="user-registration-modal-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#0f1711] border border-slate-200 dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {googleUser?.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
                  KGEC Robotics Clearance
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Society Roster
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {googleUser ? (
                  <span>
                    Logged in as <span className="text-emerald-600 dark:text-emerald-300 font-semibold">{googleUser.email}</span>
                  </span>
                ) : (
                  'Complete student/faculty registration to request formal access permissions.'
                )}
              </p>
            </div>
          </div>
          <button
            id="close-registration-modal-btn"
            onClick={closeApplicationForm}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {isApprovedAndCard && currentUserProfile ? (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Active Status Badge Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-emerald-800 dark:text-emerald-200">
                    Society Role Clearance Verified & Active
                  </h3>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    Approved
                  </span>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-1">
                  Your application for <span className="font-semibold text-emerald-900 dark:text-emerald-100 uppercase">{currentUserProfile.role}</span> has been authenticated by the KGEC Robotics Executive Board.
                </p>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 font-medium">Official Name</span>
                <p className="font-bold text-slate-800 dark:text-white mt-0.5">{currentUserProfile.name}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Assigned Role</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 uppercase">{currentUserProfile.role}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Department</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{currentUserProfile.department || 'KGEC Engineering'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Roll / Faculty ID</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{currentUserProfile.rollOrId}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Technical Wing</span>
                <p className="font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">{currentUserProfile.technicalWing || 'Open-Labs'}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Contact Phone</span>
                <p className="font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{currentUserProfile.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Actions & Locked Notice */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Application Approved & Locked — Role managed by Admin Portal.</span>
              </div>
              <button
                type="button"
                onClick={closeApplicationForm}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Member Card
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            {/* Status Info Banners */}
            {currentUserProfile?.status === 'pending' && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Application Pending Review:</span> Your details are under evaluation by the society administrators. You may update your submitted details below if needed.
                </div>
              </div>
            )}

            {currentUserProfile?.status === 'rejected' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900 dark:text-rose-200">
                  <span className="font-bold">Application Requires Revision:</span> {currentUserProfile.rejectionReason || 'Please review your details and resubmit for clearance.'}
                </div>
              </div>
            )}

            {/* Applicant Category Switcher */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Roster Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-type-student"
                onClick={() => {
                  setUserType('student');
                  if (role === 'teacherBody') setRole('member');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  userType === 'student'
                    ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-200 shadow-sm ring-1 ring-cyan-500/40'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                Student Body
              </button>
              <button
                type="button"
                id="select-type-teacher"
                onClick={() => {
                  setUserType('teacher');
                  setRole('teacherBody');
                }}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  userType === 'teacher'
                    ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-200 shadow-sm ring-1 ring-purple-500/40'
                    : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
              >
                <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Teacher / Faculty Body
              </button>
            </div>
          </div>

          {/* Role Selection Grid for Students */}
          {userType === 'student' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Requested Tier Role
                </label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Review & Clearance by Admin
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['intern', 'member', 'lead', 'studentBody'] as UserRole[]).map((r) => {
                  const cfg = ROLE_CONFIG[r];
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      id={`role-btn-${r}`}
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? `${cfg.bgColor} ${cfg.borderColor} ring-2 ring-emerald-500/40 shadow-sm`
                          : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? cfg.textColor : 'text-slate-700 dark:text-slate-300'}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                        {cfg.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Teacher Info Box */}
          {userType === 'teacher' && (
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 flex items-start gap-3">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-900 dark:text-purple-200">
                <span className="font-bold text-purple-950 dark:text-purple-100">Faculty Advisor Clearance: </span>
                Faculty profiles receive academic advisor badges upon President clearance for project grant endorsement and lab guidance.
              </div>
            </div>
          )}

          {/* Main Credentials Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Full Official Name <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="reg-name-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Subho Saha"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Department <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <select
                id="reg-department-select"
                value={department || DEPARTMENTS[0]}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                {userType === 'teacher' ? 'Faculty ID / Employee Code' : 'College Roll Number'} <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                id="reg-roll-input"
                required
                value={rollOrId}
                onChange={(e) => setRollOrId(e.target.value)}
                placeholder={userType === 'teacher' ? 'e.g. KGEC/FAC/CSE/012' : 'e.g. ECE/2022/042'}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>

            {userType === 'student' ? (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Academic Year / Semester</label>
                <select
                  id="reg-year-select"
                  value={yearOrSem || '1st Year (1st/2nd Sem)'}
                  onChange={(e) => setYearOrSem(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                >
                  <option value="1st Year (1st/2nd Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">1st Year (1st/2nd Sem)</option>
                  <option value="2nd Year (3rd/4th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">2nd Year (3rd/4th Sem)</option>
                  <option value="3rd Year (5th/6th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">3rd Year (5th/6th Sem)</option>
                  <option value="Final Year (7th/8th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Final Year (7th/8th Sem)</option>
                  <option value="M.Tech / Postgraduate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">M.Tech / Postgraduate</option>
                  <option value="Alumni / Mentor" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Alumni / Mentor</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Faculty Designation</label>
                <input
                  type="text"
                  id="reg-designation-input"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor / Head of Dept"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                id="reg-phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Primary Technical Wing
              </label>
              <select
                id="reg-wing-select"
                value={technicalWing || TECHNICAL_WINGS[0]}
                onChange={(e) => setTechnicalWing(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
              >
                {TECHNICAL_WINGS.map((w) => (
                  <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Technical Skills & Fields */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {userType === 'teacher' ? 'Research Fields & Core Expertise' : 'Key Technical Skills'}
              </label>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Comma-separated</span>
            </div>
            <input
              type="text"
              id="reg-skills-input"
              value={userType === 'teacher' ? specialization : skillsText}
              onChange={(e) => (userType === 'teacher' ? setSpecialization(e.target.value) : setSkillsText(e.target.value))}
              placeholder={
                userType === 'teacher'
                  ? 'e.g. Embedded AI, Swarm Robotics, Power Systems'
                  : 'e.g. C++, STM32, ROS2, SolidWorks, PyTorch, PCB Design'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
            />
          </div>

          {/* Social Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                id="reg-linkedin-input"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>

            {userType === 'teacher' ? (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  Google Scholar / Research Profile
                </label>
                <input
                  type="url"
                  id="reg-scholar-input"
                  value={scholarUrl}
                  onChange={(e) => setScholarUrl(e.target.value)}
                  placeholder="https://scholar.google.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-purple-500 text-xs"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  GitHub / Portfolio Link
                </label>
                <input
                  type="url"
                  id="reg-github-input"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            )}
          </div>

          {/* Statement of Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Statement of Purpose / Project Goals
            </label>
            <textarea
              id="reg-sop-input"
              rows={2}
              value={statementOfPurpose}
              onChange={(e) => setStatementOfPurpose(e.target.value)}
              placeholder="Briefly state your robotics goals, past project work, or motivation for joining this technical wing..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800/80">
            <button
              type="button"
              id="cancel-registration-btn"
              onClick={closeApplicationForm}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-registration-btn"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-400 dark:hover:to-teal-400 text-white dark:text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/40 transition-all text-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting Application...' : 'Submit Clearance Request'}
            </button>
          </div>
        </form>
      )}
    </div>
    </div>
  );
};
