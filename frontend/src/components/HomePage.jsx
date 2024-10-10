import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomePageGamer from './HomePageGamer';
import HomePageHost from './HomePageHost';
import HomePageOrg from './HomePageOrg';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';

function HomePage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const cookies = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
    if (cookies) {
      try {
        const user = JSON.parse(decodeURIComponent(cookies.split('=')[1])); 
        if (user.role) {
          setRole(user.role);
          dispatch(setAuthUser(user)); // Dispatch user to Redux state
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, [navigate, dispatch]);

  const handleLogout = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.status) {
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        dispatch(setAuthUser(null)); // Clear user from Redux state
        navigate('/auth');
      }
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  if (!role) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {role === 'gamer' && <HomePageGamer />}
      {role === 'host' && <HomePageHost />}
      {role === 'org' && <HomePageOrg />}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
