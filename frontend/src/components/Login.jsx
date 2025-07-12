import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import API from '../api';
import '../assets/auth-new.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import Header from './Header';

function Login() {
    const [signInData, setSignInData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        // Allow bypassing auto-redirect with ?force=true parameter
        const forceLogin = searchParams.get('force');
        if (forceLogin === 'true') {
            return;
        }

        // Check Redux state first
        if (user) {
            navigate('/homepage');
            return;
        }

        // Then check cookie as fallback
        const cookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
        if (cookies) {
            navigate('/homepage');
        }
    }, [navigate, user, searchParams]);

    const handleSignInChange = (e) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/v1/user/login', signInData);
            if (res.data.success) {
                // Store token in localStorage for auto-logout functionality
                // The token is also stored in httpOnly cookie for security
                const token = res.data.token || res.headers['set-cookie']?.find(cookie => cookie.startsWith('token='))?.split(';')[0]?.split('=')[1];
                if (token) {
                    localStorage.setItem('token', token);
                }
                
                // Fetch full profile after login
                const userId = res.data.user._id;
                const profileRes = await API.get(`/api/v1/user/profile/${userId}`);
                const fullUser = profileRes.data.user;
                document.cookie = `user=${encodeURIComponent(JSON.stringify(fullUser))}; path=/`;
                dispatch(setAuthUser(fullUser));
                navigate('/homepage');
            } else {
                setError(res.data.message || 'Invalid credentials.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Sign in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            <Header activePage="login" showNotifications={false} />
            <div className="auth-content">
                <div className="auth-container">
                    <h1>Sign In</h1>
                    <form onSubmit={handleSignInSubmit} className="auth-form">
                        <input type="email" placeholder="Email" name="email" value={signInData.email} onChange={handleSignInChange} required />
                        <input type="password" placeholder="Password" name="password" value={signInData.password} onChange={handleSignInChange} required />
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        {error && <p className="auth-error">{error}</p>}
                    </form>
                    <p className="auth-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login; 