import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, ShieldCheck, Mail, Calendar, Trash2 } from 'lucide-react';
import './AdminView.css';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/user/all');
        setUsers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="admin-loading">Loading administrative data...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title-section">
          <h1>Admin Dashboard</h1>
          <p>Manage users and monitor application growth.</p>
        </div>
        <div className="admin-stats">
          <div className="stat-pill">
            <Users size={18} />
            <span><strong>{users.length}</strong> Total Users</span>
          </div>
          <div className="stat-pill success">
            <ShieldCheck size={18} />
            <span><strong>{users.filter(u => u.role === 'admin').length}</strong> Admins</span>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="users-table-container glass-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-small">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name-cell">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <Mail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <Calendar size={14} />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td>
                    <span className="status-indicator online">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
