import React, { useState, useEffect } from 'react';
import { Wallet, TrendingDown, Edit2, Check, X } from 'lucide-react';
import './BudgetCard.css';

const BudgetCard = ({ total, spent, remaining, savings, onUpdateTotal }) => {
  const percentUsed = (spent / total) * 100;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(total);

  useEffect(() => {
    setEditValue(total);
  }, [total]);

  const handleSave = () => {
    const val = Number(editValue);
    if (!isNaN(val) && val > 0) {
      if (onUpdateTotal) onUpdateTotal(val);
      setIsEditing(false);
    }
  };

  return (
    <div className="budget-card">
      <div className="budget-top">
        <div className="budget-label">
          <Wallet size={16} />
          <span>Weekly Budget</span>
        </div>
        <div className="savings-badge">
          <TrendingDown size={14} />
          <span>You saved ₦{savings.toLocaleString()} this week!</span>
        </div>
      </div>

      <div className="budget-main">
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>₦</span>
            <input 
              type="number" 
              value={editValue} 
              onChange={(e) => setEditValue(e.target.value)}
              style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '140px', padding: '4px 8px', borderRadius: '8px', border: '2px solid var(--primary-color)', outline: 'none' }}
              autoFocus
            />
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}><Check size={16} /></button>
            <button onClick={() => { setIsEditing(false); setEditValue(total); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ef4444', color: 'white', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="budget-amount" style={{ margin: 0 }}>₦{total.toLocaleString()}</h2>
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Edit Budget">
              <Edit2 size={18} />
            </button>
          </div>
        )}
        <div className="budget-stats">
          <div className="stat">
            <span className="stat-label">Spent</span>
            <span className="stat-value">₦{spent.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">₦{remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="budget-progress-container">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>₦0</span>
          <span>{percentUsed.toFixed(1)}% used</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
