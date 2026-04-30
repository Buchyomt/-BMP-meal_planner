import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('bmp_users')) || [];

    if (users.some(user => user.email === email)) {
      setError('An account with this email already exists.');
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem('bmp_users', JSON.stringify(users));

    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join us today and start saving money while eating healthy, delicious meals.</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Adaeze Obi" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

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
            
            <p className="auth-footer" style={{ margin: '0', textAlign: 'left', fontSize: '0.85rem' }}>
              By signing up, you agree to our <Link to="#">Terms</Link> and <Link to="#">Privacy Policy</Link>.
            </p>

            <button type="submit" className="auth-button">Sign Up</button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <Link to="/login">Log in here</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-image-side">
        <img 
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop" 
          alt="Fresh Salad" 
        />
        <div className="auth-image-overlay">
          <h2>Smart Planning. <br />Better Living.</h2>
          <p>Join over 50,000 users who have transformed their eating habits and saved on groceries.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;