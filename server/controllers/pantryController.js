import PantryItem from '../models/PantryItem.js';

// @desc    Get all pantry items for a user
// @route   GET /api/pantry
// @access  Private
export const getPantry = async (req, res) => {
  try {
    const items = await PantryItem.find({ user: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a pantry item
// @route   POST /api/pantry
// @access  Private
export const addPantryItem = async (req, res) => {
  try {
    const { name, quantity, category, unit, expiryDate, image } = req.body;
    
    const item = await PantryItem.create({
      user: req.user._id,
      name,
      quantity,
      category,
      unit,
      expiryDate,
      image
    });
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a pantry item
// @route   PUT /api/pantry/:id
// @access  Private
export const updatePantryItem = async (req, res) => {
  try {
    const item = await PantryItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a pantry item
// @route   DELETE /api/pantry/:id
// @access  Private
export const deletePantryItem = async (req, res) => {
  try {
    const item = await PantryItem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
