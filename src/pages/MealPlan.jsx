import React, { useState, useMemo } from 'react';
import useOnlineStatus from '../hooks/useOnlineStatus';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Flame,
  Dumbbell,
  Wheat,
} from 'lucide-react';
import { swapMeal, generateRandomPlan } from '../features/mealPlan/mealPlanSlice';
import './MealPlan.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TAG_COLORS = {
  Protein: { bg: '#FFF3ED', text: '#E8642C', border: '#FDDCC8' },
  Carbs:   { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' },
  Vitamins:{ bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Fats:    { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
};

const MEAL_ICONS = {
  breakfast: '🌤️',
  lunch:     '🔥',
  dinner:    '🌙',
  snack:     '🍊',
};

const MEAL_TIMES = {
  breakfast: '7:00 AM',
  lunch:     '1:00 PM',
  dinner:    '7:00 PM',
  snack:     '4:00 PM',
};

function getWeekRange() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { monday, sunday, label: `${fmt(monday)} – ${fmt(sunday)}` };
}

const TagBadge = ({ tag }) => {
  const style = TAG_COLORS[tag] || { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
  return (
    <span
      className="mp-tag"
      style={{ background: style.bg, color: style.text, borderColor: style.border }}
    >
      {tag}
    </span>
  );
};

const IngredientBadge = ({ label }) => (
  <span className="mp-ingredient-badge">{label}</span>
);

const MealCard = ({ meal, mealType, day, defaultExpanded = false }) => {
  const dispatch = useDispatch();
  const { nutritionalGoal, selectedAllergies } = useSelector((state) => state.preferences);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [swapping, setSwapping] = useState(false);
  const isOnline = useOnlineStatus();

  if (!meal) return null;

  const handleSwap = (e) => {
    e.stopPropagation();
    setSwapping(true);
    dispatch(swapMeal({ day, mealType, nutritionalGoal, selectedAllergies }));
    setTimeout(() => setSwapping(false), 400);
  };

  return (
    <div className={`mp-meal-card ${expanded ? 'mp-meal-card--expanded' : ''}`}>
      <div className="mp-meal-header">
        <div className="mp-meal-label">
          <span className="mp-meal-icon">{MEAL_ICONS[mealType]}</span>
          <span className="mp-meal-type">{mealType.toUpperCase()}</span>
        </div>
        <span className="mp-meal-time">{MEAL_TIMES[mealType]}</span>
      </div>

      <div className="mp-meal-body">
        {isOnline ? (
          <img
            src={meal.image}
            alt={meal.meal}
            className="mp-meal-img"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="mp-meal-img mp-img-offline">
            <span>📵</span>
            <small>Offline</small>
          </div>
        )}
        <div className="mp-meal-info">
          <div className="mp-meal-info-top">
            <div>
              <h3 className="mp-meal-name">{meal.meal}</h3>
              <p className="mp-meal-desc">{meal.description}</p>
            </div>
            <span className="mp-meal-price">₦{meal.price.toLocaleString()}</span>
          </div>
          <div className="mp-meal-tags">
            {(meal.tags || []).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>

      <div className="mp-meal-actions">
        <button
          className={`mp-swap-btn ${swapping ? 'mp-swap-btn--spinning' : ''}`}
          onClick={handleSwap}
          title="Swap this meal"
        >
          <RefreshCw size={14} />
        </button>
        <button
          className="mp-expand-btn"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? 'Collapse' : 'See recipe'}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="mp-meal-expand">
          {meal.recipeSteps && meal.recipeSteps.length > 0 && (
            <div className="mp-recipe">
              <h4 className="mp-recipe-title">RECIPE STEPS</h4>
              <ol className="mp-recipe-list">
                {meal.recipeSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mp-ingredients">
              <h4 className="mp-ingredients-title">INGREDIENTS</h4>
              <div className="mp-ingredients-list">
                {meal.ingredients.map((ing, i) => (
                  <IngredientBadge key={i} label={ing} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MealPlan = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { weekPlan } = useSelector((state) => state.mealPlan);
  const { nutritionalGoal, weeklyBudget, selectedAllergies } = useSelector((state) => state.preferences);

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  const initialDayIdx = useMemo(() => {
    if (location.state && location.state.day) {
      const idx = DAYS.indexOf(location.state.day);
      if (idx !== -1) return idx;
    }
    return todayIndex;
  }, [location.state, todayIndex]);

  const [selectedDayIdx, setSelectedDayIdx] = useState(initialDayIdx);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekInfo = useMemo(() => {
    const base = getWeekRange();
    const mon = new Date(base.monday);
    mon.setDate(mon.getDate() + weekOffset * 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const fmt = (d) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dates = DAYS.map((_, i) => {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      return d.getDate();
    });
    return { label: `${fmt(mon)} – ${fmt(sun)}`, dates };
  }, [weekOffset]);

  const selectedDay = DAYS[selectedDayIdx];
  const dayMeals = weekPlan?.[selectedDay] || {};

  const dailyNutrition = useMemo(() => {
    const meals = Object.values(dayMeals).filter(Boolean);
    return {
      calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
      protein:  meals.reduce((s, m) => s + (m.protein || 0), 0),
      carbs:    meals.reduce((s, m) => s + (m.carbs || 0), 0),
    };
  }, [dayMeals]);

  const dailyTotal = useMemo(() => {
    return Object.values(dayMeals)
      .filter(Boolean)
      .reduce((s, m) => s + (m.price || 0), 0);
  }, [dayMeals]);

  const dailyBudgetLimit = weeklyBudget / 7;
  const isWithinBudget = dailyTotal <= dailyBudgetLimit;

  return (
    <div className="mp-page">
      <div className="mp-title-row">
        <h1 className="mp-page-title">Meal Plans</h1>
        <div className="goal-badge">
          <Sparkles size={14} />
          <span>{nutritionalGoal} Mode</span>
        </div>
      </div>

      <div className="mp-week-nav">
        <div className="mp-week-nav-left">
          <button className="mp-week-arrow" onClick={() => setWeekOffset((o) => o - 1)}>
            <ChevronLeft size={18} />
          </button>
          <span className="mp-week-label">{weekInfo.label}</span>
          <button className="mp-week-arrow" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRight size={18} />
          </button>
        </div>
        <button className="mp-ai-btn" onClick={() => dispatch(generateRandomPlan({ nutritionalGoal, weeklyBudget, selectedAllergies }))}>
          <Sparkles size={15} />
          AI Optimize
        </button>
      </div>

      <div className="mp-day-tabs">
        {DAYS.map((day, idx) => (
          <button
            key={day}
            className={`mp-day-tab ${selectedDayIdx === idx ? 'mp-day-tab--active' : ''}`}
            onClick={() => setSelectedDayIdx(idx)}
          >
            <span className="mp-day-name">{day}</span>
            <span className="mp-day-num">{weekInfo.dates[idx]}</span>
          </button>
        ))}
      </div>

      <div className="mp-grid">
        <MealCard meal={dayMeals.breakfast} mealType="breakfast" day={selectedDay} />
        <MealCard meal={dayMeals.lunch}     mealType="lunch"     day={selectedDay} />
        <MealCard meal={dayMeals.dinner}    mealType="dinner"    day={selectedDay} defaultExpanded />
        <MealCard meal={dayMeals.snack}     mealType="snack"     day={selectedDay} />
      </div>

      <div className="mp-bottom-bar">
        <div className="mp-budget-status">
          <CheckCircle2 size={18} color={isWithinBudget ? '#16A34A' : '#DC2626'} />
          <span className="mp-budget-label" style={{ color: isWithinBudget ? '#16A34A' : '#DC2626' }}>
            {isWithinBudget ? 'Within Budget' : 'Over Budget'}
          </span>
        </div>

        <div className="mp-nutrition-stats">
          <div className="mp-nutrition-stat">
            <Flame size={15} color="#EF4444" />
            <span>{dailyNutrition.calories.toLocaleString()} kcal</span>
          </div>
          <div className="mp-nutrition-stat">
            <Dumbbell size={15} color="#F97316" />
            <span>{dailyNutrition.protein}g protein</span>
          </div>
          <div className="mp-nutrition-stat">
            <Wheat size={15} color="#EAB308" />
            <span>{dailyNutrition.carbs}g carbs</span>
          </div>
        </div>

        <div className="mp-daily-total">
          <span className="mp-daily-total-label">Today's Total:</span>
          <span className="mp-daily-total-amount">₦{dailyTotal.toLocaleString()}</span>
          <span className="mp-daily-budget-limit">/ ₦{Math.round(dailyBudgetLimit).toLocaleString()} budget</span>
        </div>
      </div>
    </div>
  );
};

export default MealPlan;
