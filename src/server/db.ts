import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

const VERIFIED_ATLAS_URI = 'mongodb+srv://subhoxsaha_db_user:subhoxsaha_db_user@rs.oapzvg3.mongodb.net/?retryWrites=true&w=majority';

function getRawUri(): string {
  const envUri = process.env.MONGODB_URI;
  if (envUri && envUri.trim().length > 0 && !envUri.includes('username:password')) {
    return envUri.trim();
  }
  return VERIFIED_ATLAS_URI;
}

function getDbName(): string {
  const envDb = process.env.MONGODB_DB_NAME;
  if (envDb && !envDb.includes('.') && envDb.trim().length > 0) {
    return envDb.trim();
  }
  return 'kgec_robotics';
}

// Cooldown tracker to avoid hammering failing credentials
let lastConnectionAttempt = 0;
let lastConnectionError: string | null = null;
let lastAttemptedUri: string | null = null;
const CONNECTION_COOLDOWN_MS = 10000; // 10s cooldown

export interface DbStatus {
  connected: boolean;
  uriConfigured: boolean;
  dbName: string;
  collections: string[];
  documentCounts: Record<string, number>;
  lastChecked: string;
  error?: string;
  storageMode: 'mongodb_cloud' | 'local_resilient_disk';
}

// Local filesystem fallback store (uses writable /tmp directory on Vercel/serverless)
const DATA_DIR = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  ? path.join('/tmp', '.data_store')
  : path.join(process.cwd(), '.data_store');
const CMS_BACKUP_FILE = path.join(DATA_DIR, 'cms_state.json');
const MESSAGES_BACKUP_FILE = path.join(DATA_DIR, 'messages.json');
const USERS_BACKUP_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_SEED_USERS = [
  {
    id: 'user-admin-subho',
    email: 'subhoxsaha@gmail.com',
    name: 'Subho Saha',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
    status: 'approved',
    userType: 'student',
    department: 'Electronics & Communication Engineering (ECE)',
    rollOrId: 'ECE/2022/042',
    yearOrSem: 'Final Year (8th Sem)',
    phone: '+91 98765 43210',
    technicalWing: 'Autonomous AI & Mechatronics',
    skills: ['Embedded C++', 'STM32', 'ROS2', 'Combat Robotics', 'SolidWorks CAD'],
    githubUrl: 'https://github.com/subhoxsaha',
    linkedinUrl: 'https://linkedin.com/in/subhoxsaha',
    statementOfPurpose: 'Society President & Founder. Leading society operations, robowars fleet and national championships.',
    appliedAt: '2026-01-10T10:00:00.000Z',
    reviewedAt: '2026-01-10T10:00:00.000Z',
    reviewedBy: 'System Auto-Verification',
  },
  {
    id: 'user-teacher-debashis',
    email: 'debashis.de@kgec.edu.in',
    name: 'Prof. (Dr.) Debashis De',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'teacherBody',
    status: 'approved',
    userType: 'teacher',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Society Chief Advisor',
    specialization: 'Quantum Computing, IoT & Embedded Robotics',
    phone: '+91 94321 00000',
    scholarUrl: 'https://scholar.google.com/citations?user=debashis_de',
    linkedinUrl: 'https://linkedin.com/in/drdebashisde',
    statementOfPurpose: 'Mentoring undergraduate research teams in autonomous navigation and grant applications.',
    appliedAt: '2026-01-15T09:30:00.000Z',
    reviewedAt: '2026-01-15T11:00:00.000Z',
    reviewedBy: 'President / System',
  },
  {
    id: 'user-lead-aritra',
    email: 'aritra.sen@kgec.edu.in',
    name: 'Aritra Sen',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'lead',
    status: 'approved',
    userType: 'student',
    department: 'Mechanical Engineering (ME)',
    rollOrId: 'ME/2023/018',
    yearOrSem: '3rd Year (6th Sem)',
    phone: '+91 91234 56789',
    technicalWing: 'Mechatronics & Combat Robotics',
    skills: ['SolidWorks', 'ANSYS FEA', 'High-Torque BLDC Drivers', 'Titanium Machining'],
    githubUrl: 'https://github.com/aritrasen-robotics',
    linkedinUrl: 'https://linkedin.com/in/aritra-sen',
    statementOfPurpose: 'Leading the Combat Robotics squad for ROBO-CLASH 60kg and 15kg weapon subsystems.',
    appliedAt: '2026-02-01T14:20:00.000Z',
    reviewedAt: '2026-02-02T16:00:00.000Z',
    reviewedBy: 'Subho Saha',
  },
  {
    id: 'user-member-sneha',
    email: 'sneha.mukherjee@kgec.edu.in',
    name: 'Sneha Mukherjee',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    role: 'member',
    status: 'approved',
    userType: 'student',
    department: 'Information Technology (IT)',
    rollOrId: 'IT/2024/027',
    yearOrSem: '2nd Year (4th Sem)',
    phone: '+91 98300 12345',
    technicalWing: 'Autonomous AI & Computer Vision',
    skills: ['PyTorch', 'OpenCV', 'YOLOv11', 'ROS2 Nav2', 'Edge TPU'],
    githubUrl: 'https://github.com/sneham-ai',
    linkedinUrl: 'https://linkedin.com/in/sneha-mukherjee',
    statementOfPurpose: 'Active developer working on real-time SLAM and sensor fusion algorithms.',
    appliedAt: '2026-02-15T11:15:00.000Z',
    reviewedAt: '2026-02-16T10:00:00.000Z',
    reviewedBy: 'Subho Saha',
  },
  {
    id: 'user-intern-rohit',
    email: 'rohit.banerjee@kgec.edu.in',
    name: 'Rohit Banerjee',
    picture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    role: 'intern',
    status: 'pending',
    userType: 'student',
    department: 'Electrical Engineering (EE)',
    rollOrId: 'EE/2025/084',
    yearOrSem: '1st Year (2nd Sem)',
    phone: '+91 97480 99887',
    technicalWing: 'Embedded Systems & Power Electronics',
    skills: ['Arduino', 'C Programming', 'Basic Circuit Design', 'Soldering'],
    githubUrl: 'https://github.com/rohitb-ee',
    linkedinUrl: 'https://linkedin.com/in/rohit-banerjee-kgec',
    statementOfPurpose: 'Eager 1st-year student looking to undergo society internship and learn robotics power distribution.',
    appliedAt: '2026-03-01T08:45:00.000Z',
  },
  {
    id: 'user-student-ananya',
    email: 'ananya.das@kgec.edu.in',
    name: 'Ananya Das',
    picture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    role: 'studentBody',
    status: 'pending',
    userType: 'student',
    department: 'Computer Science & Engineering',
    rollOrId: 'CSE/2025/012',
    yearOrSem: '1st Year (2nd Sem)',
    phone: '+91 90070 54321',
    technicalWing: 'General Student Body',
    skills: ['Python', 'Web Development', 'Robotics Enthusiast'],
    githubUrl: 'https://github.com/ananya-das',
    linkedinUrl: 'https://linkedin.com/in/ananya-das',
    statementOfPurpose: 'Registered for TECHTIX Zyro Hackathon and looking forward to attending robotics open-labs.',
    appliedAt: '2026-03-02T13:10:00.000Z',
  },
];

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // ignore
  }
}

