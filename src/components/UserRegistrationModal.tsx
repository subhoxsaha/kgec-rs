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
    }
  }, [googleUser, currentUserProfile, isApplicationFormOpen]);

  if (!isApplicationFormOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div
      id="user-registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="user-registration-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Society User Registration
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Role-Based
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Register your credentials and request formal clearance under KGEC Robotics Society.
              </p>
            </div>
          </div>
          <button
            id="close-registration-modal-btn"
            onClick={closeApplicationForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* User Type Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Applicant Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-type-student"
                onClick={() => {
                  setUserType('student');
                  if (role === 'teacherBody') setRole('member');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  userType === 'student'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student Body
              </button>
              <button
                type="button"
                id="select-type-teacher"
                onClick={() => {
                  setUserType('teacher');
                  setRole('teacherBody');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  userType === 'teacher'
                    ? 'bg-purple-500/15 border-purple-500/50 text-purple-300 shadow-sm shadow-purple-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Teacher / Faculty Body
              </button>
            </div>
          </div>

          {/* Role Selection (If Student) */}
          {userType === 'student' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Requested Society Role</span>
                <span className="text-slate-500 text-[11px] font-normal">Requires Admin approval</span>
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
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? `${cfg.bgColor} ${cfg.borderColor} ring-1 ring-amber-400/50`
                          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? cfg.textColor : 'text-slate-300'}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {cfg.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Teacher Role Info */}
          {userType === 'teacher' && (
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-200">
                <p className="font-semibold text-purple-100">Teacher Body / Faculty Advisor Role</p>
                <p className="text-purple-300/80 mt-0.5">
                  Faculty credentials are automatically reviewed by the President/Admin. Enables research mentorship, grant endorsement, and society advisory badges.
                </p>
              </div>
            </div>
          )}

          {/* Personal & Academic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                Full Official Name *
              </label>
              <input
                type="text"
                id="reg-name-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Subho Saha / Dr. D. De"
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Department *
              </label>
              <select
                id="reg-department-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {userType === 'teacher' ? 'Faculty ID / Employee Code *' : 'College Roll Number *'}
              </label>
              <input
                type="text"
                id="reg-roll-input"
                required
                value={rollOrId}
                onChange={(e) => setRollOrId(e.target.value)}
                placeholder={userType === 'teacher' ? 'e.g. KGEC/FAC/CSE/012' : 'e.g. ECE/2022/042'}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              />
            </div>

            {userType === 'student' ? (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Academic Year / Semester</label>
                <select
                  id="reg-year-select"
                  value={yearOrSem}
                  onChange={(e) => setYearOrSem(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                >
                  <option value="1st Year (1st/2nd Sem)">1st Year (1st/2nd Sem)</option>
                  <option value="2nd Year (3rd/4th Sem)">2nd Year (3rd/4th Sem)</option>
                  <option value="3rd Year (5th/6th Sem)">3rd Year (5th/6th Sem)</option>
                  <option value="Final Year (7th/8th Sem)">Final Year (7th/8th Sem)</option>
                  <option value="M.Tech / Postgraduate">M.Tech / Postgraduate</option>
                  <option value="Alumni / Mentor">Alumni / Mentor</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Faculty Designation</label>
                <input
                  type="text"
                  id="reg-designation-input"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Associate Professor / HoD"
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Contact Phone / WhatsApp
              </label>
              <input
                type="tel"
                id="reg-phone-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                Primary Technical Wing
              </label>
              <select
                id="reg-wing-select"
                value={technicalWing}
                onChange={(e) => setTechnicalWing(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
              >
                {TECHNICAL_WINGS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Technical Skills & Specialization */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
              <span>{userType === 'teacher' ? 'Research Fields & Specialization' : 'Key Technical Skills (Comma-separated)'}</span>
              <span className="text-[11px] text-slate-500">e.g. ROS2, STM32, SolidWorks, PyTorch</span>
            </label>
            <input
              type="text"
              id="reg-skills-input"
              value={userType === 'teacher' ? specialization : skillsText}
              onChange={(e) => (userType === 'teacher' ? setSpecialization(e.target.value) : setSkillsText(e.target.value))}
              placeholder={
                userType === 'teacher'
                  ? 'e.g. Embedded AI, Swarm Robotics, Power Systems'
                  : 'e.g. Embedded C++, STM32, ROS2, SolidWorks, PCB Design'
              }
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                id="reg-linkedin-input"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs"
              />
            </div>

            {userType === 'teacher' ? (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Google Scholar / Research Profile
                </label>
                <input
                  type="url"
                  id="reg-scholar-input"
                  value={scholarUrl}
                  onChange={(e) => setScholarUrl(e.target.value)}
                  placeholder="https://scholar.google.com/..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  GitHub / Portfolio URL
                </label>
                <input
                  type="url"
                  id="reg-github-input"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs"
                />
              </div>
            )}
          </div>

          {/* Statement of Purpose */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-medium">
              Statement of Purpose / Society Interest
            </label>
            <textarea
              id="reg-sop-input"
              rows={2}
              value={statementOfPurpose}
              onChange={(e) => setStatementOfPurpose(e.target.value)}
              placeholder="Briefly describe your goals with KGEC Robotics Society, relevant past projects, or why you want to join this wing..."
              className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs resize-none"
            />
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              id="cancel-registration-btn"
              onClick={closeApplicationForm}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-registration-btn"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting Application...' : 'Submit Society Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
