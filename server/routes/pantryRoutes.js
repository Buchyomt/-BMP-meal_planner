import express from 'express';
import { 
  getPantry, 
  addPantryItem, 
  updatePantryItem, 
  deletePantryItem 
} from '../controllers/pantryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPantry)
  .post(protect, addPantryItem);

router.route('/:id')
  .put(protect, updatePantryItem)
  .delete(protect, deletePantryItem);

export default router;
