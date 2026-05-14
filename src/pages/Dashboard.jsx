import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BudgetCard from '../features/budget/components/BudgetCard';
import MealPlanCard from '../features/mealPlan/components/MealPlanCard';
import NutritionChart from '../features/mealPlan/components/NutritionChart';
import SavingsChart from '../features/budget/components/SavingsChart';
import MealsSummaryCard from '../features/mealPlan/components/MealsSummaryCard';
import QuickActionCard from '../components/ui/QuickActionCard';
import { ShoppingBag, Settings, Share2, Calendar } from 'lucide-react';
import { fetchBudget, saveBudget, updateSpentFromMeals } from '../features/budget/budgetSlice';
import { fetchMealPlans } from '../features/mealPlan/mealPlanSlice';
import { fetchPreferences } from '../features/preferences/preferencesSlice';
import { fetchShoppingList } from '../features/shoppingList/shoppingListSlice';
import './Dashboard.css';

const Dashboard = () => {
  const { total, spent, savings, weeklyHistory } = useSelector((state) => state.budget);
  const { meals, summary } = useSelector((state) => state.mealPlan);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('Adaeze');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('bmp_currentUser');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      if (currentUser && currentUser.name) {
        const firstName = currentUser.name.split(' ')[0];
        setUserName(firstName);
      }
    } catch (e) {
      console.warn('Error parsing user in Dashboard', e);
    }
    
    // Fetch user data from backend
    dispatch(fetchBudget());
    dispatch(fetchMealPlans());
    dispatch(fetchPreferences());
    dispatch(fetchShoppingList());
  }, [dispatch]);


  const getCurrentWeekString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
    
    const startOfWeek = new Date(today.setDate(diff));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `Week of ${startStr} – ${endStr}, ${endOfWeek.getFullYear()}`;
  };

  const remaining = total - spent;

  const handleUpdateTotal = (newTotal) => {
    dispatch(saveBudget({ monthlyLimit: newTotal }));
    // Cleanup old legacy key
    localStorage.removeItem('bmp_customTotal');
  };

  const handleToggleMeal = (isAdded, price) => {
    const newSpent = isAdded ? spent + price : spent - price;
    dispatch(updateSpentFromMeals(newSpent));
  };

  const calculateNutrition = (mealsArray) => {
    if (!mealsArray || mealsArray.length === 0) return null;
    const counts = { Protein: 0, Carbs: 0, Vitamins: 0, Fats: 0 };
    let totalTags = 0;
    
    mealsArray.forEach(m => {
      if (m.tags) {
        m.tags.forEach(tag => {
          if (counts[tag] !== undefined) {
             counts[tag]++;
             totalTags++;
          }
        });
      }
    });

    if (totalTags === 0) return null;
    
    return [
      { name: 'Protein', value: Math.round((counts.Protein / totalTags) * 100), color: '#FF7F50' },
      { name: 'Carbs', value: Math.round((counts.Carbs / totalTags) * 100), color: '#FFD700' },
      { name: 'Vitamins', value: Math.round((counts.Vitamins / totalTags) * 100), color: '#00BFFF' },
      { name: 'Fats', value: Math.round((counts.Fats / totalTags) * 100), color: '#32CD32' },
    ].filter(item => item.value > 0);
  };

  const shoppingListItemsCount = meals && meals.length > 0 ? meals.length * 4 : 0;
  const categoriesCount = shoppingListItemsCount > 0 ? 5 : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-section">
        <div className="greeting">
          <h1>Good morning, {userName} 👋</h1>
          <p>Here's your meal planning overview for this week.</p>
        </div>
        <div className="date-filter">
          <Calendar size={16} />
          <span>{getCurrentWeekString()}</span>
        </div>
      </div>

      <BudgetCard 
        total={total} 
        spent={spent} 
        remaining={remaining} 
        savings={savings}
        onUpdateTotal={handleUpdateTotal}
      />

      <section className="meal-plan-section">
        <div className="section-header">
          <h2>Weekly Meal Plan</h2>
          <button className="text-btn" onClick={() => navigate('/meal-plans')}>View Full Plan →</button>
        </div>
        <div className="meal-plan-grid">
          {meals.map((meal, index) => (
            <MealPlanCard 
              key={index} 
              {...meal} 
              onToggleMeal={handleToggleMeal}
              onClick={() => navigate('/meal-plans', { state: { day: meal.day } })}
            />
          ))}
        </div>
      </section>

      <div className="analytics-grid">
        <NutritionChart nutritionData={calculateNutrition(meals)} />
        <SavingsChart weeklyHistory={weeklyHistory} totalSavings={savings} />
        <MealsSummaryCard 
          totalMeals={summary.totalMeals}
          breakdown={summary.breakdown}
        />
      </div>

      <div className="quick-actions-grid">
        <div onClick={() => navigate('/shopping-list')} style={{ cursor: 'pointer', height: '100%' }}>
          <QuickActionCard 
            icon={<ShoppingBag size={20} />}
            title="View Shopping List"
            subtitle={shoppingListItemsCount > 0 ? `${shoppingListItemsCount} items across ${categoriesCount} categories` : "No items planned"}
          />
        </div>
        <div onClick={() => navigate('/preferences')} style={{ cursor: 'pointer', height: '100%' }}>
          <QuickActionCard 
            icon={<Settings size={20} />}
            title="Edit Preferences"
            subtitle="Diet, allergies, household size"
          />
        </div>
        <div onClick={() => window.print()} style={{ cursor: 'pointer', height: '100%' }}>
          <QuickActionCard 
            icon={<Share2 size={20} />}
            title="Export Meal Plan"
            subtitle="Download as PDF or share"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
