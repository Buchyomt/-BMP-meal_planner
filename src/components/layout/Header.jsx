import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Check, Sparkles, Globe, Activity, Menu } from 'lucide-react';
import { generateRandomPlan } from '../../features/mealPlan/mealPlanSlice';
import { updateSpentFromMeals } from '../../features/budget/budgetSlice';
import { markAsRead as markGlobalAsRead } from '../../features/notifications/notificationsSlice';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [userName, setUserName] = useState('Adaeze Okonkwo');
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const meals = useSelector((state) => state.mealPlan.meals);
  const globalNotifications = useSelector((state) => state.notifications.items);

  // Merge global (Redux) and local (generated) notifications
  const notifications = [...globalNotifications, ...localNotifications];

  // Dynamically calculate total whenever newly generated meals change the state
  useEffect(() => {
    if (meals && meals.length > 0) {
      const generatedTotal = meals.reduce((total, meal) => total + (Number(meal.price) || 0), 0);
      // Update the budget dynamically based on the actual sum of the meals
      dispatch(updateSpentFromMeals(Math.round(generatedTotal)));
    }
  }, [meals, dispatch]);

  useEffect(() => {
    const loadUser = () => {
      const currentUser = JSON.parse(localStorage.getItem('bmp_currentUser'));
      if (currentUser) {
        if (currentUser.name) setUserName(currentUser.name);
        if (currentUser.image) setUserImage(currentUser.image);
      }
    };

    loadUser();

    // Listen for storage changes from other components/tabs
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  useEffect(() => {
    // Generate dynamic notifications based on the meal plan
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysMeals = (meals || []).filter(m => m.day === currentDay || m.day === 'Any').slice(0, 2);
    
    const generatedNotifs = todaysMeals.map((meal, index) => ({
      id: `meal-${index}`,
      title: `Upcoming Meal: ${meal.name || meal.meal}`,
      message: `Reminder to prepare your ${meal.name || meal.meal} today.`,
      time: 'Today',
      read: false,
      isLocal: true,
      link: '/meal-plans'
    }));

    generatedNotifs.push({
      id: 'eaten-mock',
      title: 'Meal Completed',
      message: 'You logged your dinner! Great job sticking to your budget.',
      time: 'Yesterday',
      read: true,
      isLocal: true,
      link: '/meal-plans'
    });

    setLocalNotifications(generatedNotifs);
  }, [meals]);

  const { nutritionalGoal, weeklyBudget, selectedAllergies } = useSelector((state) => state.preferences) || {};

  const handleGeneratePlan = () => {
    dispatch(generateRandomPlan({ nutritionalGoal, weeklyBudget, selectedAllergies }));
  };

  const performSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotifOpen(false);
  };

  const toggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsProfileOpen(false);
  };

  const handleMarkAsRead = (e, notif) => {
    e.stopPropagation();
    if (notif.isLocal) {
      setLocalNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    } else {
      dispatch(markGlobalAsRead(notif.id));
    }
  };

  const handleNotifClick = (notif) => {
    // Mark as read
    if (!notif.read) {
      if (notif.isLocal) {
        setLocalNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      } else {
        dispatch(markGlobalAsRead(notif.id));
      }
    }
    // Navigate to the linked page
    if (notif.link) {
      setIsNotifOpen(false);
      navigate(notif.link);
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    // Clear session data from localStorage
    localStorage.removeItem('bmp_isLoggedIn');
    localStorage.removeItem('bmp_currentUser');
    // Force a complete reload to clear out the previous user's Redux state
    window.location.href = '/';
  };

  return (
    <header className="header">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <Menu size={24} color="#1E293B" />
      </button>

      <div className="header-search">
        <Search 
          size={18} 
          className="search-icon" 
          onClick={performSearch} 
          style={{ cursor: 'pointer' }}
        />
        <input 
          type="text" 
          placeholder="Search meals, recipes, ingredients..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="header-actions">
        <button className="btn-generate" onClick={handleGeneratePlan}>
          <Sparkles size={16} />
          <span className="btn-generate-text">Generate Plan</span>
        </button>

        <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? <Globe size={14} /> : <Activity size={14} />}
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>
        
        <div className="notification-bell" onClick={toggleNotif} style={{ cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          {notifications.some(n => !n.read) && <span className="notification-dot"></span>}

          {isNotifOpen && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()} style={{ 
              position: 'absolute', top: '40px', right: '-10px', 
              width: '320px', padding: '1rem', cursor: 'default', zIndex: 50
            }}>
              <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#333' }}>
                Notifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(notif => (
                  <div key={notif.id} onClick={() => handleNotifClick(notif)} style={{
                    display: 'flex', flexDirection: 'column', padding: '10px',
                    backgroundColor: notif.read ? 'transparent' : '#f0fdf4',
                    borderLeft: notif.read ? '3px solid transparent' : '3px solid #007A33',
                    borderRadius: '4px', position: 'relative',
                    cursor: notif.link ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => { if (notif.link) e.currentTarget.style.backgroundColor = notif.read ? '#f9fafb' : '#e6f7ed'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f0fdf4'; }}
                  >
                    <strong style={{ fontSize: '0.9rem', color: '#111' }}>{notif.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#555', marginTop: '2px', paddingRight: '20px' }}>{notif.message}</span>
                    <span style={{ fontSize: '0.7rem', color: '#999', marginTop: '6px' }}>{notif.time}</span>
                    {!notif.read && (
                      <button onClick={(e) => handleMarkAsRead(e, notif)} style={{
                        position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#007A33'
                      }} title="Mark as read">
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-container">
          <div className="user-profile" onClick={toggleProfile}>
            <div className="user-avatar">
              {userImage ? (
                <img src={userImage} alt={userName} className="header-avatar-img" />
              ) : (
                userName ? userName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U'
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              <span className="user-tier">Premium Plan</span>
            </div>
            <ChevronDown size={14} className={isProfileOpen ? 'rotate' : ''} />
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}>
                <User size={16} />
                <span>My Profile</span>
              </div>
              <div className="dropdown-item" onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}>
                <Settings size={16} />
                <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
