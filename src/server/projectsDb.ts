import fs from 'fs';
import path from 'path';
import { Db } from 'mongodb';
import {
  RoboticsProject,
  ProjectPhase,
  PhaseSubmission,
  SubmissionReview,
  ProjectActivity,
  ProjectPhaseType,
  UserApplicationProfile,
} from '../types.js';

const DATA_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.join('/tmp', '.data_store')
  : path.join(process.cwd(), '.data_store');

const PROJECTS_FILE = path.join(DATA_DIR, 'projects_pm.json');
const PHASES_FILE = path.join(DATA_DIR, 'phases_pm.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions_pm.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews_pm.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities_pm.json');

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // ignore
  }
}

// In-memory caches for instant retrieval and fallback
let inMemoryProjects: RoboticsProject[] = [];
let inMemoryPhases: ProjectPhase[] = [];
let inMemorySubmissions: PhaseSubmission[] = [];
let inMemoryReviews: SubmissionReview[] = [];
let inMemoryActivities: ProjectActivity[] = [];

// Clean initialization with no mock data
export function initProjectManagementStore(): void {
  ensureDataDir();

  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const raw = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryProjects = Array.isArray(parsed) ? parsed : [];
    } else {
      inMemoryProjects = [];
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    if (fs.existsSync(PHASES_FILE)) {
      const raw = fs.readFileSync(PHASES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryPhases = Array.isArray(parsed) ? parsed : [];
    } else {
      inMemoryPhases = [];
      fs.writeFileSync(PHASES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemorySubmissions = Array.isArray(parsed) ? parsed : [];
    } else {
      inMemorySubmissions = [];
      fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryReviews = Array.isArray(parsed) ? parsed : [];
    } else {
      inMemoryReviews = [];
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    if (fs.existsSync(ACTIVITIES_FILE)) {
      const raw = fs.readFileSync(ACTIVITIES_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      inMemoryActivities = Array.isArray(parsed) ? parsed : [];
    } else {
      inMemoryActivities = [];
      fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[PM Store] Initialization error:', err);
    inMemoryProjects = [];
    inMemoryPhases = [];
    inMemorySubmissions = [];
    inMemoryReviews = [];
    inMemoryActivities = [];
  }
}

// Call on startup
initProjectManagementStore();

function persistAllToDisk(): void {
  ensureDataDir();
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(inMemoryProjects, null, 2), 'utf-8');
    fs.writeFileSync(PHASES_FILE, JSON.stringify(inMemoryPhases, null, 2), 'utf-8');
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(inMemorySubmissions, null, 2), 'utf-8');
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(inMemoryReviews, null, 2), 'utf-8');
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(inMemoryActivities, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PM Store] Persistence write error:', err);
  }
}

export function normalizeUrl(url?: string): string | undefined {
  if (!url || typeof url !== 'string' || !url.trim()) return undefined;
  let trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

// Helper to validate Drive / GitHub URL schemes safely with automatic protocol normalization
export function validateExternalUrl(url?: string): { valid: boolean; normalized?: string; error?: string } {
  if (!url || typeof url !== 'string' || !url.trim()) return { valid: true };
  const normalized = normalizeUrl(url);
  if (!normalized) return { valid: true };
  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { valid: false, error: 'Only secure web URLs (https://) are supported.' };
    }
    const host = parsed.hostname.toLowerCase();
    const isDrive = host.includes('drive.google.com') || host.includes('docs.google.com');
    const isGit = host.includes('github.com') || host.includes('gitlab.com') || host.includes('bitbucket.org');
    if (!isDrive && !isGit) {
      return { valid: false, error: 'Links must be valid Google Drive, Google Docs, or GitHub/Git repository URLs.' };
    }
    return { valid: true, normalized };
  } catch {
    return { valid: false, error: 'Malformed URL scheme. Please provide a valid URL.' };
  }
}

// Populate Project with its 3 phases, submissions, reviews, and activity logs
export function populateProject(project: RoboticsProject): RoboticsProject {
  const phases = inMemoryPhases
    .filter((p) => p.projectId === project.id)
    .sort((a, b) => {
      const order: Record<ProjectPhaseType, number> = { rd: 1, prototyping: 2, documentation: 3 };
      return order[a.phaseType] - order[b.phaseType];
    })
    .map((p) => {
      const submissions = inMemorySubmissions
        .filter((s) => s.phaseId === p.id)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .map((s) => {
          const reviews = inMemoryReviews
            .filter((r) => r.submissionId === s.id)
            .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
          return { ...s, reviews };
        });
      return { ...p, submissions };
    });

  const activities = inMemoryActivities
    .filter((a) => a.projectId === project.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { ...project, phases, activities };
}

// Record an activity audit log
export function logProjectActivity(projectId: string, actorId: string, actorName: string, action: string, details: string): void {
  const activity: ProjectActivity = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    projectId,
    actorId,
    actorName,
    action,
    details,
    createdAt: new Date().toISOString(),
  };
  inMemoryActivities.unshift(activity);
  persistAllToDisk();
}

