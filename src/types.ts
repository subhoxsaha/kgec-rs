export interface RoboticsWing {
  id: string;
  name: string;
  leadSpecialty: string;
  members: number;
  projectsCount: number;
  podiums: number;
  description: string;
  focusAreas: string[];
  flagshipBot: string;
  hardwareStack: string;
  labLocation: string;
  // Compatibility fields for map/list renders
  borough?: string;
  hives?: number;
  sites?: number;
}

export interface LabStation {
  id: string;
  name: string;
  wing: string;
  category: string;
  activeBots: number;
  labAreaSqFt: number;
  powerBenchmarkKw: number;
  championshipWins: number;
  x: number; // percentage coordinate 0-100 on visual grid
  y: number; // percentage coordinate 0-100 on visual grid
  isKeyProject?: boolean;
  specNote?: string;
  equipmentSnippet?: string;
}

export interface BotCategoryImpact {
  category: string;
  squadSize: number;
  botsBuilt: number;
  weightClass: string;
  podiumsWon: number;
  sponsoredFundsInr: number;
  primaryRole: string;
  keySpecs: string;
}

export interface BotProject {
  id: string;
  name: string;
  codename: string;
  tagline: string;
  imageUrl?: string;
  imageAlt?: string;
  wingId: string;
  wingName: string;
  category: string;
  weightClass: string;
  status: string;
  podiumsCount: number;
  featuredAward?: string;
  description: string;
  specs: {
    dimensions?: string;
    weight: string;
    speed?: string;
    power: string;
    controller: string;
    actuatorsOrWeapon: string;
    chassisMaterial: string;
  };
  keyFeatures: string[];
  architectureSummary: string;
  iconName?: string;
}

export interface StrategicGoal {
  title: string;
  pillar: string;
  metric: string;
  description: string;
  targetDate: string;
}

export interface InnovationStory {
  title: string;
  arena: string;
  division: string;
  heroStat: string;
  statLabel: string;
  body: string;
  quote?: string;
  quoteAuthor?: string;
}

export interface EventPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

export interface SocietyMetadata {
  academicYear: string;
  establishedYear: string;
  organization: string;
  college: string;
  location: string;
  advisor: string;
  advisorTitle: string;
  president: string;
  presidentTitle: string;
  leadershipQuote: string;
  totalMembers: number;
  nationalPodiums: number;
  activeProjects: number;
  labAreaSqFt: number;
  prototypingHours: number;
  competitionsAttended: number;
  workshopsHosted: number;
  studentsTrained: number;
  sponsoredFundsInr: number;
  stemKitsDistributed: number;
  schoolStudentsMentored: number;
  
  // Dual Navbar & Footer Logos with Two Theme Options (Light & Dark)
  logo1?: string;
  logo2?: string;
  logo1Light?: string;
  logo1Dark?: string;
  logo2Light?: string;
  logo2Dark?: string;
  footerLogoLight?: string;
  footerLogoDark?: string;
  logo1Alt?: string;
  logo2Alt?: string;
  
  // Legacy aliases for seamless backwards-compatibility
  totalBees?: number;
  totalHives?: number;
  totalSites?: number;
  meadowAreaSqM?: number;
  speciesPerSite?: number;
  stormwaterLitres?: number;
  fieldTrips?: number;
  attendees?: number;
  volunteerHours?: number;
  honeyHarvestKg?: number;
  jarsDonated?: number;
  charityNumber?: string;
  founder?: string;
  founderTitle?: string;
  founderQuote?: string;
}

export interface RooftopSite {
  id: string;
  name: string;
  borough: string;
  boroughId?: string;
  category?: string;
  buildingType?: string;
  hives: number;
  areaSqM?: number;
  wildflowerAreaSqM?: number;
  honeyHarvestKg?: number;
  jarsDonated?: number;
  stormwaterLitres?: number;
  rainwaterL?: number;
  x: number;
  y: number;
  isKeyPartner?: boolean;
  floraSnippet?: string;
  partnerSnippet?: string;
  addressSnippet?: string;
  storyNote?: string;
  [key: string]: any;
}

export type TeamCategory = 'teacher' | 'student' | 'lead' | 'alumni';

