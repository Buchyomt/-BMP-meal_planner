import { createSlice } from '@reduxjs/toolkit';

const defaultInitialState = { items: [] };
const initialState = defaultInitialState;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    rehydrate: (state, action) => {
      const persisted = loadNotifications();
      return persisted ? { ...state, ...persisted } : defaultInitialState;
    },
    addNotification: (state, action) => {
      const notification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: action.payload.title,
        message: action.payload.message,
        time: action.payload.time || 'Just now',
        link: action.payload.link || null,
        read: false,
        timestamp: Date.now(),
      };
      state.items.unshift(notification);
      // Keep only the latest 30 notifications to avoid bloat
      if (state.items.length > 30) state.items = state.items.slice(0, 30);
    },
    markAsRead: (state, action) => {
      const notif = state.items.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach(n => { n.read = true; });
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
