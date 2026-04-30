import { configureStore, combineReducers } from '@reduxjs/toolkit';
import budgetReducer from '../features/budget/budgetSlice';
import mealPlanReducer from '../features/mealPlan/mealPlanSlice';
import shoppingListReducer from '../features/shoppingList/shoppingListSlice';
import preferencesReducer from '../features/preferences/preferencesSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import pantryReducer from '../features/pantry/pantrySlice';
import marketReducer from '../features/market/marketSlice';
import settingsReducer from '../features/settings/settingsSlice';
import { getScopedKey } from '../utils/storageUtils';

const rootReducer = combineReducers({
  budget: budgetReducer,
  mealPlan: mealPlanReducer,
  shoppingList: shoppingListReducer,
  preferences: preferencesReducer,
  notifications: notificationsReducer,
  pantry: pantryReducer,
  market: marketReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});


// ─── Lightweight localStorage persistence ─────────────────────────────────────
// Avoids redux-persist's storage.getItem crash in Vite ESM environments.

// Persist pantry, notifications, budget, preferences & mealPlan to localStorage after every relevant action
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem(getScopedKey('pantry_v1'), JSON.stringify(state.pantry));
    localStorage.setItem(getScopedKey('notifications_v1'), JSON.stringify(state.notifications));
    localStorage.setItem(getScopedKey('budget_v1'), JSON.stringify(state.budget));
    localStorage.setItem(getScopedKey('preferences_v1'), JSON.stringify(state.preferences));
    localStorage.setItem(getScopedKey('mealPlan_v1'), JSON.stringify(state.mealPlan));
    localStorage.setItem(getScopedKey('settings_v1'), JSON.stringify(state.settings));
  } catch (_) {
    // localStorage may be unavailable in private mode — silently ignore
  }
});

export const persistor = null; // Not used — persistence is handled manually above
