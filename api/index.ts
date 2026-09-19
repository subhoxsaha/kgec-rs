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

// Submit or update user application
app.post('/api/users/application', async (req, res) => {
  try {
    const profileData = req.body;
    const user = await saveUserApplicationToDb(profileData);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save application' });
  }
});

// Admin update user role / status
app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, status, reviewedBy } = req.body;
    const user = await updateUserRoleStatusInDb(userId, { role, status, reviewedBy });
    res.json({ success: true, user });
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

export default app;
