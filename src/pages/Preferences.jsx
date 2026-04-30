import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Check, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowRight,
  Utensils,
  AlertCircle,
  Users,
  Calendar,
  Wallet,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import { updatePreferences } from '../features/preferences/preferencesSlice';
import { updateBudget } from '../features/budget/budgetSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import './Preferences.css';

const DIET_TYPES = [
  { id: 'traditional', name: 'Traditional', desc: 'Nigerian classics', icon: '🇳🇬' },
  { id: 'high-protein', name: 'High-Protein', desc: 'Muscle & strength', icon: '💪' },
  { id: 'low-carb', name: 'Low-Carb', desc: 'Reduce carbs', icon: '🥗' },
  { id: 'vegan', name: 'Vegan', desc: 'Plant-based only', icon: '🌱' },
  { id: 'budget-saver', name: 'Budget Saver', desc: 'Maximize savings', icon: '💰' },
  { id: 'balanced', name: 'Balanced', desc: 'All nutrients', icon: '⚖️' },
];

const ALLERGIES = ['Groundnut', 'Shellfish', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Fish'];

const Preferences = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedPrefs = useSelector((state) => state.preferences);
  
  const [view, setView] = useState('wizard'); // 'wizard' or 'settings'
  const [selectedDiet, setSelectedDiet] = useState(savedPrefs.dietToggles ? Object.keys(savedPrefs.dietToggles).find(k => savedPrefs.dietToggles[k]) : 'traditional');
  const [dietToggles, setDietToggles] = useState(savedPrefs.dietToggles);
  const [selectedAllergies, setSelectedAllergies] = useState(savedPrefs.selectedAllergies);
  const [isNoneChecked, setIsNoneChecked] = useState(savedPrefs.selectedAllergies.length === 0);
  const [householdSize, setHouseholdSize] = useState(savedPrefs.householdSize);
  const [planDuration, setPlanDuration] = useState(savedPrefs.planDuration);
  const [weeklyBudget, setWeeklyBudget] = useState(savedPrefs.weeklyBudget);
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleAllergy = (allergy) => {
    setIsNoneChecked(false);
    if (selectedAllergies.includes(allergy)) {
      const updated = selectedAllergies.filter(a => a !== allergy);
      setSelectedAllergies(updated);
      if (updated.length === 0) setIsNoneChecked(true);
    } else {
      setSelectedAllergies(prev => [...prev, allergy]);
    }
  };

  const removeAllergy = (allergy) => {
    setSelectedAllergies(prev => prev.filter(a => a !== allergy));
  };

  const toggleDiet = (id) => {
    setDietToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setNone = () => {
    setIsNoneChecked(true);
    setSelectedAllergies([]);
  };

  const handleSave = () => {
    // 1. Dispatch preferences update
    dispatch(updatePreferences({
      dietToggles,
      selectedAllergies,
      householdSize,
      planDuration,
      weeklyBudget
    }));

    // 2. Update global budget limit
    dispatch(updateBudget({ total: weeklyBudget }));

    // 3. Send notification to the header bell
    const activeDiets = Object.entries(dietToggles || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(', ');

    dispatch(addNotification({
      title: 'Preferences Updated',
      message: `Budget set to ₦${weeklyBudget.toLocaleString()} · ${householdSize} people · ${planDuration} plan${activeDiets ? ` · Diet: ${activeDiets}` : ''}`,
      link: '/preferences',
    }));

    if (selectedAllergies.length > 0) {
      dispatch(addNotification({
        title: 'Allergy Restrictions Active',
        message: `Meals will exclude: ${selectedAllergies.join(', ')}`,
        link: '/preferences',
      }));
    }

    // 4. Show success feedback
    setShowSuccess(true);

    // 5. Redirect after a small delay
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/dashboard');
    }, 1500);
  };

  if (view === 'wizard') {
    return (
      <div className="preferences-wizard">
        <button className="back-btn" title="Back" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>

        <div className="wizard-header">
          <div className="step-indicator">
            <span className="step-text">Step 2 of 3</span>
            <div className="step-dots">
              <div className="dot active"></div>
              <div className="dot active"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>

        <div className="wizard-title-section">
          <h1 className="wizard-title">Customize your meals</h1>
          <p className="wizard-subtitle">Select your dietary preferences and restrictions.</p>
        </div>

        <div className="setup-card">
          <section className="setup-section">
            <div className="section-label">
              <Utensils size={18} />
              DIET TYPE
            </div>
            <div className="diet-grid">
              {DIET_TYPES.map(type => (
                <div 
                  key={type.id} 
                  className={`diet-card ${selectedDiet === type.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedDiet(type.id);
                    setDietToggles(prev => ({ ...prev, [type.id]: true }));
                  }}
                >
                  {selectedDiet === type.id && <div className="check-badge"><Check size={12} strokeWidth={4} /></div>}
                  <div className="diet-icon-box">{type.icon}</div>
                  <h3 className="diet-card-name">{type.name}</h3>
                  <p className="diet-card-desc">{type.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="section-label">
              <AlertCircle size={18} />
              ANY ALLERGIES?
            </div>
            <div className="allergies-pills">
              <button 
                className={`allergy-pill ${isNoneChecked ? 'selected' : ''}`}
                onClick={setNone}
              >
                None
              </button>
              {ALLERGIES.map(allergy => (
                <button 
                  key={allergy}
                  className={`allergy-pill ${selectedAllergies.includes(allergy) ? 'selected' : ''}`}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {allergy}
                </button>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="bottom-settings">
              <div className="setting-group">
                <div className="section-label">
                  <Users size={18} />
                  HOUSEHOLD SIZE
                </div>
                <div className="counter-control">
                  <button className="counter-btn" onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))}>
                    <Minus size={16} />
                  </button>
                  <div className="counter-value">
                    <span className="count-num">{householdSize}</span>
                    <span className="count-label">people</span>
                  </div>
                  <button className="counter-btn" onClick={() => setHouseholdSize(householdSize + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="setting-group">
                <div className="section-label">
                  <Calendar size={18} />
                  PLAN DURATION
                </div>
                <div className="duration-toggle">
                  <div className={`toggle-opt ${planDuration === 'Weekly' ? 'active' : ''}`} onClick={() => setPlanDuration('Weekly')}>Weekly</div>
                  <div className={`toggle-opt ${planDuration === 'Monthly' ? 'active' : ''}`} onClick={() => setPlanDuration('Monthly')}>Monthly</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="wizard-footer">
          <div className="security-notice">
            <ShieldCheck size={16} />
            Your preferences are saved securely
          </div>
          <button className="btn-next" onClick={() => setView('settings')}>
            Next
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Final Settings View implementation
  return (
    <div className="preferences-settings">
      {showSuccess && (
        <div className="success-toast">
          <CheckCircle2 size={20} />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <div className="settings-header">
        <h1 className="settings-title">Preferences</h1>
        <p className="settings-subtitle">Customize your meal planning experience to fit your budget, diet, and household.</p>
      </div>

      <div className="settings-card">
        <div className="card-label">
          <Wallet size={16} />
          WEEKLY BUDGET
        </div>
        <p className="card-desc">Set your weekly food budget in Naira</p>
        <div className="budget-display">
          <div className="budget-amount-large">₦{weeklyBudget.toLocaleString()}</div>
        </div>
        <div className="slider-container">
          <input 
            type="range" 
            min="5000" 
            max="50000" 
            step="500"
            className="budget-slider" 
            value={weeklyBudget}
            onChange={(e) => setWeeklyBudget(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>₦5,000</span>
            <span>₦50,000</span>
          </div>
        </div>
        <div className="exact-amount-row">
          Exact amount ₦
          <input 
            type="number" 
            className="exact-input"
            value={weeklyBudget}
            onChange={(e) => setWeeklyBudget(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="settings-card">
        <div className="card-label">
          <Calendar size={16} />
          PLAN DURATION
        </div>
        <p className="card-desc">Choose how long each meal plan should cover</p>
        <div className="duration-toggle" style={{ margin: '0.5rem 0' }}>
          <div className={`toggle-opt ${planDuration === 'Weekly' ? 'active' : ''}`} onClick={() => setPlanDuration('Weekly')}>Weekly</div>
          <div className={`toggle-opt ${planDuration === 'Monthly' ? 'active' : ''}`} onClick={() => setPlanDuration('Monthly')}>Monthly</div>
        </div>
      </div>

      <div className="settings-card">
        <div className="card-label">
          <Utensils size={16} />
          DIETARY PREFERENCES
        </div>
        <p className="card-desc">Select diets that match your lifestyle</p>
        <div className="diet-toggle-list">
          {DIET_TYPES.filter(t => ['high-protein', 'vegan', 'low-carb', 'traditional'].includes(t.id)).map(diet => (
            <div key={diet.id} className="diet-toggle-item">
              <div className="diet-item-info">
                <span className="diet-item-icon">{diet.icon}</span>
                <div className="diet-item-text">
                  <span className="diet-item-name">{diet.name}{diet.id === 'traditional' ? ' Nigerian' : ''}</span>
                  <span className="diet-item-desc">{diet.desc}</span>
                </div>
              </div>
              <label className="switch">
                <input type="checkbox" checked={dietToggles?.[diet.id] || false} onChange={() => toggleDiet(diet.id)} />
                <span className="slider-round"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-card">
        <div className="card-label">
          <AlertCircle size={16} />
          ALLERGIES & RESTRICTIONS
        </div>
        <p className="card-desc">Select any food allergies or restrictions</p>
        <div className="allergies-pills">
          {selectedAllergies.map(allergy => (
            <div key={allergy} className="closable-pill">
              {allergy}
              <button className="pill-close" onClick={() => removeAllergy(allergy)}>
                <X size={14} />
              </button>
            </div>
          ))}
          {ALLERGIES.filter(a => !selectedAllergies.includes(a)).map(allergy => (
            <button key={allergy} className="allergy-pill" onClick={() => toggleAllergy(allergy)}>{allergy}</button>
          ))}
        </div>
      </div>

      <div className="settings-card">
        <div className="card-label">
          <Users size={16} />
          HOUSEHOLD SIZE
        </div>
        <p className="card-desc">Number of people you're planning meals for</p>
        <div className="counter-control" style={{ margin: '0.5rem 0' }}>
          <button className="counter-btn" onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))} disabled={householdSize <= 1}>
            <Minus size={16} />
          </button>
          <div className="counter-value">
            <span className="count-num">{householdSize}</span>
          </div>
          <button className="counter-btn" onClick={() => setHouseholdSize(householdSize + 1)}>
            <Plus size={16} />
          </button>
          <span style={{ fontSize: '0.8125rem', color: '#6B7280', marginLeft: '0.5rem' }}>people</span>
        </div>
      </div>

      <div className="save-action">
        <button className="btn-save" onClick={handleSave}>
          <Save size={18} />
          Save Preferences
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', color: '#9CA3AF', fontSize: '0.75rem', paddingBottom: '2rem' }}>
        <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
        Preferences are encrypted and stored securely
      </div>
    </div>
  );
};

export default Preferences;
