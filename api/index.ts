import express from 'express';
import dotenv from 'dotenv';
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
} from '../src/server/db.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'vercel-serverless' });
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

// Get all registered users/applications
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsersFromDb();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch users' });
  }
});

// Get single user profile
app.get('/api/users/profile', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ error: 'Email parameter required' });
      return;
    }
    const user = await getUserProfileFromDb(email);
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch user profile' });
  }
});

// Submit or update user application (supports both /register and /application endpoints)
const handleUserRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const profileData = req.body;
    if (!profileData || (!profileData.email && !profileData.id)) {
      res.status(400).json({ error: 'Valid profile data is required' });
      return;
    }
    const result = await saveUserApplicationToDb(profileData);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save application' });
  }
};

app.post('/api/users/register', handleUserRegistration);
app.post('/api/users/application', handleUserRegistration);

// Admin update user role / status (supports both PUT and PATCH)
const handleUserStatusUpdate = async (req: express.Request, res: express.Response) => {
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
};

app.put('/api/users/:id/status', handleUserStatusUpdate);
app.patch('/api/users/:id/status', handleUserStatusUpdate);

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

// JSON fallback for any unhandled /api/* routes to avoid returning HTML DOCTYPE
app.use((req, res) => {
  res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

export default app;
