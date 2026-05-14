import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a recipe title']
  },
  description: {
    type: String,
    required: false
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  image: {
    type: String,
    required: false,
    default: ''
  },
  cookTime: {
    type: Number,
    required: false,
    default: 30
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
