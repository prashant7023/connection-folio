const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollNo: { type: String, required: true },
    batch: { type: String, required: true }, // Format: "2021-2025"
    branch: { type: String, required: true },
    bio: { type: String, default: "" },
    skills: { type: String, default: "" },
    interests: { type: String, default: "" },
    status: { type: String, enum: ['approved', 'pending', 'kyc', 'block'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    collection: 'students', // Explicitly set collection name
    timestamps: true // Use timestamps for createdAt and updatedAt
});

// Create indexes for frequently queried fields
studentSchema.index({ rollNo: 1 }, { unique: true });
studentSchema.index({ branch: 1 });
studentSchema.index({ batch: 1 });
studentSchema.index({ status: 1 });

// Define cleaner toJSON method
studentSchema.set('toJSON', {
    transform: function(doc, ret) {
        delete ret.password; // Never send password
        delete ret.__v; // Remove version key
        return ret;
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
