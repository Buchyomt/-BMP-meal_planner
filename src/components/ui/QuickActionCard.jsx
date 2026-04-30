import React from 'react';
import { ChevronRight } from 'lucide-react';
import './QuickActionCard.css';

const QuickActionCard = ({ icon, title, subtitle, onClick }) => {
  return (
    <div className="quick-action-card" onClick={onClick}>
      <div className="action-icon-box">
        {icon}
      </div>
      <div className="action-text">
        <h4 className="action-title">{title}</h4>
        <p className="action-subtitle">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="action-arrow" />
    </div>
  );
};

export default QuickActionCard;
