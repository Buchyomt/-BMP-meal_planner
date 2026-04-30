import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Edit2, RefreshCw, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { updateMealInPlan } from '../../mealPlan/mealPlanSlice';
import { updateSpentFromMeals } from '../../budget/budgetSlice';
import MealReplacementModal from './MealReplacementModal';
import './EditPlan.css';

const EditPlan = () => {
  const dispatch = useDispatch();
  const { weekPlan } = useSelector((state) => state.mealPlan);
  const { spent, total } = useSelector((state) => state.budget);
  const [expandedDay, setExpandedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'short' }));
  const [modalData, setModalData] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleReplace = (day, mealType, meal) => {
    setModalData({ day, mealType, meal });
  };

  const handleSelectReplacement = (newMeal) => {
    if (!modalData) return;
    
    const { day, mealType, meal: oldMeal } = modalData;
    const priceDiff = newMeal.price - oldMeal.price;
    
    // Update Meal Plan
    dispatch(updateMealInPlan({ day, mealType, newMeal }));
    
    // Update Budget (Mocking the spent update based on the meal change)
    dispatch(updateSpentFromMeals(spent + priceDiff));
    
    setModalData(null);
  };

  return (
    <div className="edit-plan-card">
      <div className="card-header">
        <div className="header-title">
          <Calendar size={18} className="icon-gold" />
          <h3>Edit Plan</h3>
        </div>
        <span className="plan-status">Active</span>
      </div>

      <div className="days-list">
        {days.map((day) => (
          <div key={day} className={`day-item ${expandedDay === day ? 'expanded' : ''}`}>
            <div className="day-header" onClick={() => setExpandedDay(expandedDay === day ? null : day)}>
              <span className="day-name">{day}</span>
              <div className="day-summary">
                {expandedDay !== day && (
                  <span className="meal-preview">
                    {weekPlan[day].lunch.meal}
                  </span>
                )}
                {expandedDay === day ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedDay === day && (
              <div className="day-content">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
                  <div key={type} className="meal-row">
                    <div className="meal-type-label">{type}</div>
                    <div className="meal-info">
                      <span className="meal-name">{weekPlan[day][type].meal}</span>
                      <span className="meal-price">₦{weekPlan[day][type].price?.toLocaleString()}</span>
                    </div>
                    <button 
                      className="replace-btn"
                      onClick={() => handleReplace(day, type, weekPlan[day][type])}
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="plan-footer">
        <div className="budget-impact">
          <span>Planned Spend</span>
          <strong>₦{spent.toLocaleString()}</strong>
        </div>
        <div className="budget-bar-mini">
          <div 
            className="bar-fill" 
            style={{ width: `${Math.min(100, (spent / total) * 100)}%`, backgroundColor: spent > total ? '#EF4444' : '#FBBF24' }}
          ></div>
        </div>
      </div>

      <MealReplacementModal 
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        currentMeal={modalData?.meal}
        day={modalData?.day}
        mealType={modalData?.mealType}
        onSelect={handleSelectReplacement}
      />
    </div>
  );
};

export default EditPlan;
