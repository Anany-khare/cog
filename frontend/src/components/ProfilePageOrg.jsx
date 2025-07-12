import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import { FaYoutube, FaInstagram, FaGlobe } from 'react-icons/fa';
import EditProfileModalOrg from './EditProfileModalOrg';
import API, { logoutUser } from '../api';
import { setAuthUser } from '../redux/authSlice';

const defaultAvatar = '/default-avatar.png';

const ProfilePageOrg = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // New state for About Us (bio) edit modal
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [bioValue, setBioValue] = useState(user?.bio || '');
  const [bioLoading, setBioLoading] = useState(false);
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  if (!user) return null;

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSave = async (formData) => {
    setLoading(true);
    try {
      const res = await API.post('/api/v1/user/profile/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.user) {
        dispatch(setAuthUser(res.data.user));
        setEditOpen(false);
        showToast('Profile updated successfully! 🎉');
      }
    } catch (e) {
      showToast('Failed to update profile: ' + (e.response?.data?.message || e.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // New: Save About Us (bio) only
  const handleSaveBio = async () => {
    setBioLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bioValue);
      const res = await API.post('/api/v1/user/profile/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.user) {
        dispatch(setAuthUser(res.data.user));
        setEditBioOpen(false);
        showToast('About Us updated successfully! ✨');
      }
    } catch (e) {
      showToast('Failed to update About Us: ' + (e.response?.data?.message || e.message), 'error');
    } finally {
      setBioLoading(false);
    }
  };

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
    <>
      {/* 1. Navbar */}
      <Header onLogout={handleLogout} />
      {/* Animated SVG background for main content area */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 900"
        style={{
          position: 'absolute',
          left: 0,
          top: 66,
          width: '100vw',
          height: 'calc(100vh - 66px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#23272f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#23272f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="400" cy="200" r="180" fill="url(#glow1)">
          <animate attributeName="r" values="180;220;180" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="1600" cy="700" r="160" fill="url(#glow2)">
          <animate attributeName="r" values="160;200;160" dur="7s" repeatCount="indefinite" />
        </circle>
        <circle cx="1200" cy="300" r="90" fill="#f9731622">
          <animate attributeName="cy" values="300;400;300" dur="8s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="800" r="60" fill="#00f0ff22">
          <animate attributeName="cx" values="200;400;200" dur="10s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* 2+3. Main content: About container + Profile card container */}
      <div className="profile-flex-row" style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        marginTop: 0,
        background: 'linear-gradient(120deg, #181c23 60%, #23272f 100%)',
        width: '100vw',
        position: 'relative',
        zIndex: 1,
        gap: 48,
        animation: 'fadeSlideInMain 1.2s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {/* 2. About container */}
        <div className="about-container" style={{
          background: 'rgba(24,28,35,0.95)',
          borderRadius: 24,
          border: '3px solid #23272f',
          boxShadow: '0 0 32px #23272f55',
          padding: '32px 24px',
          minWidth: 220,
          maxWidth: 260,
          width: 240,
          minHeight: 520,
          maxHeight: 520,
          height: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 24,
        }}>
          <h3 style={{ color: '#f97316', fontWeight: 900, fontSize: 24, margin: 0, textAlign: 'center', textShadow: '0 0 8px #f97316aa' }}>About Us</h3>
          <div style={{ width: '100%', height: 0, borderTop: '2px solid #f97316', opacity: 0.7, marginBottom: 16 }} />
          <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.6, textAlign: 'center', margin: 0, flex: 1 }}>
            {user.bio || 'We are a gaming organization dedicated to fostering talent and creating amazing gaming experiences. Join our community and be part of something extraordinary!'}
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 12, width: 140, fontWeight: 700, fontSize: 16, alignSelf: 'center', background: 'linear-gradient(90deg, #f97316 60%, #00f0ff 100%)', border: 'none', borderRadius: 10, boxShadow: '0 0 12px #f9731688, 0 0 12px #00f0ff88', color: '#fff', letterSpacing: 1 }}
            onClick={() => { setBioValue(user.bio || ''); setEditBioOpen(true); }}
            disabled={bioLoading}
          >
            Edit
          </button>
        </div>
        {/* About Us Edit Modal */}
        {editBioOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#181c23', borderRadius: 18, padding: 32, minWidth: 320, maxWidth: 400, width: '95vw', boxShadow: '0 8px 32px #000a', color: '#fff', position: 'relative' }}>
              <button style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', color: '#f97316', fontSize: 28, cursor: 'pointer', fontWeight: 700 }} onClick={() => setEditBioOpen(false)}>&times;</button>
              <h2 style={{ fontWeight: 900, fontSize: 22, marginBottom: 18, color: '#fff', textAlign: 'center' }}>Edit About Us</h2>
              <textarea
                value={bioValue}
                onChange={e => setBioValue(e.target.value)}
                style={{ width: '100%', minHeight: 100, borderRadius: 8, border: '1.5px solid #23272f', background: '#23272f', color: '#fff', fontSize: 15, padding: 12, marginBottom: 18 }}
                placeholder="Describe your organization..."
                disabled={bioLoading}
              />
              <button
                style={{ background: 'linear-gradient(90deg, #f97316 60%, #00f0ff 100%)', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 10, padding: '12px 0', width: '100%', marginTop: 8, boxShadow: '0 0 12px #f9731688, 0 0 12px #00f0ff88', letterSpacing: 1, cursor: 'pointer' }}
                onClick={handleSaveBio}
                disabled={bioLoading}
              >
                {bioLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
        {/* 3. Profile card container */}
        <div className="profile-card-container" style={{
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(135deg, #181c23 60%, #23272f 100%)',
          borderRadius: 32,
          padding: '48px 40px 40px 40px',
          minWidth: 440,
          maxWidth: 600,
          width: 520,
          color: 'white',
          boxShadow: '0 0 32px 0 #f9731655, 0 0 64px 0 #00f0ff33',
          border: '3px solid #f97316',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          justifyContent: 'flex-start',
          fontFamily: 'Poppins, monospace',
          textAlign: 'center',
          minHeight: 520,
          maxHeight: 520,
          height: 520,
        }}>
          <div style={{ position: 'absolute', top: '-48px', left: '50%', transform: 'translateX(-50%)', width: 120, height: 120, zIndex: 3, background: 'transparent' }}>
            <img src={user.profilepic || defaultAvatar} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid #f97316', boxShadow: '0 0 24px #f97316cc, 0 0 32px #f9731688', background: '#181c23' }} />
          </div>
          <div style={{ width: '100%', height: 0, borderTop: '2.5px solid #f97316', marginTop: 70, marginBottom: 18, opacity: 0.7 }} />
          <h2 style={{ fontWeight: 900, fontSize: 32, margin: 0, color: '#fff', letterSpacing: 2, textShadow: '0 0 12px #f97316, 0 0 8px #00f0ff' }}>{user.username}</h2>
          <div style={{ color: '#f97316', fontSize: 18, marginBottom: 4, fontWeight: 600, textShadow: '0 0 8px #f9731688' }}>{user.email}</div>
          
          {/* Social Media Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', marginBottom: 16 }}>
            {user.youtube && (
              <a href={user.youtube.startsWith('http') ? user.youtube : `https://youtube.com/${user.youtube}`} target="_blank" rel="noopener noreferrer" title="YouTube" style={{ color: '#FF0000', fontSize: 28, textShadow: '0 0 8px #FF0000cc' }}>
                <FaYoutube />
              </a>
            )}
            {user.instagram && (
              <a href={user.instagram.startsWith('http') ? user.instagram : `https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#E4405F', fontSize: 28, textShadow: '0 0 8px #E4405Fcc' }}>
                <FaInstagram />
              </a>
            )}
            {user.website && (
              <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" title="Website" style={{ color: '#00f0ff', fontSize: 28, textShadow: '0 0 8px #00f0ffcc' }}>
                <FaGlobe />
              </a>
            )}
          </div>
          
          <button className="btn btn-primary" style={{ marginTop: 18, width: 200, fontWeight: 700, fontSize: 20, alignSelf: 'center', background: 'linear-gradient(90deg, #f97316 60%, #00f0ff 100%)', border: 'none', borderRadius: 10, boxShadow: '0 0 16px #f9731688, 0 0 16px #00f0ff88', color: '#fff', letterSpacing: 1 }} onClick={() => setEditOpen(true)} disabled={loading}>Edit Details</button>
        </div>
      </div>
      <EditProfileModalOrg open={editOpen} onClose={() => setEditOpen(false)} user={user} onSave={handleSave} />
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: toast.type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minWidth: 300,
          maxWidth: 400,
          animation: 'slideInRight 0.3s ease-out',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 'bold',
          }}>
            {toast.type === 'success' ? '✓' : '✕'}
          </div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{toast.message}</span>
        </div>
      )}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @media (max-width: 900px) {
          .profile-flex-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            padding: 8px 0 !important;
          }
          .about-container, .profile-card-container {
            min-width: 0 !important;
            max-width: 100vw !important;
            width: 100vw !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 24px 8px 24px 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePageOrg; 