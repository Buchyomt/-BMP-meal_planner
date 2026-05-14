import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks for API calls ──────────────────────────────────────────────

export const fetchPreferences = createAsyncThunk(
  'preferences/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/preferences');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch preferences');
    }
  }
);

export const savePreferences = createAsyncThunk(
  'preferences/savePreferences',
  async (prefData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/preferences', prefData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save preferences');
    }
  }
);

const defaultInitialState = {
  dietToggles: {
    'traditional': true,
    'high-protein': false,
    'low-carb': false,
    'vegan': false,
    'budget-saver': false,
    'balanced': false
  },
  selectedAllergies: ['Groundnut', 'Dairy'],
  householdSize: 4,
  planDuration: 'Weekly',
  weeklyBudget: 15000,
  nutritionalGoal: 'Balanced', 
  autoSchedule: 'Monday', 
  lastGenerated: null,
  loading: false,
  error: null
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: defaultInitialState,
  reducers: {
    updatePreferencesLocal: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        return { ...state, ...action.payload, loading: false };
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(savePreferences.fulfilled, (state, action) => {
        return { ...state, ...action.payload };
      });
  }
});

export const { updatePreferencesLocal } = preferencesSlice.actions;
export default preferencesSlice.reducer;
