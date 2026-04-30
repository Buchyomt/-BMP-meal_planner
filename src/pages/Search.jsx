import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mealPool } from '../features/mealPlan/mealPlanSlice';
import MealPlanCard from '../features/mealPlan/components/MealPlanCard';
import { Search as SearchIcon, Filter, ArrowLeft } from 'lucide-react';
import { updateSpentFromMeals } from '../features/budget/budgetSlice';
import { useSelector } from 'react-redux';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { spent } = useSelector((state) => state.budget);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';
    setQuery(q);
    
    if (q.trim()) {
      // Flatten all categories from mealPool into a single searchable array
      const allMeals = [
        ...mealPool.breakfast,
        ...mealPool.lunch,
        ...mealPool.dinner,
        ...mealPool.snack
      ];
      
      const filtered = allMeals.filter(meal => {
        const name = (meal.meal || meal.name || '').toLowerCase();
        const desc = (meal.description || '').toLowerCase();
        const ingredients = (meal.ingredients || []).join(' ').toLowerCase();
        const tags = (meal.tags || []).join(' ').toLowerCase();
        const searchTerm = q.toLowerCase();
        
        return name.includes(searchTerm) || 
               desc.includes(searchTerm) || 
               ingredients.includes(searchTerm) ||
               tags.includes(searchTerm);
      });
      
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [location.search]);

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

      {results.length > 0 ? (
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