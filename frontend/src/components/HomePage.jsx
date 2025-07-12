import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios';
import HomePageGamer from './HomePageGamer';
import HomePageHost from './HomePageHost';
import HomePageOrg from './HomePageOrg';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
=======
import API, { logoutUser } from '../api';
import HomePageGamer from './HomePageGamer';
import HomePageHost from './HomePageHost';
import HomePageOrg from './HomePageOrg';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPane from './RightPane';
import './../assets/HomePage.css';
>>>>>>> d997b8b (Initial commit: project ready for deployment)

function HomePage() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD

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
=======
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    // If user is already in Redux, just set the role and do nothing else
    if (user && user.role) {
          setRole(user.role);
      return;
    }
    // Fallback: Try backend fetch using token
          (async () => {
      try {
        const profileRes = await API.get('/api/v1/user/profile/me');
            const fullUser = profileRes.data.user;
        if (fullUser && fullUser.role) {
            dispatch(setAuthUser(fullUser));
          setRole(fullUser.role);
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      }
    })();
  }, [user, navigate, dispatch]);
>>>>>>> d997b8b (Initial commit: project ready for deployment)

  if (!role) {
    return <div>Loading...</div>;
  }

<<<<<<< HEAD
  return (
    <div>
      {role === 'gamer' && <HomePageGamer />}
      {role === 'host' && <HomePageHost />}
      {role === 'org' && <HomePageOrg />}
      <button onClick={handleLogout}>Logout</button>
=======
  const validRoles = ['gamer', 'host', 'org'];
  if (!validRoles.includes(role)) {
    return <div style={{ color: 'red', padding: 32, textAlign: 'center' }}>Unknown user role: <b>{role}</b>. Please contact support or try logging out and in again.</div>;
  }

  const handleLogout = async () => {
    try {
      const res = await API.get('/api/v1/user/logout');
      if (res.data.status) {
        logoutUser(); // Use centralized logout function
      }
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
      logoutUser(); // Still logout even if API call fails
    }
  };

  return (
    <div className="homepage-container">
      <Header onLogout={handleLogout} />
      <div className="homepage-grid-custom stretch-containers">
        <Sidebar />
        <main className="main-content-custom card-bg">
          {role === 'gamer' && <HomePageGamer />}
          {role === 'host' && <HomePageHost />}
          {role === 'org' && <HomePageOrg />}
        </main>
        <RightPane />
      </div>
      <style>{`
        /* Layout: wider post container, even gap, and matching heights for side cards */
        .homepage-grid-custom.stretch-containers {
          display: grid;
          grid-template-columns: 400px 1.2fr 400px;
          gap: 32px;
          max-width: 1800px;
          margin: 0 auto;
          padding: 24px 0 0 0;
          background: none;
          align-items: flex-start;
          min-height: 100vh;
        }
        .sidebar-container,
        .main-content-custom.card-bg {
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .main-content-custom.card-bg {
          background: none;
          border-radius: 0;
          box-shadow: none;
          padding: 0 2vw;
          margin: 0 2vw;
          max-width: 900px;
          width: 100%;
          height: calc(100vh - 80px);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          transition: margin 0.3s, padding 0.3s, border-radius 0.3s;
          scrollbar-color: #f97316 transparent;
        }
        .main-content-custom.card-bg::-webkit-scrollbar {
          width: 10px;
        }
        .main-content-custom.card-bg::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 6px;
        }
        .main-content-custom.card-bg::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Match left and right card heights */
        .sidebar-card, .right-pane-announcement-card {
          box-sizing: border-box;
        }
        /* Orange scrollbar for posts section */
        .posts-container {
          scrollbar-width: thin;
          scrollbar-color: #f97316 #23272f;
        }
        .posts-container::-webkit-scrollbar {
          width: 10px;
        }
        .posts-container::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 6px;
        }
        .posts-container::-webkit-scrollbar-track {
          background: #23272f;
          border-radius: 6px;
        }
        @media (max-width: 1200px) {
          .homepage-grid-custom.stretch-containers {
            grid-template-columns: 280px 1.2fr 280px;
            gap: 16px;
          }
          .main-content-custom.card-bg {
            max-width: 98vw;
          }
          .sidebar-card, .right-pane-announcement-card {
            min-height: 410px;
            max-height: 410px;
            height: 410px;
          }
        }
        @media (max-width: 900px) {
          .homepage-grid-custom.stretch-containers {
            grid-template-columns: 1fr;
            padding: 0;
            gap: 0;
          }
          .sidebar-container, .right-pane-container {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .homepage-grid-custom.stretch-containers {
            grid-template-columns: 1fr;
            padding: 0;
            gap: 0;
          }
          .main-content-custom.card-bg {
            width: 100vw !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            padding: 0;
            border-radius: 0 !important;
            margin: 0 !important;
          }
          .sidebar-card, .right-pane-announcement-card {
            min-height: unset;
            max-height: unset;
            height: auto;
          }
        }
      `}</style>
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    </div>
  );
}

export default HomePage;
