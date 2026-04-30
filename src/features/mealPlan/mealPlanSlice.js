import { createSlice } from '@reduxjs/toolkit';
import { loadScopedData } from '../../utils/storageUtils';

const allergyIngredientMap = {
  Groundnut: ['Raw groundnuts'],
  Shellfish: ['Crayfish'],
  Dairy: ['Custard powder', 'Milk', 'Butter'],
  Gluten: ['Flour', 'Semolina'],
  Eggs: ['Eggs']
};

const mealPool = {
  breakfast: [
    {
      meal: 'Akara & Pap',
      price: 850,
      tags: ['Protein', 'Carbs', 'Vitamins'],
      image: '/assets/meals/akara_pap.png',
      description: 'Bean cakes with corn porridge',
      time: '7:00 AM',
      calories: 420,
      protein: 18,
      carbs: 55,
      recipeSteps: [
        'Soak black-eyed beans and blend until smooth',
        'Season with onions, pepper, and salt',
        'Heat oil in a pan and deep-fry spoonfuls until golden',
        'Prepare pap by dissolving in hot water and stirring',
        'Serve akara alongside the warm pap',
      ],
      ingredients: ['Black-eyed beans', 'Palm oil', 'Onions', 'Pepper', 'Corn flour', 'Salt'],
    },
    {
      meal: 'Moi Moi & Custard',
      price: 900,
      tags: ['Protein', 'Carbs'],
      image: '/assets/meals/moi_moi_custard.png',
      description: 'Steamed bean pudding with creamy custard',
      time: '7:00 AM',
      calories: 380,
      protein: 20,
      carbs: 48,
      recipeSteps: [
        'Peel and blend beans until smooth',
        'Add seasoning, pepper, and any fillings (egg, fish)',
        'Pour into moi moi leaves or cups and steam for 45 minutes',
        'Mix custard powder with milk and hot water',
        'Serve together while still warm',
      ],
      ingredients: ['Black-eyed beans', 'Eggs', 'Mackerel', 'Onions', 'Custard powder', 'Milk'],
    },
    {
      meal: 'Yam & Egg Sauce',
      price: 1200,
      tags: ['Carbs', 'Vitamins'],
      image: '/assets/meals/yam_egg_sauce.png',
      description: 'Boiled yam with a rich egg and tomato sauce',
      time: '7:00 AM',
      calories: 460,
      protein: 15,
      carbs: 70,
      recipeSteps: [
        'Peel and cut yam into pieces, boil until tender',
        'Dice tomatoes, onions, and peppers',
        'Sauté onions in oil, add tomatoes and fry until reduced',
        'Beat eggs and pour into the sauce, stir gently',
        'Season with salt and serve over yam',
      ],
      ingredients: ['Yam', 'Eggs', 'Tomatoes', 'Onions', 'Pepper', 'Vegetable oil'],
    },
    {
      meal: 'Oatmeal & Fruits',
      price: 600,
      tags: ['Vitamins', 'Carbs'],
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop',
      description: 'Healthy oats with seasonal fruit toppings',
      time: '7:00 AM',
      calories: 320,
      protein: 12,
      carbs: 52,
      recipeSteps: ['Boil water or milk', 'Add oats and stir', 'Top with sliced fruits'],
      ingredients: ['Oats', 'Milk', 'Banana', 'Honey'],
    },
    {
      meal: 'Pancakes & Syrup',
      price: 700,
      tags: ['Carbs', 'Fats'],
      image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=600&auto=format&fit=crop',
      description: 'Fluffy pancakes with maple syrup',
      time: '7:00 AM',
      calories: 450,
      protein: 10,
      carbs: 65,
      recipeSteps: ['Mix batter', 'Fry on griddle', 'Serve with syrup'],
      ingredients: ['Flour', 'Eggs', 'Milk', 'Syrup'],
    }
  ],
  lunch: [
    {
      meal: 'Jollof Rice & Chicken',
      price: 1200,
      tags: ['Protein', 'Carbs', 'Fats'],
      image: '/assets/meals/jollof_rice_chicken.png',
      description: 'Smoky party-style jollof with grilled chicken',
      time: '1:00 PM',
      calories: 620,
      protein: 35,
      carbs: 80,
      recipeSteps: [
        'Blend tomatoes, peppers, and onions into a puree',
        'Fry the blended tomato mix in hot oil for 20 minutes',
        'Add parboiled rice, chicken stock, and seasoning',
        'Cover and cook on low heat until rice is done',
        'Serve with oven-grilled chicken and coleslaw',
      ],
      ingredients: ['Parboiled rice', 'Chicken', 'Tomatoes', 'Onions', 'Peppers', 'Seasoning'],
    },
    {
      meal: 'Beans & Plantain',
      price: 1000,
      tags: ['Protein', 'Vitamins'],
      image: '/assets/meals/beans_plantain.png',
      description: 'Spiced honey beans with sweet fried plantain',
      time: '1:00 PM',
      calories: 540,
      protein: 22,
      carbs: 75,
      recipeSteps: [
        'Wash and parboil honey beans until soft',
        'Season and cook beans with palm oil, onions, and crayfish',
        'Peel ripe plantains and slice diagonally',
        'Fry plantains in hot oil until golden brown',
        'Serve beans with fried plantain',
      ],
      ingredients: ['Honey beans', 'Palm oil', 'Ripe plantain', 'Onions', 'Crayfish', 'Salt'],
    },
    {
      meal: 'Fried Rice & Coleslaw',
      price: 1500,
      tags: ['Carbs', 'Vitamins', 'Protein'],
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop',
      description: 'Colorful Nigerian fried rice with fresh coleslaw',
      time: '1:00 PM',
      calories: 580,
      protein: 28,
      carbs: 78,
      recipeSteps: [
        'Parboil rice and drain. Dice all vegetables',
        'Fry onions, liver, and mixed vegetables in butter',
        'Add rice, curry powder, and seasoning, stir-fry',
        'Shred cabbage and carrots for coleslaw, dress with mayo',
        'Serve fried rice alongside coleslaw',
      ],
      ingredients: ['Parboiled rice', 'Mixed vegetables', 'Chicken liver', 'Butter', 'Cabbage', 'Carrots'],
    },
    {
      meal: 'White Rice & Stew',
      price: 1100,
      tags: ['Carbs', 'Vitamins'],
      image: '/assets/meals/rice and stew.jpg',
      description: 'Steamed white rice with peppery tomato stew',
      time: '1:00 PM',
      calories: 550,
      protein: 20,
      carbs: 85,
      recipeSteps: ['Boil rice', 'Prepare tomato stew', 'Serve together'],
      ingredients: ['Rice', 'Tomatoes', 'Pepper', 'Beef'],
    },
    {
      meal: 'Amala & Ewedu',
      price: 1200,
      tags: ['Protein', 'Vitamins'],
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=600&auto=format&fit=crop',
      description: 'Yam flour meal with jute leaf soup',
      time: '1:00 PM',
      calories: 480,
      protein: 25,
      carbs: 60,
      recipeSteps: ['Make amala paste', 'Cook ewedu soup', 'Serve with stew'],
      ingredients: ['Yam flour', 'Ewedu leaves', 'Crayfish'],
    }
  ],
  dinner: [
    {
      meal: 'Egusi Soup & Pounded Yam',
      price: 1100,
      tags: ['Protein', 'Carbs', 'Vitamins', 'Fats'],
      image: '/assets/meals/egusi_pounded_yam.png',
      description: 'Rich melon seed soup with smooth pounded yam',
      time: '7:00 PM',
      calories: 710,
      protein: 32,
      carbs: 90,
      recipeSteps: [
        'Blend egusi seeds with onions and peppers until smooth',
        'Heat palm oil in a pot and fry the egusi paste for 5 minutes',
        'Add stockfish, seasoning cubes, and salt. Simmer for 15 minutes',
        'Add chopped spinach and cook for 3 more minutes',
        'Serve with freshly pounded yam',
      ],
      ingredients: ['Egusi seeds', 'Palm oil', 'Spinach', 'Stockfish', 'Yam flour', 'Onions', 'Peppers'],
    },
    {
      meal: 'Efo Riro & Eba',
      price: 1000,
      tags: ['Vitamins', 'Protein'],
      image: '/assets/meals/Efo Riro & Eba.jpg',
      description: 'Rich Yoruba spinach stew with smooth eba',
      time: '7:00 PM',
      calories: 640,
      protein: 28,
      carbs: 82,
      recipeSteps: [
        'Blend peppers and onions, fry in palm oil until reduced',
        'Add assorted meat and stockfish, season and stir',
        'Wash and chop spinach, add to pot and stir fry briefly',
        'Add crayfish and adjust seasoning',
        'Serve with warm eba (garri)',
      ],
      ingredients: ['Spinach', 'Palm oil', 'Assorted meat', 'Stockfish', 'Garri', 'Crayfish'],
    },
    {
      meal: 'Vegetable Soup & Semolina',
      price: 950,
      tags: ['Vitamins', 'Carbs'],
      image: '/assets/meals/Vegetable Soup & Semolina.jpg',
      description: 'Light mixed vegetable soup with soft semolina',
      time: '7:00 PM',
      calories: 590,
      protein: 24,
      carbs: 76,
      recipeSteps: [
        'Boil meat until tender with seasoning and onions',
        'Blend peppers, add to meat stock and fry briefly',
        'Chop mixed vegetables: spinach, pumpkin leaves',
        'Add vegetables and seasoning, simmer for 5 minutes',
        'Mold semolina in hot water until firm, serve together',
      ],
      ingredients: ['Mixed vegetables', 'Meat', 'Palm oil', 'Semolina', 'Crayfish', 'Pepper'],
    },
    {
      meal: 'Okra Soup & Garri',
      price: 900,
      tags: ['Vitamins', 'Protein'],
      image: '/assets/meals/Okra soup and garri.jpg',
      description: 'Fresh okra soup with yellow or white garri',
      time: '7:00 PM',
      calories: 520,
      protein: 28,
      carbs: 70,
      recipeSteps: ['Chop okra', 'Cook with fish and stock', 'Serve with eba'],
      ingredients: ['Okra', 'Fish', 'Garri', 'Palm oil'],
    },
    {
      meal: 'Spaghetti Stir-fry',
      price: 1300,
      tags: ['Carbs', 'Protein'],
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop',
      description: 'Quick spaghetti with vegetables and sausage',
      time: '7:00 PM',
      calories: 490,
      protein: 18,
      carbs: 72,
      recipeSteps: ['Boil spaghetti', 'Stir-fry veggies and sausage', 'Mix together'],
      ingredients: ['Spaghetti', 'Mixed veggies', 'Sausage'],
    }
  ],
  snack: [
    {
      meal: 'Chin Chin',
      price: 300,
      tags: ['Carbs', 'Fats'],
      image: '/assets/meals/chin_chin.jpg',
      description: 'Crunchy deep-fried Nigerian dough cubes',
      time: '4:00 PM',
      calories: 180,
      protein: 4,
      carbs: 30,
      recipeSteps: [
        'Mix flour, sugar, butter, and eggs into a firm dough',
        'Roll out dough on a flat surface and cut into small pieces',
        'Deep fry in hot oil until golden and crispy',
        'Drain excess oil on a paper towel',
        'Store in an airtight container when cool',
      ],
      ingredients: ['Flour', 'Sugar', 'Butter', 'Eggs', 'Vegetable oil', 'Milk'],
    },
    {
      meal: 'Puff Puff',
      price: 200,
      tags: ['Carbs', 'Fats'],
      image: '/assets/meals/puff_puff.jpg',
      description: 'Soft, fluffy deep-fried Nigerian doughnuts',
      time: '4:00 PM',
      calories: 210,
      protein: 5,
      carbs: 35,
      recipeSteps: [
        'Mix flour, yeast, sugar, and warm water. Let rise for 1 hour',
        'Heat oil in a pan to medium heat',
        'Scoop batter into oil using a spoon or hands',
        'Fry until golden brown on all sides',
        'Drain on paper towels and serve warm',
      ],
      ingredients: ['Flour', 'Yeast', 'Sugar', 'Warm water', 'Vegetable oil', 'Nutmeg'],
    },
    {
      meal: 'Groundnut',
      price: 150,
      tags: ['Protein', 'Fats'],
      image: '/assets/meals/groundnut.jpg',
      description: 'Roasted peanuts, a protein-rich snack',
      time: '4:00 PM',
      calories: 160,
      protein: 8,
      carbs: 12,
      recipeSteps: [
        'Rinse raw groundnuts and allow to dry',
        'Heat a dry pan or pot on medium fire',
        'Add groundnuts and stir continuously',
        'Roast for 15-20 minutes until skin darkens',
        'Allow to cool, peel skins, and serve',
      ],
      ingredients: ['Raw groundnuts', 'Salt (optional)'],
    },
    {
      meal: 'Fresh Fruits',
      price: 250,
      tags: ['Vitamins'],
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&auto=format&fit=crop',
      description: 'Assorted seasonal fresh fruits',
      time: '4:00 PM',
      calories: 90,
      protein: 1,
      carbs: 22,
      recipeSteps: ['Wash fruits', 'Slice and serve'],
      ingredients: ['Orange', 'Apple', 'Banana'],
    }
  ],
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const createDefaultWeekPlan = () => {
  return DAYS.reduce((plan, day, i) => {
    plan[day] = {
      // Rotate across the pools so each day gets a different meal
      breakfast: mealPool.breakfast[i % mealPool.breakfast.length],
      lunch:     mealPool.lunch[i % mealPool.lunch.length],
      dinner:    mealPool.dinner[i % mealPool.dinner.length],
      snack:     mealPool.snack[i % mealPool.snack.length],
    };
    return plan;
  }, {});
};


// ─── Load persisted meal plan from localStorage on startup ───────────────────
const loadMealPlan = () => {
  return loadScopedData('mealPlan_v1');
};

const defaultInitialState = {
  meals: [
    { day: 'Mon', meal: 'Jollof Rice & Chicken', price: 2800, tags: ['Protein', 'Carbs'], image: '/assets/meals/jollof_rice_chicken.png', calories: 620, protein: 35, carbs: 80 },
    { day: 'Tue', meal: 'Beans & Plantain', price: 1500, tags: ['Protein', 'Vitamins'], image: '/assets/meals/beans_plantain.png', calories: 540, protein: 22, carbs: 75 },
    { day: 'Wed', meal: 'Egusi Soup & Pounded Yam', price: 2200, tags: ['Protein', 'Carbs'], image: '/assets/meals/egusi_pounded_yam.png', calories: 710, protein: 32, carbs: 90 },
    { day: 'Thu', meal: 'Akara & Pap', price: 1200, tags: ['Protein', 'Carbs'], image: '/assets/meals/akara_pap.png', calories: 420, protein: 18, carbs: 55 },
    { day: 'Fri', meal: 'Yam & Egg Sauce', price: 1800, tags: ['Vitamins', 'Carbs'], image: '/assets/meals/yam_egg_sauce.png', calories: 460, protein: 15, carbs: 70 },
    { day: 'Sat', meal: 'Fried Rice & Coleslaw', price: 3000, tags: ['Protein', 'Carbs'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=400&auto=format&fit=crop', calories: 580, protein: 28, carbs: 78 },
    { day: 'Sun', meal: 'Vegetable Soup & Eba', price: 2050, tags: ['Vitamins', 'Protein'], image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop', calories: 640, protein: 28, carbs: 82 },
  ],
  weekPlan: createDefaultWeekPlan(),
  summary: {
    totalMeals: 21,
    breakdown: { breakfast: 7, lunch: 7, dinner: 7 },
  },
  totalBudget: 15000,
};

const initialState = loadMealPlan() || defaultInitialState;

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    rehydrate: (state, action) => {
      const persisted = loadMealPlan();
      return persisted ? { ...state, ...persisted } : defaultInitialState;
    },
    setMeals: (state, action) => {
      state.meals = action.payload;
    },
    generateRandomPlan: (state, action) => {
      const { nutritionalGoal = 'Balanced', weeklyBudget = 15000, selectedAllergies = [] } = action.payload || {};
      
      const excludedIngredients = selectedAllergies.reduce((acc, allergy) => {
        return [...acc, ...(allergyIngredientMap[allergy] || [])];
      }, []);

      const filterByGoalAndAllergies = (pool, goal) => {
        let filtered = pool.filter(meal => !meal.ingredients.some(ing => excludedIngredients.includes(ing)));
        if (filtered.length === 0) filtered = pool; // Fallback if allergies exclude everything

        if (goal === 'Weight Loss') return filtered.filter(m => m.calories < 450 || m.tags.includes('Vitamins'));
        if (goal === 'Muscle Gain') return filtered.filter(m => m.protein > 25 || m.calories > 500);
        return filtered;
      };

      // Fisher-Yates shuffle for true randomisation without in-place repeats
      const shuffle = (arr) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      };

      // Build unique-first queues per meal type, padded with as many shuffles as needed to cover all 7 days
      const buildQueue = (pool, goal) => {
        const filtered = filterByGoalAndAllergies(pool, goal);
        let base = shuffle(filtered);
        // Ensure we have at least 7 items by repeating the shuffled list if needed
        while (base.length < DAYS.length && filtered.length > 0) {
          base = [...base, ...shuffle(filtered)];
        }
        return base;
      };

      const breakfastQueue = buildQueue(mealPool.breakfast, nutritionalGoal);
      const lunchQueue    = buildQueue(mealPool.lunch, nutritionalGoal);
      const dinnerQueue   = buildQueue(mealPool.dinner, nutritionalGoal);
      const snackQueue    = buildQueue(mealPool.snack, nutritionalGoal);

      DAYS.forEach((day, i) => {
        state.weekPlan[day] = {
          breakfast: breakfastQueue[i % breakfastQueue.length],
          lunch:     lunchQueue[i % lunchQueue.length],
          dinner:    dinnerQueue[i % dinnerQueue.length],
          snack:     snackQueue[i % snackQueue.length],
        };
      });
      
      // Update Dashboard meals array to show 7 unique meals drawn from the week's plan
      const uniqueDashboardMeals = [];
      const seenMeals = new Set();
      
      DAYS.forEach((day) => {
        const dailyPlan = state.weekPlan[day];
        const types = ['lunch', 'dinner', 'breakfast', 'snack'];
        let selectedMeal = dailyPlan.lunch;
        
        for (const type of types) {
          if (dailyPlan[type] && !seenMeals.has(dailyPlan[type].meal)) {
            selectedMeal = dailyPlan[type];
            break;
          }
        }
        
        seenMeals.add(selectedMeal.meal);
        uniqueDashboardMeals.push({ ...selectedMeal, day });
      });
      
      state.meals = uniqueDashboardMeals;
      
      state.summary = { totalMeals: 28, breakdown: { breakfast: 7, lunch: 7, dinner: 7, snack: 7 } };
      state.totalBudget = Object.values(state.weekPlan).reduce((acc, d) => {
        return acc + (d.breakfast?.price || 0) + (d.lunch?.price || 0) + (d.dinner?.price || 0) + (d.snack?.price || 0);
      }, 0);
    },
    swapMeal: (state, action) => {
      const { day, mealType, nutritionalGoal = 'Balanced', selectedAllergies = [] } = action.payload || {};
      const pool = mealPool[mealType];
      if (!pool) return;
      
      const excludedIngredients = selectedAllergies.reduce((acc, allergy) => {
        return [...acc, ...(allergyIngredientMap[allergy] || [])];
      }, []);

      const filterByGoalAndAllergies = (pool, goal) => {
        let filtered = pool.filter(meal => !meal.ingredients.some(ing => excludedIngredients.includes(ing)));
        if (filtered.length === 0) filtered = pool; // Fallback

        if (goal === 'Weight Loss') return filtered.filter(m => m.calories < 450 || m.tags.includes('Vitamins'));
        if (goal === 'Muscle Gain') return filtered.filter(m => m.protein > 25 || m.calories > 500);
        return filtered;
      };

      const current = state.weekPlan[day]?.[mealType];
      let filtered = filterByGoalAndAllergies(pool, nutritionalGoal).filter((m) => m.meal !== current?.meal);
      if (filtered.length === 0) filtered = filterByGoalAndAllergies(pool, nutritionalGoal);
      const next = filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
      
      if (state.weekPlan[day]) {
        state.weekPlan[day][mealType] = next;
      }
      
      // Recalculate total budget
      state.totalBudget = Object.values(state.weekPlan).reduce((acc, d) => {
        return acc + (d.breakfast?.price || 0) + (d.lunch?.price || 0) + (d.dinner?.price || 0) + (d.snack?.price || 0);
      }, 0);
    },
    updateMealInPlan: (state, action) => {
      const { day, mealType, newMeal } = action.payload;
      if (state.weekPlan[day]) {
        state.weekPlan[day][mealType] = newMeal;
      }
    },
    consumeIngredients: (state, action) => {
      const { ingredients } = action.payload;
      // Logic to decrement pantry items would go here
    },
  },
});

export const { setMeals, generateRandomPlan, swapMeal, updateMealInPlan, consumeIngredients } = mealPlanSlice.actions;
export { mealPool };
export default mealPlanSlice.reducer;
