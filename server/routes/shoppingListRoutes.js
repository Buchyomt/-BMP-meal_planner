import express from 'express';
import { 
  getShoppingList, 
  updateShoppingList, 
  generateSmartShoppingList 
} from '../controllers/shoppingListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/generate', protect, generateSmartShoppingList);

router.route('/')
  .get(protect, getShoppingList)
  .put(protect, updateShoppingList);

export default router;
