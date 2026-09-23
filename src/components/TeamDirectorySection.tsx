import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Github, GraduationCap, Edit3, Plus, User } from 'lucide-react';
import { useReportData } from '../context/ReportDataContext';
import { TeamMember } from '../types';

interface ProfileCardProps {
  member: TeamMember;
  index: number;
}

const formatRoleText = (post?: string): string => {
  if (!post || typeof post !== 'string') return 'Member';
  const mappings: Record<string, string> = {
    'Chief Faculty Advisor & Professor': 'Chief Advisor',
    'Associate Faculty Mentor & Lab In-Charge': 'Faculty Mentor',
    'Faculty Mentor (Control Systems & Mechatronics)': 'Faculty Mentor',
    'Faculty Mentor (Embedded Computing & AI)': 'Faculty Mentor',
    'President & Student Convener': 'President',
    'Vice President (Technical & Operations)': 'Vice President',
    'General Secretary': 'General Secretary',
    'Treasurer & Accounts Head': 'Treasurer',
    'Joint Convener (TECHTIX & ZYRO)': 'Joint Convener',
    'Autonomous Navigation & AI Lead': 'Autonomous Lead',
    'Combat Mechatronics & Hardware Lead': 'Combat Lead',
    'Embedded Systems & IoT Lead': 'Embedded Lead',
    'Aeromodelling & UAV Dynamics Lead': 'UAV Lead',
    'Web & Digital Platforms Lead': 'Web Lead',
    'Media, PR & Creative Design Lead': 'Media Lead',
    'Sponsorship & Event Operations Lead': 'Operations Lead',
    'School STEM Outreach & Eklavya Lead': 'Outreach Lead',
    'Robotics Systems Engineer • Former President': 'Alumni Lead',
    'Autonomous UAV Systems Lead • Former Tech Convener': 'Alumni Lead',
    'Embedded Hardware Architect • Former Hardware Lead': 'Alumni Lead',
    'Perception & Computer Vision Scientist • Former AI Lead': 'Alumni Lead',
  };
  if (mappings[post]) return mappings[post];
  const cleaned = post.replace(/\(.*?\)/g, '').replace(/[•&/]/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.slice(0, 2).join(' ') || post;
};

const DEFAULT_AVATARS: Record<string, string> = {
  teacher: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  student: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
  lead: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  alumni: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
};

const ProfileCard: React.FC<ProfileCardProps> = ({ member, index }) => {
  const roleString = member.post || (member as any).role || (member as any).designation || 'Member';
  const shortRole = formatRoleText(roleString);
  const fallbackUrl = DEFAULT_AVATARS[member.category] || DEFAULT_AVATARS.student;
  const initialUrl = member.avatarUrl || fallbackUrl;

  const [currentImgSrc, setCurrentImgSrc] = useState<string>(initialUrl);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentImgSrc(fallbackUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3) }}
      className="group flex flex-col justify-between w-full h-full overflow-hidden rounded-2xl bg-[#FAF8F5] dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/12 shadow-xs hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 select-none"
    >
      {/* Top: Portrait Image with Vignette & Inside Overlays (Role on top, Name/Info on bottom) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-900 shrink-0">
        <img
          src={currentImgSrc}
          alt={member.name || 'Team Member'}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-500 ease-out block"
        />

        {/* Bottom deep vignette for Name & Info clarity */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/80 via-40% to-transparent pointer-events-none" />

        {/* TOP: Role / Post (Plain clean text without shadow) */}
        <div className="absolute inset-x-0 top-0 p-3 sm:p-3.5 z-10 flex items-start justify-start">
          <p
            className="text-[11px] sm:text-xs font-semibold text-white tracking-tight flex items-center gap-1 leading-none select-none"
            title={roleString}
          >
            <span className="text-white font-bold opacity-90">|</span>
            <span>{shortRole}</span>
          </p>
        </div>

        {/* BOTTOM: Name & Department/Batch */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 z-10 flex flex-col justify-end text-left space-y-0.5">
          <h4 className="font-display text-sm sm:text-base font-semibold text-white leading-snug tracking-tight drop-shadow-md">
            {member.name}
          </h4>
          {member.departmentOrBatch && (
            <p className="text-[10px] sm:text-[11px] text-neutral-300 font-mono leading-tight line-clamp-2 pt-0.5 drop-shadow-xs">
              {member.departmentOrBatch}
            </p>
          )}
        </div>
      </div>

      {/* Down Side: Social Contacts OUT of picture */}
      <div className="px-3 py-2 sm:py-2.5 bg-[#FAF7F2] dark:bg-[#142013] border-t border-[#243324]/8 dark:border-white/8 flex items-center justify-center gap-2 sm:gap-2.5">
        {/* Email button */}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            title={`Email ${member.name}`}
            aria-label={`Send email to ${member.name}`}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20301F] text-[#243324] dark:text-[#E6F4E2] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center border border-[#243324]/10 dark:border-white/10 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        )}

        {/* LinkedIn button */}
        {member.linkedinUrl && (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`LinkedIn Profile of ${member.name}`}
            aria-label={`Visit LinkedIn profile of ${member.name}`}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20301F] text-[#243324] dark:text-[#E6F4E2] hover:bg-[#0077b5] hover:text-white dark:hover:bg-[#0077b5] dark:hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center border border-[#243324]/10 dark:border-white/10 shadow-2xs"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Google Scholar button (Teachers / Faculty Mentors) */}
        {member.scholarUrl && (
          <a
            href={member.scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Google Scholar Profile of ${member.name}`}
            aria-label={`Visit Google Scholar profile of ${member.name}`}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20301F] text-[#243324] dark:text-[#E6F4E2] hover:bg-[#4285F4] hover:text-white dark:hover:bg-[#4285F4] dark:hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center border border-[#243324]/10 dark:border-white/10 shadow-2xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
          </a>
        )}

        {/* GitHub button (Students, Leads, Alumni) */}
        {member.githubUrl && (
          <a
            href={member.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`GitHub Profile of ${member.name}`}
            aria-label={`Visit GitHub profile of ${member.name}`}
            className="p-1.5 sm:p-2 rounded-full bg-white dark:bg-[#20301F] text-[#243324] dark:text-[#E6F4E2] hover:bg-[#24292e] hover:text-white dark:hover:bg-[#24292e] dark:hover:text-white transition-all duration-200 hover:scale-110 flex items-center justify-center border border-[#243324]/10 dark:border-white/10 shadow-2xs"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const TeamDirectorySection: React.FC = () => {
  const { teamMembers, isAdminLoggedIn, openEditor } = useReportData();

  const teachers = teamMembers.filter((m) => m.category === 'teacher');
  const students = teamMembers.filter((m) => m.category === 'student');
  const leads = teamMembers.filter((m) => m.category === 'lead');
  const alumni = teamMembers.filter((m) => m.category === 'alumni');

  return (
    <section
      id="leadership-team-section"
      className="relative pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center bg-[#FBF9F5] dark:bg-[#131D12] text-[#243324] dark:text-[#F4EFE6] transition-colors duration-400"
    >
      <div className="max-w-6xl mx-auto w-full space-y-12 sm:space-y-16">
        
        {/* Section Main Header */}
        <div className="space-y-2 max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1F2B1D] dark:text-[#F4EFE6] font-normal leading-[1.08] tracking-tight">
            Meet Our Mentors &amp; Teams
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5D44] dark:text-[#CBD7C7] font-light leading-relaxed">
            The visionary faculty advisors, student office bearers, domain technical leads, and distinguished alumni driving robotics and engineering at KGEC.
          </p>
          {isAdminLoggedIn && (
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => openEditor('team')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
                title="Edit Leadership & Mentorship Directory in CMS"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Team &amp; Mentors</span>
              </button>
            </div>
          )}
        </div>

        {/* 1. Teacher Body Members Heading & Cards */}
        {teachers.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium tracking-tight">
                Teacher Body Members
              </h3>
              <p className="text-xs sm:text-sm text-[#657351] dark:text-[#A3B899] font-light">
                Chief faculty advisors and mentors guiding research, laboratories &amp; innovation
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {teachers.map((member, idx) => (
                <ProfileCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* 2. Student Body Members Heading & Cards */}
        {students.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium tracking-tight">
                Student Body Members
              </h3>
              <p className="text-xs sm:text-sm text-[#657351] dark:text-[#A3B899] font-light">
                Elected office bearers orchestrating society initiatives and club operations
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {students.map((member, idx) => (
                <ProfileCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* 3. Leads Heading & Cards */}
        {leads.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium tracking-tight">
                Leads
              </h3>
              <p className="text-xs sm:text-sm text-[#657351] dark:text-[#A3B899] font-light">
                Specialists heading hardware prototyping, software architectures, UAVs &amp; media
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {leads.map((member, idx) => (
                <ProfileCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* 4. Alumni Heading & Cards */}
        {alumni.length > 0 && (
          <div className="space-y-5 sm:space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-display text-lg sm:text-2xl text-[#1F2B1D] dark:text-[#F4EFE6] font-medium tracking-tight">
                Alumni
              </h3>
              <p className="text-xs sm:text-sm text-[#657351] dark:text-[#A3B899] font-light">
                Former society leaders and innovators now working across aerospace, robotics &amp; tech
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {alumni.map((member, idx) => (
                <ProfileCard key={member.id} member={member} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state if no team members */}
        {teamMembers.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-white/80 dark:bg-[#1A2619] border border-[#243324]/12 dark:border-white/12">
            <p className="text-sm text-[#526340] dark:text-[#A3B59E]">
              No team members are currently listed in the roster.
            </p>
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={() => openEditor('team')}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Members in CMS</span>
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
