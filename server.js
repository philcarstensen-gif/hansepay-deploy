'use strict';

const express = require('express');
const cal = (() => { try { return require('./lib/calendar'); } catch(e) { return null; } })();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4200;
const JWT_SECRET = 'hansepay-cms-secret-2024';
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer — store uploads with original extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uuidv4() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Static files — files live at repo root in hansepay-deploy
app.use(express.static(__dirname));
// Also serve under /hansepay/ prefix for compatibility with landing page links
app.use('/hansepay', express.static(__dirname));
// Serve uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Data helpers ───────────────────────────────────────────────────────────

function readData(filename) {
  const fp = path.join(DATA_DIR, filename);
  if (!fs.existsSync(fp)) return filename.endsWith('analytics.json') ? [] : {};
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function writeData(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf8');
}

// ─── Auth middleware ─────────────────────────────────────────────────────────

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// ─── Auth routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = readData('users.json');
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const users = readData('users.json');
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { passwordHash, ...userSafe } = user;
  res.json(userSafe);
});

// ─── Image upload ─────────────────────────────────────────────────────────────

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

app.delete('/api/upload/:filename', authenticateToken, (req, res) => {
  const fp = path.join(UPLOADS_DIR, path.basename(req.params.filename));
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
  res.json({ success: true });
});

// ─── Posts routes ─────────────────────────────────────────────────────────────

app.get('/api/posts', (req, res) => {
  const all = req.query.status === 'all';
  if (all) {
    // Requires auth
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const posts = readData('posts.json');
    return res.json(posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }

  const posts = readData('posts.json');
  const published = posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(published);
});

app.get('/api/posts/:slug', (req, res) => {
  const posts = readData('posts.json');
  const idx = posts.findIndex(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: 'Post not found' });

  // Increment view count (support both 'viewCount' and 'views' field names)
  if ('viewCount' in posts[idx]) {
    posts[idx].viewCount = (posts[idx].viewCount || 0) + 1;
  } else {
    posts[idx].views = (posts[idx].views || 0) + 1;
  }
  writeData('posts.json', posts);

  res.json(posts[idx]);
});

app.post('/api/posts', authenticateToken, (req, res) => {
  const { title, slug, excerpt, content, category, tags, status, featuredImage } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const users = readData('users.json');
  const author = users.find(u => u.id === req.user.id);

  const posts = readData('posts.json');
  const newPost = {
    id: 'post_' + uuidv4().replace(/-/g, '').substring(0, 8),
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    excerpt: excerpt || '',
    content: content || '',
    category: category || 'Uncategorised',
    tags: tags || [],
    status: status || 'draft',
    featuredImage: featuredImage || null,
    authorId: req.user.id,
    authorName: author ? author.name : req.user.name,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  posts.push(newPost);
  writeData('posts.json', posts);
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', authenticateToken, (req, res) => {
  const posts = readData('posts.json');
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post not found' });

  const allowed = ['title', 'slug', 'excerpt', 'content', 'category', 'tags', 'status', 'featuredImage'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) posts[idx][k] = req.body[k];
  });
  posts[idx].updatedAt = new Date().toISOString();

  writeData('posts.json', posts);
  res.json(posts[idx]);
});

app.delete('/api/posts/:id', authenticateToken, requireAdmin, (req, res) => {
  let posts = readData('posts.json');
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Post not found' });
  posts.splice(idx, 1);
  writeData('posts.json', posts);
  res.json({ success: true });
});

// ─── Users routes ─────────────────────────────────────────────────────────────

app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  res.json(users.map(({ passwordHash, ...u }) => u));
});

app.post('/api/users', authenticateToken, requireAdmin, (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

  const users = readData('users.json');
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'Email already in use' });

  const newUser = {
    id: 'usr_' + uuidv4().replace(/-/g, '').substring(0, 8),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role || 'editor',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData('users.json', users);
  const { passwordHash, ...userSafe } = newUser;
  res.status(201).json(userSafe);
});

app.put('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const users = readData('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });

  const allowed = ['name', 'email', 'role'];
  allowed.forEach(k => {
    if (req.body[k] !== undefined) users[idx][k] = req.body[k];
  });
  if (req.body.password) {
    users[idx].passwordHash = bcrypt.hashSync(req.body.password, 10);
  }

  writeData('users.json', users);
  const { passwordHash, ...userSafe } = users[idx];
  res.json(userSafe);
});

