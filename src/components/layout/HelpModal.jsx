import React, { useEffect } from 'react';
import { X, BookOpen, Target, DollarSign, ShoppingCart } from 'lucide-react';
import './HelpModal.css';

const HelpModal = ({ onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <BookOpen size={32} color="var(--primary-color)" />
          <h2>Budget Meal Planner Guides</h2>
          <p>Quick tips to get the most out of your planning.</p>
        </div>
        <div className="modal-body">
          <div className="guide-section">
            <div className="guide-icon"><Target size={20} /></div>
            <div>
              <h4>1. Generating a Meal Plan</h4>
              <p>Click the "Generate Plan" button on the top bar. This will create a new 7-day meal plan based on your preferences. Your budget will automatically update with the total cost.</p>
            </div>
          </div>
          <div className="guide-section">
            <div className="guide-icon"><DollarSign size={20} /></div>
            <div>
              <h4>2. Tracking Your Spending</h4>
              <p>On the Dashboard and Meal Plans page, you can check/uncheck meals. This updates your 'Spent' amount in the budget card, helping you see how much you have left.</p>
            </div>
          </div>
          <div className="guide-section">
            <div className="guide-icon"><ShoppingCart size={20} /></div>
            <div>
              <h4>3. Using the Shopping List</h4>
              <p>Navigate to the "Shopping List" page from the sidebar. It automatically lists all the ingredients you'll need for your generated meal plan for the week.</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="primary-btn" onClick={onClose}>Got it, thanks!</button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;