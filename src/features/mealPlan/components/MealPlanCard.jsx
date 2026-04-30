import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import useOnlineStatus from '../../../hooks/useOnlineStatus';
import './MealPlanCard.css';

const MealPlanCard = ({ day = 'Any', meal = 'Unknown Meal', name, price = 0, tags = [], image = '', onToggleMeal, onClick }) => {
  const [isSelected, setIsSelected] = useState(false);
  const isOnline = useOnlineStatus();
  const displayTitle = meal !== 'Unknown Meal' ? meal : (name || 'Unknown Meal');

  const handleToggle = (e) => {
    e.stopPropagation();
    const newState = !isSelected;
    setIsSelected(newState);
    if (onToggleMeal) {
      onToggleMeal(newState, price);
    }
  };

  return (
    <div className={`meal-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="meal-image-container">
        <div className="day-badge">{day}</div>
        {isOnline ? (
          <img 
            src={image} 
            alt={meal} 
            className="meal-image" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="meal-image meal-img-offline">
            <span>📵</span>
            <small>Offline</small>
          </div>
        )}
      </div>
      <div className="meal-info">
        <div className="flex justify-between items-start" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 className="meal-title">{displayTitle}</h3>
            <p className="meal-price">₦{(Number(price) || 0).toLocaleString()}</p>
          </div>
          <button 
            onClick={handleToggle}
            style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
            title={isSelected ? "Remove from budget" : "Add to budget"}
          >
            {isSelected ? <Minus color="#f44336" size={20} /> : <Plus color="#4CAF50" size={20} />}
          </button>
        </div>
        <div className="meal-tags">
          {(Array.isArray(tags) ? tags : []).map((tag, index) => (
            <span key={index} className="meal-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;
