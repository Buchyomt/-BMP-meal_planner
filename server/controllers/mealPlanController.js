import MealPlan from '../models/MealPlan.js';

// @desc    Get all meal plans for a user
// @route   GET /api/meals
// @access  Private
export const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).sort({ date: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a meal plan
// @route   POST /api/meals
// @access  Private
export const addMealPlan = async (req, res) => {
  try {
    const { date, mealType, recipeName, recipeId, image, cost } = req.body;
    
    const plan = await MealPlan.create({
      user: req.user._id,
      date,
      mealType,
      recipeName,
      recipeId,
      image,
      cost
    });
    
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meal plan
// @route   PUT /api/meals/:id
// @access  Private
export const updateMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal plan
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMealPlan = async (req, res) => {
  try {
    const plan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    
    res.json({ message: 'Meal plan removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
