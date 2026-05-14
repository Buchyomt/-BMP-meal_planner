import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Wallet, 
  Heart,
  Save,
  Check,
  X,
  Camera,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { 
  setTheme, 
  setAccentColor, 
  setCurrency, 
  updateNotificationSettings 
} from '../features/settings/settingsSlice';
import { savePreferences, updatePreferencesLocal } from '../features/preferences/preferencesSlice';
import { saveBudget } from '../features/budget/budgetSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import { generateRandomPlan } from '../features/mealPlan/mealPlanSlice';
import api from '../services/api';
import './Settings.css';

const ACCENT_PRESETS = [
  { name: 'Emerald', color: '#10B981' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Violet', color: '#8B5CF6' },
  { name: 'Rose', color: '#F43F5E' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Indigo', color: '#6366F1' },
];

const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Naira' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'Pound Sterling' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Safely select state with fallbacks
  const settings = useSelector((state) => state.settings) || {};
  const preferences = useSelector((state) => state.preferences) || {};
  const budget = useSelector((state) => state.budget) || {};
  
  const [activeSection, setActiveSection] = useState('account');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Local state for forms
  const [profileData, setProfileData] = useState({
    name: 'Adaeze Okonkwo',
    email: 'adaeze.okonkwo@example.com',
    phone: '+234 803 123 4567',
    location: 'Lagos, Nigeria',
    image: null
  });

  const [prefData, setPrefData] = useState({
    weeklyBudget: budget.total || 20000,
    householdSize: preferences.householdSize || 1,
    planDuration: preferences.planDuration || 'Weekly'
  });

  // Load user data on mount
  useEffect(() => {
    try {
      const userJson = localStorage.getItem('bmp_currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        setProfileData(prev => ({ ...prev, ...user }));
      }
    } catch (e) {
      console.warn('Error parsing user in Settings', e);
    }
  }, []);

  // Sync Theme and Accent with DOM
  useEffect(() => {
    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
    if (settings.accentColor) {
      document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    }
  }, [settings.theme, settings.accentColor]);

  const handleSaveAll = async () => {
    try {
      // Save Preferences to Backend
      await dispatch(savePreferences({
        ...preferences,
        ...prefData,
      })).unwrap();

      // Save Budget to Backend
      await dispatch(saveBudget({ monthlyLimit: prefData.weeklyBudget })).unwrap();

      // For profile data, we'll store it locally for now (can be expanded to a User model update API later)
      localStorage.setItem('bmp_currentUser', JSON.stringify(profileData));

      // Regenerate meal plan to apply any new allergy/diet settings
      dispatch(generateRandomPlan({ 
        nutritionalGoal: preferences.nutritionalGoal || 'Balanced', 
        weeklyBudget: prefData.weeklyBudget, 
        selectedAllergies: preferences.selectedAllergies || []
      }));

      setShowSuccess(true);
      dispatch(addNotification({
        title: 'Settings Saved',
        message: 'Your profile and preferences have been updated.',
      }));

      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      dispatch(addNotification({
        title: 'Error Saving Settings',
        message: err || 'Something went wrong while saving.',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('bmp_isLoggedIn');
    localStorage.removeItem('bmp_currentUser');
    window.location.href = '/';
  };

  const renderSection = () => {
    const safeSettings = {
      notifications: settings.notifications || {},
      currency: settings.currency || { symbol: '₦', code: 'NGN' },
      ...settings
    };

    switch (activeSection) {
      case 'account':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Account Settings</h2>
              <p>Manage your personal information and profile picture.</p>
            </div>
            
            <div className="profile-edit-grid">
              <div className="avatar-uploader">
                <div className="avatar-preview">
                  {profileData.image ? (
                    <img src={profileData.image} alt="Profile" />
                  ) : (
                    (profileData.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()
                  )}
                </div>
                <button className="camera-btn" onClick={() => fileInputRef.current.click()}>
                  <Camera size={18} />
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
              </div>
              
              <div className="settings-grid" style={{ width: '100%' }}>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Full Name</label>
                    <span>Used for your profile and notifications.</span>
                  </div>
                  <input 
                    type="text" 
                    className="modern-input" 
                    value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Email Address</label>
                    <span>Primary contact for account security.</span>
                  </div>
                  <input 
                    type="email" 
                    className="modern-input" 
                    value={profileData.email}
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <label>Location</label>
                    <span>Helps us suggest local markets.</span>
                  </div>
                  <input 
                    type="text" 
                    className="modern-input" 
                    value={profileData.location}
                    onChange={e => setProfileData({...profileData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Planner Preferences</h2>
              <p>Adjust your budget and household planning defaults.</p>
            </div>
            
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <label>Default Weekly Budget</label>
                  <span>Maximum you want to spend per week.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-color)', fontSize: '1.25rem' }}>
                    {safeSettings.currency.symbol}{prefData.weeklyBudget.toLocaleString()}
                  </span>
                  <input 
                    type="range" 
                    min="5000" max="100000" step="500" 
                    value={prefData.weeklyBudget}
                    onChange={e => setPrefData({...prefData, weeklyBudget: parseInt(e.target.value) || 5000})}
                    style={{ width: '150px' }}
                  />
                </div>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <label>Plan Duration</label>
                  <span>How many days each cycle covers.</span>
                </div>
                <div className="segmented-control">
                  {['Weekly', 'Monthly'].map(opt => (
                    <button 
                      key={opt}
                      className={`segment-btn ${prefData.planDuration === opt ? 'active' : ''}`}
                      onClick={() => setPrefData({...prefData, planDuration: opt})}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <label>Household Size</label>
                  <span>Number of people in your meal plan.</span>
                </div>
                <div className="modern-input" style={{ width: '100px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <input 
                    type="number" 
                    value={prefData.householdSize} 
                    onChange={e => setPrefData({...prefData, householdSize: parseInt(e.target.value) || 1})}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', width: '30px', textAlign: 'center', outline: 'none', fontWeight: 700 }}
                  />
                  <span>ppl</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'diet':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Diet & Health</h2>
              <p>Customize your meal types and food restrictions.</p>
            </div>
            
            <div className="settings-card">
              <div className="setting-info">
                <label>Dietary Preferences</label>
                <span>Select all that apply.</span>
              </div>
              <div className="settings-grid" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
                {[
                  { id: 'traditional', label: 'Traditional Nigerian' },
                  { id: 'high-protein', label: 'High-Protein' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'low-carb', label: 'Low-Carb' },
                  { id: 'budget-saver', label: 'Budget Saver' }
                ].map(diet => (
                  <div key={diet.id} className="setting-row" style={{ padding: '0.5rem 0' }}>
                    <span>{diet.label}</span>
                    <label className="modern-switch">
                      <input 
                        type="checkbox" 
                        checked={preferences.dietToggles?.[diet.id] || false}
                        onChange={(e) => dispatch(updatePreferencesLocal({
                          dietToggles: { ...(preferences.dietToggles || {}), [diet.id]: e.target.checked }
                        }))}
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <div className="setting-info">
                <label>Allergies & Restrictions</label>
                <span>Meals containing these will be excluded.</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                {['None', 'Groundnut', 'Shellfish', 'Dairy', 'Gluten', 'Eggs'].map(allergy => {
                  const isSelected = (preferences.selectedAllergies || []).includes(allergy);
                  const effectiveSelected = (allergy === 'None' && (preferences.selectedAllergies?.length === 0 || isSelected)) || isSelected;

                  return (
                    <button 
                      key={allergy}
                      className={`segment-btn ${effectiveSelected ? 'active' : ''}`}
                      onClick={() => {
                        let updated;
                        if (allergy === 'None') {
                          updated = [];
                        } else {
                          const current = preferences.selectedAllergies || [];
                          if (isSelected) {
                            updated = current.filter(a => a !== allergy);
                          } else {
                            updated = [...current.filter(a => a !== 'None'), allergy];
                          }
                        }
                        dispatch(updatePreferencesLocal({ selectedAllergies: updated }));
                      }}
                    >
                      {allergy}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Notifications</h2>
              <p>Stay updated on your budget and meal plans.</p>
            </div>
            
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <label>Push Notifications</label>
                  <span>Get alerts on your mobile device.</span>
                </div>
                <label className="modern-switch">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.notifications.pushEnabled || false} 
                    onChange={e => dispatch(updateNotificationSettings({ pushEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <label>Email Reports</label>
                  <span>Weekly summary of your savings.</span>
                </div>
                <label className="modern-switch">
                  <input 
                    type="checkbox" 
                    checked={safeSettings.notifications.emailEnabled || false} 
                    onChange={e => dispatch(updateNotificationSettings({ emailEnabled: e.target.checked }))}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <label>Reminder Time</label>
                  <span>When to receive your daily meal plan.</span>
                </div>
                <input 
                  type="time" 
                  className="modern-input" 
                  style={{ width: '150px' }}
                  value={safeSettings.notifications.reminderTime || '08:00'}
                  onChange={e => dispatch(updateNotificationSettings({ reminderTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Appearance</h2>
              <p>Personalize the look and feel of your app.</p>
            </div>
            
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <label>Interface Theme</label>
                  <span>Select your preferred visual mode.</span>
                </div>
                <div className="segmented-control">
                  {[
                    { id: 'light', icon: <Sun size={14} />, label: 'Light' },
                    { id: 'dark', icon: <Moon size={14} />, label: 'Dark' },
                    { id: 'system', icon: <Monitor size={14} />, label: 'System' }
                  ].map(mode => (
                    <button 
                      key={mode.id}
                      className={`segment-btn ${settings.theme === mode.id ? 'active' : ''}`}
                      onClick={() => dispatch(setTheme(mode.id))}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      {mode.icon}
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <label>Accent Color</label>
                  <span>Choose a primary color for buttons and icons.</span>
                </div>
                <div className="color-grid">
                  {ACCENT_PRESETS.map(preset => (
                    <div 
                      key={preset.name}
                      className={`color-dot ${settings.accentColor === preset.color ? 'active' : ''}`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                      onClick={() => dispatch(setAccentColor(preset.color))}
                    />
                  ))}
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <label>Currency & Region</label>
                  <span>Change how prices are displayed.</span>
                </div>
                <select 
                  className="modern-input"
                  value={safeSettings.currency.code || 'NGN'}
                  onChange={e => {
                    const found = CURRENCIES.find(c => c.code === e.target.value);
                    if (found) dispatch(setCurrency(found));
                  }}
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>{curr.name} ({curr.symbol})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-grid">
            <div className="section-header">
              <h2>Security</h2>
              <p>Keep your data and account safe.</p>
            </div>
            
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <label>Change Password</label>
                  <span>Last updated 3 months ago.</span>
                </div>
                <button className="nav-item" style={{ width: 'auto', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  Update
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="setting-row">
                <div className="setting-info">
                  <label>Two-Factor Authentication</label>
                  <span>Add an extra layer of security.</span>
                </div>
                <label className="modern-switch">
                  <input type="checkbox" />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="setting-row" style={{ marginTop: '2rem' }}>
                <button className="nav-item" style={{ color: '#F43F5E', width: '100%', justifyContent: 'center', background: 'rgba(244, 63, 94, 0.05)' }} onClick={handleSignOut}>
                  <LogOut size={18} />
                  Sign Out of All Devices
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page" style={{ padding: '1rem 0' }}>
      <div className="settings-container">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {[
            { id: 'account', icon: <User size={20} />, label: 'Account' },
            { id: 'preferences', icon: <Wallet size={20} />, label: 'Planner' },
            { id: 'diet', icon: <Heart size={20} />, label: 'Diet & Health' },
            { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
            { id: 'appearance', icon: <Palette size={20} />, label: 'Appearance' },
            { id: 'security', icon: <Shield size={20} />, label: 'Security' },
          ].map(item => (
            <div 
              key={item.id} 
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <div className="nav-item" style={{ color: '#F43F5E' }} onClick={handleSignOut}>
              <LogOut size={20} />
              Sign Out
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="settings-content">
          {renderSection()}
          
          <div className="settings-footer">
            <button className="btn-save-settings" onClick={handleSaveAll}>
              {showSuccess ? <Check size={20} /> : <Save size={20} />}
              {showSuccess ? 'Settings Saved!' : 'Save All Changes'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
