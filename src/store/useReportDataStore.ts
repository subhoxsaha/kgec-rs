import { create } from 'zustand';
import {
  REPORT_METADATA as INITIAL_METADATA,
  ROBOTICS_WINGS as INITIAL_WINGS,
  NARRATIVE_STORIES as INITIAL_STORIES,
  STRATEGIC_ROADMAP as INITIAL_ROADMAP,
} from '../data/reportData';
import { FLAGSHIP_PROJECTS as INITIAL_BOT_PROJECTS } from '../data/projectsData';
import {
  DEFAULT_TECHFEST_PHOTOS as INITIAL_TECHFEST_PHOTOS,
  DEFAULT_OTHER_ACTIVITIES_PHOTOS as INITIAL_ACTIVITY_PHOTOS,
  DEFAULT_HACKATHON_PHOTOS as INITIAL_HACKATHON_PHOTOS,
} from '../data/eventsData';
import { INITIAL_TEAM_MEMBERS } from '../data/teamData';
import { fetchStaticTeamMembers } from '../utils/teamUtils';
import { TECHTIX_ZYRO_EVENTS, FestEvent } from '../data/techtixZyroEventsData';
import {
  RoboticsWing,
  StrategicGoal,
  InnovationStory,
  SocietyMetadata,
  GoogleUserProfile,
  UserRole,
  UserStatus,
  UserApplicationProfile,
  isUserAdmin,
  BotProject,
  EventPhoto,
  TeamMember,
} from '../types';
import {
  persistCmsState,
  getStoredStateSync,
  loadFromIndexedDB,
  fetchCmsFromMongoDB,
  clearAllCmsStorage,
  STORAGE_KEY,
  AUTH_STORAGE_KEY,
  GOOGLE_USER_STORAGE_KEY,
} from '../utils/storageManager';

export interface PhaseItem {
  step: string;
  month: string;
  title: string;
  desc: string;
  aiNote?: string;
}

export const DEFAULT_FEST_PHASES: PhaseItem[] = [
  {
    step: '01',
    month: 'OCT',
    title: 'Abstract Submissions',
    desc: 'Hardware architectures & squad registrations.',
    aiNote: 'AI verification assesses kinematic models, CAD chassis integrity, and compute-to-payload ratios before grant clearance.',
  },
  {
    step: '02',
    month: 'NOV',
    title: 'Kits & Grants',
    desc: 'Jetson Orin Nano & RPLIDAR hardware issued.',
    aiNote: 'Hardware distribution authorizes NVIDIA Jetson Orin Nano boards and RPLIDAR units for benchtop testing.',
  },
  {
    step: '03',
    month: 'DEC',
    title: '36H Sprint',
    desc: 'Continuous fabrication, 3D printing & ROS2 coding.',
    aiNote: '36 hours of continuous rapid prototyping, embedded ROS2 trajectory tuning, and edge vision optimization.',
  },
  {
    step: '04',
    month: 'JAN',
    title: 'Arena Trials & Pitch',
    desc: 'Obstacle benchmarking & jury evaluation.',
    aiNote: 'Live arena qualification testing against randomized physical obstacles with zero manual intervention scoring.',
  },
];

export const DEFAULT_TRACK_PASSAGES: Record<string, { code: string; title: string; passage: string }> = {
  agv: {
    code: 'TRACK 01 // AGV',
    title: 'Autonomous Navigation',
    passage:
      'Build dual-drive rovers with ROS2 and 360° LiDAR to autonomously map, compute optimal paths, and navigate unknown arenas without teleoperation.',
  },
  bionics: {
    code: 'TRACK 02 // BIONICS',
    title: 'Assistive Mechatronics',
    passage:
      'Engineer 3D-printed bionic limbs controlled through real-time EMG bio-signals and adaptive multi-finger tendon actuation for tactile dexterity.',
  },
  uav: {
    code: 'TRACK 03 // UAV',
    title: 'Aerial Reconnaissance',
    passage:
      'Deploy autonomous quadcopters with onboard optical flow and thermal cameras for GPS-denied indoor search, hazard detection, and live telemetry.',
  },
  industrial: {
    code: 'TRACK 04 // ROBOTICS',
    title: 'Industrial Manipulation',
    passage:
      'Design 6-DOF robotic arms with edge-AI computer vision for real-time defect sorting, closed-loop servo feedback, and kinematic conveyor pick-and-place.',
  },
};

export interface SectionTexts {
  heroTagline: string;
  heroTitle: string;
  heroDescription: string;
  heroPill1Text: string;
  heroPill1Target: string;
  heroPill2Text: string;
  heroPill2Target: string;
  heroPill3Text: string;
  heroPill3Target: string;
  overviewHeading: string;
  aboutTitle: string;
  aboutQuote: string;
  aboutQuoteAuthor: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  mottoHeading: string;
  mottoTagline: string;
  mottoVideoUrl: string;
  climateTitle: string;
  climateDescription: string;
  sectorTitle: string;
  sectorDescription: string;
  foodTitle: string;
  foodDescription: string;
  educationTitle: string;
  educationDescription: string;
  roadmapHeading: string;
  roadmapTitle: string;
  roadmapDescription: string;
}

export const INITIAL_SECTION_TEXTS: SectionTexts = {
  heroTagline: 'OFFICIAL TECHNICAL & INNOVATION REPORT • KALYANI GOVERNMENT ENGINEERING COLLEGE',
  heroTitle: 'KGEC Robotics Society',
  heroDescription: 'Pioneering autonomous intelligence, heavy combat robotics, aerial rovers, and hands-on mechatronics since 2012.',
  heroPill1Text: '48+ National Podiums',
  heroPill1Target: '#overview-section',
  heroPill2Text: '180+ Active Engineers',
  heroPill2Target: '#leadership-team-section',
  heroPill3Text: '26 Flagship Bot Builds',
  heroPill3Target: '#projects-section',
  overviewHeading: 'Engineering world-class autonomous bots, rovers, and national champions from Kalyani.',
  aboutTitle: 'About Us',
  aboutQuote: '"The best way to predict the future is to invent it."',
  aboutQuoteAuthor: 'Alan Kay',
  aboutParagraph1:
    'And what else can best define our future if not robots. Robotics Society, Kgec believes that the future lies in the world of robotics and we strive forward to spread and act on it.',
  aboutParagraph2:
    'We work on domains like : Mechatronics, Robot Design, Machine Learning, Computer Vision, Electronics and IoT to build basic robotic systems. We also have a web team, a Content team and a Graphics Team to promote our belief.',
  mottoHeading: 'Our Motto',
  mottoTagline: 'Think, Build, Renovate.',
  mottoVideoUrl: 'https://youtu.be/_0xqFfpLjm4?si=WhN6CHr1YsF6i-0a',
  climateTitle: 'High-performance hardware engineering and extreme arena benchmarking.',
  climateDescription: 'From 14,000 RPM high-kinetic weapon drums to sub-millisecond sensor telemetry, our machines are designed and simulated to endure real-world shocks.',
  sectorTitle: 'Flagship Bot Fleet & Specialized Competition Squads',
  sectorDescription: 'Over 26 custom-fabricated robotic systems engineered across 6 competitive categories—from 30kg battle titans to micro-precision maze solvers.',
  foodTitle: 'Democratizing robotics with free STEM kits & rural student drives.',
  foodDescription: 'Empowering the next generation of engineers through Project Eklavya, distributing 1,250+ custom microcontroller kits and mentoring 3,800+ school students across West Bengal.',
  educationTitle: 'Hands-on bootcamps, RoboFiesta, and real-world hardware mastery.',
  educationDescription: 'Training over 5,400 students in embedded C++, ROS2, PCB layout, CAD design, and high-G combat dynamics through student-led masterclasses.',
  roadmapHeading: 'Vision 2027 Strategic Horizons',
  roadmapTitle: 'From campus makerspace to global autonomous robotics arenas.',
  roadmapDescription: 'Four key commitments driving KGEC Robotics Society towards the University Rover Challenge, deep-tech hardware startups, and an advanced Centre of Excellence.',
};

