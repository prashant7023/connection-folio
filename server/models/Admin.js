const mongoose = require('mongoose');

// Hardcode the authorized emails directly in the model for absolute enforcement
const AUTHORIZED_EMAILS = [
  'prahantsh123@gmail.com',
  'prahantsh7014@gmail.com'
];

// Create a schema without depending on external modules
const adminSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        // Direct check without any external dependencies
        const normalizedEmail = email.toLowerCase().trim();
        const isAuthorized = AUTHORIZED_EMAILS.includes(normalizedEmail);
        console.log(`🔎 Admin email validation: ${normalizedEmail} - ${isAuthorized ? 'AUTHORIZED ✓' : 'REJECTED ✗'}`);
        return isAuthorized;
      },
      message: props => `${props.value} is not an authorized admin email address`
    }
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Super Admin', 'Admin'], 
    default: 'Admin' 
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
  collection: 'admins',
  timestamps: true
});

// Additional safeguard in pre-save hook
adminSchema.pre('save', function(next) {
  const email = this.email.toLowerCase().trim();
  if (!AUTHORIZED_EMAILS.includes(email)) {
    console.error(`❌ SECURITY BLOCKED: Unauthorized admin creation attempt: ${email}`);
    return next(new Error(`${email} is not authorized to create an admin account`));
  }
  console.log(`✅ Admin creation authorized for: ${email}`);
  next();
});

// Helper method to check email authorization
adminSchema.statics.isAuthorizedEmail = function(email) {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.includes(normalizedEmail);
};

// Clean up sensitive data for JSON responses
adminSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

// Create the model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
