import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email to receive an OTP.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, code: otpCode });
      const { token, ...userData } = response.data;
      localStorage.setItem('bmp_token', token);
      localStorage.setItem('bmp_isLoggedIn', 'true');
      localStorage.setItem('bmp_currentUser', JSON.stringify(userData));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('bmp_token', token);
      localStorage.setItem('bmp_isLoggedIn', 'true');
      localStorage.setItem('bmp_currentUser', JSON.stringify(userData));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('bmp_token', token);
      localStorage.setItem('bmp_isLoggedIn', 'true');
      localStorage.setItem('bmp_currentUser', JSON.stringify(userData));

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
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
          
          <form onSubmit={loginMode === 'password' ? handleLogin : handleVerifyOTP} className="auth-form">
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
            
            {loginMode === 'password' ? (
              <>
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
                  <button type="button" onClick={() => setLoginMode('otp')} className="text-btn">Login with OTP instead</button>
                </div>
                
                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </>
            ) : (
              <>
                {otpSent ? (
                  <div className="form-group">
                    <label>Enter 6-Digit OTP</label>
                    <input 
                      type="text" 
                      placeholder="000000" 
                      value={otpCode} 
                      onChange={e => setOtpCode(e.target.value)} 
                      maxLength={6}
                      required 
                    />
                    <p className="otp-hint">Sent to {email}</p>
                  </div>
                ) : null}

                <div className="auth-extras">
                  <button type="button" onClick={() => setLoginMode('password')} className="text-btn">Back to Password</button>
                </div>
                
                {!otpSent ? (
                  <button type="button" onClick={handleSendOTP} className="auth-button" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP to Email'}
                  </button>
                ) : (
                  <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                )}
              </>
            )}
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="google-auth-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In was unsuccessful. Try again later.')}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
          
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