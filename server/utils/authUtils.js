// List of authorized emails that can create admin accounts
const AUTHORIZED_ADMIN_EMAILS = [
  'prahantsh123@gmail.com',
  'prashantsh7014@gmail.com',
  // Add more emails here if needed in the future
];

/**
 * Check if an email is authorized to register as an admin
 * @param {String} email - Email to check
 * @returns {Boolean} - True if email is in the authorized list
 */
const isAuthorizedAdminEmail = (email) => {
  if (!email) {
    console.log('🚫 Auth check failed: Empty email provided');
    return false;
  }
  
  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log(`🚫 Auth check failed: Invalid email format - ${email}`);
    return false;
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.map(e => e.toLowerCase().trim())
    .includes(normalizedEmail);
  
  console.log(`🔒 Auth check for ${normalizedEmail}: ${isAuthorized ? 'AUTHORIZED ✅' : 'DENIED ❌'}`);
  
  return isAuthorized;
};

/**
 * Get list of authorized admin emails
 * @returns {Array} - List of authorized admin emails
 */
const getAuthorizedEmails = () => {
  return [...AUTHORIZED_ADMIN_EMAILS];
};

/**
 * Check if admin with authorized email exists
 * @param {Object} Admin - Mongoose Admin model
 * @param {String} email - Email to check
 * @returns {Promise<Boolean>} - True if admin exists with authorized email
 */
const adminWithAuthorizedEmailExists = async (Admin, email) => {
  if (!isAuthorizedAdminEmail(email)) return false;
  
  try {
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    return !!admin;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

module.exports = {
  AUTHORIZED_ADMIN_EMAILS,
  isAuthorizedAdminEmail,
  getAuthorizedEmails,
  adminWithAuthorizedEmailExists
}; 