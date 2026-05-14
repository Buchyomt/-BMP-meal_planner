import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'light'
  },
  accentColor: {
    type: String,
    default: '#10B981'
  },
  currency: {
    code: { type: String, default: 'NGN' },
    symbol: { type: String, default: '₦' },
    name: { type: String, default: 'Naira' }
  },
  dietType: {
    type: String,
    default: 'Traditional Nigerian'
  },
  allergies: {
    type: [String],
    default: []
  },
  notifications: {
    mealReminders: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true },
    reminderTime: { type: String, default: '08:00' }
  }
}, {
  timestamps: true
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;