export type EditorTab =
  | 'overview'
  | 'users'
  | 'projects'
  | 'team'
  | 'logos'
  | 'photos'
  | 'metrics'
  | 'texts'
  | 'wings'
  | 'roadmap'
  | 'botfaq'
  | 'tools'
  | 'fests';

export interface ReportDataState {
  lastUpdated: number;
  metadata: SocietyMetadata;
  sectionTexts: SectionTexts;
  wings: RoboticsWing[];
  boroughs: RoboticsWing[]; // alias
  stories: InnovationStory[];
  roadmap: StrategicGoal[];
  botProjects: BotProject[];
  techfestPhotos: EventPhoto[];
  activityPhotos: EventPhoto[];
  hackathonPhotos: EventPhoto[];
  teamMembers: TeamMember[];

  // TECHTIX & ZYRO Hackathon Fest State
  festEvents: FestEvent[];
  festPhases: PhaseItem[];
  trackPassages: Record<string, { code: string; title: string; passage: string }>;

  // User Management & Application Roster
  users: UserApplicationProfile[];
  currentUserProfile: UserApplicationProfile | null;
  userNotification: {
    title: string;
    text: string;
    role: UserRole;
    status: UserStatus;
    userName: string;
    timestamp: number;
  } | null;
  isApplicationFormOpen: boolean;

  // Auth & Modal States
  isAdminLoggedIn: boolean;
  isStudentLoggedIn: boolean;
  isLoggedIn: boolean;
  googleUser: GoogleUserProfile | null;
  userRole: UserRole | null;
  isBackdoorModalOpen: boolean;
  isEditorOpen: boolean;
  activeEditorTab: EditorTab;
  toastMessage: string | null;

  // Actions
  loginWithGoogleUser: (user: GoogleUserProfile) => void;
  logoutAdmin: () => void;
  openBackdoorModal: () => void;
  closeBackdoorModal: () => void;
  openApplicationForm: () => void;
  closeApplicationForm: () => void;
  setIsApplicationFormOpen: (open: boolean) => void;
  openEditor: (tab?: EditorTab) => void;
  closeEditor: () => void;
  setActiveEditorTab: (tab: EditorTab) => void;
  showToast: (msg: string) => void;
  dismissUserNotification: () => void;

  // User Application & CMS Operations
  fetchUsersList: () => Promise<void>;
  submitUserApplication: (profile: Partial<UserApplicationProfile>) => Promise<boolean>;
  updateUserRoleStatus: (
    userId: string,
    updates: { role?: UserRole; status?: UserStatus; rejectionReason?: string; reviewedBy?: string }
  ) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  refreshUserProfile: (email: string) => Promise<UserApplicationProfile | null>;

  // Content Mutations
  updateMetadata: (updates: Partial<SocietyMetadata>) => void;
  updateSectionTexts: (updates: Partial<SectionTexts>) => void;
  updateRoadmapGoal: (index: number, goal: Partial<StrategicGoal>) => void;
  addRoadmapGoal: (goal: StrategicGoal) => void;
  deleteRoadmapGoal: (index: number) => void;
  updateWing: (index: number, updates: Partial<RoboticsWing>) => void;
  addWing: (wing: RoboticsWing) => void;
  deleteWing: (idOrIndex: string | number) => void;
  updateProjectPhoto: (id: string, imageUrl: string, imageAlt?: string) => void;
  updateBotProject: (id: string, updates: Partial<BotProject>) => void;
  addBotProject: (project: BotProject) => void;
  deleteBotProject: (id: string) => void;
  updateTechfestPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => void;
  addTechfestPhoto: (photo: EventPhoto) => void;
  deleteTechfestPhoto: (id: string) => void;
  updateActivityPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => void;
  addActivityPhoto: (photo: EventPhoto) => void;
  deleteActivityPhoto: (id: string) => void;
  updateHackathonPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => void;
  addHackathonPhoto: (photo: EventPhoto) => void;
  deleteHackathonPhoto: (id: string) => void;
  resetPhotosToDefaults: () => void;
  // Fest & Track Mutations
  updateFestEvent: (id: string, updates: Partial<FestEvent>) => void;
  addFestEvent: (event: FestEvent) => void;
  deleteFestEvent: (id: string) => void;
  updateFestPhase: (step: string, updates: Partial<PhaseItem>) => void;
  updateTrackPassage: (key: string, updates: Partial<{ code: string; title: string; passage: string }>) => void;
  resetFestDataToDefaults: () => void;

  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  addTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  reorderTeamMember: (id: string, direction: 'up' | 'down') => void;
  resetTeamToDefaults: () => void;
  resetAllToDefaults: () => void;
  exportConfigAsJson: () => string;
  importConfigFromJson: (jsonStr: string) => boolean;
  initData: () => void;
}

export const sanitizeLoadedTeamMembers = (members: any[]): TeamMember[] => {
  if (!Array.isArray(members) || members.length === 0) return INITIAL_TEAM_MEMBERS;
  return members.map((m, idx) => ({
    id: m.id || `member-${idx}-${Date.now().toString(36)}`,
    category: (m.category || 'student') as any,
    name: m.name || 'KGEC Member',
    post: m.post || m.role || m.designation || 'Robotics Member',
    departmentOrBatch: m.departmentOrBatch || m.department || m.batch || '',
    avatarUrl:
      m.avatarUrl ||
      m.image ||
      `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80`,
    email: m.email || '',
    linkedinUrl: m.linkedinUrl || m.linkedin || '',
    scholarUrl: m.scholarUrl || '',
    githubUrl: m.githubUrl || m.github || '',
    bio: m.bio || '',
    order: typeof m.order === 'number' ? m.order : idx,
  }));
};

export const sanitizeLoadedBotProjects = (projects: any[]): BotProject[] => {
  if (!Array.isArray(projects) || projects.length === 0) return INITIAL_BOT_PROJECTS;
  return projects.map((p, idx) => ({
    id: p.id || `bot-${idx}`,
    name: p.name || 'Bot Project',
    codename: p.codename || p.name || `BOT-${idx}`,
    tagline: p.tagline || 'Autonomous Robotics System',
    imageUrl:
      p.imageUrl ||
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: p.imageAlt || p.name || 'Bot',
    wingId: p.wingId || 'mechatronics',
    wingName: p.wingName || 'Mechatronics Wing',
    category: p.category || 'Combat Robotics',
    weightClass: p.weightClass || '15kg',
    status: p.status || 'Operational',
    podiumsCount: Number(p.podiumsCount) || 0,
    featuredAward: p.featuredAward || '',
    description: p.description || '',
    specs: p.specs || {
      weight: '15kg',
      power: 'LiPo 6S',
      controller: 'STM32',
      actuatorsOrWeapon: 'Brushless motor',
      chassisMaterial: 'Aluminium 7075-T6',
    },
    keyFeatures: Array.isArray(p.keyFeatures) ? p.keyFeatures : ['High Speed', 'Telemetry'],
    architectureSummary: p.architectureSummary || 'Custom engineered mechatronic robotics system.',
    iconName: p.iconName || 'Zap',
  }));
};

