require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// -------------------
// 1. Middleware
// -------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // FIX: was app.use('view engine', 'ejs')

// -------------------
// 2. Database Connection
// -------------------
let dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_db',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Heroku JawsDB support
if (process.env.JAWSDB_URL) {
  const dbUrl = new URL(process.env.JAWSDB_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else if (process.env.CLEARDB_DATABASE_URL) {
  const dbUrl = new URL(process.env.CLEARDB_DATABASE_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const db = mysql.createPool(dbConfig);

// Verify DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.message);
  } else {
    console.log('✅ Connected to MySQL');
    connection.release();
  }
});

const dbPromise = db.promise();

// -------------------
// 3. Email Transporter
// -------------------
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// -------------------
// 4. Routes
// -------------------

// Home page
app.get('/', async (req, res) => {
  try {
    const [results] = await dbPromise.query('SELECT * FROM projects');
    res.render('index', { projects: results || [], activeSection: 'home' });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.render('index', { projects: [], activeSection: 'home' });
  }
});

// Projects page
app.get('/projects', async (req, res) => {
  try {
    const [results] = await dbPromise.query('SELECT * FROM projects');
    res.render('projects', { projects: results || [], activeSection: 'projects' });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.render('projects', { projects: [], activeSection: 'projects' });
  }
});

// Static pages
app.get('/skills', (req, res) => res.render('skills', { activeSection: 'skills' }));
app.get('/about', (req, res) => res.render('about', { activeSection: 'about' }));
app.get('/contact', (req, res) => res.render('contact', { activeSection: 'contact' }));

// Role pages
app.get('/roles/:role', (req, res) => {
  const rolePage = req.params.role;
  res.render(rolePage, { activeSection: rolePage });
});

// -------------------
// 5. Contact Form Submission
// -------------------
app.post(
  '/contact',
  [
    body('name').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Please fill all fields correctly', errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
      await dbPromise.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'kambez.saidi@outlook.com',
        subject: `New message from ${name} via your portfolio`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`
      });

      res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, message: 'Error sending message' });
    }
  }
);

// -------------------
// 6. Fallbacks
// -------------------
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use((req, res) => res.status(404).render('404', { activeSection: '' }));

// -------------------
// 7. Server Start
// -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Database host: ${dbConfig.host}`);
});
