require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Environment Validation
const requiredEnv = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.error('❌ Missing environment variables:', missingEnv);
  process.exit(1);
}

// Database Connection
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const db = mysql.createPool(dbConfig);

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.stack);
  } else {
    console.log('✅ Connected to MySQL');
    connection.release();
  }
});

// Email Transporter
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err.stack);
      res.render('index', { projects: [], activeSection: 'home' });
    } else {
      res.render('index', { projects: results, activeSection: 'home' });
    }
  });
});

app.get('/projects', (req, res) => {
  db.query('SELECT * FROM projects', (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err.stack);
      res.render('projects', { projects: [], activeSection: 'projects' });
    } else {
      res.render('projects', { projects: results, activeSection: 'projects' });
    }
  });
});

app.get('/about', (req, res) => res.render('about', { activeSection: 'about' }));
app.get('/expertise', (req, res) => res.render('expertise', { activeSection: 'expertise' }));
app.get('/experiences', (req, res) => res.render('experiences', { activeSection: 'experiences' }));
app.get('/contact', (req, res) => res.render('contact', { activeSection: 'contact' }));
app.get('/certificates', (req, res) => res.render('certificates', { activeSection: 'certificates' }));

app.get('/expertise/data-engineering', (req, res) => res.render('data-engineering', { activeSection: 'expertise' }));
app.get('/expertise/software-development', (req, res) => res.render('software-development', { activeSection: 'expertise' }));
app.get('/expertise/business-analysis', (req, res) => res.render('business-analysis', { activeSection: 'expertise' }));

app.get('/experiences/:experience', (req, res) => {
  const experiencePage = req.params.experience;
  const validExperiences = ['siak-cars', 'ukhsa', 'intuit', 'minor-weir-willis', 'optima-health'];
  if (validExperiences.includes(experiencePage)) {
    res.render(experiencePage, { activeSection: experiencePage });
  } else {
    res.status(404).render('404', { activeSection: '' });
  }
});

app.post(
  '/contact',
  [
    body('name').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Please fill all fields correctly', errors: errors.array() });
    }

    const { name, email, message } = req.body;

    db.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err) => {
      if (err) {
        console.error('Error inserting contact:', err.stack);
        return res.status(500).json({ success: false, message: 'Error saving contact' });
      }

      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'kambez.saidi@outlook.com',
        subject: `New message from ${name} via your portfolio`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`
      }, (err) => {
        if (err) {
          console.error('Error sending email:', err.stack);
          return res.status(500).json({ success: false, message: 'Error sending message' });
        }
        res.json({ success: true, message: 'Message sent successfully!' });
      });
    });
  }
);

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use((req, res) => res.status(404).render('404', { activeSection: '' }));

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Database host: ${dbConfig.host}, Database: ${dbConfig.database}`);
});