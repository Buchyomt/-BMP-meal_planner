import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { searchRecipes, mealPool } from '../features/mealPlan/mealPlanSlice';
import MealPlanCard from '../features/mealPlan/components/MealPlanCard';
import { Search as SearchIcon, Filter, ArrowLeft, Loader2 } from 'lucide-react';
import { updateSpentFromMeals } from '../features/budget/budgetSlice';
import { useSelector } from 'react-redux';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { spent } = useSelector((state) => state.budget);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';
    setQuery(q);
    
    const performSearch = async () => {
      if (!q.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      
      // 1. Search local pool
      const allMeals = [
        ...mealPool.breakfast,
        ...mealPool.lunch,
        ...mealPool.dinner,
        ...mealPool.snack
      ];
      
      const localResults = allMeals.filter(meal => {
        const name = (meal.meal || meal.name || '').toLowerCase();
        const ingredients = (meal.ingredients || []).join(' ').toLowerCase();
        return name.includes(q.toLowerCase()) || ingredients.includes(q.toLowerCase());
      });

      // 2. Search Spoonacular via Backend
      try {
        const apiAction = await dispatch(searchRecipes(q));
        const apiResults = apiAction.payload || [];
        
        // Combine results, removing duplicates by name
        const combined = [...localResults];
        apiResults.forEach(apiMeal => {
          if (!combined.some(m => m.meal.toLowerCase() === apiMeal.meal.toLowerCase())) {
            combined.push(apiMeal);
          }
        });
        
        setResults(combined);
      } catch (err) {
        console.error('API Search failed:', err);
        setResults(localResults); // Fallback to local
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [location.search, dispatch]);

  const handleToggleMeal = (isAdded, price) => {
    const newSpent = isAdded ? spent + price : spent - price;
    dispatch(updateSpentFromMeals(newSpent));
  };

  return (
    <div className="search-page">
      <div className="search-results-header">
        <div className="search-info">
          <h1 className="search-title">
            Search Results for "{query}"
          </h1>
          <p className="search-subtitle">
            Found {results.length} results matching your search terms.
          </p>
        </div>
        <div className="search-filters">
          <button className="filter-btn">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="search-loading">
          <Loader2 size={48} className="spinner" />
          <p>Searching for delicious recipes...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="search-results-grid">
          {results.map((meal, index) => (
            <MealPlanCard 
              key={index} 
              {...meal} 
              onToggleMeal={handleToggleMeal}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">
            <SearchIcon size={48} color="#9CA3AF" />
          </div>
          <h3>No results found</h3>
          <p>We couldn't find any meals matching "{query}". Try searching for something else like "Rice", "Beans", or "Chicken".</p>
          <button className="back-home-btn" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;