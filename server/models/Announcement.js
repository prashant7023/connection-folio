const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info'
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin',
        required: true
    },
    creatorName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    collection: 'announcements',
    timestamps: true
});

// Create indexes for better query performance
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ isActive: 1 });
announcementSchema.index({ type: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement; 