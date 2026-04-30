/**
 * Utility to generate scoped storage keys based on the currently logged-in user.
 * This ensures that User A's data doesn't overwrite User B's data on the same browser.
 */

export const getScopedKey = (baseKey) => {
  try {
    const userJson = localStorage.getItem('bmp_currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user && user.email) {
        // Sanitize email to be a safe key part (remove dots/special chars if needed, 
        // but for localStorage keys, standard email chars are generally fine)
        const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_');
        return `bmp_${safeEmail}_${baseKey}`;
      }
    }
  } catch (error) {
    console.warn('Error generating scoped key:', error);
  }
  
  // Fallback to global key if no user is logged in
  return `bmp_guest_${baseKey}`;
};

/**
 * Loads data from localStorage using a scoped key.
 */
export const loadScopedData = (baseKey) => {
  try {
    const key = getScopedKey(baseKey);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error(`Error loading scoped data for ${baseKey}:`, error);
    return null;
  }
};
