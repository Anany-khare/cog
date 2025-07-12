import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'https://cog-csr2.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Utility function to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

// Utility function to get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Utility function to logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
    // Dispatch logout action if store is available
    if (window.store) {
        window.store.dispatch({ type: 'auth/logout' });
    }
    // Redirect to login page
    window.location.href = '/login';
};

// Utility function to validate token periodically
export const validateToken = () => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
        logoutUser();
        return false;
    }
    return true;
};

// Request interceptor for debugging and FormData handling
API.interceptors.request.use(
    (config) => {
        // Check token before making request
        const token = getToken();
        if (token && isTokenExpired(token)) {
            logoutUser();
            return Promise.reject(new Error('Token expired'));
        }

        // Add token to Authorization header if available
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            // Remove Content-Type header for FormData to let browser set it with boundary
            delete config.headers['Content-Type'];
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
API.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', error.response?.status, error.response?.data || error.message);
        
        // Handle 401 Unauthorized errors (expired/invalid token)
        if (error.response?.status === 401) {
            logoutUser();
        }
        
        return Promise.reject(error);
    }
);

export default API; 