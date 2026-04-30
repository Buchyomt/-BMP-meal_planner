import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { addItem } from '../shoppingListSlice';

const QuickAdd = () => {
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const dispatch = useDispatch();
  const suggestions = useSelector(state => state.shoppingList.quickAddSuggestions);

  const handleAdd = (name) => {
    const finalName = name || itemName;
    if (finalName.trim()) {
      dispatch(addItem({ 
        name: finalName, 
        amount: itemAmount.trim(),
        price: Number(itemPrice) || 0
      }));
      setItemName('');
      setItemAmount('');
      setItemPrice('');
    }
  };

  return (
    <div className="quick-add-card">
      <h4>Quick Add</h4>
      <p>Add items to your list</p>
      
      <div className="quick-add-form" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Item name..." 
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="quick-input"
        />
        <input 
          type="text" 
          placeholder="Quantity (e.g. 1kg)" 
          value={itemAmount}
          onChange={(e) => setItemAmount(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="quick-input"
        />
        <input 
          type="number" 
          placeholder="Price (₦)" 
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="quick-input"
        />
        <button className="btn-add-full" onClick={() => handleAdd()}>
          <Plus size={18} color="white" /> Quick Add
        </button>
      </div>
      
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            className="suggestion-pill"
            onClick={() => handleAdd(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAdd;
