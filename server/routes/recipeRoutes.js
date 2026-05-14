import express from 'express';
import { 
  searchRecipes, 
  getRecipeDetails, 
  createRecipe, 
  getMyRecipes, 
  updateRecipe, 
  deleteRecipe 
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Custom Recipe Routes
router.route('/')
  .post(protect, upload.single('image'), createRecipe);

router.get('/myrecipes', protect, getMyRecipes);

router.get('/search', protect, searchRecipes);

router.route('/:id')
  .get(protect, getRecipeDetails) // Existing Spoonacular ID route
  .put(protect, upload.single('image'), updateRecipe)
  .delete(protect, deleteRecipe);

export default router;
