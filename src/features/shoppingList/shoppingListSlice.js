import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks for API calls ──────────────────────────────────────────────

export const fetchShoppingList = createAsyncThunk(
  'shoppingList/fetchShoppingList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shopping-list');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch shopping list');
    }
  }
);

export const saveShoppingList = createAsyncThunk(
  'shoppingList/saveShoppingList',
  async (listData, { rejectWithValue }) => {
    try {
      const response = await api.put('/shopping-list', listData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save shopping list');
    }
  }
);

const initialState = {
  categories: [],
  weeklyBudget: 20000,
  quickAddSuggestions: ['Crayfish', 'Maggi', 'Salt', 'Ogiri', 'Locust beans'],
  loading: false,
  error: null
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    setShoppingList: (state, action) => {
      state.categories = action.payload.categories || [];
      state.weeklyBudget = action.payload.weeklyBudget || 20000;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShoppingList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || [];
        state.weeklyBudget = action.payload.weeklyBudget || 20000;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveShoppingList.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      });
  }
});

export const { setShoppingList } = shoppingListSlice.actions;

export const toggleItem = (payload) => (dispatch, getState) => {
  const { categoryId, itemId } = payload;
  const { shoppingList } = getState();
  const newCategories = shoppingList.categories.map(cat => {
    if (cat.id === categoryId || cat._id === categoryId) {
      return {
        ...cat,
        items: cat.items.map(item => 
          (item.id === itemId || item._id === itemId) ? { ...item, checked: !item.checked } : item
        )
      };
    }
    return cat;
  });
  dispatch(saveShoppingList({ categories: newCategories }));
};

export const addItem = (payload) => (dispatch, getState) => {
  const { name, amount, price = 0, categoryId = 'veg' } = payload;
  const { shoppingList } = getState();
  
  const newItem = {
    id: Date.now().toString(),
    name,
    desc: amount ? `${amount} • Added manually` : 'Added manually',
    price: parseFloat(price) || 0,
    checked: false
  };

  const newCategories = JSON.parse(JSON.stringify(shoppingList.categories));
  let catIndex = newCategories.findIndex(c => c.id === categoryId || c._id === categoryId);
  if (catIndex === -1 && newCategories.length > 0) catIndex = 0;
  
  if (catIndex !== -1) {
    newCategories[catIndex].items.push(newItem);
    dispatch(saveShoppingList({ categories: newCategories }));
  }
};

export default shoppingListSlice.reducer;
