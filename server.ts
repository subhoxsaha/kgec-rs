import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  getDatabaseStatus,
  getCmsStateFromDb,
  saveCmsStateToDb,
  saveFeedbackToDb,
  getFeedbackFromDb,
  getUsersFromDb,
  getUserProfileFromDb,
  saveUserApplicationToDb,
  updateUserRoleStatusInDb,
  deleteUserFromDb,
} from './src/server/db.js';
import {
  getProjectsForUser,
  getProjectById,
  createProject,
  updateProjectDetails,
  updateProjectTeam,
  updatePhaseConfig,
  submitPhaseWork,
  reviewPhaseSubmission,
  deleteProject,
} from './src/server/projectsDb.js';

dotenv.config();

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Increase payload limit for CMS image syncs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Pre-route path normalization for serverless and proxy rewrites
  app.use((req, _res, next) => {
    if (req.url && !req.url.startsWith('/api') && req.originalUrl?.startsWith('/api')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
    next();
  });

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Media files manifest (Instant background detection of dropped images in public folders)
  app.get('/api/media/files', (req, res) => {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      const getFiles = (sub: string) => {
        const dir = path.join(publicDir, sub);
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir).filter(
          (f) => !f.startsWith('.') && f !== 'README.txt' && !f.endsWith('.txt')
        );
      };

      const getEventFiles = () => {
        const eventsDir = path.join(publicDir, 'events');
        if (!fs.existsSync(eventsDir)) return [];
        const results: string[] = [];
        const subfolders = ['hackathon', 'techfest', 'workshop'];
        for (const sub of subfolders) {
          const subDir = path.join(eventsDir, sub);
          if (fs.existsSync(subDir)) {
            const files = fs.readdirSync(subDir).filter(
              (f) => !f.startsWith('.') && !f.endsWith('.txt')
            );
            files.forEach((f) => results.push(`${sub}/${f}`));
          }
        }
        // Also check any direct root files in events/
        const rootFiles = fs.readdirSync(eventsDir).filter(
          (f) => !f.startsWith('.') && !f.endsWith('.txt') && !subfolders.includes(f)
        );
        results.push(...rootFiles);
        return results;
      };

      res.json({
        team: getFiles('team'),
        events: getEventFiles(),
        projects: getFiles('projects'),
        logos: getFiles('logos'),
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to list media files' });
    }
  });

  // MongoDB Status & Diagnostics
  app.get('/api/db/status', async (req, res) => {
    try {
      const force = req.query.force === 'true';
      const status = await getDatabaseStatus(force);
      res.json(status);
    } catch (err: any) {
      res.status(500).json({
        connected: false,
        error: err?.message || 'Failed to check database status',
      });
    }
  });

  // Get full CMS state from MongoDB
  app.get('/api/cms/state', async (req, res) => {
    try {
      const result = await getCmsStateFromDb();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to load CMS state' });
    }
  });

  // Save / Update full CMS state to MongoDB
  app.post('/api/cms/state', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload) {
        res.status(400).json({ error: 'Payload body is required' });
        return;
      }
      const result = await saveCmsStateToDb(payload);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to save CMS state to MongoDB' });
    }
  });

  // Submit Feedback / Contact Proposal
  app.post('/api/feedback', async (req, res) => {
    try {
      const message = req.body;
      const result = await saveFeedbackToDb(message);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to record feedback message' });
    }
  });

  // Get all feedback messages
  app.get('/api/feedback', async (req, res) => {
    try {
      const messages = await getFeedbackFromDb();
      res.json({ messages });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch feedback' });
    }
  });

  // --- USER APPLICATION & ROLE MANAGEMENT ROUTES ---

  // Get all registered users/applications
  app.get('/api/users', async (req, res) => {
    try {
      const users = await getUsersFromDb();
      res.json({ users });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch users' });
    }
  });

  // Get user profile by email
  app.get('/api/users/profile', async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ error: 'Email parameter is required' });
        return;
      }
      const user = await getUserProfileFromDb(email);
      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch user profile' });
    }
  });

  // Register / submit / update user application (requires authenticated user identity)
  app.post('/api/users/register', async (req, res) => {
    try {
      const userData = req.body;
      if (!userData || !userData.email || typeof userData.email !== 'string' || !userData.email.trim()) {
        res.status(400).json({ error: 'Authentication required: A valid authenticated user email is required to submit an application.' });
        return;
      }
      if (!userData.name || typeof userData.name !== 'string' || !userData.name.trim()) {
        res.status(400).json({ error: 'Applicant name is required.' });
        return;
      }
      const result = await saveUserApplicationToDb(userData);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to register user application' });
    }
  });

  // Update user role / status (admin approval, rejection, or role promotion)
  app.put('/api/users/:id/status', async (req, res) => {
    try {
      const userId = req.params.id;
      const { role, status, rejectionReason, reviewedBy } = req.body;
      const result = await updateUserRoleStatusInDb(userId, { role, status, rejectionReason, reviewedBy });
      if (!result.success) {
        res.status(404).json(result);
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update user status' });
    }
  });

  // Delete user
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await deleteUserFromDb(userId);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to delete user' });
    }
  });

  // --- PROJECT MANAGEMENT MODULE ROUTES ---

  function getActorFromReq(req: express.Request) {
    const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || (req.body?.userId as string);
    const userRole = (req.headers['x-user-role'] as string) || (req.query.userRole as string) || (req.body?.userRole as string);
    const userName = (req.headers['x-user-name'] as string) || (req.query.userName as string) || (req.body?.userName as string);
    if (!userId || !userRole || userRole === 'guest') {
      return { id: '', role: 'guest', name: 'Guest' };
    }
    return { id: userId, role: userRole, name: userName || 'User' };
  }

  // Get projects for current user context (Admin sees all, mentor/member sees assigned)
  app.get('/api/pm/projects', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const projects = getProjectsForUser(actor);
      res.json({ projects });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch projects' });
    }
  });

  // Get single project details
  app.get('/api/pm/projects/:id', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const project = getProjectById(req.params.id, actor);
      if (!project) {
        res.status(404).json({ error: 'Project not found or not authorized' });
        return;
      }
      res.json({ project });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to fetch project' });
    }
  });

  // Create new project (Admin only)
  app.post('/api/pm/projects', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = createProject(req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to create project' });
    }
  });

  // Edit project details (Mentor only)
  app.put('/api/pm/projects/:id', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = updateProjectDetails(req.params.id, req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update project details' });
    }
  });

  // Edit project team members (Mentor only)
  app.put('/api/pm/projects/:id/team', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = updateProjectTeam(req.params.id, req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update team members' });
    }
  });

  // Update phase deadline and requirements (Mentor only)
  app.put('/api/pm/projects/:id/phases/:phaseId', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = updatePhaseConfig(req.params.id, req.params.phaseId, req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to update phase settings' });
    }
  });

  // Submit phase deliverables (Member only)
  app.post('/api/pm/projects/:id/phases/:phaseId/submissions', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = submitPhaseWork(req.params.id, req.params.phaseId, req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to submit phase deliverables' });
    }
  });

  // Review submission (Mentor only: Approve / Request Changes)
  app.post('/api/pm/projects/:id/phases/:phaseId/submissions/:submissionId/review', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = reviewPhaseSubmission(req.params.id, req.params.phaseId, req.params.submissionId, req.body, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to review submission' });
    }
  });

  // Permanently delete project (Admin only with confirmation)
  app.delete('/api/pm/projects/:id', async (req, res) => {
    try {
      const actor = getActorFromReq(req);
      if (!actor.id || actor.role === 'guest') {
        res.status(401).json({ error: 'Unauthorized: Project Management is accessible only to accepted KGEC Robotics society members.' });
        return;
      }
      const result = deleteProject(req.params.id, actor);
      if (!result.success) {
        res.status(400).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to delete project' });
    }
  });

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: HOST,
        port: PORT,
        strictPort: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[KGEC Robotics] Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