// Helpers for multi-tier persistence
const getInitialStoredState = () => {
  let initialMeta = INITIAL_METADATA;
  let initialTexts = INITIAL_SECTION_TEXTS;
  let initialWings = INITIAL_WINGS;
  let initialRoadmap = INITIAL_ROADMAP;
  let initialProjects = INITIAL_BOT_PROJECTS;
  let initialTechfest = INITIAL_TECHFEST_PHOTOS;
  let initialActivities = INITIAL_ACTIVITY_PHOTOS;
  let initialHackathon = INITIAL_HACKATHON_PHOTOS;
  let initialTeam = INITIAL_TEAM_MEMBERS;
  let initialFestEvents = [...TECHTIX_ZYRO_EVENTS];
  let initialFestPhases = [...DEFAULT_FEST_PHASES];
  let initialTrackPassages = { ...DEFAULT_TRACK_PASSAGES };
  let initialUser: GoogleUserProfile | null = null;
  let initialLastUpdated = 0;

  if (typeof window !== 'undefined') {
    try {
      const savedUserStr = localStorage.getItem(GOOGLE_USER_STORAGE_KEY);
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        initialUser = {
          ...parsed,
          role: isUserAdmin(parsed.email) ? 'admin' : 'student',
        };
      }

      const parsed: any = getStoredStateSync();
      if (parsed) {
        if (typeof parsed.lastUpdated === 'number') initialLastUpdated = parsed.lastUpdated;
        if (parsed.metadata) initialMeta = { ...initialMeta, ...parsed.metadata };
        if (parsed.sectionTexts) initialTexts = { ...initialTexts, ...parsed.sectionTexts };
        if (parsed.wings && Array.isArray(parsed.wings)) initialWings = parsed.wings;
        if (parsed.roadmap && Array.isArray(parsed.roadmap)) initialRoadmap = parsed.roadmap;
        if (parsed.botProjects && Array.isArray(parsed.botProjects)) {
          initialProjects = sanitizeLoadedBotProjects(parsed.botProjects);
        }
        if (parsed.techfestPhotos && Array.isArray(parsed.techfestPhotos)) initialTechfest = parsed.techfestPhotos;
        if (parsed.activityPhotos && Array.isArray(parsed.activityPhotos)) initialActivities = parsed.activityPhotos;
        if (parsed.hackathonPhotos && Array.isArray(parsed.hackathonPhotos)) initialHackathon = parsed.hackathonPhotos;
        if (parsed.teamMembers && Array.isArray(parsed.teamMembers)) {
          initialTeam = sanitizeLoadedTeamMembers(parsed.teamMembers);
        }
        if (parsed.festEvents && Array.isArray(parsed.festEvents)) initialFestEvents = parsed.festEvents;
        if (parsed.festPhases && Array.isArray(parsed.festPhases)) initialFestPhases = parsed.festPhases;
        if (parsed.trackPassages) initialTrackPassages = { ...DEFAULT_TRACK_PASSAGES, ...parsed.trackPassages };
      }
    } catch {
      // Safe fallback, no console error
    }
  }

  const isAdmin = Boolean(initialUser && isUserAdmin(initialUser.email));
  const isStudent = Boolean(initialUser && !isUserAdmin(initialUser.email));

  const firstName = initialUser?.name ? initialUser.name.split(' ')[0] : 'User';
  const initialNotification = initialUser
    ? {
        title: `Welcome back, ${firstName}!`,
        text: `Signed in as ${initialUser.name}. ${isAdmin ? 'CMS Portal ready.' : 'Society clearance active.'}`,
        role: (initialUser.role as UserRole) || (isAdmin ? 'admin' : 'guest'),
        status: (initialUser.status as UserStatus) || 'approved',
        userName: initialUser.name || 'User',
        timestamp: Date.now(),
      }
    : {
        title: 'Welcome to KGEC Robotics!',
        text: 'Greetings Guest! Explore our autonomous bots and wings, or sign in for member clearance.',
        role: 'guest' as UserRole,
        status: 'approved' as UserStatus,
        userName: 'Guest',
        timestamp: Date.now(),
      };

  return {
    lastUpdated: initialLastUpdated,
    metadata: initialMeta,
    sectionTexts: initialTexts,
    wings: initialWings,
    roadmap: initialRoadmap,
    botProjects: initialProjects,
    techfestPhotos: initialTechfest,
    activityPhotos: initialActivities,
    hackathonPhotos: initialHackathon,
    teamMembers: initialTeam,
    festEvents: initialFestEvents,
    festPhases: initialFestPhases,
    trackPassages: initialTrackPassages,
    googleUser: initialUser,
    userNotification: initialNotification,
    isAdminLoggedIn: isAdmin,
    isStudentLoggedIn: isStudent,
    isLoggedIn: Boolean(initialUser),
    userRole: initialUser ? (isAdmin ? ('admin' as UserRole) : ('student' as UserRole)) : null,
  };
};

const saveStateToStorage = (
  meta?: SocietyMetadata,
  texts?: SectionTexts,
  wings?: RoboticsWing[],
  roadmap?: StrategicGoal[],
  botProjects?: BotProject[],
  techfestPhotos?: EventPhoto[],
  activityPhotos?: EventPhoto[],
  hackathonPhotos?: EventPhoto[],
  teamMembers?: TeamMember[],
  festEvents?: FestEvent[],
  festPhases?: PhaseItem[],
  trackPassages?: Record<string, { code: string; title: string; passage: string }>
) => {
  if (typeof window === 'undefined') return;
  const current = (useReportDataStore && typeof useReportDataStore.getState === 'function')
    ? useReportDataStore.getState()
    : ({} as any);

  const now = Date.now();
  const payload = {
    metadata: meta || current.metadata || INITIAL_METADATA,
    sectionTexts: texts || current.sectionTexts || INITIAL_SECTION_TEXTS,
    wings: wings || current.wings || INITIAL_WINGS,
    roadmap: roadmap || current.roadmap || INITIAL_ROADMAP,
    botProjects: botProjects || current.botProjects || INITIAL_BOT_PROJECTS,
    techfestPhotos: techfestPhotos || current.techfestPhotos || INITIAL_TECHFEST_PHOTOS,
    activityPhotos: activityPhotos || current.activityPhotos || INITIAL_ACTIVITY_PHOTOS,
    hackathonPhotos: hackathonPhotos || current.hackathonPhotos || INITIAL_HACKATHON_PHOTOS,
    teamMembers: teamMembers || current.teamMembers || INITIAL_TEAM_MEMBERS,
    festEvents: festEvents || current.festEvents || TECHTIX_ZYRO_EVENTS,
    festPhases: festPhases || current.festPhases || DEFAULT_FEST_PHASES,
    trackPassages: trackPassages || current.trackPassages || DEFAULT_TRACK_PASSAGES,
    lastUpdated: now,
  };

  if (useReportDataStore && typeof useReportDataStore.setState === 'function') {
    useReportDataStore.setState({ lastUpdated: now });
  }

  persistCmsState(payload);
};

const initial = getInitialStoredState();

let toastTimeout: NodeJS.Timeout | null = null;

