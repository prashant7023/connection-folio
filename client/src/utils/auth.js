// Authentication utility functions for client-side

/**
 * Check if a student is currently logged in
 * @returns {boolean} True if a student is logged in
 */
export const isStudentLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const studentProfile = localStorage.getItem('studentProfile');
  
  return !!token && !!studentProfile;
};

/**
 * Check if an admin is currently logged in
 * @returns {boolean} True if an admin is logged in
 */
export const isAdminLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('admin_token');
  const adminProfile = localStorage.getItem('adminProfile');
  
  return !!token && !!adminProfile;
};

/**
 * Check if any user (student or admin) is logged in
 * @returns {boolean} True if any user is logged in
 */
export const isAnyUserLoggedIn = () => {
  return isStudentLoggedIn() || isAdminLoggedIn();
};

/**
 * Get the current user's profile data
 * @returns {Object|null} The user profile object or null if not logged in
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  if (isStudentLoggedIn()) {
    try {
      return JSON.parse(localStorage.getItem('studentProfile'));
    } catch (e) {
      console.error('Error parsing student profile:', e);
      return null;
    }
  }
  
  if (isAdminLoggedIn()) {
    try {
      return JSON.parse(localStorage.getItem('adminProfile'));
    } catch (e) {
      console.error('Error parsing admin profile:', e);
      return null;
    }
  }
  
  return null;
};

/**
 * Log out the current user (student or admin)
 */
export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all auth-related storage
  localStorage.removeItem('token');
  localStorage.removeItem('admin_token');
  localStorage.removeItem('studentProfile');
  localStorage.removeItem('adminProfile');
};

/**
 * Get the initials from a name
 * @param {string} name - The name to get initials from
 * @returns {string} The initials (up to first 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return "?";
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}; 