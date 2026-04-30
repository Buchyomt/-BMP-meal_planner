import React from 'react';
import { useDispatch } from 'react-redux';
import { Check } from 'lucide-react';
import { toggleItem } from '../shoppingListSlice';

const ShoppingCategory = ({ category }) => {
  const dispatch = useDispatch();

  return (
    <div className="shopping-category-card">
      <div className="category-header">
        <div className="title-group">
          <span className="category-emoji">{category.emoji}</span>
          <h3 className="category-name">{category.name}</h3>
        </div>
        <span className="item-count">{category.items.length} items</span>
      </div>
      
      <div className="items-list">
        {category.items.map(item => (
          <div 
            key={item.id} 
            className={`shopping-item ${item.checked ? 'checked' : ''}`}
            onClick={() => dispatch(toggleItem({ categoryId: category.id, itemId: item.id }))}
          >
            <div className="checkbox-container">
              <div className={`checkbox ${item.checked ? 'active' : ''}`}>
                {item.checked && <Check size={14} color="white" strokeWidth={3} />}
              </div>
            </div>
            
            <div className="item-info">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-desc">{item.desc}</p>
            </div>
            
            <div className="item-price">
              ₦{item.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingCategory;
