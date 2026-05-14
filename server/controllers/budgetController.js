import Budget from '../models/Budget.js';

// @desc    Get user budget
// @route   GET /api/budget
// @access  Private
export const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ user: req.user._id });
    
    if (!budget) {
      budget = await Budget.create({ user: req.user._id });
    }
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user budget
// @route   PUT /api/budget
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