export const useReportDataStore = create<ReportDataState>((set, get) => ({
  lastUpdated: initial.lastUpdated,
  metadata: initial.metadata,
  sectionTexts: initial.sectionTexts,
  wings: initial.wings,
  boroughs: initial.wings,
  stories: INITIAL_STORIES,
  roadmap: initial.roadmap,
  botProjects: initial.botProjects,
  techfestPhotos: initial.techfestPhotos,
  activityPhotos: initial.activityPhotos,
  hackathonPhotos: initial.hackathonPhotos,
  teamMembers: initial.teamMembers,
  festEvents: initial.festEvents,
  festPhases: initial.festPhases,
  trackPassages: initial.trackPassages,

  isAdminLoggedIn: initial.isAdminLoggedIn,
  isStudentLoggedIn: initial.isStudentLoggedIn,
  isLoggedIn: initial.isLoggedIn,
  googleUser: initial.googleUser,
  userRole: initial.userRole,

  users: [],
  currentUserProfile: null,
  userNotification: null,
  isApplicationFormOpen: false,

  isBackdoorModalOpen: false,
  isEditorOpen: false,
  activeEditorTab: 'overview',
  toastMessage: null,

  showToast: (msg: string) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    set({ toastMessage: msg });
    toastTimeout = setTimeout(() => {
      set((state) => (state.toastMessage === msg ? { toastMessage: null } : {}));
    }, 3500);
  },

  dismissUserNotification: () => set({ userNotification: null }),
  openApplicationForm: () => set({ isApplicationFormOpen: true }),
  closeApplicationForm: () => set({ isApplicationFormOpen: false }),
  setIsApplicationFormOpen: (open: boolean) => set({ isApplicationFormOpen: open }),

  fetchUsersList: async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.users)) {
          const nextUsers = data.users as UserApplicationProfile[];
          set((prev) => {
            let nextUserProfile = prev.currentUserProfile;
            let nextGoogleUser = prev.googleUser;
            let nextIsAdmin = prev.isAdminLoggedIn;
            let nextIsStudent = prev.isStudentLoggedIn;
            let nextUserRole = prev.userRole;

            if (prev.googleUser) {
              const matched = nextUsers.find(
                (u) => u.email.toLowerCase() === prev.googleUser?.email.toLowerCase()
              );
              if (matched) {
                const isDirectAdmin = isUserAdmin(matched.email);
                const hasApprovedAdmin = isDirectAdmin || (matched.role === 'admin' && matched.status === 'approved');

                nextUserProfile = matched;
                nextGoogleUser = {
                  ...prev.googleUser,
                  role: matched.role,
                  status: matched.status,
                  profile: matched,
                };
                nextIsAdmin = hasApprovedAdmin;
                nextIsStudent = !hasApprovedAdmin;
                nextUserRole = matched.role;

                try {
                  localStorage.setItem(AUTH_STORAGE_KEY, hasApprovedAdmin ? 'true' : 'false');
                  localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(nextGoogleUser));
                } catch {}
              }
            }

            return {
              users: nextUsers,
              currentUserProfile: nextUserProfile,
              googleUser: nextGoogleUser,
              isAdminLoggedIn: nextIsAdmin,
              isStudentLoggedIn: nextIsStudent,
              userRole: nextUserRole,
            };
          });
        }
      }
    } catch {
      // Fallback
    }
  },

  refreshUserProfile: async (email: string) => {
    if (!email) return null;
    try {
      const res = await fetch(`/api/users/profile?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          const updated = data.user as UserApplicationProfile;
          const isDirectAdmin = isUserAdmin(updated.email);
          const hasApprovedAdmin = isDirectAdmin || (updated.role === 'admin' && updated.status === 'approved');

          set((prev) => {
            const nextGoogleUser = prev.googleUser
              ? {
                  ...prev.googleUser,
                  role: updated.role,
                  status: updated.status,
                  profile: updated,
                }
              : null;

            if (nextGoogleUser) {
              try {
                localStorage.setItem(AUTH_STORAGE_KEY, hasApprovedAdmin ? 'true' : 'false');
                localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(nextGoogleUser));
              } catch {}
            }

            return {
              currentUserProfile: updated,
              googleUser: nextGoogleUser,
              isAdminLoggedIn: hasApprovedAdmin,
              isStudentLoggedIn: !hasApprovedAdmin,
              userRole: updated.role,
            };
          });
          return updated;
        }
      }
    } catch {
      // Fallback
    }
    return null;
  },

  submitUserApplication: async (profile: Partial<UserApplicationProfile>) => {
    const currentGoogleUser = get().googleUser;
    if (!currentGoogleUser) {
      get().showToast('Authentication Required: You must be signed in with Google to submit an application.');
      return false;
    }

    // Ensure application is strictly bound to the authenticated Google user's verified credentials
    const verifiedPayload: Partial<UserApplicationProfile> = {
      ...profile,
      email: currentGoogleUser.email,
      name: profile.name?.trim() || currentGoogleUser.name,
      picture: profile.picture || currentGoogleUser.picture,
    };

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifiedPayload),
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.user) {
        const updatedUser = data.user as UserApplicationProfile;
        set((prev) => ({
          currentUserProfile: updatedUser,
          users: [updatedUser, ...prev.users.filter((u) => u.id !== updatedUser.id && u.email !== updatedUser.email)],
          isApplicationFormOpen: false,
        }));

        // Robot mascot notification
        set({
          userNotification: {
            title: updatedUser.status === 'approved' ? 'Role Verified & Active!' : 'Application Submitted to Board',
            text:
              updatedUser.status === 'approved'
                ? `Welcome to KGEC Robotics Society! Your verified role as ${updatedUser.role} is active.`
                : `Thank you, ${updatedUser.name}! Your application for ${updatedUser.role} has been queued for Administrative review.`,
            role: updatedUser.role as UserRole,
            status: updatedUser.status as UserStatus,
            userName: updatedUser.name,
            timestamp: Date.now(),
          },
        });

        get().showToast(
          updatedUser.status === 'approved'
            ? `Application approved as ${updatedUser.role}!`
            : 'Application submitted successfully for admin review.'
        );
        return true;
      }
    } catch (err: any) {
      get().showToast(`Submission notice: ${err?.message || 'Saved locally'}`);
      // Fallback: save locally in store state if offline or endpoint error
      const mockUser: UserApplicationProfile = {
        id: profile.id || `app_${Date.now()}`,
        email: profile.email || 'applicant@kgec.edu.in',
        name: profile.name || 'Applicant',
        role: profile.role || 'member',
        status: profile.status || 'pending',
        userType: profile.userType || 'student',
        appliedAt: new Date().toISOString(),
        ...profile,
      } as UserApplicationProfile;

      set((prev) => ({
        currentUserProfile: mockUser,
        users: [mockUser, ...prev.users.filter((u) => u.id !== mockUser.id && u.email !== mockUser.email)],
        isApplicationFormOpen: false,
      }));
      return true;
    }
    return false;
  },

  updateUserRoleStatus: async (userId: string, updates: { role?: UserRole; status?: UserStatus; rejectionReason?: string; reviewedBy?: string }) => {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.user) {
        const updated = data.user as UserApplicationProfile;
        set((prev) => {
          const nextUsers = prev.users.map((u) => (u.id === userId || u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u));
          
          const isCurrentActiveUser =
            prev.googleUser &&
            (prev.currentUserProfile?.id === userId ||
             prev.currentUserProfile?.email.toLowerCase() === updated.email.toLowerCase() ||
             prev.googleUser.email.toLowerCase() === updated.email.toLowerCase());

          let nextGoogleUser = prev.googleUser;
          let nextUserProfile =
            prev.currentUserProfile?.id === userId || prev.currentUserProfile?.email.toLowerCase() === updated.email.toLowerCase()
              ? updated
              : prev.currentUserProfile;
          let nextIsAdmin = prev.isAdminLoggedIn;
          let nextIsStudent = prev.isStudentLoggedIn;
          let nextUserRole = prev.userRole;

          if (isCurrentActiveUser && prev.googleUser) {
            const isDirectAdmin = isUserAdmin(updated.email);
            const hasApprovedAdmin = isDirectAdmin || (updated.role === 'admin' && updated.status === 'approved');

            nextUserProfile = updated;
            nextGoogleUser = {
              ...prev.googleUser,
              role: updated.role,
              status: updated.status,
              profile: updated,
            };
            nextIsAdmin = hasApprovedAdmin;
            nextIsStudent = !hasApprovedAdmin;
            nextUserRole = updated.role;

            try {
              localStorage.setItem(AUTH_STORAGE_KEY, hasApprovedAdmin ? 'true' : 'false');
              localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(nextGoogleUser));
            } catch {}
          }

          return {
            users: nextUsers,
            currentUserProfile: nextUserProfile,
            googleUser: nextGoogleUser,
            isAdminLoggedIn: nextIsAdmin,
            isStudentLoggedIn: nextIsStudent,
            userRole: nextUserRole,
          };
        });

        get().showToast(`User ${updated.name} updated: ${updated.role} (${updated.status})`);
        return true;
      }
    } catch (err: any) {
      set((prev) => {
        const target = prev.users.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
        if (!target) return {};
        const updated: UserApplicationProfile = {
          ...target,
          role: updates.role || target.role,
          status: updates.status || target.status,
          rejectionReason: updates.rejectionReason !== undefined ? updates.rejectionReason : target.rejectionReason,
          reviewedBy: updates.reviewedBy || target.reviewedBy,
        };

        const nextUsers = prev.users.map((u) => (u.id === userId || u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u));
        const isCurrentActiveUser =
          prev.googleUser &&
          (prev.currentUserProfile?.id === userId ||
           prev.currentUserProfile?.email.toLowerCase() === updated.email.toLowerCase() ||
           prev.googleUser.email.toLowerCase() === updated.email.toLowerCase());

        let nextGoogleUser = prev.googleUser;
        let nextUserProfile =
          prev.currentUserProfile?.id === userId || prev.currentUserProfile?.email.toLowerCase() === updated.email.toLowerCase()
            ? updated
            : prev.currentUserProfile;
        let nextIsAdmin = prev.isAdminLoggedIn;
        let nextIsStudent = prev.isStudentLoggedIn;
        let nextUserRole = prev.userRole;

        if (isCurrentActiveUser && prev.googleUser) {
          const isDirectAdmin = isUserAdmin(updated.email);
          const hasApprovedAdmin = isDirectAdmin || (updated.role === 'admin' && updated.status === 'approved');

          nextUserProfile = updated;
          nextGoogleUser = {
            ...prev.googleUser,
            role: updated.role,
            status: updated.status,
            profile: updated,
          };
          nextIsAdmin = hasApprovedAdmin;
          nextIsStudent = !hasApprovedAdmin;
          nextUserRole = updated.role;

          try {
            localStorage.setItem(AUTH_STORAGE_KEY, hasApprovedAdmin ? 'true' : 'false');
            localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(nextGoogleUser));
          } catch {}
        }

        return {
          users: nextUsers,
          currentUserProfile: nextUserProfile,
          googleUser: nextGoogleUser,
          isAdminLoggedIn: nextIsAdmin,
          isStudentLoggedIn: nextIsStudent,
          userRole: nextUserRole,
        };
      });

      get().showToast(`Updated locally: ${updates.status || updates.role}`);
      return true;
    }
    return false;
  },

  deleteUser: async (userId: string) => {
    if (!userId) return false;
    const normalizedTarget = userId.toLowerCase().trim();
    // Optimistically update local list
    set((prev) => ({
      users: prev.users.filter(
        (u) => u.id !== userId && u.email?.toLowerCase().trim() !== normalizedTarget
      ),
    }));

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        get().showToast('User application record deleted permanently.');
        return true;
      } else {
        // Re-fetch if backend fails
        await get().fetchUsersList();
      }
    } catch (err: any) {
      await get().fetchUsersList();
      get().showToast(`Delete failed: ${err?.message || 'Network error'}`);
    }
    return false;
  },

  loginWithGoogleUser: async (user: GoogleUserProfile) => {
    const isDirectAdmin = isUserAdmin(user.email);
    
    // Check if user already exists in DB
    let existingProfile: UserApplicationProfile | null = null;
    try {
      const res = await fetch(`/api/users/profile?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        existingProfile = data.user;
      }
    } catch {
      // Offline fallback
    }

    const assignedRole: UserRole = isDirectAdmin ? 'admin' : (existingProfile?.role as UserRole) || 'guest';
    const assignedStatus: UserStatus = isDirectAdmin ? 'approved' : (existingProfile?.status as UserStatus) || 'pending';

    const enrichedUser: GoogleUserProfile = {
      ...user,
      role: assignedRole,
      status: assignedStatus,
      profile: existingProfile || undefined,
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, isDirectAdmin ? 'true' : 'false');
      localStorage.setItem(GOOGLE_USER_STORAGE_KEY, JSON.stringify(enrichedUser));
    } catch {}

    const hasApprovedAdmin = isDirectAdmin || (assignedRole === 'admin' && assignedStatus === 'approved');

    set({
      googleUser: enrichedUser,
      currentUserProfile: existingProfile,
      isAdminLoggedIn: hasApprovedAdmin,
      isStudentLoggedIn: !hasApprovedAdmin,
      isLoggedIn: true,
      userRole: assignedRole,
      isBackdoorModalOpen: false,
      isEditorOpen: false, // Don't auto-open without intent
    });

    // If no existing profile and not direct admin, trigger registration prompt
    if (!existingProfile && !isDirectAdmin) {
      set({ isApplicationFormOpen: true });
    }

    // Trigger mascot notification for approved users or role notifications
    if (assignedStatus === 'approved') {
      set({
        userNotification: {
          title: `Welcome, ${assignedRole.toUpperCase()}!`,
          text: `Signed in as ${user.name}. ${assignedRole === 'admin' ? 'CMS Portal unlocked.' : 'Society clearance active.'}`,
          role: assignedRole,
          status: 'approved',
          userName: user.name,
          timestamp: Date.now(),
        },
      });
    } else {
      set({
        userNotification: {
          title: 'Application Pending',
          text: `Hi ${user.name}, your request is queued for review.`,
          role: assignedRole,
          status: assignedStatus,
          userName: user.name,
          timestamp: Date.now(),
        },
      });
    }

    if (hasApprovedAdmin) {
      get().showToast(`Welcome Administrator, ${user.name}! CMS Master Rights verified.`);
    } else {
      get().showToast(`Signed in as ${user.name} (${assignedRole}).`);
    }

    // Fetch refreshed user list
    get().fetchUsersList();
  },

  logoutAdmin: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(GOOGLE_USER_STORAGE_KEY);
    } catch {}

    set({
      googleUser: null,
      currentUserProfile: null,
      userNotification: {
        title: 'Welcome to KGEC Robotics!',
        text: 'Greetings Guest! Explore our autonomous bots and wings, or sign in for member clearance.',
        role: 'guest',
        status: 'approved',
        userName: 'Guest',
        timestamp: Date.now(),
      },
      isAdminLoggedIn: false,
      isStudentLoggedIn: false,
      isLoggedIn: false,
      userRole: null,
      isEditorOpen: false,
      isApplicationFormOpen: false,
    });

    get().showToast('Signed out of Google session.');
  },

  openBackdoorModal: () => set({ isBackdoorModalOpen: true }),
  closeBackdoorModal: () => set({ isBackdoorModalOpen: false }),

  openEditor: (tab?: EditorTab) => {
    const { isAdminLoggedIn, showToast } = get();
    if (!isAdminLoggedIn) {
      showToast('Admin privileges required. Website editing is restricted to subhoxsaha@gmail.com.');
      return;
    }
    set({
      isEditorOpen: true,
      activeEditorTab: tab || get().activeEditorTab,
    });
  },

  closeEditor: () => set({ isEditorOpen: false }),
  setActiveEditorTab: (tab: EditorTab) => set({ activeEditorTab: tab }),

  updateMetadata: (updates: Partial<SocietyMetadata>) => {
    const current = get().metadata;
    const next = { ...current, ...updates };

    if (updates.nationalPodiums !== undefined) next.totalHives = updates.nationalPodiums;
    if (updates.totalMembers !== undefined) next.totalBees = updates.totalMembers;
    if (updates.activeProjects !== undefined) next.totalSites = updates.activeProjects;
    if (updates.labAreaSqFt !== undefined) next.meadowAreaSqM = updates.labAreaSqFt;
    if (updates.studentsTrained !== undefined) next.attendees = updates.studentsTrained;
    if (updates.stemKitsDistributed !== undefined) next.jarsDonated = updates.stemKitsDistributed;
    if (updates.leadershipQuote !== undefined) next.founderQuote = updates.leadershipQuote;
    if (updates.president !== undefined) next.founder = updates.president;
    if (updates.presidentTitle !== undefined) next.founderTitle = updates.presidentTitle;

    saveStateToStorage(
      next,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ metadata: next });
    get().showToast('Society metrics updated successfully');
  },

  updateSectionTexts: (updates: Partial<SectionTexts>) => {
    const next = { ...get().sectionTexts, ...updates };
    saveStateToStorage(
      get().metadata,
      next,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ sectionTexts: next });
    get().showToast('Section copy updated successfully');
  },

  updateRoadmapGoal: (index: number, goal: Partial<StrategicGoal>) => {
    const next = [...get().roadmap];
    if (next[index]) {
      next[index] = { ...next[index], ...goal };
      saveStateToStorage(
        get().metadata,
        get().sectionTexts,
        get().wings,
        next,
        get().botProjects,
        get().techfestPhotos,
        get().activityPhotos,
        get().hackathonPhotos
      );
      set({ roadmap: next });
      get().showToast('Roadmap goal updated');
    }
  },

  addRoadmapGoal: (goal: StrategicGoal) => {
    const next = [...get().roadmap, goal];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      next,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ roadmap: next });
    get().showToast('New roadmap goal added');
  },

  deleteRoadmapGoal: (index: number) => {
    const next = get().roadmap.filter((_, idx) => idx !== index);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      next,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ roadmap: next });
    get().showToast('Goal removed from roadmap');
  },

  updateWing: (index: number, updates: Partial<RoboticsWing>) => {
    const next = [...get().wings];
    if (next[index]) {
      next[index] = { ...next[index], ...updates };
      if (updates.podiums !== undefined) next[index].hives = updates.podiums;
      if (updates.projectsCount !== undefined) next[index].sites = updates.projectsCount;
      if (updates.name !== undefined) next[index].borough = updates.name;

      saveStateToStorage(
        get().metadata,
        get().sectionTexts,
        next,
        get().roadmap,
        get().botProjects,
        get().techfestPhotos,
        get().activityPhotos,
        get().hackathonPhotos
      );
      set({ wings: next, boroughs: next });
      get().showToast('Robotics wing specs updated');
    }
  },

  addWing: (wing: RoboticsWing) => {
    const next = [...get().wings, wing];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      next,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ wings: next, boroughs: next });
    get().showToast(`Added new wing: ${wing.name}`);
  },

  deleteWing: (idOrIndex: string | number) => {
    const next = get().wings.filter((w, idx) =>
      typeof idOrIndex === 'number' ? idx !== idOrIndex : w.id !== idOrIndex
    );
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      next,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ wings: next, boroughs: next });
    get().showToast('Technical wing removed');
  },

  updateProjectPhoto: (id: string, imageUrl: string, imageAlt?: string) => {
    const next = get().botProjects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          imageUrl,
          ...(imageAlt !== undefined ? { imageAlt } : {}),
        };
      }
      return p;
    });

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      next,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ botProjects: next });
    get().showToast('Bot project photo updated');
  },

  updateBotProject: (id: string, updates: Partial<BotProject>) => {
    const next = get().botProjects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          specs: updates.specs ? { ...p.specs, ...updates.specs } : p.specs,
        };
      }
      return p;
    });

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      next,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ botProjects: next });
    get().showToast('Bot project updated successfully');
  },

  addBotProject: (project: BotProject) => {
    const next = [project, ...get().botProjects];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      next,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ botProjects: next });
    get().showToast(`Added new project: ${project.name}`);
  },

  deleteBotProject: (id: string) => {
    const target = get().botProjects.find((p) => p.id === id);
    const next = get().botProjects.filter((p) => p.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      next,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ botProjects: next });
    get().showToast(`Deleted project: ${target ? target.name : id}`);
  },

  updateTechfestPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => {
    const next = get().techfestPhotos.map((p) => {
      if (p.id === id) {
        if (typeof updatesOrUrl === 'string') {
          return {
            ...p,
            imageUrl: updatesOrUrl,
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
          };
        } else {
          return { ...p, ...updatesOrUrl };
        }
      }
      return p;
    });

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      next,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ techfestPhotos: next });
    get().showToast('Techfest photo updated');
  },

  addTechfestPhoto: (photo: EventPhoto) => {
    const next = [photo, ...get().techfestPhotos];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      next,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ techfestPhotos: next });
    get().showToast(`Added new photo: ${photo.title}`);
  },

  deleteTechfestPhoto: (id: string) => {
    const next = get().techfestPhotos.filter((p) => p.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      next,
      get().activityPhotos,
      get().hackathonPhotos
    );
    set({ techfestPhotos: next });
    get().showToast('Photo removed from Techfest gallery');
  },

  updateActivityPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => {
    const next = get().activityPhotos.map((p) => {
      if (p.id === id) {
        if (typeof updatesOrUrl === 'string') {
          return {
            ...p,
            imageUrl: updatesOrUrl,
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
          };
        } else {
          return { ...p, ...updatesOrUrl };
        }
      }
      return p;
    });

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      next,
      get().hackathonPhotos
    );
    set({ activityPhotos: next });
    get().showToast('Activity photo updated');
  },

  addActivityPhoto: (photo: EventPhoto) => {
    const next = [photo, ...get().activityPhotos];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      next,
      get().hackathonPhotos
    );
    set({ activityPhotos: next });
    get().showToast(`Added activity photo: ${photo.title}`);
  },

  deleteActivityPhoto: (id: string) => {
    const next = get().activityPhotos.filter((p) => p.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      next,
      get().hackathonPhotos
    );
    set({ activityPhotos: next });
    get().showToast('Photo removed from Activities gallery');
  },

  updateHackathonPhoto: (id: string, updatesOrUrl: string | Partial<EventPhoto>, title?: string, description?: string) => {
    const next = get().hackathonPhotos.map((p) => {
      if (p.id === id) {
        if (typeof updatesOrUrl === 'string') {
          return {
            ...p,
            imageUrl: updatesOrUrl,
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
          };
        } else {
          return { ...p, ...updatesOrUrl };
        }
      }
      return p;
    });

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      next
    );
    set({ hackathonPhotos: next });
    get().showToast('Hackathon photo updated');
  },

  addHackathonPhoto: (photo: EventPhoto) => {
    const next = [photo, ...get().hackathonPhotos];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      next
    );
    set({ hackathonPhotos: next });
    get().showToast(`Added hackathon photo: ${photo.title}`);
  },

  deleteHackathonPhoto: (id: string) => {
    const next = get().hackathonPhotos.filter((p) => p.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      next
    );
    set({ hackathonPhotos: next });
    get().showToast('Photo removed from Hackathon gallery');
  },

  resetPhotosToDefaults: () => {
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      INITIAL_BOT_PROJECTS,
      INITIAL_TECHFEST_PHOTOS,
      INITIAL_ACTIVITY_PHOTOS,
      INITIAL_HACKATHON_PHOTOS,
      get().teamMembers,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({
      botProjects: INITIAL_BOT_PROJECTS,
      techfestPhotos: INITIAL_TECHFEST_PHOTOS,
      activityPhotos: INITIAL_ACTIVITY_PHOTOS,
      hackathonPhotos: INITIAL_HACKATHON_PHOTOS,
    });
    get().showToast('All photos restored to default gallery');
  },

  updateFestEvent: (id: string, updates: Partial<FestEvent>) => {
    const next = get().festEvents.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev));
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      next,
      get().festPhases,
      get().trackPassages
    );
    set({ festEvents: next });
    get().showToast('Fest event updated');
  },

  addFestEvent: (event: FestEvent) => {
    const next = [...get().festEvents, event];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      next,
      get().festPhases,
      get().trackPassages
    );
    set({ festEvents: next });
    get().showToast(`Added event: ${event.title}`);
  },

  deleteFestEvent: (id: string) => {
    const next = get().festEvents.filter((ev) => ev.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      next,
      get().festPhases,
      get().trackPassages
    );
    set({ festEvents: next });
    get().showToast('Fest event deleted');
  },

  updateFestPhase: (step: string, updates: Partial<PhaseItem>) => {
    const next = get().festPhases.map((ph) => (ph.step === step ? { ...ph, ...updates } : ph));
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      get().festEvents,
      next,
      get().trackPassages
    );
    set({ festPhases: next });
    get().showToast(`Phase ${step} updated`);
  },

  updateTrackPassage: (key: string, updates: Partial<{ code: string; title: string; passage: string }>) => {
    const prev = get().trackPassages;
    const current = prev[key] || { code: '', title: '', passage: '' };
    const next = {
      ...prev,
      [key]: { ...current, ...updates },
    };
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      get().festEvents,
      get().festPhases,
      next
    );
    set({ trackPassages: next });
    get().showToast(`Track ${key.toUpperCase()} passage updated`);
  },

  resetFestDataToDefaults: () => {
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      get().teamMembers,
      TECHTIX_ZYRO_EVENTS,
      DEFAULT_FEST_PHASES,
      DEFAULT_TRACK_PASSAGES
    );
    set({
      festEvents: TECHTIX_ZYRO_EVENTS,
      festPhases: DEFAULT_FEST_PHASES,
      trackPassages: DEFAULT_TRACK_PASSAGES,
    });
    get().showToast('TECHTIX & ZYRO data restored to defaults');
  },

  updateTeamMember: (id: string, updates: Partial<TeamMember>) => {
    const next = get().teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m));
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      next,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({ teamMembers: next });
    get().showToast('Team member updated');
  },

  addTeamMember: (member: TeamMember) => {
    const next = [...get().teamMembers, member];
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      next,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({ teamMembers: next });
    get().showToast(`Added ${member.name} to team`);
  },

  deleteTeamMember: (id: string) => {
    const target = get().teamMembers.find((m) => m.id === id);
    const next = get().teamMembers.filter((m) => m.id !== id);
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      next,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({ teamMembers: next });
    get().showToast(target ? `Removed ${target.name}` : 'Team member removed');
  },

  reorderTeamMember: (id: string, direction: 'up' | 'down') => {
    const list = [...get().teamMembers];
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      list,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({ teamMembers: list });
  },

  resetTeamToDefaults: () => {
    saveStateToStorage(
      get().metadata,
      get().sectionTexts,
      get().wings,
      get().roadmap,
      get().botProjects,
      get().techfestPhotos,
      get().activityPhotos,
      get().hackathonPhotos,
      INITIAL_TEAM_MEMBERS,
      get().festEvents,
      get().festPhases,
      get().trackPassages
    );
    set({ teamMembers: INITIAL_TEAM_MEMBERS });
    get().showToast('Team directory restored to default roster');
  },

  resetAllToDefaults: () => {
    clearAllCmsStorage().catch(() => {});

    set({
      metadata: INITIAL_METADATA,
      sectionTexts: INITIAL_SECTION_TEXTS,
      wings: INITIAL_WINGS,
      boroughs: INITIAL_WINGS,
      roadmap: INITIAL_ROADMAP,
      botProjects: INITIAL_BOT_PROJECTS,
      techfestPhotos: INITIAL_TECHFEST_PHOTOS,
      activityPhotos: INITIAL_ACTIVITY_PHOTOS,
      hackathonPhotos: INITIAL_HACKATHON_PHOTOS,
      teamMembers: INITIAL_TEAM_MEMBERS,
      festEvents: TECHTIX_ZYRO_EVENTS,
      festPhases: DEFAULT_FEST_PHASES,
      trackPassages: DEFAULT_TRACK_PASSAGES,
    });
    get().showToast('All data successfully restored to KGEC defaults');
  },

  exportConfigAsJson: () => {
    const state = get();
    const exportObj = {
      metadata: state.metadata,
      sectionTexts: state.sectionTexts,
      wings: state.wings,
      roadmap: state.roadmap,
      botProjects: state.botProjects,
      techfestPhotos: state.techfestPhotos,
      activityPhotos: state.activityPhotos,
      hackathonPhotos: state.hackathonPhotos,
      teamMembers: state.teamMembers,
      festEvents: state.festEvents,
      festPhases: state.festPhases,
      trackPassages: state.trackPassages,
      exportedAt: new Date().toISOString(),
      organization: 'KGEC Robotics Society',
    };
    return JSON.stringify(exportObj, null, 2);
  },

  importConfigFromJson: (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      const nextMeta = parsed.metadata || get().metadata;
      const nextTexts = parsed.sectionTexts || get().sectionTexts;
      const nextWings = parsed.wings || get().wings;
      const nextRoadmap = parsed.roadmap || get().roadmap;
      const nextProjects = parsed.botProjects || get().botProjects;
      const nextTechfest = parsed.techfestPhotos || get().techfestPhotos;
      const nextActivities = parsed.activityPhotos || get().activityPhotos;
      const nextHackathon = parsed.hackathonPhotos || get().hackathonPhotos;
      const nextTeam = parsed.teamMembers || get().teamMembers;
      const nextFestEvents = parsed.festEvents || get().festEvents;
      const nextFestPhases = parsed.festPhases || get().festPhases;
      const nextTrackPassages = parsed.trackPassages || get().trackPassages;

      saveStateToStorage(
        nextMeta,
        nextTexts,
        nextWings,
        nextRoadmap,
        nextProjects,
        nextTechfest,
        nextActivities,
        nextHackathon,
        nextTeam,
        nextFestEvents,
        nextFestPhases,
        nextTrackPassages
      );
      set({
        metadata: nextMeta,
        sectionTexts: nextTexts,
        wings: nextWings,
        boroughs: nextWings,
        roadmap: nextRoadmap,
        botProjects: nextProjects,
        techfestPhotos: nextTechfest,
        activityPhotos: nextActivities,
        hackathonPhotos: nextHackathon,
        teamMembers: nextTeam,
        festEvents: nextFestEvents,
        festPhases: nextFestPhases,
        trackPassages: nextTrackPassages,
      });

      get().showToast('Configuration imported successfully!');
      return true;
    } catch (err) {
      get().showToast('Error: Failed to parse JSON configuration');
      return false;
    }
  },

  initData: () => {
    const fresh = getInitialStoredState();
    set({
      metadata: fresh.metadata,
      sectionTexts: fresh.sectionTexts,
      wings: fresh.wings,
      boroughs: fresh.wings,
      roadmap: fresh.roadmap,
      botProjects: fresh.botProjects,
      techfestPhotos: fresh.techfestPhotos,
      activityPhotos: fresh.activityPhotos,
      hackathonPhotos: fresh.hackathonPhotos,
      teamMembers: fresh.teamMembers,
      festEvents: fresh.festEvents,
      festPhases: fresh.festPhases,
      trackPassages: fresh.trackPassages,
      googleUser: fresh.googleUser,
      isAdminLoggedIn: fresh.isAdminLoggedIn,
      isStudentLoggedIn: fresh.isStudentLoggedIn,
      isLoggedIn: fresh.isLoggedIn,
      userRole: fresh.userRole,
    });
  },
}));