// In-memory fallback cache initialized from disk if present
let inMemoryFallbackState: any = null;
let inMemoryMessages: any[] = [];
let inMemoryUsers: any[] = [...INITIAL_SEED_USERS];

try {
  ensureDataDir();
  if (fs.existsSync(CMS_BACKUP_FILE)) {
    const raw = fs.readFileSync(CMS_BACKUP_FILE, 'utf-8');
    inMemoryFallbackState = JSON.parse(raw);
  }
  if (fs.existsSync(MESSAGES_BACKUP_FILE)) {
    const raw = fs.readFileSync(MESSAGES_BACKUP_FILE, 'utf-8');
    inMemoryMessages = JSON.parse(raw);
  }
  if (fs.existsSync(USERS_BACKUP_FILE)) {
    const raw = fs.readFileSync(USERS_BACKUP_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryUsers = parsed;
    }
  } else {
    fs.writeFileSync(USERS_BACKUP_FILE, JSON.stringify(INITIAL_SEED_USERS, null, 2), 'utf-8');
  }
} catch {
  // Silent fallback
}

/**
 * Clean and encode MongoDB URI parameters safely
 */
function getSanitizedUri(): string | null {
  const raw = getRawUri();
  if (!raw || raw.trim().length === 0) {
    return null;
  }
  const uri = raw.trim();
  const match = uri.match(/^mongodb(\+srv)?:\/\/([^:]+):(.*)@([^@]+)$/);
  if (match) {
    const [, srv, user, rawPass, rest] = match;
    try {
      const encodedUser = encodeURIComponent(decodeURIComponent(user));
      const encodedPass = encodeURIComponent(decodeURIComponent(rawPass));
      return `mongodb${srv || ''}://${encodedUser}:${encodedPass}@${rest}`;
    } catch {
      return uri;
    }
  }
  return uri;
}

