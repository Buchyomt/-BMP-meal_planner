import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import './MealsSummaryCard.css';

const MealsSummaryCard = ({ totalMeals = 0, breakdown = {}, targetMeals = 21 }) => {
  const navigate = useNavigate();
  // Dynamically calculate percentage based on total vs target (default 3 meals * 7 days = 21)
  const percentage = Math.min(Math.round((totalMeals / targetMeals) * 100), 100) || 0;

  return (
    <div className="analytics-card meals-summary" onClick={() => navigate('/meal-plans')}>
      <div className="card-header items-center flex justify-between">
        <h3>Meals Planned</h3>
        <span className="time-badge">Jan 13-19</span>
      </div>

      <div className="summary-main">
        <div className="summary-icon-box">
          <Utensils color="#FFB800" size={24} />
        </div>
        <h2 className="meals-count">{totalMeals}</h2>
        <p className="meals-subtitle">meals this week</p>
      </div>

      <div className="meals-breakdown">
        {Object.entries(breakdown || {}).map(([type, count], index) => (
          <div key={index} className="breakdown-item">
            <span className="breakdown-count">{count}</span>
            <span className="breakdown-label">{type}</span>
          </div>
        ))}
      </div>

      <div className="planning-progress">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="progress-label">{percentage}% planned</div>
      </div>
    </div>
  );
};

export default MealsSummaryCard;
