import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    default: '1'
  },
  category: {
    type: String,
    default: 'Other'
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  expiryDate: {
    type: Date
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);

export default PantryItem;