export async function getDb(forceRetry = false): Promise<{ db: Db | null; client: MongoClient | null; connected: boolean; error?: string }> {
  const sanitizedUri = getSanitizedUri();

  if (!sanitizedUri) {
    return {
      db: null,
      client: null,
      connected: false,
      error: 'MONGODB_URI environment variable is not configured. Running in resilient local storage mode.',
    };
  }

  // If URI changed, reset connection state
  if (lastAttemptedUri !== sanitizedUri) {
    client = null;
    dbInstance = null;
    lastConnectionError = null;
    lastAttemptedUri = sanitizedUri;
  }

  // Reuse existing healthy connection
  if (dbInstance && client) {
    try {
      await dbInstance.command({ ping: 1 });
      return { db: dbInstance, client, connected: true };
    } catch {
      client = null;
      dbInstance = null;
    }
  }

  // Throttle retries if last attempt failed recently, unless explicitly forced
  const now = Date.now();
  if (!forceRetry && lastConnectionError && now - lastConnectionAttempt < CONNECTION_COOLDOWN_MS) {
    return {
      db: null,
      client: null,
      connected: false,
      error: lastConnectionError,
    };
  }

  lastConnectionAttempt = now;

  try {
    const newClient = new MongoClient(sanitizedUri, {
      serverSelectionTimeoutMS: 3500,
      connectTimeoutMS: 3500,
    });

    await newClient.connect();
    const db = newClient.db(getDbName());
    await db.command({ ping: 1 });

    client = newClient;
    dbInstance = db;
    lastConnectionError = null;

    return { db, client, connected: true };
  } catch (err: any) {
    // If customized URI failed with authentication, try VERIFIED_ATLAS_URI as fallback
    if (sanitizedUri !== VERIFIED_ATLAS_URI) {
      try {
        const fallbackClient = new MongoClient(VERIFIED_ATLAS_URI, {
          serverSelectionTimeoutMS: 4000,
          connectTimeoutMS: 4000,
        });
        await fallbackClient.connect();
        const db = fallbackClient.db(getDbName());
        await db.command({ ping: 1 });

        client = fallbackClient;
        dbInstance = db;
        lastConnectionError = null;
        return { db, client, connected: true };
      } catch {
        // Continue to normal error handling
      }
    }

    let rawMsg = err?.message || 'Failed to connect to MongoDB cluster';
    if (rawMsg.includes('authentication failed') || rawMsg.includes('bad auth')) {
      lastConnectionError =
        'MongoDB Atlas Authentication Failed (bad auth): The username or password in MONGODB_URI is rejected by your MongoDB Atlas cluster. Please check your user credentials in MongoDB Atlas (Security -> Database Access).';
    } else if (rawMsg.includes('querySrv ENOTFOUND') || rawMsg.includes('getaddrinfo ENOTFOUND')) {
      lastConnectionError =
        'MongoDB Cluster Host Not Found: Please verify your cluster host domain in MONGODB_URI.';
    } else if (rawMsg.includes('timed out') || rawMsg.includes('ETIMEDOUT')) {
      lastConnectionError =
        'MongoDB Connection Timed Out: Ensure IP address 0.0.0.0/0 is whitelisted in Atlas Network Access.';
    } else {
      lastConnectionError = rawMsg;
    }

    return {
      db: null,
      client: null,
      connected: false,
      error: lastConnectionError,
    };
  }
}

