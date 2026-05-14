import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  desc: String,
  price: { type: Number, default: 0 },
  checked: { type: Boolean, default: false }
});

const shoppingCategorySchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  emoji: String,
  items: [shoppingItemSchema]
});

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [shoppingCategorySchema],
  weeklyBudget: { type: Number, default: 20000 },
  quickAddSuggestions: [String]
}, { timestamps: true });

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);
export default ShoppingList;
