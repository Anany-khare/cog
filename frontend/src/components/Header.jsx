import React, { useState, useRef, useEffect } from 'react';
import { IoGameController } from 'react-icons/io5';
import { FaBell, FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const headerStyle = {
  width: '100%',
  height: '66px',
  background: 'rgba(17, 24, 39, 0.95)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 48px',
  borderBottom: '1.5px solid #23272f',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxSizing: 'border-box',
};
const nameStyle = {
  fontSize: 28,
  fontWeight: 800,
  color: '#fff',
  letterSpacing: 1,
  fontFamily: 'Poppins, monospace',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};
const accentStyle = {
  color: '#f97316',
  marginLeft: 2,
};
const btnStyle = {
  background: '#f97316',
  color: '#fff',
  fontWeight: 700,
  fontSize: 18,
  border: 'none',
  borderRadius: 8,
  padding: '10px 28px',
  cursor: 'pointer',
  boxShadow: '0 0 12px #f9731688',
  fontFamily: 'Poppins, monospace',
  transition: 'background 0.2s',
};
const avatarStyle = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #f97316',
  marginLeft: 18,
  marginRight: 8,
  background: '#23272f',
};
const defaultAvatar = '/default-avatar.png';

const Header = ({ onLogout, showNotifications = true, activePage }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifOpen]);

  return (
    <header style={headerStyle}>
      <div style={{ ...nameStyle, cursor: 'pointer' }} onClick={() => navigate('/homepage')} title="Go to Home">
        <IoGameController size={30} />
        <span>Game<span className="logo-accent">Verse</span></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Show login/register options if on login or signup page and not logged in */}
        {!user && (['login', 'signup'].includes(String(activePage))) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{
                background: activePage === 'login' ? '#f97316' : 'transparent',
                color: activePage === 'login' ? '#fff' : '#f97316',
                fontWeight: 700,
                fontSize: 18,
                border: activePage === 'login' ? 'none' : '2px solid #f97316',
                borderRadius: 8,
                padding: '8px 22px',
                cursor: activePage === 'login' ? 'not-allowed' : 'pointer',
                opacity: activePage === 'login' ? 1 : 0.85,
                pointerEvents: activePage === 'login' ? 'none' : 'auto',
                transition: 'background 0.2s',
              }}
              disabled={activePage === 'login'}
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              style={{
                background: activePage === 'signup' ? '#f97316' : 'transparent',
                color: activePage === 'signup' ? '#fff' : '#f97316',
                fontWeight: 700,
                fontSize: 18,
                border: activePage === 'signup' ? 'none' : '2px solid #f97316',
                borderRadius: 8,
                padding: '8px 22px',
                cursor: activePage === 'signup' ? 'not-allowed' : 'pointer',
                opacity: activePage === 'signup' ? 1 : 0.85,
                pointerEvents: activePage === 'signup' ? 'none' : 'auto',
                transition: 'background 0.2s',
              }}
              disabled={activePage === 'signup'}
              onClick={() => navigate('/signup')}
            >
              Register
            </button>
          </div>
        )}
        {/* Notification Bell */}
        {showNotifications && (
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8, position: 'relative' }}
              title="Notifications"
              onClick={() => setNotifOpen((open) => !open)}
            >
              <FaBell size={24} color="#fff" />
            </button>
            {notifOpen && (
              <div style={{
                position: 'absolute',
                top: 36,
                right: 0,
                background: '#23272f',
                color: '#fff',
                borderRadius: 10,
                boxShadow: '0 4px 16px #0008',
                padding: '18px 32px',
                zIndex: 1000,
                minWidth: 180,
                fontSize: 16,
                textAlign: 'center',
              }}>
                No new notifications now
              </div>
            )}
          </div>
        )}
        {/* Profile Avatar and Logout - only show when user is logged in */}
        {user && (
          <>
            {/* Hamburger for small screens */}
            <span className="header-hamburger" style={{ display: 'none', position: 'relative' }}>
              <FaBars size={28} style={{ cursor: 'pointer', color: '#fff' }} title="Menu" onClick={() => setMenuOpen((open) => !open)} />
              {menuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 36,
                  right: 0,
                  background: '#23272f',
                  color: '#fff',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px #0008',
                  padding: '18px 24px',
                  zIndex: 1000,
                  minWidth: 160,
                  fontSize: 16,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}>
                  <img
                    src={user?.profilepic || defaultAvatar}
                    alt="Profile"
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #f97316', background: '#181c23', cursor: 'pointer', marginBottom: 8 }}
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    title="Go to Profile"
                  />
                  <button style={{ ...btnStyle, width: '100%', fontSize: 16, padding: '8px 0' }} onClick={() => { setMenuOpen(false); onLogout(); }}>Logout</button>
                </div>
              )}
            </span>
            {/* Profile avatar and logout for larger screens (always next to notification) */}
            <span className="header-profile-logout" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={user?.profilepic || defaultAvatar}
                alt="Profile"
                style={avatarStyle}
                onClick={() => navigate('/profile')}
                title="Go to Profile"
              />
              <button style={btnStyle} onClick={onLogout}>Logout</button>
            </span>
          </>
        )}
      </div>
      {/* Close menu on outside click */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
      )}
      <style>{`
        .header-profile-logout {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .header-hamburger {
          display: none;
        }
        @media (max-width: 600px) {
          .header-profile-logout {
            display: none !important;
          }
          .header-hamburger {
            display: inline-block !important;
            margin-left: 8px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 