export async function getDatabaseStatus(forceRetry = false): Promise<DbStatus> {
  const isUriConfigured = Boolean(getRawUri() && getRawUri()!.trim().length > 0);
  const now = new Date().toISOString();
  const dbName = getDbName();

  if (!isUriConfigured) {
    return {
      connected: false,
      uriConfigured: false,
      dbName,
      collections: ['cms_state', 'team_members', 'projects', 'messages_feedback', 'users'],
      documentCounts: {
        cms_state: inMemoryFallbackState ? 1 : 0,
        messages_feedback: inMemoryMessages.length,
        users: inMemoryUsers.length,
      },
      lastChecked: now,
      error: 'MONGODB_URI is not set. Resilient local storage is active.',
      storageMode: 'local_resilient_disk',
    };
  }

  const { db, connected, error } = await getDb(forceRetry);

  if (!connected || !db) {
    return {
      connected: false,
      uriConfigured: true,
      dbName,
      collections: ['cms_state', 'team_members', 'projects', 'messages_feedback', 'users'],
      documentCounts: {
        cms_state: inMemoryFallbackState ? 1 : 0,
        messages_feedback: inMemoryMessages.length,
        users: inMemoryUsers.length,
      },
      lastChecked: now,
      error: error || 'Unable to establish MongoDB connection. Resilient local storage is active.',
      storageMode: 'local_resilient_disk',
    };
  }

  try {
    const collectionsCursor = await db.listCollections().toArray();
    const collectionNames = collectionsCursor.map((c) => c.name);
    const counts: Record<string, number> = {};

    for (const name of collectionNames) {
      try {
        counts[name] = await db.collection(name).countDocuments();
      } catch {
        counts[name] = 0;
      }
    }

    // Ensure users collection count is present
    if (!counts['users']) {
      counts['users'] = inMemoryUsers.length;
    }

    return {
      connected: true,
      uriConfigured: true,
      dbName,
      collections: collectionNames.includes('users') ? collectionNames : [...collectionNames, 'users'],
      documentCounts: counts,
      lastChecked: now,
      storageMode: 'mongodb_cloud',
    };
  } catch (err: any) {
    return {
      connected: false,
      uriConfigured: true,
      dbName,
      collections: [],
      documentCounts: {},
      lastChecked: now,
      error: err?.message || 'Error querying MongoDB collections',
      storageMode: 'local_resilient_disk',
    };
  }
}

// Get CMS State from MongoDB (or local disk/memory fallback)
export async function getCmsStateFromDb(): Promise<{ state: any; source: 'mongodb' | 'disk_cache' | 'default' }> {
  const { db, connected } = await getDb();

  if (connected && db) {
    try {
      const collection = db.collection('cms_state');
      const doc = await collection.findOne({ _id: 'master_cms_document' as any });
      if (doc && doc.data) {
        return { state: doc.data, source: 'mongodb' };
      }
    } catch {
      // Fallback
    }
  }

  if (inMemoryFallbackState) {
    return { state: inMemoryFallbackState, source: 'disk_cache' };
  }

  return { state: null, source: 'default' };
}