/**
 * 1. Get all projects for current user context:
 * - Admin: sees all projects
 * - Mentor: sees projects where mentorIds.includes(userId)
 * - Member: sees projects where memberIds.includes(userId)
 */
export function getProjectsForUser(user: { id: string; role: string } | null): RoboticsProject[] {
  if (!user) return [];

  let list: RoboticsProject[] = [];
  if (user.role === 'admin') {
    list = inMemoryProjects;
  } else {
    list = inMemoryProjects.filter(
      (p) => p.mentorIds.includes(user.id) || p.memberIds.includes(user.id)
    );
  }

  return list.map(populateProject);
}

/**
 * 2. Get specific project details with role authorization
 */
export function getProjectById(projectId: string, user: { id: string; role: string } | null): RoboticsProject | null {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return null;

  if (user) {
    if (user.role !== 'admin' && !project.mentorIds.includes(user.id) && !project.memberIds.includes(user.id)) {
      return null; // Not authorized
    }
  }

  return populateProject(project);
}

/**
 * 3. Create Project (ADMIN ONLY)
 */
export function createProject(
  payload: { title: string; description: string; mentorIds: string[]; memberIds: string[] },
  actor: { id: string; name: string; role: string }
): { success: boolean; project?: RoboticsProject; error?: string } {
  if (actor.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Only administrators can create new robotics projects.' };
  }

  if (!payload.title || !payload.title.trim()) {
    return { success: false, error: 'Project title is required.' };
  }

  const projectId = `proj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const newProject: RoboticsProject = {
    id: projectId,
    title: payload.title.trim(),
    description: (payload.description || '').trim(),
    createdBy: actor.id,
    mentorIds: Array.isArray(payload.mentorIds) ? payload.mentorIds : [],
    memberIds: Array.isArray(payload.memberIds) ? payload.memberIds : [],
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  // Create exactly 3 phases: R&D (in_progress), Prototyping (locked), Documentation (locked)
  const defaultDeadline1 = new Date(Date.now() + 14 * 86400000).toISOString();
  const defaultDeadline2 = new Date(Date.now() + 30 * 86400000).toISOString();
  const defaultDeadline3 = new Date(Date.now() + 45 * 86400000).toISOString();

  const phase1: ProjectPhase = {
    id: `phase-${projectId}-rd`,
    projectId,
    phaseType: 'rd',
    deadline: defaultDeadline1,
    requirements: 'Literature survey, state-of-the-art benchmark, physics & math simulations, CAD concept sketches, and component selection sheet.',
    status: 'in_progress',
  };

  const phase2: ProjectPhase = {
    id: `phase-${projectId}-prototyping`,
    projectId,
    phaseType: 'prototyping',
    deadline: defaultDeadline2,
    requirements: 'Rapid prototype manufacturing, CNC/3D print assemblies, circuit PCB bring-up, motor torque testing, and telemetry logs.',
    status: 'locked',
  };

  const phase3: ProjectPhase = {
    id: `phase-${projectId}-docs`,
    projectId,
    phaseType: 'documentation',
    deadline: defaultDeadline3,
    requirements: 'Complete technical report, open-source repository release, safety checklists, and bill of materials.',
    status: 'locked',
  };

  inMemoryProjects.unshift(newProject);
  inMemoryPhases.push(phase1, phase2, phase3);

  logProjectActivity(projectId, actor.id, actor.name, 'project_created', `Project created by Admin ${actor.name}`);
  persistAllToDisk();

  return { success: true, project: populateProject(newProject) };
}

/**
 * 4. Mentor or Admin edits project details (Title & Description)
 */
export function updateProjectDetails(
  projectId: string,
  payload: { title?: string; description?: string },
  actor: { id: string; name: string; role: string }
): { success: boolean; project?: RoboticsProject; error?: string } {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: 'Project not found.' };

  const isAuthorized = actor.role === 'admin' || project.mentorIds.includes(actor.id);
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Only an assigned mentor or administrator can edit project details.' };
  }

  if (payload.title && payload.title.trim()) {
    project.title = payload.title.trim();
  }
  if (typeof payload.description === 'string') {
    project.description = payload.description.trim();
  }
  project.updatedAt = new Date().toISOString();

  logProjectActivity(projectId, actor.id, actor.name, 'details_updated', `Project details updated by ${actor.role === 'admin' ? 'Admin' : 'Mentor'} ${actor.name}`);
  persistAllToDisk();

  return { success: true, project: populateProject(project) };
}

/**
 * 5. Mentor or Admin manages team assignments (Add/remove mentors or members)
 */
export function updateProjectTeam(
  projectId: string,
  payload: { mentorIds?: string[]; memberIds?: string[] },
  actor: { id: string; name: string; role: string }
): { success: boolean; project?: RoboticsProject; error?: string } {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: 'Project not found.' };

  const isAuthorized = actor.role === 'admin' || project.mentorIds.includes(actor.id);
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Only an assigned mentor or administrator can update project team members.' };
  }

  if (Array.isArray(payload.mentorIds)) {
    project.mentorIds = payload.mentorIds;
  }
  if (Array.isArray(payload.memberIds)) {
    project.memberIds = payload.memberIds;
  }
  project.updatedAt = new Date().toISOString();

  logProjectActivity(projectId, actor.id, actor.name, 'team_updated', `Team assignments updated by ${actor.name}`);
  persistAllToDisk();

  return { success: true, project: populateProject(project) };
}

/**
 * 6. Mentor or Admin updates phase configuration (Deadline & Requirements)
 */
export function updatePhaseConfig(
  projectId: string,
  phaseId: string,
  payload: { deadline?: string; requirements?: string },
  actor: { id: string; name: string; role: string }
): { success: boolean; phase?: ProjectPhase; error?: string } {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: 'Project not found.' };

  const isAuthorized = actor.role === 'admin' || project.mentorIds.includes(actor.id);
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Only an assigned mentor or administrator can update phase deadlines and requirements.' };
  }

  const phase = inMemoryPhases.find((p) => p.id === phaseId && p.projectId === projectId);
  if (!phase) return { success: false, error: 'Phase not found.' };

  if (payload.deadline) {
    phase.deadline = new Date(payload.deadline).toISOString();
  }
  if (typeof payload.requirements === 'string') {
    phase.requirements = payload.requirements.trim();
  }

  project.updatedAt = new Date().toISOString();
  logProjectActivity(projectId, actor.id, actor.name, 'phase_config_updated', `Phase ${phase.phaseType.toUpperCase()} deadline/requirements updated by ${actor.name}`);
  persistAllToDisk();

  return { success: true, phase };
}

/**
 * 7. Team member, mentor, or admin submits work (Drive URL, Git URL, Notes)
 */
export function submitPhaseWork(
  projectId: string,
  phaseId: string,
  payload: { driveUrl?: string; gitUrl?: string; notes?: string },
  actor: { id: string; name: string; role: string }
): { success: boolean; submission?: PhaseSubmission; error?: string } {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: 'Project not found.' };

  const isAuthorizedMember =
    actor.role === 'admin' ||
    project.memberIds.includes(actor.id) ||
    project.mentorIds.includes(actor.id);

  if (!isAuthorizedMember) {
    return { success: false, error: 'Unauthorized: Only assigned team members or project administrators can submit work.' };
  }

  const phase = inMemoryPhases.find((p) => p.id === phaseId && p.projectId === projectId);
  if (!phase) return { success: false, error: 'Phase not found.' };

  if (phase.status === 'locked') {
    return { success: false, error: 'Phase is currently locked. The previous phase must be approved first.' };
  }

  if (phase.status === 'approved') {
    return { success: false, error: 'This phase has already been approved and closed.' };
  }

  // At least one link or note required
  if (!payload.driveUrl && !payload.gitUrl && !payload.notes) {
    return { success: false, error: 'Please provide at least a Google Drive link, GitHub repository link, or submission notes.' };
  }

  // Validate URLs
  const driveCheck = validateExternalUrl(payload.driveUrl);
  if (!driveCheck.valid) return { success: false, error: driveCheck.error };

  const gitCheck = validateExternalUrl(payload.gitUrl);
  if (!gitCheck.valid) return { success: false, error: gitCheck.error };

  const now = new Date();
  const isLate = phase.deadline ? now > new Date(phase.deadline) : false;

  const submission: PhaseSubmission = {
    id: `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    phaseId: phase.id,
    projectId,
    submittedBy: actor.id,
    submittedByName: actor.name,
    driveUrl: payload.driveUrl?.trim() || undefined,
    gitUrl: payload.gitUrl?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
    submittedAt: now.toISOString(),
    isLate,
  };

  inMemorySubmissions.unshift(submission);

  // Update phase state to 'submitted'
  phase.status = 'submitted';
  project.updatedAt = now.toISOString();

  logProjectActivity(
    projectId,
    actor.id,
    actor.name,
    'work_submitted',
    `Submission delivered by ${actor.name}${isLate ? ' (Late)' : ''}`
  );
  persistAllToDisk();

  return { success: true, submission };
}

