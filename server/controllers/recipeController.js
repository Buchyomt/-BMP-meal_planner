import axios from 'axios';
import Recipe from '../models/Recipe.js';


// @desc    Search recipes from Spoonacular
// @route   GET /api/recipes/search
// @access  Private
export const searchRecipes = async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey || apiKey === 'your_spoonacular_api_key_here') {
      return res.status(400).json({ message: 'Spoonacular API key is missing or invalid' });
    }

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        query,
        apiKey,
        number: 10,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });

    // Map Spoonacular data to our internal meal format
    const recipes = response.data.results.map(recipe => ({
      meal: recipe.title,
      name: recipe.title,
      price: Math.round(recipe.pricePerServing * 10) || 1500, // Mock price if not available
      tags: recipe.dishTypes,
      image: recipe.image,
      description: recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '',
      calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
      protein: recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
      carbs: recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
      recipeSteps: recipe.analyzedInstructions?.[0]?.steps?.map(s => s.step) || [],
      ingredients: recipe.extendedIngredients?.map(i => i.original) || [],
      id: recipe.id
    }));

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recipe details by ID
// @route   GET /api/recipes/:id
// @access  Private
export const getRecipeDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.SPOONACULAR_API_KEY;

    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
      params: { apiKey }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a custom recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookTime, tags } = req.body;

    let parsedIngredients = ingredients;
    let parsedInstructions = instructions;
    let parsedTags = tags;

    // Parse JSON strings if they come from FormData
    if (typeof ingredients === 'string') parsedIngredients = JSON.parse(ingredients);
    if (typeof instructions === 'string') parsedInstructions = JSON.parse(instructions);
    if (typeof tags === 'string') parsedTags = JSON.parse(tags);

    const recipe = new Recipe({
      user: req.user._id,
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      cookTime: cookTime || 30,
      tags: parsedTags || [],
    });

    if (req.file) {
      recipe.image = req.file.path; // Cloudinary URL
    }

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's custom recipes
// @route   GET /api/recipes/myrecipes
// @access  Private
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a custom recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user owns the recipe
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this recipe' });
    }

    const { title, description, ingredients, instructions, cookTime, tags } = req.body;

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (cookTime) recipe.cookTime = cookTime;

    if (ingredients) recipe.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    if (instructions) recipe.instructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
    if (tags) recipe.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;

    if (req.file) {
      recipe.image = req.file.path;
    }

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a custom recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
