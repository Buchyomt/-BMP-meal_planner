import express from 'express';
import { getPreferences, updatePreferences, getUsers, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/all', protect, admin, getUsers);

router.route('/preferences')
  .get(protect, getPreferences)
  .put(protect, updatePreferences);

router.put('/profile', protect, upload.single('profileImage'), updateProfile);

export default router;
