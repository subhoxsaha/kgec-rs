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
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            {googleUser?.picture ? (
              <img
                src={googleUser.picture}
                alt={googleUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-500/40 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                  KGEC Robotics Clearance
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Roster Form
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {googleUser ? (
                  <span>
                    Account: <span className="text-emerald-600 dark:text-emerald-300 font-semibold">{googleUser.email}</span>
                  </span>
                ) : (
                  'Complete registration to request access.'
                )}
              </p>
            </div>
          </div>
          <button
            id="close-registration-modal-btn"
            onClick={closeApplicationForm}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {/* Status Info Banners */}
            {currentUserProfile?.status === 'pending' && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong className="font-semibold">Pending Review:</strong> Your application is under review by admins.</span>
              </div>
            )}

            {currentUserProfile?.status === 'rejected' && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center gap-2 text-xs text-rose-900 dark:text-rose-200">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span><strong className="font-semibold">Revision Required:</strong> {currentUserProfile.rejectionReason || 'Please update your details.'}</span>
              </div>
            )}

            {/* Applicant Category Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Category
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="select-type-student"
                  onClick={() => {
                    setUserType('student');
                    if (role === 'teacherBody') setRole('member');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    userType === 'student'
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-500/40'
                      : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-cyan-500" />
                  Student
                </button>
                <button
                  type="button"
                  id="select-type-teacher"
                  onClick={() => {
                    setUserType('teacher');
                    setRole('teacherBody');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    userType === 'teacher'
                      ? 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-200 ring-1 ring-purple-500/40'
                      : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Faculty
                </button>
              </div>
            </div>

            {/* Role Selection Grid for Students */}
            {userType === 'student' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Requested Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['intern', 'member', 'lead', 'studentBody'] as UserRole[]).map((r) => {
                    const cfg = ROLE_CONFIG[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        id={`role-btn-${r}`}
                        onClick={() => setRole(r)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? `${cfg.bgColor} ${cfg.borderColor} ring-2 ring-emerald-500/40 font-bold`
                            : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className={`text-xs font-bold uppercase ${isSelected ? cfg.textColor : 'text-slate-700 dark:text-slate-300'}`}>
                          {cfg.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Credentials Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="reg-name-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Official full name"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Department <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reg-department-select"
                  value={department || DEPARTMENTS[0]}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {userType === 'teacher' ? 'Faculty ID' : 'Roll Number'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="reg-roll-input"
                  required
                  value={rollOrId}
                  onChange={(e) => setRollOrId(e.target.value)}
                  placeholder={userType === 'teacher' ? 'e.g. FAC/CSE/012' : 'e.g. ECE/2022/042'}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {userType === 'student' ? (
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Semester / Year</label>
                  <select
                    id="reg-year-select"
                    value={yearOrSem || '1st Year (1st/2nd Sem)'}
                    onChange={(e) => setYearOrSem(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
                  >
                    <option value="1st Year (1st/2nd Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">1st Year (Sem 1-2)</option>
                    <option value="2nd Year (3rd/4th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">2nd Year (Sem 3-4)</option>
                    <option value="3rd Year (5th/6th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">3rd Year (Sem 5-6)</option>
                    <option value="Final Year (7th/8th Sem)" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Final Year (Sem 7-8)</option>
                    <option value="M.Tech / Postgraduate" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">M.Tech / Postgrad</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Designation</label>
                  <input
                    type="text"
                    id="reg-designation-input"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Asst. Professor"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Phone</label>
                <input
                  type="tel"
                  id="reg-phone-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 Phone"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Technical Wing</label>
                <select
                  id="reg-wing-select"
                  value={technicalWing || TECHNICAL_WINGS[0]}
                  onChange={(e) => setTechnicalWing(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
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
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {userType === 'teacher' ? 'Research Expertise' : 'Skills'}
              </label>
              <input
                type="text"
                id="reg-skills-input"
                value={userType === 'teacher' ? specialization : skillsText}
                onChange={(e) => (userType === 'teacher' ? setSpecialization(e.target.value) : setSkillsText(e.target.value))}
                placeholder={userType === 'teacher' ? 'e.g. Embedded AI, Power Systems' : 'e.g. C++, ROS2, SolidWorks, PyTorch'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">LinkedIn</label>
                <input
                  type="url"
                  id="reg-linkedin-input"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="LinkedIn URL"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              {userType === 'teacher' ? (
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Google Scholar</label>
                  <input
                    type="url"
                    id="reg-scholar-input"
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    placeholder="Scholar URL"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">GitHub / Portfolio</label>
                  <input
                    type="url"
                    id="reg-github-input"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              )}
            </div>

            {/* Statement of Purpose */}
            <div className="space-y-1">
              <label className="text-xs text-slate-700 dark:text-slate-300 font-medium">Motivation / Goals</label>
              <textarea
                id="reg-sop-input"
                rows={2}
                value={statementOfPurpose}
                onChange={(e) => setStatementOfPurpose(e.target.value)}
                placeholder="Briefly state your robotics goals..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 text-xs resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800/80">
              <button
                type="button"
                id="cancel-registration-btn"
                onClick={closeApplicationForm}
                className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-registration-btn"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold flex items-center gap-1.5 text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
      )}
    </div>
    </div>
  );
};
