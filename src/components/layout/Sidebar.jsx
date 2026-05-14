import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingCart, 
  Settings, 
  Boxes,
  TrendingUp,
  X,
  ShieldAlert
} from 'lucide-react';
import HelpModal from './HelpModal';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  let isAdmin = false;
  try {
    const storedUser = localStorage.getItem('bmp_currentUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    isAdmin = user && user.role === 'admin';
  } catch (e) {}

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Utensils size={20} />, label: 'Meal Plans', path: '/meal-plans' },
    { icon: <ShoppingCart size={20} />, label: 'Shopping List', path: '/shopping-list' },
    { icon: <Boxes size={20} />, label: 'Pantry', path: '/pantry' },
    { icon: <TrendingUp size={20} />, label: 'Market Prices', path: '/market' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: <ShieldAlert size={20} />, label: 'Admin Panel', path: '/admin' });
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon">
            <Utensils color="white" size={24} />
          </div>
          <span>BMP</span>
        </div>
        <button className="mobile-close-btn" onClick={onClose}>
          <X size={24} color="white" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="help-card">
          <h4>Need help?</h4>
          <p>Check our guides for tips on saving more on meals.</p>
          <button className="help-btn" onClick={() => setIsHelpModalOpen(true)}>Go to Guides</button>
        </div>
      </div>

      {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}
    </aside>
  );
};

export default Sidebar;
