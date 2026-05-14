import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  recipeName: {
    type: String,
    required: true
  },
  recipeId: {
    type: String // For Spoonacular IDs
  },
  image: {
    type: String
  },
  cost: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
