import express from 'express';
import path from 'path';
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

dotenv.config();

const PORT = 3000;
const HOST = '0.0.0.0';

async function startServer() {
  const app = express();

  // Increase payload limit for CMS image syncs
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
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

  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: HOST,
        port: PORT,
        strictPort: true,
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
