const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

let PrismaClient;
let prisma = null;
let usePrisma = false;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
  prisma = new PrismaClient();
  usePrisma = true;
  console.log('Prisma client loaded, using SQLite persistence');
} catch (e) {
  console.log('Prisma not available — falling back to file-based persistence');
}

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'deeset-dev-secret-change-me';

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const DATA_FILE = path.join(__dirname, 'data.json');

// file-based DB fallback
let db = {
  users: [
    {
      id: 'admin-1',
      name: 'MastaDee',
      email: 'mastadee01@gmail.com',
      passwordHash: bcrypt.hashSync('MastaDee', 10),
      role: 'admin',
      paymentStatus: 'paid_premium',
      createdAt: new Date().toISOString(),
    },
  ],
  meetings: [],
  cbtCodes: [],
  cbtQuestions: [
    {
      id: 'q-1',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: '4',
      createdAt: new Date().toISOString(),
    },
  ],
  resources: [],
};

function saveDB() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Failed to save DB', e);
  }
}

function loadDB() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      db = JSON.parse(raw);
    } else {
      saveDB();
    }
  } catch (e) {
    console.error('Failed to load DB', e);
  }
}

if (!usePrisma) loadDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, uploadDir);
  },
  filename: function (_, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage });

const signToken = (user) => jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

async function findUserByEmail(email) {
  if (usePrisma) {
    return await prisma.user.findUnique({ where: { email } });
  }
  return db.users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
}

async function findUserById(id) {
  if (usePrisma) {
    return await prisma.user.findUnique({ where: { id } });
  }
  return db.users.find((u) => u.id === id);
}

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.deeset_token;
    const auth = req.headers.authorization || '';
    const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const token = cookieToken || headerToken;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUserById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'Invalid user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin required' });
  }
  next();
};

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'deeset-hub-backend' }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await findUserByEmail(String(email || '').toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(String(password || ''), user.passwordHash || user.passwordHash || user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user);

  // set httpOnly cookie
  res.cookie('deeset_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  // return user without token
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, paymentStatus: user.paymentStatus } });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('deeset_token', { path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const u = req.user;
  res.json({ id: u.id, name: u.name, email: u.email, role: u.role, paymentStatus: u.paymentStatus });
});

// Meetings
app.get('/api/meetings', authMiddleware, async (req, res) => {
  if (usePrisma) {
    const meetings = await prisma.meeting.findMany({ orderBy: { scheduledAt: 'asc' } });
    return res.json(meetings);
  }
  res.json(db.meetings);
});

app.post('/api/meetings', authMiddleware, adminMiddleware, async (req, res) => {
  const { title, scheduledAt, platform, meetingLink, notes } = req.body || {};
  if (!title || !scheduledAt || !meetingLink) {
    return res.status(400).json({ error: 'title, scheduledAt, and meetingLink are required' });
  }

  if (usePrisma) {
    const meeting = await prisma.meeting.create({ data: { title, scheduledAt: new Date(scheduledAt), platform: platform || 'zoom', meetingLink, notes: notes || '', hostName: req.user.name, hostEmail: req.user.email } });
    return res.status(201).json(meeting);
  }

  const meeting = { id: crypto.randomUUID(), title, hostName: req.user.name, hostEmail: req.user.email, scheduledAt, platform: platform || 'zoom', meetingLink, notes: notes || '', createdAt: new Date().toISOString() };
  db.meetings.push(meeting);
  saveDB();
  res.status(201).json(meeting);
});

// CBT Questions
app.get('/api/cbt/questions', authMiddleware, async (req, res) => {
  if (usePrisma) {
    const qs = await prisma.cBTQuestion.findMany({ orderBy: { createdAt: 'asc' } });
    return res.json(qs);
  }
  res.json(db.cbtQuestions);
});

app.post('/api/cbt/questions', authMiddleware, adminMiddleware, async (req, res) => {
  const { question, options, answer } = req.body || {};
  if (!question || !Array.isArray(options) || !answer) {
    return res.status(400).json({ error: 'question, options, and answer are required' });
  }

  if (usePrisma) {
    const item = await prisma.cBTQuestion.create({ data: { question, options: { set: options }, answer } });
    return res.status(201).json(item);
  }

  const item = { id: crypto.randomUUID(), question, options, answer, createdAt: new Date().toISOString() };
  db.cbtQuestions.push(item);
  saveDB();
  res.status(201).json(item);
});

// CBT codes
app.post('/api/cbt/generate', authMiddleware, adminMiddleware, async (req, res) => {
  const rawCode = `CBT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  if (usePrisma) {
    const item = await prisma.cBTCode.create({ data: { code: rawCode, createdBy: req.user.id } });
    return res.status(201).json({ code: item.code });
  }
  const item = { id: crypto.randomUUID(), code: rawCode, createdBy: req.user.id, createdAt: new Date().toISOString(), used: false };
  db.cbtCodes.push(item);
  saveDB();
  res.status(201).json({ code: rawCode });
});

app.post('/api/cbt/validate', authMiddleware, async (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ valid: false, error: 'Code is required' });

  if (usePrisma) {
    // atomic check & update
    const found = await prisma.cBTCode.findFirst({ where: { code, used: false } });
    if (!found) return res.status(200).json({ valid: false, error: 'Invalid or used code' });
    await prisma.cBTCode.update({ where: { id: found.id }, data: { used: true, usedAt: new Date() } });
    return res.json({ valid: true, message: 'Code accepted' });
  }

  const foundIndex = db.cbtCodes.findIndex((entry) => entry.code === code && !entry.used);
  if (foundIndex === -1) return res.status(200).json({ valid: false, error: 'Invalid or used code' });
  db.cbtCodes[foundIndex].used = true;
  db.cbtCodes[foundIndex].usedAt = new Date().toISOString();
  saveDB();
  res.json({ valid: true, message: 'Code accepted' });
});

// Resources
app.get('/api/resources', authMiddleware, async (req, res) => {
  if (usePrisma) {
    const list = await prisma.resource.findMany({ orderBy: { uploadedAt: 'desc' } });
    return res.json(list);
  }
  res.json(db.resources);
});

app.post('/api/resources/upload', authMiddleware, adminMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const data = {
    id: crypto.randomUUID(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: `/uploads/${req.file.filename}`,
    size: req.file.size,
    uploadedBy: req.user.id,
    uploadedAt: new Date().toISOString(),
  };

  if (usePrisma) {
    const rec = await prisma.resource.create({ data: { filename: data.filename, originalName: data.originalName, path: data.path, size: data.size, uploadedBy: data.uploadedBy } });
    return res.status(201).json(rec);
  }

  db.resources.push(data);
  saveDB();
  res.status(201).json(data);
});

app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`DeeSET Hub backend running on http://localhost:${PORT}`);
});
