import connectDB from '../../server/config/db.js';
import User from '../../server/models/User.js';
import { cloudinary } from '../../server/config/cloudinary.js';
import jwt from 'jsonwebtoken';

// Add Vercel config to allow large payloads (base64 images)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Connect to Database (Serverless needs to ensure connection)
    await connectDB();

    // 2. Authenticate User (replicate 'protect' middleware)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // 3. Update Profile Logic
    // Vercel automatically parses JSON bodies into req.body if it's an object
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { /* ignore */ }
    }

    user.name = body.name || user.name;
    if (body.email) user.email = body.email;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.location !== undefined) user.location = body.location;

    // 4. Handle Base64 Image Upload
    if (body.profileImageBase64) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(body.profileImageBase64, {
          folder: 'budget_planner_profiles',
          transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });
        user.profileImage = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
      }
    }

    // 5. Save and Respond
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      role: updatedUser.role,
      image: updatedUser.profileImage,
      token: token
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
}
