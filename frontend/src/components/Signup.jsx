import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import '../assets/auth-new.css';
import Header from './Header';

function Signup() {
    const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '', role: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const cookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
        if (cookies) {
            navigate('/homePage');
        }
    }, [navigate]);

    const handleSignUpChange = (e) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/v1/user/register', signUpData);
            if (res.data.success) {
                navigate('/login');
            } else {
                setError(res.data.message || 'Sign up failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Header activePage="signup" showNotifications={false} />
            <div className="auth-content">
                <div className="auth-container">
                    <h1>Create Account</h1>
                    <form onSubmit={handleSignUpSubmit} className="auth-form">
                        <input type="text" placeholder="Username" name="username" value={signUpData.username} onChange={handleSignUpChange} required />
                        <input type="email" placeholder="Email" name="email" value={signUpData.email} onChange={handleSignUpChange} required />
                        <input type="password" placeholder="Password" name="password" value={signUpData.password} onChange={handleSignUpChange} required />
                        <select name="role" value={signUpData.role} onChange={handleSignUpChange} required>
                            <option value="" disabled>Select Role</option>
                            <option value="org">Organization</option>
                            <option value="gamer">Gamer</option>
                            <option value="host">Host</option>
                        </select>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        {error && <p className="auth-error">{error}</p>}
                    </form>
                    <p className="auth-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup; 