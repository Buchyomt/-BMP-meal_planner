import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    {
      id: 'proteins',
      name: 'Proteins',
      emoji: '🥩',
      items: [
        { id: 'p1', name: 'Chicken', desc: '1kg • Whole chicken', price: 3500, checked: false },
        { id: 'p2', name: 'Eggs', desc: '1 crate • 30 pieces', price: 2800, checked: true },
        { id: 'p3', name: 'Stockfish', desc: 'Dried • Medium size', price: 1200, checked: false },
      ]
    },
    {
      id: 'grains',
      name: 'Grains & Staples',
      emoji: '🌾',
      items: [
        { id: 'g1', name: 'Rice (Ofada)', desc: '2kg • Local Ofada rice', price: 2400, checked: false },
        { id: 'g2', name: 'Yam', desc: '1 tuber • Medium size', price: 1500, checked: true },
        { id: 'g3', name: 'Garri', desc: 'Paint bucket • White garri', price: 1000, checked: false },
        { id: 'g4', name: 'Beans (Oloyin)', desc: '1kg • Honey beans', price: 1200, checked: false },
      ]
    },
    {
      id: 'veg',
      name: 'Vegetables & Spices',
      emoji: '🌶️',
      items: [
        { id: 'v1', name: 'Ugwu Leaves', desc: 'Fresh bundle • Fluted pumpkin', price: 200, checked: false },
        { id: 'v2', name: 'Tomatoes', desc: '1 basket • Fresh ripe', price: 800, checked: false },
        { id: 'v3', name: 'Pepper & Onions', desc: 'Mixed • Atarodo & onions', price: 500, checked: true },
        { id: 'v4', name: 'Palm Oil', desc: '1 Litre • Pure red palm oil', price: 1500, checked: false },
      ]
    }
  ],
  weeklyBudget: 20000,
  quickAddSuggestions: ['Crayfish', 'Maggi', 'Salt', 'Ogiri', 'Locust beans']
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    toggleItem: (state, action) => {
      const { categoryId, itemId } = action.payload;
      const category = state.categories.find(c => c.id === categoryId);
      if (category) {
        const item = category.items.find(i => i.id === itemId);
        if (item) {
          item.checked = !item.checked;
        }
      }
    },
    addItem: (state, action) => {
      const { name, amount, price = 0, categoryId = 'veg' } = action.payload;
      const category = state.categories.find(c => c.id === categoryId) || state.categories[0];
      category.items.push({
        id: Date.now().toString(),
        name,
        desc: amount ? `${amount} • Added manually` : 'Added manually',
        price: price,
        checked: false
      });
    }
  }
});

export const { toggleItem, addItem } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
