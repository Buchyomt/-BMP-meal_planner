import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthlyLimit: {
    type: Number,
    default: 0
  },
  weeklyLimit: {
    type: Number,
    default: 0
  },
  spent: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'NGN'
  }
}, {
  timestamps: true
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