app.delete('/api/users/:id', authenticateToken, requireAdmin, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  let users = readData('users.json');
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  writeData('users.json', users);
  res.json({ success: true });
});

// ─── Analytics routes ─────────────────────────────────────────────────────────

app.post('/api/analytics/pageview', (req, res) => {
  const { page, referrer } = req.body;
  const analytics = readData('analytics.json');
  analytics.push({
    id: uuidv4(),
    page: page || '/',
    referrer: referrer || '',
    timestamp: new Date().toISOString()
  });
  writeData('analytics.json', analytics);
  res.json({ success: true });
});

app.get('/api/analytics/summary', authenticateToken, (req, res) => {
  const analytics = readData('analytics.json');
  const posts = readData('posts.json');
  const users = readData('users.json');

  const totalPageviews = analytics.length;
  const postsPublished = posts.filter(p => p.status === 'published').length;
  const postsDraft = posts.filter(p => p.status === 'draft').length;
  const totalUsers = users.length;

  // Views by page
  const viewsByPage = {};
  analytics.forEach(a => {
    viewsByPage[a.page] = (viewsByPage[a.page] || 0) + 1;
  });

  // Views last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const viewsLast30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    const count = analytics.filter(a => a.timestamp && a.timestamp.startsWith(dateStr)).length;
    viewsLast30Days.push({ date: dateStr, count });
  }

  // Top posts (support both 'viewCount' and 'views' field names)
  const topPosts = [...posts]
    .filter(p => p.status === 'published')
    .sort((a, b) => (b.viewCount || b.views || 0) - (a.viewCount || a.views || 0))
    .slice(0, 5)
    .map(p => ({ id: p.id, title: p.title, slug: p.slug, viewCount: p.viewCount || p.views || 0 }));

  res.json({
    totalPageviews,
    postsPublished,
    postsDraft,
    totalUsers,
    viewsByPage,
    viewsLast30Days,
    topPosts
  });
});

// ─── Settings routes ──────────────────────────────────────────────────────────

app.get('/api/settings', authenticateToken, (req, res) => {
  res.json(readData('settings.json'));
});

app.put('/api/settings', authenticateToken, requireAdmin, (req, res) => {
  const current = readData('settings.json');
  const updated = Object.assign({}, current, req.body);
  writeData('settings.json', updated);
  res.json(updated);
});

// ─── Booking routes ───────────────────────────────────────────────────────────

// GET /api/booking/auth — start one-time OAuth2 authorisation flow
// Visit this URL in a browser while logged in as the calendar owner.
// After consent you are redirected to /api/booking/auth/callback which prints
// the refresh token — copy it into Railway as GOOGLE_REFRESH_TOKEN.
app.get('/api/booking/auth', (req, res) => {
  if (!cal) return res.status(503).send('Calendar module not loaded.');
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).send(
      'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Railway env vars first.'
    );
  }
  const redirectUri = `${req.protocol}://${req.get('host')}/api/booking/auth/callback`;
  try {
    const url = cal.getOAuthUrl(redirectUri);
    res.redirect(url);
  } catch (err) {
    res.status(500).send('Could not generate OAuth URL: ' + err.message);
  }
});

