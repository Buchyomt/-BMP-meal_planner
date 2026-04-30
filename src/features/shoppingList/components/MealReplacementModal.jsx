import React from 'react';
import { X, Check, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import useOnlineStatus from '../../../hooks/useOnlineStatus';
import { mealPool } from '../../mealPlan/mealPlanSlice';
import './EditPlan.css';

const MealReplacementModal = ({ isOpen, onClose, currentMeal, day, mealType, onSelect }) => {
  const isOnline = useOnlineStatus();
  if (!isOpen) return null;

  const alternatives = mealPool[mealType]?.filter(m => m.meal !== currentMeal.meal) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Replace {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h2>
            <p>Select an alternative for {day}</p>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="current-selection-mini">
          <span className="label">Current:</span>
          <span className="value">{currentMeal.meal}</span>
          <span className="price">₦{currentMeal.price?.toLocaleString()}</span>
        </div>

        <div className="alternatives-list">
          {alternatives.map((alt, index) => {
            const priceDiff = alt.price - currentMeal.price;
            return (
              <div key={index} className="alt-card" onClick={() => onSelect(alt)}>
                <div className="alt-img">
                  {isOnline ? (
                    <img src={alt.image} alt={alt.meal} />
                  ) : (
                    <div className="alt-img-offline">📵</div>
                  )}
                </div>
                <div className="alt-info">
                  <h3>{alt.meal}</h3>
                  <div className="alt-meta">
                    <span className="alt-price">₦{alt.price?.toLocaleString()}</span>
                    <span className={`price-impact ${priceDiff > 0 ? 'increase' : 'decrease'}`}>
                      {priceDiff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {priceDiff === 0 ? 'No change' : `₦${Math.abs(priceDiff).toLocaleString()}`}
                    </span>
                  </div>
                </div>
                <div className="select-icon">
                  <ArrowRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MealReplacementModal;