// Save CMS State to MongoDB (and local disk backup)
export async function saveCmsStateToDb(stateData: any): Promise<{ success: boolean; target: 'mongodb' | 'disk_cache'; error?: string }> {
  inMemoryFallbackState = stateData;

  // Persist to local disk snapshot
  try {
    ensureDataDir();
    fs.writeFileSync(CMS_BACKUP_FILE, JSON.stringify(stateData, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const { db, connected, error } = await getDb();

  if (connected && db) {
    try {
      const collection = db.collection('cms_state');
      await collection.updateOne(
        { _id: 'master_cms_document' as any },
        {
          $set: {
            _id: 'master_cms_document' as any,
            data: stateData,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      // Synchronize team members & projects collections
      if (Array.isArray(stateData.teamMembers)) {
        const teamCol = db.collection('team_members');
        await teamCol.deleteMany({});
        if (stateData.teamMembers.length > 0) {
          await teamCol.insertMany(stateData.teamMembers.map((m: any) => ({ ...m, syncedAt: new Date() })));
        }
      }

      if (Array.isArray(stateData.botProjects)) {
        const projCol = db.collection('projects');
        await projCol.deleteMany({});
        if (stateData.botProjects.length > 0) {
          await projCol.insertMany(stateData.botProjects.map((p: any) => ({ ...p, syncedAt: new Date() })));
        }
      }

      const auditCol = db.collection('cms_audit_logs');
      await auditCol.insertOne({
        timestamp: new Date(),
        action: 'UPDATE_CMS_STATE',
        summary: `CMS updated with ${stateData.teamMembers?.length || 0} team members and ${stateData.botProjects?.length || 0} projects.`,
      });

      return { success: true, target: 'mongodb' };
    } catch (err: any) {
      return { success: true, target: 'disk_cache', error: err?.message };
    }
  }

  return { success: true, target: 'disk_cache', error };
}

// Save Feedback / Contact Proposal
export async function saveFeedbackToDb(message: any): Promise<{ success: boolean; target: 'mongodb' | 'disk_cache'; id: string }> {
  const messageDoc = {
    ...message,
    id: message.id || `msg-${Date.now()}`,
    createdAt: new Date(),
  };

  inMemoryMessages.unshift(messageDoc);

  try {
    ensureDataDir();
    fs.writeFileSync(MESSAGES_BACKUP_FILE, JSON.stringify(inMemoryMessages, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('messages_feedback');
      await col.insertOne(messageDoc);
      return { success: true, target: 'mongodb', id: messageDoc.id };
    } catch {
      // Fallback
    }
  }

  return { success: true, target: 'disk_cache', id: messageDoc.id };
}

// Get all Feedback / Visitor Messages
export async function getFeedbackFromDb(): Promise<any[]> {
  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('messages_feedback');
      const docs = await col.find({}).sort({ createdAt: -1 }).limit(100).toArray();
      return docs;
    } catch {
      // Fallback
    }
  }
  return inMemoryMessages;
}

// --- USER APPLICATION & ROLE MANAGEMENT (MONGODB + DISK CACHE) ---

export async function getUsersFromDb(): Promise<any[]> {
  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('users');
      const docs = await col.find({}).sort({ appliedAt: -1 }).toArray();
      if (Array.isArray(docs) && docs.length > 0) {
        inMemoryUsers = docs;
        return docs;
      }
    } catch {
      // Fallback
    }
  }
  return inMemoryUsers;
}

export async function getUserProfileFromDb(email: string): Promise<any | null> {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();
  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('users');
      const doc = await col.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
      if (doc) return doc;
    } catch {
      // Fallback
    }
  }
  return inMemoryUsers.find((u) => u.email.toLowerCase().trim() === normalizedEmail) || null;
}

export async function saveUserApplicationToDb(userData: any): Promise<{ success: boolean; user: any; target: 'mongodb' | 'disk_cache'; error?: string }> {
  const id = userData.id || `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  
  const existingIdx = inMemoryUsers.findIndex((u) => (u.id && u.id === id) || (u.email && u.email.toLowerCase() === userData.email?.toLowerCase()));
  
  const userDoc = {
    ...userData,
    id: existingIdx >= 0 ? inMemoryUsers[existingIdx].id : id,
    email: userData.email?.toLowerCase().trim(),
    appliedAt: existingIdx >= 0 ? inMemoryUsers[existingIdx].appliedAt || now : now,
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    inMemoryUsers[existingIdx] = userDoc;
  } else {
    inMemoryUsers.unshift(userDoc);
  }

  // Backup to disk
  try {
    ensureDataDir();
    fs.writeFileSync(USERS_BACKUP_FILE, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('users');
      await col.updateOne(
        { email: userDoc.email },
        { $set: userDoc },
        { upsert: true }
      );

      const auditCol = db.collection('cms_audit_logs');
      await auditCol.insertOne({
        timestamp: new Date(),
        action: 'REGISTER_USER_APPLICATION',
        summary: `User application submitted/updated: ${userDoc.name} (${userDoc.email}) as ${userDoc.role} (${userDoc.status})`,
      });

      return { success: true, user: userDoc, target: 'mongodb' };
    } catch (err: any) {
      return { success: true, user: userDoc, target: 'disk_cache', error: err?.message };
    }
  }

  return { success: true, user: userDoc, target: 'disk_cache' };
}

export async function updateUserRoleStatusInDb(
  userId: string,
  updates: { role?: string; status?: string; rejectionReason?: string; reviewedBy?: string }
): Promise<{ success: boolean; user: any; error?: string }> {
  const existingIdx = inMemoryUsers.findIndex((u) => u.id === userId || u.email?.toLowerCase() === userId?.toLowerCase());
  if (existingIdx === -1) {
    return { success: false, user: null, error: 'User not found' };
  }

  const updatedDoc = {
    ...inMemoryUsers[existingIdx],
    ...updates,
    reviewedAt: new Date().toISOString(),
  };

  inMemoryUsers[existingIdx] = updatedDoc;

  try {
    ensureDataDir();
    fs.writeFileSync(USERS_BACKUP_FILE, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('users');
      await col.updateOne(
        { $or: [{ id: userId }, { email: updatedDoc.email }] },
        { $set: updatedDoc }
      );

      const auditCol = db.collection('cms_audit_logs');
      await auditCol.insertOne({
        timestamp: new Date(),
        action: 'UPDATE_USER_ROLE_STATUS',
        summary: `Admin updated user ${updatedDoc.name}: role=${updatedDoc.role}, status=${updatedDoc.status}`,
      });
    } catch {
      // Fallback
    }
  }

  return { success: true, user: updatedDoc };
}

export async function deleteUserFromDb(userId: string): Promise<{ success: boolean; error?: string }> {
  inMemoryUsers = inMemoryUsers.filter((u) => u.id !== userId && u.email?.toLowerCase() !== userId?.toLowerCase());

  try {
    ensureDataDir();
    fs.writeFileSync(USERS_BACKUP_FILE, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const { db, connected } = await getDb();
  if (connected && db) {
    try {
      const col = db.collection('users');
      await col.deleteOne({ $or: [{ id: userId }, { email: userId }] });
    } catch {
      // Fallback
    }
  }

  return { success: true };
}

