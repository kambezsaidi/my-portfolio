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
app.set('view engine', 'ejs');

// -------------------
// 2. Environment Validation
// -------------------
const requiredEnv = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.error('❌ Missing environment variables:', missingEnv);
  process.exit(1);
}

// -------------------
// 3. Database Connection
// -------------------
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
const dbPromise = db.promise();

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL/RDS:', err.stack);
  } else {
    // Create tables if they don't exist
    connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('❌ Error creating contacts table:', err.stack);
      else console.log('✅ Contacts table checked/created');
    });

    connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('❌ Error creating projects table:', err.stack);
      else console.log('✅ Projects table checked/created');
    });

    connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      )
    `, (err) => {
      if (err) console.error('❌ Error creating certificates table:', err.stack);
      else console.log('✅ Certificates table checked/created');
    });

    console.log('✅ Connected to MySQL/RDS');
    connection.release();
  }
});

// -------------------
// 4. Email Transporter
// -------------------
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
console.log('Transporter config:', transporter.options); // Debug email setup

// -------------------
// 5. Routes
// -------------------

// Home page
app.get('/', async (req, res) => {
  try {
    const [projects] = await dbPromise.query('SELECT * FROM projects');
    res.render('index', { projects: projects || [], activeSection: 'home' });
  } catch (err) {
    console.error('Error fetching projects:', err.stack);
    res.status(500).render('index', { projects: [], activeSection: 'home', error: 'Failed to load projects. Please try again later.' });
  }
});

// Projects page
app.get('/projects', async (req, res) => {
  try {
    const [projects] = await dbPromise.query('SELECT * FROM projects');
    res.render('projects', { projects: projects || [], activeSection: 'projects' });
  } catch (err) {
    console.error('Error fetching projects:', err.stack);
    res.status(500).render('projects', { projects: [], activeSection: 'projects', error: 'Failed to load projects. Please try again later.' });
  }
});

// Static pages
app.get('/about', (req, res) => res.render('about', { activeSection: 'about' }));
app.get('/expertise', (req, res) => res.render('expertise', { activeSection: 'expertise' }));
app.get('/experiences', (req, res) => res.render('experiences', { activeSection: 'experiences' }));
app.get('/contact', (req, res) => res.render('contact', { activeSection: 'contact' }));
app.get('/certificates', async (req, res) => {
  try {
    const [certificates] = await dbPromise.query('SELECT * FROM certificates');
    res.render('certificates', { certificates: certificates || [], activeSection: 'certificates' });
  } catch (err) {
    console.error('Error fetching certificates:', err.stack);
    res.status(500).render('certificates', { certificates: [], activeSection: 'certificates', error: 'Failed to load certificates.' });
  }
});

// Expertise subpages
app.get('/expertise/data-engineering', (req, res) => res.render('data-engineering', { activeSection: 'expertise' }));
app.get('/expertise/software-development', (req, res) => res.render('software-development', { activeSection: 'expertise' }));
app.get('/expertise/business-analysis', (req, res) => res.render('business-analysis', { activeSection: 'expertise' }));

// Experiences subpages
app.get('/experiences/:experience', (req, res) => {
  const experiencePage = req.params.experience;
  const validExperiences = ['siak-cars', 'ukhsa', 'intuit', 'minor-weir-willis', 'optima-health'];
  if (validExperiences.includes(experiencePage)) {
    res.render(experiencePage, { activeSection: experiencePage });
  } else {
    res.status(404).render('404', { activeSection: '' });
  }
});

// -------------------
// 6. Contact Form Submission
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
      console.error('Error in contact submission:', err.stack);
      res.status(500).json({ success: false, message: 'Error sending message' });
    }
  }
);

// -------------------
// 7. Fallbacks
// -------------------
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use((req, res) => res.status(404).render('404', { activeSection: '' }));

// -------------------
// 8. Server Start
// -------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} at ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`);
  console.log(`Database host: ${dbConfig.host}, Database: ${dbConfig.database}`);
});