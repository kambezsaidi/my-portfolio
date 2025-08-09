require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const url = require('url');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('view engine', 'EJS');

// Database connection with pooling
let dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'portfolio_db',
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL ? { rejectUnauthorized: true } : null
};

if (process.env.JAWSDB_URL) {
  const dbUrl = new URL(process.env.JAWSDB_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: true }
  };
} else if (process.env.CLEARDB_DATABASE_URL) {
  const dbUrl = new URL(process.env.CLEARDB_DATABASE_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    port: dbUrl.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: true }
  };
}

const db = mysql.createPool(dbConfig);

// Verify DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

// Promisify for async/await
const dbPromise = db.promise();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/', async (req, res) => {
  try {
    const [results] = await dbPromise.query('SELECT * FROM projects');
    res.render('index', { 
      projects: results || [], 
      activeSection: 'home' 
    });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.render('index', { 
      projects: [], 
      activeSection: 'home' 
    });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const [results] = await dbPromise.query('SELECT * FROM projects');
    res.render('projects', { 
      projects: results || [], 
      activeSection: 'projects' 
    });
  } catch (err) {
    console.error('Error fetching projects:', err.message);
    res.render('projects', { 
      projects: [], 
      activeSection: 'projects' 
    });
  }
});

app.get('/skills', (req, res) => {
  res.render('skills', { activeSection: 'skills' });
});

app.get('/about', (req, res) => {
  res.render('about', { activeSection: 'about' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { activeSection: 'contact' });
});

// Role routes
app.get('/roles/siak-cars', (req, res) => {
  res.render('siak-cars', { activeSection: 'siak-cars' });
});

app.get('/roles/ukhsa', (req, res) => {
  res.render('ukhsa', { activeSection: 'ukhsa' });
});

app.get('/roles/intuit', (req, res) => {
  res.render('intuit', { activeSection: 'intuit' });
});

app.get('/roles/optima-health', (req, res) => {
  res.render('optima-health', { activeSection: 'optima-health' });
});

app.get('/roles/minor-weir-willis', (req, res) => {
  res.render('minor-weir-willis', { activeSection: 'minor-weir-willis' });
});

// Contact form submission
app.post('/contact', [
  body('name').trim().notEmpty().escape(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().notEmpty().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please fill all fields correctly',
      errors: errors.array() 
    });
  }

  const { name, email, message } = req.body;

  try {
    // Save to database
    if (dbPromise) {
      await dbPromise.query(
        'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', 
        [name, email, message]
      );
    }

    // Send email
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

    res.json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending message' 
    });
  }
});

// Favicon route to prevent 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { activeSection: '' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database host: ${dbConfig.host}`);
});