const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendStudentApprovalEmail } = require('../utils/emailService');
require('dotenv').config();

// Middleware to verify admin JWT token
const adminAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Double-check if the email in the token is authorized
    if (!Admin.isAuthorizedEmail(decoded.email)) {
      console.log(`🚫 Unauthorized admin access attempt: ${decoded.email}`);
      return res.status(403).json({ error: 'Not authorized as admin' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Admin authentication required' });
  }
};

// Get list of authorized admin emails
router.get('/authorized-emails', (req, res) => {
  // For security reasons, only return if the email exists in our system, not the actual list
  res.json({ 
    message: 'Only specific authorized emails can register as admin. Contact system administrator for access.' 
  });
});

// Register Admin
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    // Normalize email to prevent bypass attempts
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email is authorized directly using the model
    if (!Admin.isAuthorizedEmail(normalizedEmail)) {
      console.log(`🚫 BLOCKED: Admin registration attempt with unauthorized email: ${normalizedEmail}`);
      return res.status(403).json({ 
        error: 'Unauthorized email. Only specific email addresses can create admin accounts.' 
      });
    }
    
    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Password requirements
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      // Create new admin with hashed password
      const admin = new Admin({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'Admin'
      });

      await admin.save();
      console.log(`✅ New admin account created: ${normalizedEmail}`);

      // Generate JWT token
      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Return admin without password and with token
      const { password, ...adminData } = admin.toObject();
      res.status(201).json({ admin: adminData, token });
    } catch (saveErr) {
      // This will catch validation errors from the model
      console.error('❌ Admin save error:', saveErr.message);
      return res.status(400).json({ error: saveErr.message });
    }
  } catch (err) {
    console.error('❌ Admin registration error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if email is on the authorized list
    if (!Admin.isAuthorizedEmail(normalizedEmail)) {
      console.log(`🔒 SECURITY: Blocked login attempt from unauthorized email: ${normalizedEmail}`);
      return res.status(403).json({ error: 'This email is not authorized to access the admin panel' });
    }
    
    // Find admin by email
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      console.log(`❓ Login attempted with authorized email but no account exists: ${normalizedEmail}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      console.log(`🔑 Incorrect password for admin: ${normalizedEmail}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log(`✅ Admin login successful: ${normalizedEmail}`);

    // Generate token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return admin without password and with token
    const { password: pwd, ...adminData } = admin.toObject();
    res.json({ admin: adminData, token });
  } catch (err) {
    console.error('❌ Admin login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get admin profile
router.get('/profile', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student status (approve, reject, etc.)
router.put('/students/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'kyc', 'block'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Send email notification to student
    try {
      console.log(`🔔 Sending status update email to student: ${student.email}`);
      await sendStudentApprovalEmail(student);
      console.log(`✅ Status update email sent successfully to ${student.email}`);
    } catch (emailError) {
      // Log the error but don't fail the status update if email fails
      console.error(`❌ Failed to send status update email: ${emailError.message}`);
    }

    res.json(student);
  } catch (err) {
    console.error('Error updating student status:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
