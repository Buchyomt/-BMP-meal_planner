import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks for API calls ──────────────────────────────────────────────

export const fetchBudget = createAsyncThunk(
  'budget/fetchBudget',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/budget');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch budget');
    }
  }
);

export const saveBudget = createAsyncThunk(
  'budget/saveBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await api.put('/budget', budgetData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update budget');
    }
  }
);

const defaultInitialState = {
  total: 20000,
  spent: 14550,
  remaining: 5450,
  savings: 5200,
  loading: false,
  error: null,
  weeklyHistory: [
    { day: 'Mon', savings: 1200 },
    { day: 'Tue', savings: 800 },
    { day: 'Wed', savings: 1500 },
    { day: 'Thu', savings: 1000 },
    { day: 'Fri', savings: 500 },
    { day: 'Sat', savings: 200 },
  ]
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState: defaultInitialState,
  reducers: {
    updateBudgetLocal: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend fields to frontend state
        if (action.payload) {
          state.total = action.payload.monthlyLimit || state.total;
          state.spent = action.payload.spent !== undefined ? action.payload.spent : state.spent;
          state.remaining = state.total - state.spent;
        }
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveBudget.fulfilled, (state, action) => {
        if (action.payload) {
          state.total = action.payload.monthlyLimit || state.total;
          state.spent = action.payload.spent !== undefined ? action.payload.spent : state.spent;
          state.remaining = state.total - state.spent;
        }
      });
  },
});

export const { updateBudgetLocal } = budgetSlice.actions;

export const updateSpentFromMeals = (mealTotal) => (dispatch, getState) => {
  const { budget } = getState();
  const spent = mealTotal;
  const remaining = budget.total - spent;
  
  dispatch(saveBudget({ spent }));
};

export default budgetSlice.reducer;
