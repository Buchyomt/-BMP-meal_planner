import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search } from 'lucide-react';
import ShoppingCategory from '../features/shoppingList/components/ShoppingCategory';
import CostSummary from '../features/shoppingList/components/CostSummary';
import QuickAdd from '../features/shoppingList/components/QuickAdd';
import EditPlan from '../features/shoppingList/components/EditPlan';
import { updateSpentFromMeals } from '../features/budget/budgetSlice';
import { fetchShoppingList } from '../features/shoppingList/shoppingListSlice';
import { fetchPantry } from '../features/pantry/pantrySlice';
import './ShoppingList.css';

const ShoppingList = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.shoppingList);
  const { items: pantryItems } = useSelector(state => state.pantry);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchShoppingList());
    dispatch(fetchPantry());
  }, [dispatch]);

  // Synchronize Checked Items Total with Global 'Spent' Budget
  useEffect(() => {
    const allCheckedItemsTotal = categories.reduce((total, category) => {
      const categoryTotal = category.items
        .filter(item => item.checked)
        .reduce((catSum, item) => catSum + (item.price || 0), 0);
      return total + categoryTotal;
    }, 0);

    dispatch(updateSpentFromMeals(allCheckedItemsTotal));
  }, [categories, dispatch]);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.map(item => {
      const inStock = pantryItems.find(p => p.name.toLowerCase() === item.name.toLowerCase());
      return {
        ...item,
        inPantry: inStock && inStock.quantity > 0 ? true : false,
        pantryQty: inStock ? inStock.quantity : 0,
        pantryUnit: inStock ? inStock.unit : ''
      };
    }).filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="shopping-list-page">
      <div className="shopping-header">
        <h1>Shopping List</h1>
        <span className="badge-this-week">This Week</span>
      </div>

      <div className="shopping-layout">
        <div className="shopping-main">
          <div className="inner-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search your shopping list..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredCategories.map(category => (
            <ShoppingCategory key={category.id} category={category} />
          ))}

          {filteredCategories.length === 0 && (
            <div className="empty-search" style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
              <p>No items found matching your search.</p>
            </div>
          )}
        </div>

        <div className="shopping-sidebar">
          <EditPlan />
          <CostSummary />
          <QuickAdd />
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
