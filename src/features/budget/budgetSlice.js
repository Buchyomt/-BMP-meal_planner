import { createSlice } from '@reduxjs/toolkit';
import { loadScopedData } from '../../utils/storageUtils';

// ─── Load persisted budget from localStorage on startup ──────────────────────
const loadBudget = () => {
  return loadScopedData('budget_v1');
};

const defaultInitialState = {
  total: 20000,
  spent: 14550,
  remaining: 5450,
  savings: 5200,
  weeklyHistory: [
    { day: 'Mon', savings: 1200 },
    { day: 'Tue', savings: 800 },
    { day: 'Wed', savings: 1500 },
    { day: 'Thu', savings: 1000 },
    { day: 'Fri', savings: 500 },
    { day: 'Sat', savings: 200 },
  ]
};

const initialState = loadBudget() || defaultInitialState;

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    updateBudget: (state, action) => {
      return { ...state, ...action.payload };
    },
    rehydrate: (state, action) => {
      const persisted = loadBudget();
      return persisted ? { ...state, ...persisted } : defaultInitialState;
    },
    updateSpentFromMeals: (state, action) => {
      const mealTotal = action.payload;
      state.spent = mealTotal;
      state.remaining = state.total - state.spent;
      state.savings = Math.max(0, state.total * 0.3 - (state.spent * 0.2)); // Dynamic mock savings
      
      // Dynamically update the weekly history chart data based on new savings
      const baseSavings = state.savings / 6; 
      state.weeklyHistory = [
        { day: 'Mon', savings: Math.round(baseSavings * 1.2) },
        { day: 'Tue', savings: Math.round(baseSavings * 0.8) },
        { day: 'Wed', savings: Math.round(baseSavings * 1.5) },
        { day: 'Thu', savings: Math.round(baseSavings * 1.0) },
        { day: 'Fri', savings: Math.round(baseSavings * 0.5) },
        { day: 'Sat', savings: Math.round(baseSavings * 1.0) },
      ];
    },
  },
});

export const { updateBudget, updateSpentFromMeals, rehydrate } = budgetSlice.actions;
export default budgetSlice.reducer;
