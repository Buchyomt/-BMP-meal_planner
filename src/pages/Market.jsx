import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, TrendingDown, Clock, MapPin, RefreshCcw, Info, X } from 'lucide-react';
import { setMarket, refreshPrices, toggleLiveUpdates } from '../features/market/marketSlice';
import './Market.css';

const Market = () => {
  const dispatch = useDispatch();
  const { prices, selectedMarket, marketOptions, isLive, lastRefreshTime } = useSelector((state) => state.market);
  
  const [selectedCommodity, setSelectedCommodity] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCommodity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedCommodity]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInfoClick = (item) => {
    setSelectedCommodity(item);
  };

  const closeModal = () => {
    setSelectedCommodity(null);
  };

  return (
    <div className="market-page">
      <header className="page-header">
        <div className="header-text">
          <h1>Market Prices</h1>
          <p>Real-time price monitoring across major Nigerian markets.</p>
        </div>
        <div className="header-actions">
          <div className="live-toggle" onClick={() => dispatch(toggleLiveUpdates())}>
            <div className={`toggle-dot ${isLive ? 'active' : ''}`}></div>
            <span>Live Updates {isLive ? 'ON' : 'OFF'}</span>
          </div>
          <button className="refresh-btn" onClick={() => dispatch(refreshPrices())}>
            <RefreshCcw size={18} /> Refresh
          </button>
        </div>
      </header>

      <div className="market-selector-box glass-card">
        <div className="selector-info">
          <MapPin size={20} className="pin-icon" />
          <div>
            <label>Selected Region / Market</label>
            <select 
              value={selectedMarket} 
              onChange={(e) => dispatch(setMarket(e.target.value))}
            >
              {marketOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="market-status">
          <Clock size={16} />
          <span>Last update: {lastRefreshTime}</span>
        </div>
      </div>

      <div className="price-trends-grid">
        <div className="trend-card glass-card yellow">
          <div className="trend-icon"><TrendingUp size={24} /></div>
          <div className="trend-content">
            <h3>Rising Items</h3>
            <p>Rice, Yam, and Tomatoes have seen a 5-10% increase this week.</p>
          </div>
        </div>
        <div className="trend-card glass-card green">
          <div className="trend-icon"><TrendingDown size={24} /></div>
          <div className="trend-content">
            <h3>Best Value</h3>
            <p>Palm Oil and Beans prices are currently stable or dipping in {selectedMarket.split(' - ')[0]}.</p>
          </div>
        </div>
      </div>

      <div className="price-table-container glass-card">
        <table className="market-table">
          <thead>
            <tr>
              <th>Commodity Item</th>
              <th>Current Price</th>
              <th>Last Updated</th>
              <th>Trend</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {prices.map(item => (
              <tr key={item.id}>
                <td className="item-name"><strong>{item.item}</strong></td>
                <td className="item-price">{formatCurrency(item.currentPrice)}</td>
                <td className="item-date">{item.lastUpdated}</td>
                <td className={`item-trend ${item.trend}`}>
                  {item.trend === 'up' ? <TrendingUp size={16} /> : 
                   item.trend === 'down' ? <TrendingDown size={16} /> : 
                   <div className="stable-line"></div>}
                  <span>{item.trend}</span>
                </td>
                <td>
                  <button className="view-details-btn" onClick={() => handleInfoClick(item)}>
                    <Info size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="market-tips glass-card">
        <h3>💡 Market Tips for {selectedMarket.split(' - ')[0]}</h3>
        <ul>
          <li>Bulk buying at Mile 12 on Tuesday mornings offers the best wholesale rates for tubers.</li>
          <li>Prices are typically 15% higher on weekends due to increased consumer demand.</li>
          <li>Vegetable oil is currently cheaper if bought in 25L kegs rather than retail bottles.</li>
        </ul>
      </div>

      {/* --- Custom Modal Overlay --- */}
      {selectedCommodity && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="commodity-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCommodity.item} Details</h3>
              <button className="close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span>Current Price:</span>
                <strong>{formatCurrency(selectedCommodity.currentPrice)}</strong>
              </div>
              <div className="detail-row">
                <span>Market Trend:</span>
                <span className={`item-trend ${selectedCommodity.trend}`} style={{ display: 'inline-flex', padding: 0 }}>
                   {selectedCommodity.trend === 'up' ? <TrendingUp size={16} /> : 
                    selectedCommodity.trend === 'down' ? <TrendingDown size={16} /> : 
                    <div className="stable-line"></div>}
                   <span style={{ textTransform: 'capitalize' }}>{selectedCommodity.trend}</span>
                </span>
              </div>
              <div className="detail-row">
                <span>Last Updated:</span>
                <span>{selectedCommodity.lastUpdated}</span>
              </div>
              <div className="detail-row">
                <span>Regional Market:</span>
                <span>{selectedMarket}</span>
              </div>
              
              <div className="modal-tip">
                <h4>💡 Quick Tip</h4>
                <p>Buy in bulk for better rates! Prices and availability fluctuate based on transport costs to {selectedMarket.split(' - ')[0]}.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
