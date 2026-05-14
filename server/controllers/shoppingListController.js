import axios from 'axios';
import ShoppingList from '../models/ShoppingList.js';
import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';
import PantryItem from '../models/PantryItem.js';

// @desc    Get user's shopping list
// @route   GET /api/shopping-list
// @access  Private
export const getShoppingList = async (req, res) => {
  try {
    let list = await ShoppingList.findOne({ user: req.user._id });
    
    if (!list) {
      // Create default list if not found
      list = await ShoppingList.create({
        user: req.user._id,
        categories: [
          {
            id: 'proteins',
            name: 'Proteins',
            emoji: '🥩',
            items: []
          },
          {
            id: 'grains',
            name: 'Grains & Staples',
            emoji: '🌾',
            items: []
          },
          {
            id: 'veg',
            name: 'Vegetables & Spices',
            emoji: '🌶️',
            items: []
          }
        ]
      });
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user's shopping list
// @route   PUT /api/shopping-list
// @access  Private
export const updateShoppingList = async (req, res) => {
  try {
    const list = await ShoppingList.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate smart shopping list suggestions
// @route   GET /api/shopping-list/generate
// @access  Private
export const generateSmartShoppingList = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch meal plans from today onwards
    const mealPlans = await MealPlan.find({
      user: req.user._id,
      date: { $gte: today }
    });

    if (mealPlans.length === 0) {
      return res.json({ 
        message: 'No upcoming meal plans found. Add some meals to your calendar first!',
        suggestions: [] 
      });
    }

    // 2. Fetch user's pantry
    const pantry = await PantryItem.find({ user: req.user._id });
    const pantryNames = pantry.map(item => item.name.toLowerCase());

    // 3. Collect ingredients from all recipes in meal plans
    let requiredIngredients = [];
    const spoonacularIds = [];
    const customRecipeNames = [];

    mealPlans.forEach(plan => {
      if (plan.recipeId) {
        spoonacularIds.push(plan.recipeId);
      } else if (plan.recipeName) {
        customRecipeNames.push(plan.recipeName);
      }
    });

    // 3a. Handle Custom Recipes
    if (customRecipeNames.length > 0) {
      const customRecipes = await Recipe.find({
        user: req.user._id,
        title: { $in: customRecipeNames }
      });
      
      customRecipes.forEach(recipe => {
        requiredIngredients = requiredIngredients.concat(recipe.ingredients);
      });
    }

    // 3b. Handle Spoonacular Recipes (Bulk fetch)
    if (spoonacularIds.length > 0) {
      const apiKey = process.env.SPOONACULAR_API_KEY;
      try {
        const uniqueIds = [...new Set(spoonacularIds)].join(',');
        const response = await axios.get(`https://api.spoonacular.com/recipes/informationBulk`, {
          params: { ids: uniqueIds, apiKey }
        });

        response.data.forEach(recipe => {
          const ingredients = recipe.extendedIngredients.map(ing => ing.original);
          requiredIngredients = requiredIngredients.concat(ingredients);
        });
      } catch (err) {
        console.error('Spoonacular Bulk Fetch Error:', err.message);
      }
    }

    // 4. Compare with Pantry and filter out existing items
    // Simple logic: If pantry item name is found in the ingredient string, assume we have it.
    const missingIngredients = requiredIngredients.filter(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      // Check if any pantry item name is contained in the ingredient description
      const inPantry = pantryNames.some(pantryName => 
        lowerIngredient.includes(pantryName) || pantryName.includes(lowerIngredient)
      );
      return !inPantry;
    });

    // 5. Remove duplicates and clean up
    const uniqueMissing = [...new Set(missingIngredients)];

    // 6. Map to shopping list format (Categorized roughly)
    const suggestions = uniqueMissing.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item,
      checked: false
    }));

    res.json({
      message: `Generated ${suggestions.length} suggestions from ${mealPlans.length} meal plans.`,
      suggestions
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
