import { createSlice } from '@reduxjs/toolkit';
import { loadScopedData } from '../../utils/storageUtils';

// ─── Load persisted preferences from localStorage on startup ─────────────────
const loadPreferences = () => {
  return loadScopedData('preferences_v1');
};

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
  nutritionalGoal: 'Balanced', // New: Weight Loss, Muscle Gain, Balanced
  autoSchedule: 'Monday', // New: Sunday, Monday, etc. or None
  lastGenerated: null,
};

const initialState = loadPreferences() || defaultInitialState;

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    rehydrate: (state, action) => {
      const persisted = loadPreferences();
      return persisted ? { ...state, ...persisted } : defaultInitialState;
    },
    updatePreferences: (state, action) => {
      return { ...state, ...action.payload };
    },
    setNutritionalGoal: (state, action) => {
      state.nutritionalGoal = action.payload;
    },
    setAllergy: (state, action) => {
      state.selectedAllergies = action.payload;
    },
    setDiet: (state, action) => {
      state.dietToggles = action.payload;
    }
  }
});

export const { updatePreferences, setNutritionalGoal, setAllergy, setDiet } = preferencesSlice.actions;
export default preferencesSlice.reducer;
