import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/auth.css';  
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import API from '../api'; // Import the API instance

function Auth() {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '', role: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const cookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    if (cookies) {
      const user = JSON.parse(decodeURIComponent(cookies.split('=')[1]));
      if (user) {
        dispatch(setAuthUser(user)); // Set the user in Redux state
        navigate('/homePage'); // Redirect to home page
      }
    }
  }, [navigate, dispatch]);

  const handleSignUpChange = (e) => {
    setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
  };

  const handleSignInChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await API.post('/api/v1/user/register', signUpData);
      if (res.data.success) { // Changed from status to success
        alert('Registration successful!');
        setRightPanelActive(false); // Changed from setIsSignUp
        setSignUpData({ username: '', email: '', password: '', role: '' }); // Reset form
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      alert(errorMessage);
    }
    setLoading(false);
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await API.post('/api/v1/user/login', signInData);
      console.log('Login response:', res.data); // Debug log
      
      if (res.data.success) { // Changed from status to success
        // Set user in Redux
        dispatch(setAuthUser(res.data.user));
        
        // Store token in localStorage if needed
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        
        // Navigate based on user role
        if (res.data.user.role === 'gamer') {
          navigate('/homePageGamer');
        } else if (res.data.user.role === 'host') {
          navigate('/homePageHost');
        } else if (res.data.user.role === 'org') {
          navigate('/homePageOrg');
        } else {
          navigate('/homePage'); // Fallback
        }
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      alert(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Background Video */}
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="auth.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Username" name="username" value={signUpData.username} onChange={handleSignUpChange} required />
            <input type="email" placeholder="Email" name="email" value={signUpData.email} onChange={handleSignUpChange} required />
            <input type="password" placeholder="Password" name="password" value={signUpData.password} onChange={handleSignUpChange} required />
            <select name="role" value={signUpData.role} onChange={handleSignUpChange} required>
              <option value="" disabled>Select Role</option>
              <option value="org">ORG</option>
              <option value="gamer">GAMER</option>
              <option value="host">HOST</option>
            </select>
            <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign in</h1>
            <input type="email" placeholder="Email" name="email" value={signInData.email} onChange={handleSignInChange} required />
            <input type="password" placeholder="Password" name="password" value={signInData.password} onChange={handleSignInChange} required />
            <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={() => setRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp" onClick={() => setRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