/**
 * 8. Mentor or Admin reviews submission (Approve or Request Changes)
 */
export function reviewPhaseSubmission(
  projectId: string,
  phaseId: string,
  submissionId: string,
  payload: { decision: 'approved' | 'changes_requested'; feedback: string },
  actor: { id: string; name: string; role: string }
): { success: boolean; review?: SubmissionReview; project?: RoboticsProject; error?: string } {
  const project = inMemoryProjects.find((p) => p.id === projectId);
  if (!project) return { success: false, error: 'Project not found.' };

  const isAuthorized = actor.role === 'admin' || project.mentorIds.includes(actor.id);
  if (!isAuthorized) {
    return { success: false, error: 'Unauthorized: Only an assigned mentor or administrator can review submissions and approve phases.' };
  }

  const phase = inMemoryPhases.find((p) => p.id === phaseId && p.projectId === projectId);
  if (!phase) return { success: false, error: 'Phase not found.' };

  const submission = inMemorySubmissions.find((s) => s.id === submissionId && s.phaseId === phaseId);
  if (!submission) return { success: false, error: 'Submission record not found.' };

  if (payload.decision !== 'approved' && payload.decision !== 'changes_requested') {
    return { success: false, error: 'Invalid decision: Must be "approved" or "changes_requested".' };
  }

  const now = new Date().toISOString();

  const review: SubmissionReview = {
    id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    submissionId,
    phaseId,
    projectId,
    reviewedBy: actor.id,
    reviewedByName: actor.name,
    decision: payload.decision,
    feedback: (payload.feedback || '').trim(),
    reviewedAt: now,
  };

  inMemoryReviews.unshift(review);

  if (payload.decision === 'approved') {
    phase.status = 'approved';
    phase.approvedAt = now;
    phase.approvedBy = actor.id;

    // Progression: Unlock next phase
    const phasesOfProject = inMemoryPhases
      .filter((p) => p.projectId === projectId)
      .sort((a, b) => {
        const order: Record<ProjectPhaseType, number> = { rd: 1, prototyping: 2, documentation: 3 };
        return order[a.phaseType] - order[b.phaseType];
      });

    const currentIndex = phasesOfProject.findIndex((p) => p.id === phase.id);
    if (currentIndex >= 0 && currentIndex < phasesOfProject.length - 1) {
      const nextPhase = phasesOfProject[currentIndex + 1];
      if (nextPhase.status === 'locked') {
        nextPhase.status = 'in_progress';
      }
    } else if (currentIndex === phasesOfProject.length - 1) {
      // All 3 phases approved! Complete project!
      project.status = 'completed';
      logProjectActivity(projectId, actor.id, actor.name, 'project_completed', `All phases approved! Project successfully completed.`);
    }

    logProjectActivity(
      projectId,
      actor.id,
      actor.name,
      'phase_approved',
      `Phase ${phase.phaseType.toUpperCase()} approved by mentor ${actor.name}`
    );
  } else {
    // Changes Requested
    phase.status = 'changes_requested';
    logProjectActivity(
      projectId,
      actor.id,
      actor.name,
      'changes_requested',
      `Changes requested on ${phase.phaseType.toUpperCase()} by mentor ${actor.name}: ${review.feedback || 'Revision needed'}`
    );
  }

  project.updatedAt = now;
  persistAllToDisk();

  return { success: true, review, project: populateProject(project) };
}

/**
 * 9. Delete project permanently (ADMIN ONLY with explicit confirmation)
 */
export function deleteProject(
  projectId: string,
  actor: { id: string; name: string; role: string }
): { success: boolean; error?: string } {
  if (actor.role !== 'admin') {
    return { success: false, error: 'Unauthorized: Only administrators can permanently delete projects.' };
  }

  const projectIndex = inMemoryProjects.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    return { success: false, error: 'Project not found.' };
  }

  const projectTitle = inMemoryProjects[projectIndex].title;

  // Remove project and associated records
  inMemoryProjects.splice(projectIndex, 1);
  inMemoryPhases = inMemoryPhases.filter((p) => p.projectId !== projectId);
  inMemorySubmissions = inMemorySubmissions.filter((s) => s.projectId !== projectId);
  inMemoryReviews = inMemoryReviews.filter((r) => r.projectId !== projectId);
  inMemoryActivities = inMemoryActivities.filter((a) => a.projectId !== projectId);

  persistAllToDisk();

  console.log(`[PM Store] Project "${projectTitle}" (${projectId}) permanently deleted by Admin ${actor.name}`);
  return { success: true };
}