// GET /api/booking/auth/callback — Google redirects here after consent
app.get('/api/booking/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).send('OAuth error: ' + error);
  if (!code)  return res.status(400).send('No code returned by Google.');

  if (!cal) return res.status(503).send('Calendar module not loaded.');
  const redirectUri = `${req.protocol}://${req.get('host')}/api/booking/auth/callback`;

  try {
    const tokens = await cal.exchangeCodeForTokens(code, redirectUri);
    const rt = tokens.refresh_token;
    if (!rt) {
      return res.status(400).send(
        'Google did not return a refresh token. ' +
        'This usually means the app was already authorised without the "consent" prompt. ' +
        'Go to https://myaccount.google.com/permissions, revoke HansePay, then visit /api/booking/auth again.'
      );
    }
    // Display the token — user must copy it into Railway manually
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>HansePay Calendar Auth</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:680px;margin:60px auto;padding:0 24px;color:#1a2b3c}
    h1{color:#0B4F8C}
    .token-box{background:#f0f7ff;border:1.5px solid #0B4F8C;border-radius:10px;padding:20px 24px;font-family:monospace;font-size:13px;word-break:break-all;margin:20px 0}
    .steps{background:#f9fafb;border-radius:10px;padding:20px 24px;margin:20px 0}
    .steps ol{margin:0;padding-left:20px;line-height:2}
    .check{color:#16a34a;font-weight:bold}
  </style>
</head>
<body>
  <h1>✅ Calendar Authorised</h1>
  <p>Copy the refresh token below and add it to Railway as <strong>GOOGLE_REFRESH_TOKEN</strong>.</p>
  <div class="token-box">${rt}</div>
  <div class="steps">
    <strong>Steps:</strong>
    <ol>
      <li>Copy the token above</li>
      <li>Open <a href="https://railway.app" target="_blank">railway.app</a> → your project → Variables</li>
      <li>Add variable: <code>GOOGLE_REFRESH_TOKEN</code> = <em>paste token</em></li>
      <li>Railway will redeploy automatically</li>
      <li>Come back and test a booking — it should work now 🎉</li>
    </ol>
  </div>
  <p style="color:#6b7280;font-size:13px">This page is only accessible to someone with your Railway URL. The token is not stored anywhere — copy it now.</p>
</body>
</html>
    `);
  } catch (err) {
    res.status(500).send('Token exchange failed: ' + err.message);
  }
});

// GET /api/booking/config — public config for the frontend
app.get('/api/booking/config', (req, res) => {
  if (!cal) return res.json({ configured: false, timezone: 'Europe/Berlin', daysAhead: 30, hoursStart: 9, hoursEnd: 17, slotMinutes: 30 });
  res.json(cal.getBookingConfig());
});

// GET /api/booking/availability?date=YYYY-MM-DD
app.get('/api/booking/availability', async (req, res) => {
  const { date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date param required (YYYY-MM-DD)' });
  }
  // Reject weekends
  const d = new Date(date + 'T12:00:00Z');
  const dow = d.getUTCDay(); // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) return res.json({ slots: [] });

  try {
    const slots = cal ? await cal.getAvailableSlots(date) : [];
    res.json({ slots });
  } catch (err) {
    console.error('[booking] availability error:', err.message);
    res.status(500).json({ error: 'Could not fetch availability', detail: err.message });
  }
});

// POST /api/booking — create a booking
app.post('/api/booking', async (req, res) => {
  const { slot, lead } = req.body;

  // Validate required fields
  const required = ['firstName', 'lastName', 'email', 'industry', 'fxVolume', 'companySize'];
  const missing = required.filter(k => !lead?.[k]);
  if (missing.length) return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  if (!slot?.startISO || !slot?.endISO) return res.status(400).json({ error: 'slot.startISO and slot.endISO required' });

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Reject past slots
  if (new Date(slot.startISO) < new Date()) {
    return res.status(400).json({ error: 'That slot is in the past. Please select another time.' });
  }

  try {
    const event = cal ? await cal.createBookingEvent(slot, lead) : { id: 'unconfigured', htmlLink: '#', hangoutLink: null };
    console.log(`[booking] created: ${lead.email} @ ${slot.startISO} — event ${event.id}`);
    res.json({
      success: true,
      eventId:     event.id,
      meetLink:    event.hangoutLink || null,
      calendarUrl: event.htmlLink    || null,
    });
  } catch (err) {
    console.error('[booking] create error:', err.message);
    // Specific Google API errors
    if (err.code === 409) return res.status(409).json({ error: 'That slot was just taken. Please choose another time.' });
    if (err.code === 404) return res.status(500).json({ error: 'Calendar not yet connected. Please contact us directly at hello@hansepay.com and we\'ll schedule your call manually.' });
    if (err.code === 403) return res.status(500).json({ error: 'Calendar access not authorised. Please contact us directly at hello@hansepay.com.' });
    res.status(500).json({ error: 'Could not create booking. Please try again or contact us directly.', detail: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`HansePay CMS server running at http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/hansepay/admin/`);
  console.log(`Blog: http://localhost:${PORT}/hansepay/blog.html`);
});