export interface TeamMember {
  id: string;
  category: TeamCategory;
  name: string;
  post: string;
  departmentOrBatch?: string;
  avatarUrl: string;
  email: string;
  linkedinUrl: string;
  scholarUrl?: string; // For teachers / faculty mentors
  githubUrl?: string;  // For students / leads / alumni
  bio?: string;
  order?: number;
}

export type UserRole =
  | 'admin'
  | 'lead'
  | 'member'
  | 'intern'
  | 'studentBody'
  | 'teacherBody';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export type UserTrack = 'student' | 'teacher';

export interface UserApplicationProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  status: UserStatus;
  userType: UserTrack;
  department: string;
  phone?: string;
  
  // Student track specifics
  rollOrId?: string;
  yearOrSem?: string;
  technicalWing?: string;
  skills?: string[];
  
  // Teacher/Faculty track specifics
  designation?: string;
  specialization?: string;
  scholarUrl?: string;
  
  // Universal social & portfolio
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  statementOfPurpose?: string;
  
  // Audit & Metadata
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  lastLoginAt?: string;
}

export const ADMIN_EMAILS = [
  'subhoxsaha@gmail.com',
  'admin@kgecrobotics.com',
  'president@kgecrobotics.com',
];

export const isUserAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase().trim()).includes(email.toLowerCase().trim());
};

export interface GoogleUserProfile {
  id?: string;
  name: string;
  email: string;
  picture?: string;
  sub?: string;
  given_name?: string;
  family_name?: string;
  verified_email?: boolean;
  role?: UserRole;
  status?: UserStatus;
  profile?: UserApplicationProfile;
}

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    track: UserTrack;
  }
> = {
  admin: {
    label: 'Executive Admin',
    description: 'Full CMS access, user role approval, data sync & database controls',
    badgeBg: 'bg-amber-500/20 dark:bg-amber-500/30',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-500/40',
    bgColor: 'bg-amber-500/20 dark:bg-amber-500/30',
    textColor: 'text-amber-800 dark:text-amber-300',
    borderColor: 'border-amber-500/40',
    track: 'student',
  },
  studentBody: {
    label: 'Student Body Exec',
    description: 'Top student executive council overseeing society leadership, operations & wings',
    badgeBg: 'bg-amber-500/15 dark:bg-amber-500/25',
    badgeText: 'text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-500/30',
    bgColor: 'bg-amber-500/15 dark:bg-amber-500/25',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-500/30',
    track: 'student',
  },
  lead: {
    label: 'Wing Lead',
    description: 'Technical lead for combat robotics, AI vision, UAV, or embedded wings',
    badgeBg: 'bg-blue-500/20 dark:bg-blue-500/30',
    badgeText: 'text-blue-800 dark:text-blue-300',
    badgeBorder: 'border-blue-500/40',
    bgColor: 'bg-blue-500/20 dark:bg-blue-500/30',
    textColor: 'text-blue-800 dark:text-blue-300',
    borderColor: 'border-blue-500/40',
    track: 'student',
  },
  member: {
    label: 'Core Member',
    description: 'Active robotics hardware/software engineer and project builder',
    badgeBg: 'bg-emerald-500/20 dark:bg-emerald-500/30',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/20 dark:bg-emerald-500/30',
    textColor: 'text-emerald-800 dark:text-emerald-300',
    borderColor: 'border-emerald-500/40',
    track: 'student',
  },
  intern: {
    label: 'Apprentice / Intern',
    description: 'Junior trainee undergoing robotics mentorship, workshops & prototyping',
    badgeBg: 'bg-teal-500/20 dark:bg-teal-500/30',
    badgeText: 'text-teal-800 dark:text-teal-300',
    badgeBorder: 'border-teal-500/40',
    bgColor: 'bg-teal-500/20 dark:bg-teal-500/30',
    textColor: 'text-teal-800 dark:text-teal-300',
    borderColor: 'border-teal-500/40',
    track: 'student',
  },
  teacherBody: {
    label: 'Faculty Mentor / Advisor',
    description: 'College faculty advisor, department professor & academic research mentor',
    badgeBg: 'bg-purple-500/20 dark:bg-purple-500/30',
    badgeText: 'text-purple-800 dark:text-purple-300',
    badgeBorder: 'border-purple-500/40',
    bgColor: 'bg-purple-500/20 dark:bg-purple-500/30',
    textColor: 'text-purple-800 dark:text-purple-300',
    borderColor: 'border-purple-500/40',
    track: 'teacher',
  },
};


