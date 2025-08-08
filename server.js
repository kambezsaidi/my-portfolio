require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Add this to handle JSON requests
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Database connection
const db = mysql.createConnection({
    host: process.env.JAWSDB_URL ? new URL(process.env.JAWSDB_URL).hostname : process.env.MYSQL_HOST,
    user: process.env.JAWSDB_URL ? new URL(process.env.JAWSDB_URL).username : process.env.MYSQL_USER,
    password: process.env.JAWSDB_URL ? new URL(process.env.JAWSDB_URL).password : process.env.MYSQL_PASSWORD,
    database: process.env.JAWSDB_URL ? new URL(process.env.JAWSDB_URL).pathname.slice(1) : process.env.MYSQL_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err.message);
            res.status(500).send('Error loading projects');
            return;
        }
        res.render('index', { projects: results, activeSection: 'home' });
    });
});

app.get('/projects', (req, res) => {
    const sql = 'SELECT * FROM projects';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err.message);
            res.status(500).send('Error loading projects');
            return;
        }
        res.render('projects', { projects: results, activeSection: 'projects' }); // Changed to render 'projects' template
    });
});

app.get('/skills', (req, res) => {
    res.render('skills', { activeSection: 'skills' }); // Changed to render 'skills' template
});

app.get('/about', (req, res) => {
    res.render('about', { activeSection: 'about' }); // Changed to render 'about' template
});

app.get('/contact', (req, res) => {
    res.render('contact', { activeSection: 'contact' }); // Changed to render 'contact' template
});

// Role routes (keep these unchanged)
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

// Contact form submission (single route)
app.post('/contact', [
    body('name').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.accepts('json')) {
            return res.status(400).json({ success: false, message: 'Please fill all fields correctly' });
        }
        return res.status(400).send('Please fill all fields correctly');
    }
    
    const { name, email, message } = req.body;
    
    try {
        // Save to database
        const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
        await db.query(sql, [name, email, message]);
        
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
        
        if (req.accepts('json')) {
            return res.json({ success: true, message: 'Message sent successfully!' });
        }
        res.send('Message received. Thank you!');
    } catch (err) {
        console.error('Error:', err);
        if (req.accepts('json')) {
            return res.status(500).json({ success: false, message: 'Error sending message' });
        }
        res.status(500).send('Error sending message');
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));