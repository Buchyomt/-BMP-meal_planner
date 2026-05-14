import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateRandomPlan } from '../features/mealPlan/mealPlanSlice';
import { updatePreferencesLocal } from '../features/preferences/preferencesSlice';

const useAutoScheduler = () => {
  const dispatch = useDispatch();
  const { autoSchedule, lastGenerated, nutritionalGoal, weeklyBudget, selectedAllergies } = useSelector((state) => state.preferences);

  useEffect(() => {
    if (autoSchedule === 'None') return;

    const checkSchedule = () => {
      const today = new Date();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = dayNames[today.getDay()];

      if (currentDay === autoSchedule) {
        const todayStr = today.toISOString().split('T')[0];
        
        // Only generate if we haven't generated today already
        if (lastGenerated !== todayStr) {
          console.log(`Auto-generating plan for ${currentDay}...`);
          dispatch(generateRandomPlan({ nutritionalGoal, weeklyBudget, selectedAllergies }));
          dispatch(updatePreferencesLocal({ lastGenerated: todayStr }));
        }
      }
    };

    // Check once on mount and then every hour (in case the app stays open)
    checkSchedule();
    const interval = setInterval(checkSchedule, 3600000);

    return () => clearInterval(interval);
  }, [autoSchedule, lastGenerated, nutritionalGoal, weeklyBudget, selectedAllergies, dispatch]);
};

export default useAutoScheduler;
