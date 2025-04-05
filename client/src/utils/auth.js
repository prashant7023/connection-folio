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
 * Get the first character of a name for avatar display
 * @param {string} name - The name to get initial from
 * @returns {string} The first character in uppercase
 */
export const getInitials = (name) => {
  if (!name) return "?";
  
  // Just return the first character in uppercase
  return name.charAt(0).toUpperCase();
};

/**
 * Get a consistent color for an avatar based on the name
 * @param {string} name - The name to derive color from
 * @returns {string} A background color class
 */
export const getAvatarColor = (name) => {
  if (!name) return "bg-slate-200";
  
  // Color palette with lighter colors for better contrast with dark text
  const colorPalette = [
    "bg-purple-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-pink-200",
    "bg-cyan-200",
    "bg-emerald-200",
    "bg-violet-200",
    "bg-amber-200",
    "bg-teal-200",
    "bg-rose-200",
  ];
  
  // Get consistent index based on the first character of the name
  const charCode = name.charCodeAt(0) || 65; // Default to 'A' if empty
  const index = charCode % colorPalette.length;
  
  return colorPalette[index];
}; 