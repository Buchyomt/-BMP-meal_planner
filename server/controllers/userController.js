import User from '../models/User.js';
import UserPreference from '../models/UserPreference.js';

// @desc    Get all users (Admin only)
// @route   GET /api/user/all
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
export const getPreferences = async (req, res) => {
  try {
    let preferences = await UserPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      // Create default preferences if they don't exist
      preferences = await UserPreference.create({ user: req.user._id });
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const preferences = await UserPreference.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { cloudinary } from '../config/cloudinary.js';

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      
      // Update email if provided (might need verification in real app)
      if (req.body.email) {
        user.email = req.body.email;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.location !== undefined) user.location = req.body.location;

      if (req.body.profileImageBase64) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(req.body.profileImageBase64, {
            folder: 'budget_planner_profiles',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
          });
          user.profileImage = uploadResponse.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload error:', uploadError);
          return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        role: updatedUser.role,
        image: updatedUser.profileImage,
        token: req.headers.authorization.split(' ')[1] // Keep existing token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
