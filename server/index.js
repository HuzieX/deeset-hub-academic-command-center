const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'deeset-dev-secret-change-me';

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const DATA_FILE = path.join(__dirname, 'data.json');

// load or init DB
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

loadDB();

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

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = db.users.find((u) => u.id === decoded.sub) || null;
    if (!req.user) return res.status(401).json({ error: 'Invalid user' });
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

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = db.users.find((u) => u.email.toLowerCase() === String(email || '').toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = bcrypt.compareSync(String(password || ''), user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      paymentStatus: user.paymentStatus,
    },
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    paymentStatus: req.user.paymentStatus,
  });
});

app.get('/api/meetings', authMiddleware, (req, res) => {
  res.json(db.meetings);
});

app.post('/api/meetings', authMiddleware, adminMiddleware, (req, res) => {
  const { title, scheduledAt, platform, meetingLink, notes } = req.body || {};
  if (!title || !scheduledAt || !meetingLink) {
    return res.status(400).json({ error: 'title, scheduledAt, and meetingLink are required' });
  }

  const meeting = {
    id: crypto.randomUUID(),
    title,
    hostName: req.user.name,
    hostEmail: req.user.email,
    scheduledAt,
    platform: platform || 'zoom',
    meetingLink,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  db.meetings.push(meeting);
  saveDB();
  res.status(201).json(meeting);
});

app.get('/api/cbt/questions', authMiddleware, (req, res) => {
  res.json(db.cbtQuestions);
});

app.post('/api/cbt/questions', authMiddleware, adminMiddleware, (req, res) => {
  const { question, options, answer } = req.body || {};
  if (!question || !Array.isArray(options) || !answer) {
    return res.status(400).json({ error: 'question, options, and answer are required' });
  }

  const item = {
    id: crypto.randomUUID(),
    question,
    options,
    answer,
    createdAt: new Date().toISOString(),
  };

  db.cbtQuestions.push(item);
  saveDB();
  res.status(201).json(item);
});

app.post('/api/cbt/generate', authMiddleware, adminMiddleware, (req, res) => {
  const rawCode = `CBT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const item = {
    id: crypto.randomUUID(),
    code: rawCode,
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    used: false,
  };
  db.cbtCodes.push(item);
  saveDB();
  res.status(201).json({ code: rawCode });
});

app.post('/api/cbt/validate', authMiddleware, (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ valid: false, error: 'Code is required' });
  const foundIndex = db.cbtCodes.findIndex((entry) => entry.code === code && !entry.used);
  if (foundIndex === -1) return res.status(200).json({ valid: false, error: 'Invalid or used code' });

  db.cbtCodes[foundIndex].used = true;
  db.cbtCodes[foundIndex].usedAt = new Date().toISOString();
  saveDB();
  res.json({ valid: true, message: 'Code accepted' });
});

app.get('/api/resources', authMiddleware, (req, res) => {
  res.json(db.resources);
});

app.post('/api/resources/upload', authMiddleware, adminMiddleware, upload.single('file'), (req, res) => {
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
  db.resources.push(data);
  saveDB();
  res.status(201).json(data);
});

app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
  console.log(`DeeSET Hub backend running on http://localhost:${PORT}`);
});
