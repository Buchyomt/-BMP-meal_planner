import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profileImage,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { OAuth2Client } from 'google-auth-library';
import OTP from '../models/OTP.js';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google login
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create user if they don't exist
      user = await User.create({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // Dummy password
        profileImage: picture || '',
        role: 'user'
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed: ' + error.message });
  }
};

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB
    await OTP.create({
      email,
      code: otpCode,
      expiresAt: new Date(Date.now() + 10 * 60000) // 10 mins
    });

    // Send email (Using credentials from .env)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: { 
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      await transporter.sendMail({
        from: `"Budget Planner" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Login OTP - Budget Planner",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #007A33;">Your Verification Code</h2>
            <p>Welcome back! Use the code below to complete your login.</p>
            <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="font-size: 12px; color: #666;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          </div>
        `
      });
      res.json({ message: 'OTP sent successfully to your email!' });
    } catch (mailError) {
      console.error('Mail Error:', mailError);
      res.status(500).json({ message: 'Failed to send real email. Check your EMAIL_PASS in .env' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    const otpRecord = await OTP.findOne({ email, code });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Success - get user or create one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: Math.random().toString(36).slice(-8),
        role: 'user'
      });
    }

    // Delete OTP after use
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profileImage,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
