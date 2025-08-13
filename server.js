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
const requiredEnv = ['JAWSDB_URL', 'EMAIL_USER', 'EMAIL_PASS'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.error('❌ Missing environment variables:', missingEnv);
  process.exit(1);
}

// -------------------
// 3. Database Connection
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

// Override with JawsDB URL if provided
if (process.env.JAWSDB_URL) {
  const dbUrl = new URL(process.env.JAWSDB_URL);
  dbConfig = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1), // Extracts database name (e.g., v7x6ss6unpxwxu5u)
    port: dbUrl.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const db = mysql.createPool(dbConfig);
const dbPromise = db.promise();

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to MySQL/JawsDB:', err.stack);
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

    console.log('✅ Connected to MySQL/JawsDB');
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
  } catch (err