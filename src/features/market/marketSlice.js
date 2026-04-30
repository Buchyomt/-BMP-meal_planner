import { createSlice } from '@reduxjs/toolkit';

const basePrices = [
  { id: '1', item: 'Rice (50kg)', basePrice: 75000, trend: 'up' },
  { id: '2', item: 'Beans (Oloyin)', basePrice: 3500, trend: 'stable' },
  { id: '3', item: 'Palm Oil (1L)', basePrice: 1500, trend: 'down' },
  { id: '4', item: 'Yam (Large Tubers)', basePrice: 4500, trend: 'up' },
  { id: '5', item: 'Vegetable Oil (1L)', basePrice: 1800, trend: 'stable' },
];

const marketMultipliers = {
  'Lagos - Mile 12': 1.0,
  'Abuja - Utako': 1.15,
  'Port Harcourt - Oil Mill': 1.2,
  'Ibadan - Bodija': 0.9,
};

const generatePricesForMarket = (marketName) => {
  const multiplier = marketMultipliers[marketName] || 1.0;
  return basePrices.map(p => ({
    ...p,
    currentPrice: Math.round((p.basePrice * multiplier) / 50) * 50,
    lastUpdated: new Date().toISOString().split('T')[0],
  }));
};

const initialState = {
  selectedMarket: 'Lagos - Mile 12',
  marketOptions: Object.keys(marketMultipliers),
  prices: generatePricesForMarket('Lagos - Mile 12'),
  isLive: true,
  lastRefreshTime: 'Today, 6:00 AM'
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarket: (state, action) => {
      state.selectedMarket = action.payload;
      state.prices = generatePricesForMarket(action.payload);
      state.lastRefreshTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    refreshPrices: (state) => {
      state.prices.forEach(p => {
        const change = 1 + (Math.random() * 0.1 - 0.05); // +/- 5%
        p.currentPrice = Math.round((p.currentPrice * change) / 10) * 10;
        p.trend = change > 1.02 ? 'up' : change < 0.98 ? 'down' : 'stable';
        p.lastUpdated = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      });
      state.lastRefreshTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    },
    toggleLiveUpdates: (state) => {
      state.isLive = !state.isLive;
    }
  }
});

export const { setMarket, refreshPrices, toggleLiveUpdates } = marketSlice.actions;
export default marketSlice.reducer;
