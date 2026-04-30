import { createSlice } from '@reduxjs/toolkit';
import { addNotification } from '../notifications/notificationsSlice';
import { loadScopedData } from '../../utils/storageUtils';

// ─── Load persisted pantry from localStorage on startup ──────────────────────
const loadPantry = () => {
  return loadScopedData('pantry_v1');
};

const defaultItems = [
  { id: '1', name: 'Rice',     quantity: 5, unit: 'kg',   image: '/assets/pantry/rice.jpg' },
  { id: '2', name: 'Beans',   quantity: 2, unit: 'kg',   image: '/assets/pantry/beans.jpg' },
  { id: '3', name: 'Palm Oil',quantity: 1, unit: 'L',    image: '/assets/pantry/palmoil.jpg' },
  { id: '4', name: 'Salt',    quantity: 1, unit: 'pack', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=200&auto=format&fit=crop' },
];

const defaultInitialState = {
  items: defaultItems,
  inventoryThresholds: {
    Rice: 2,
    Beans: 1,
    'Palm Oil': 0.5,
  },
};

const initialState = loadPantry() || defaultInitialState;

const pantrySlice = createSlice({
  name: 'pantry',
  initialState,
  reducers: {
    rehydrate: (state, action) => {
      const persisted = loadPantry();
      return persisted ? { ...state, ...persisted } : defaultInitialState;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    },
    updateItemImage: (state, action) => {
      const { id, image } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.image = image;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    consumeIngredients: (state, action) => {
      const ingredientsToConsume = action.payload;
      ingredientsToConsume.forEach(({ name, quantity }) => {
        const item = state.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
        if (item) item.quantity = Math.max(0, item.quantity - quantity);
      });
    },
  },
});

export const { addItem, updateQuantity, updateItemImage, removeItem, consumeIngredients } = pantrySlice.actions;

// ─── Thunk: Add item AND post a notification ──────────────────────────────────
export const addPantryItemWithNotification = (item) => (dispatch) => {
  dispatch(addItem(item));
  dispatch(
    addNotification({
      title: '📦 Pantry Updated',
      message: `"${item.name}" (${item.quantity} ${item.unit}) has been added to your pantry.`,
      time: 'Just now',
      link: '/pantry',
    })
  );
};

// ─── Thunk: Remove item AND post a notification ───────────────────────────────
export const removePantryItemWithNotification = (id, name) => (dispatch) => {
  dispatch(removeItem(id));
  dispatch(
    addNotification({
      title: '🗑️ Item Removed',
      message: `"${name}" has been removed from your pantry.`,
      time: 'Just now',
      link: '/pantry',
    })
  );
};

// ─── Thunk: Alert when item goes low stock ────────────────────────────────────
export const alertLowStock = (name) => (dispatch) => {
  dispatch(
    addNotification({
      title: '⚠️ Low Stock Alert',
      message: `"${name}" is running low in your pantry. Consider restocking soon.`,
      time: 'Just now',
      link: '/pantry',
    })
  );
};

export default pantrySlice.reducer;
