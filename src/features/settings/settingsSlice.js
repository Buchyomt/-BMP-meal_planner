import { createSlice } from '@reduxjs/toolkit';
import { loadScopedData } from '../../utils/storageUtils';

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

const loadSettings = () => {
  return loadScopedData('settings_v1');
};

const initialState = loadSettings() || defaultInitialState;

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
