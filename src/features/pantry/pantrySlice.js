import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addNotification } from '../notifications/notificationsSlice';

// ─── Async Thunks for API calls ──────────────────────────────────────────────

export const fetchPantry = createAsyncThunk(
  'pantry/fetchPantry',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/pantry');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch pantry');
    }
  }
);

export const addPantryItem = createAsyncThunk(
  'pantry/addPantryItem',
  async (itemData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post('/pantry', itemData);
      dispatch(addNotification({
        title: '📦 Pantry Updated',
        message: `"${itemData.name}" has been added to your pantry.`,
        time: 'Just now',
        link: '/pantry',
      }));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item');
    }
  }
);

export const updatePantryItem = createAsyncThunk(
  'pantry/updatePantryItem',
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pantry/${id}`, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deletePantryItem = createAsyncThunk(
  'pantry/deletePantryItem',
  async ({ id, name }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/pantry/${id}`);
      dispatch(addNotification({
        title: '🗑️ Item Removed',
        message: `"${name}" has been removed from your pantry.`,
        time: 'Just now',
        link: '/pantry',
      }));
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item');
    }
  }
);

const defaultInitialState = {
  items: [],
  loading: false,
  error: null,
  inventoryThresholds: {
    Rice: 2,
    Beans: 1,
    'Palm Oil': 0.5,
  },
};

const pantrySlice = createSlice({
  name: 'pantry',
  initialState: defaultInitialState,
  reducers: {
    consumeIngredients: (state, action) => {
      const ingredientsToConsume = action.payload;
      ingredientsToConsume.forEach(({ name, quantity }) => {
        const item = state.items.find((i) => i.name.toLowerCase() === name.toLowerCase());
        if (item) item.quantity = Math.max(0, item.quantity - quantity);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPantry.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPantry.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPantry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPantryItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePantryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deletePantryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  }
});

export const { consumeIngredients } = pantrySlice.actions;

export const updateQuantity = ({ id, quantity }) => (dispatch) => {
  dispatch(updatePantryItem({ id, quantity }));
};

// ─── Legacy compatibility thunks (mapping to new API thunks) ──────────────────
export const addPantryItemWithNotification = (item) => (dispatch) => {
  dispatch(addPantryItem(item));
};

export const removePantryItemWithNotification = (id, name) => (dispatch) => {
  dispatch(deletePantryItem({ id, name }));
};

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

export const updateItemImage = ({ id, image }) => (dispatch) => {
  dispatch(updatePantryItem({ id, image }));
};

export default pantrySlice.reducer;
