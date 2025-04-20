const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendNewStudentNotification } = require('../utils/emailService');
require('dotenv').config();

// Middleware to verify JWT token
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Register Student
router.post('/register', async (req, res) => {
  try {
    // Check if email already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new student with hashed password
    const student = new Student({
      ...req.body,
      password: hashedPassword
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      // Don't await this call to avoid blocking the response
      sendNewStudentNotification(student.toObject(), adminEmail)
        .then(sent => {
          if (sent) {
            console.log('✅ Admin notification email sent successfully');
          }
        })
        .catch(err => console.error('Email error:', err));
    }

    // Return student without password and token
    const { password, ...studentData } = student.toObject();
    res.status(201).json({ student: studentData, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login Student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check student status - prevent blocked students from logging in
    if (student.status === 'block') {
      console.log(`🚫 Blocked student login attempt: ${student.email}`);
      return res.status(403).json({ 
        error: 'Your account has been blocked. Please contact the administrator for assistance.',
        blocked: true
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return student without password and token
    const { password: pwd, ...studentData } = student.toObject();
    res.json({ student: studentData, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student profile
router.get('/profile', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student profile
router.put('/profile', auth, async (req, res) => {
  try {
    // Fields that can be updated
    const updates = {};
    const allowedUpdates = ['name', 'bio', 'skills', 'interests'];
    
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    
    updates.updatedAt = Date.now();

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Students (Admin access - should be protected in production)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
