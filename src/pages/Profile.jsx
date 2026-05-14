import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Edit2, 
  Shield, Bell, Download, LogOut, 
  ChevronRight, Star, TrendingUp, Calendar, Heart,
  X, Check, Save, Camera, Upload
} from 'lucide-react';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { spent, savings, total } = useSelector((state) => state.budget);
  const { dietToggles, selectedAllergies, weekPlan } = useSelector((state) => state.preferences);
  
  const [user, setUser] = useState({ 
    name: 'Adaeze Okonkwo', 
    email: 'adaeze.okonkwo@example.com',
    phone: '+234 803 123 4567',
    location: 'Lagos, Nigeria',
    joinDate: 'Jan 2024',
    image: null
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup on unmount
    return () => { document.body.style.overflow = ''; };
  }, [isEditModalOpen]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('bmp_currentUser'));
    if (currentUser) {
      // Filter out any undefined/null values so they don't overwrite valid defaults
      const safeUser = Object.fromEntries(
        Object.entries(currentUser).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      setUser(prev => ({ ...prev, ...safeUser }));
      setFormData(prev => ({ ...prev, ...safeUser }));
    }
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);

  const showSuccess = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone || '');
      formPayload.append('location', formData.location || '');
      
      if (selectedFile) {
        formPayload.append('profileImage', selectedFile);
      }

      const response = await api.put('/user/profile', formPayload);

      const updatedUser = response.data;
      // Important: Merge the new data with existing data in case some fields are missing in response
      const existingUser = JSON.parse(localStorage.getItem('bmp_currentUser') || '{}');
      const mergedUser = { ...existingUser, ...updatedUser };
      
      localStorage.setItem('bmp_currentUser', JSON.stringify(mergedUser));
      setUser(mergedUser);
      setIsEditModalOpen(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      setToast(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('bmp_isLoggedIn');
    localStorage.removeItem('bmp_currentUser');
    navigate('/login');
  };
  const handleExportData = () => {
    const exportData = {
      user,
      budget: { spent, savings, total },
      preferences: { dietToggles, selectedAllergies },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmp_data_export_${new Date().getTime()}.json`;
    a.click();
    showSuccess('Data exported successfully!');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const activeDiets = Object.entries(dietToggles || {})
    .filter(([_, active]) => active)
    .map(([name]) => name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()));

  return (
    <div className="profile-dashboard">
      {/* Success Toast */}
      {toast && (
        <div className="profile-toast">
          <Check size={18} />
          <span>{toast}</span>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content profile-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-titles">
                <h2>Edit Profile</h2>
                <p>Update your personal information and profile picture</p>
              </div>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form-container">
              <div className="modal-body">
                {/* Profile Photo Editor */}
                <div className="profile-photo-editor">
                  <div className="edit-avatar">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" />
                    ) : (
                      getInitials(formData.name)
                    )}
                    <div className="camera-overlay" onClick={() => fileInputRef.current.click()}>
                      <Camera size={20} />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="photo-info">
                    <h3>Profile Picture</h3>
                    <p>Click the icon to upload a new photo</p>
                    <div className="photo-btns">
                      <button type="button" className="text-btn blue" onClick={() => fileInputRef.current.click()}>
                        Change Photo
                      </button>
                      {formData.image && (
                        <button type="button" className="text-btn red" onClick={() => setFormData({...formData, image: null})}>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="Adaeze Okonkwo"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-group">
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                        placeholder="adaeze@mail.com"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234..."
                      />
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>Location</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        placeholder="Lagos, Nigeria"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn-subtle" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn-modern">
                  <Check size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="profile-hero">
        <div className="user-identity">
          <div className="avatar-large">
            {user.image ? (
              <img src={user.image} alt={user.name} className="hero-avatar-img" />
            ) : (
              getInitials(user.name)
            )}
            <div className="status-indicator"></div>
          </div>
          <div className="user-meta">
            <h1>{user.name || 'User'}</h1>
            <div className="membership-badge">
              <Star size={14} fill="currentColor" />
              <span>Premium Member</span>
            </div>
          </div>
        </div>
        <button className="primary-btn-modern" onClick={() => setIsEditModalOpen(true)}>
          <Edit2 size={16} />
          Edit Profile
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box gold">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Total Savings</span>
            <span className="value">₦{savings?.toLocaleString() || '0'}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box green">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Meals Planned</span>
            <span className="value">124 Meals</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box blue">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <span className="label">Plan Streak</span>
            <span className="value">12 Weeks</span>
          </div>
        </div>
      </div>

      <div className="profile-main-layout">
        <div className="left-column">
          <div className="dashboard-card info-card">
            <div className="card-header-flex">
              <h2>Account Details</h2>
              <Edit2 size={16} color="#94A3B8" cursor="pointer" onClick={() => setIsEditModalOpen(true)} />
            </div>
            <div className="info-rows">
              <div className="info-row">
                <div className="row-icon-box"><Mail size={18} /></div>
                <div className="row-details">
                  <span className="label">Email Address</span>
                  <span className="value">{user.email || '—'}</span>
                </div>
              </div>
              <div className="info-row">
                <div className="row-icon-box"><Phone size={18} /></div>
                <div className="row-details">
                  <span className="label">Phone Number</span>
                  <span className="value">{user.phone || '—'}</span>
                </div>
              </div>
              <div className="info-row">
                <div className="row-icon-box"><MapPin size={18} /></div>
                <div className="row-details">
                  <span className="label">Location</span>
                  <span className="value">{user.location || '—'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card habits-card" style={{ marginTop: '2rem' }}>
            <div className="card-header-flex">
              <h2>My Habits</h2>
              <Heart size={16} color="#FBBF24" />
            </div>
            <div className="habit-section">
              <p className="section-label">Active Diets</p>
              <div className="pills-container">
                {activeDiets.length > 0 ? activeDiets.map(diet => (
                  <span key={diet} className="diet-pill">{diet}</span>
                )) : <span className="no-pills">No restricted diets active</span>}
              </div>
            </div>
            <div className="habit-section" style={{ marginTop: '1.5rem' }}>
              <p className="section-label">Selected Allergies</p>
              <div className="pills-container">
                {selectedAllergies?.length > 0 ? selectedAllergies.map(allergy => (
                  <span key={allergy} className="allergy-pill">{allergy}</span>
                )) : <span className="no-pills">None recorded</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="dashboard-card settings-card">
            <div className="card-header-flex">
              <h2>Settings & Security</h2>
            </div>
            <div className="settings-list">
              <div className="setting-item" onClick={() => showSuccess('Security settings are locked in demo mode')}>
                <div className="setting-info">
                  <Shield size={20} color="#FBBF24" />
                  <div>
                    <h4>Password & 2FA</h4>
                    <p>Last changed 3 months ago</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>
              <div className="setting-item" onClick={() => showSuccess('Notification preferences saved')}>
                <div className="setting-info">
                  <Bell size={20} color="#FBBF24" />
                  <div>
                    <h4>Notifications</h4>
                    <p>Email and push enabled</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>
              <div className="setting-item" onClick={handleExportData}>
                <div className="setting-info">
                  <Download size={20} color="#FBBF24" />
                  <div>
                    <h4>Data & Export</h4>
                    <p>Download your meal history</p>
                  </div>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>
            </div>

            <div className="danger-zone" style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #F1F5F9' }}>
              <button className="logout-btn-modern" onClick={handleSignOut}>
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