// Asynchronously hydrate from static team.json, IndexedDB, and remote MongoDB
if (typeof window !== 'undefined') {
  // 1. Fetch static team.json to ensure filesystem edits reflect instantly
  fetchStaticTeamMembers()
    .then((staticMembers) => {
      if (Array.isArray(staticMembers) && staticMembers.length > 0) {
        useReportDataStore.setState({ teamMembers: staticMembers });
      }
    })
    .catch(() => {});

  // 2. Load cached user state & preferences
  loadFromIndexedDB<any>()
    .then((idbData) => {
      if (idbData && typeof idbData === 'object') {
        const cur = useReportDataStore.getState();
        const incomingTime = Number(idbData.lastUpdated) || 0;
        if (incomingTime >= (cur.lastUpdated || 0)) {
          useReportDataStore.setState((prev) => ({
            lastUpdated: incomingTime || prev.lastUpdated,
            metadata: idbData.metadata ? { ...prev.metadata, ...idbData.metadata } : prev.metadata,
            sectionTexts: idbData.sectionTexts ? { ...prev.sectionTexts, ...idbData.sectionTexts } : prev.sectionTexts,
            wings: Array.isArray(idbData.wings) && idbData.wings.length > 0 ? idbData.wings : prev.wings,
            boroughs: Array.isArray(idbData.wings) && idbData.wings.length > 0 ? idbData.wings : prev.boroughs,
            roadmap: Array.isArray(idbData.roadmap) && idbData.roadmap.length > 0 ? idbData.roadmap : prev.roadmap,
            botProjects: Array.isArray(idbData.botProjects) && idbData.botProjects.length > 0 ? sanitizeLoadedBotProjects(idbData.botProjects) : prev.botProjects,
            techfestPhotos: Array.isArray(idbData.techfestPhotos) && idbData.techfestPhotos.length > 0 ? idbData.techfestPhotos : prev.techfestPhotos,
            activityPhotos: Array.isArray(idbData.activityPhotos) && idbData.activityPhotos.length > 0 ? idbData.activityPhotos : prev.activityPhotos,
            hackathonPhotos: Array.isArray(idbData.hackathonPhotos) && idbData.hackathonPhotos.length > 0 ? idbData.hackathonPhotos : prev.hackathonPhotos,
            teamMembers: Array.isArray(idbData.teamMembers) && idbData.teamMembers.length > 0 ? sanitizeLoadedTeamMembers(idbData.teamMembers) : prev.teamMembers,
            festEvents: Array.isArray(idbData.festEvents) && idbData.festEvents.length > 0 ? idbData.festEvents : prev.festEvents,
            festPhases: Array.isArray(idbData.festPhases) && idbData.festPhases.length > 0 ? idbData.festPhases : prev.festPhases,
            trackPassages: idbData.trackPassages ? { ...prev.trackPassages, ...idbData.trackPassages } : prev.trackPassages,
          }));
        }
      }
    })
    .catch(() => {})
    .finally(() => {
      fetchCmsFromMongoDB()
        .then((dbData) => {
          if (dbData && typeof dbData === 'object') {
            const cur = useReportDataStore.getState();
            const incomingTime = Number(dbData.lastUpdated) || 0;
            if (incomingTime > (cur.lastUpdated || 0)) {
              useReportDataStore.setState((prev) => ({
                lastUpdated: incomingTime,
                metadata: dbData.metadata ? { ...prev.metadata, ...dbData.metadata } : prev.metadata,
                sectionTexts: dbData.sectionTexts ? { ...prev.sectionTexts, ...dbData.sectionTexts } : prev.sectionTexts,
                wings: Array.isArray(dbData.wings) && dbData.wings.length > 0 ? dbData.wings : prev.wings,
                boroughs: Array.isArray(dbData.wings) && dbData.wings.length > 0 ? dbData.wings : prev.boroughs,
                roadmap: Array.isArray(dbData.roadmap) && dbData.roadmap.length > 0 ? dbData.roadmap : prev.roadmap,
                botProjects: Array.isArray(dbData.botProjects) && dbData.botProjects.length > 0 ? sanitizeLoadedBotProjects(dbData.botProjects) : prev.botProjects,
                techfestPhotos: Array.isArray(dbData.techfestPhotos) && dbData.techfestPhotos.length > 0 ? dbData.techfestPhotos : prev.techfestPhotos,
                activityPhotos: Array.isArray(dbData.activityPhotos) && dbData.activityPhotos.length > 0 ? dbData.activityPhotos : prev.activityPhotos,
                hackathonPhotos: Array.isArray(dbData.hackathonPhotos) && dbData.hackathonPhotos.length > 0 ? dbData.hackathonPhotos : prev.hackathonPhotos,
                teamMembers: Array.isArray(dbData.teamMembers) && dbData.teamMembers.length > 0 ? sanitizeLoadedTeamMembers(dbData.teamMembers) : prev.teamMembers,
                festEvents: Array.isArray(dbData.festEvents) && dbData.festEvents.length > 0 ? dbData.festEvents : prev.festEvents,
                festPhases: Array.isArray(dbData.festPhases) && dbData.festPhases.length > 0 ? dbData.festPhases : prev.festPhases,
                trackPassages: dbData.trackPassages ? { ...prev.trackPassages, ...dbData.trackPassages } : prev.trackPassages,
              }));
            }
          }
        })
        .catch(() => {});
    });
}
