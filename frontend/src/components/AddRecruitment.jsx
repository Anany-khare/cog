import React, { useState } from 'react';
import API from '../api';

const AddRecruitment = ({ orgId, onRecruitmentAdded }) => {
  const [game, setGame] = useState('');
  const [requirement, setRequirement] = useState('');
  const [loading, setLoading] = useState(false);
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call backend to create recruitment post
      const res = await API.post('/api/v1/recruitment/add', {
        orgId,
        game,
        requirement,
      });
      if (res.data.success) {
        showToast('Recruitment posted and notification sent to all gamers! 🎯');
        setGame('');
        setRequirement('');
        if (onRecruitmentAdded) onRecruitmentAdded();
      } else {
        showToast(res.data.message || 'Failed to add recruitment.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add recruitment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="add-recruitment-form" style={{ maxWidth: 500, margin: '0 auto', background: '#23272f', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0008' }}>
        <h2 style={{ color: '#f97316', textAlign: 'center', marginBottom: 24 }}>Add Recruitment</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#fff', fontWeight: 600 }}>Game</label>
            <input
              type="text"
              value={game}
              onChange={e => setGame(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #f97316', background: '#181c23', color: '#fff', marginTop: 6 }}
              placeholder="e.g. Valorant, BGMI, COD"
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ color: '#fff', fontWeight: 600 }}>Requirement</label>
            <textarea
              value={requirement}
              onChange={e => setRequirement(e.target.value)}
              required
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #f97316', background: '#181c23', color: '#fff', marginTop: 6, minHeight: 80 }}
              placeholder="Describe your requirements..."
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer', marginTop: 8 }}>
            {loading ? 'Posting...' : 'Post Recruitment'}
          </button>
        </form>
      </div>
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
      `}</style>
    </>
  );
};

export default AddRecruitment; 