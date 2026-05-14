import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPreferences } from '../preferences/preferencesSlice';

// Note: Settings are now synchronized via the fetchPreferences thunk in preferencesSlice.
// This slice handles the local UI state for these settings.

const defaultInitialState = {
  theme: 'light', 
  accentColor: '#10B981', 
  currency: {
    symbol: '₦',
    code: 'NGN',
    name: 'Naira'
  },
  notifications: {
    pushEnabled: true,
    emailEnabled: false,
    reminderTime: '08:00',
    mealSuggestions: true,
    budgetAlerts: true
  },
  language: 'en',
  region: 'Nigeria'
};

const initialState = defaultInitialState;

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    resetSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPreferences.fulfilled, (state, action) => {
      const { theme, accentColor, currency, notifications } = action.payload;
      if (theme) state.theme = theme;
      if (accentColor) state.accentColor = accentColor;
      if (currency) state.currency = currency;
      if (notifications) state.notifications = { ...state.notifications, ...notifications };
    });
  }
});

export const { 
  setTheme, 
  setAccentColor, 
  setCurrency, 
  updateNotificationSettings, 
  setLanguage,
  resetSettings 
} = settingsSlice.actions;

export default settingsSlice.reducer;
