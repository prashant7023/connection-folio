const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Admin authentication middleware
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

// GET all announcements (public)
router.get('/', async (req, res) => {
  try {
    // Get active announcements only, sort by newest first
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(20); // Limit to 20 most recent announcements
      
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
});

// GET all announcements (admin only, includes inactive)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    // Get all announcements for admin, sort by newest first
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching admin announcements:', err);
    res.status(500).json({ error: 'Failed to retrieve announcements' });
  }
});

// POST create a new announcement (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // Basic validation
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    
    // Create new announcement
    const announcement = new Announcement({
      title,
      message,
      type: type || 'info',
      createdBy: req.admin.id,
      creatorName: req.admin.name || 'Admin',
      isActive: true
    });
    
    await announcement.save();
    console.log(`✅ New announcement created by admin ${req.admin.email}`);
    
    res.status(201).json(announcement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PUT update an announcement (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, message, type, isActive } = req.body;
    
    // Find and update the announcement
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { 
        ...(title && { title }),
        ...(message && { message }),
        ...(type && { type }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    res.json(announcement);
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE an announcement (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }
    
    console.log(`❌ Announcement deleted by admin ${req.admin.email}`);
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router; 