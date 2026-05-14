import express from 'express';
import { 
  getMealPlans, 
  addMealPlan, 
  updateMealPlan, 
  deleteMealPlan 
} from '../controllers/mealPlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMealPlans)
  .post(protect, addMealPlan);

router.route('/:id')
  .put(protect, updateMealPlan)
  .delete(protect, deleteMealPlan);

export default router;
