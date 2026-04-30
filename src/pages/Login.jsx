import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('bmp_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('bmp_isLoggedIn', 'true');
      localStorage.setItem('bmp_currentUser', JSON.stringify({ name: user.name, email: user.email }));
      window.location.href = '/dashboard';
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Please enter your details to sign in and continue your meal planning journey.</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="adaeze@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div className="auth-extras">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </div>
            
            <button type="submit" className="auth-button">Log In</button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link to="/signup">Sign up for free</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-image-side">
        <img 
          src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop" 
          alt="Healthy Meal" 
        />
        <div className="auth-image-overlay">
          <h2>Plan. Save. <br />Eat Better.</h2>
          <p>Discover thousands of budget-friendly recipes tailored to your preferences and pantry.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;