import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../api';
import './../assets/RightPane.css';
import { motion } from 'framer-motion';
import useSocket from '../hooks/useSocket';


// Recruitment Modal Component
const RecruitmentModal = ({ open, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    game: '',
    position: '',
    requirements: '',
    contactInfo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await API.post('/api/v1/notification/recruitment', formData);
      
      if (response.data.success) {
        showToast(`Recruitment notification sent to ${response.data.data.count} gamers! 🎯`);
        onClose();
        setFormData({ game: '', position: '', requirements: '', contactInfo: '' });
      } else {
        showToast('Failed to send recruitment notification: ' + response.data.message, 'error');
      }
    } catch (error) {
      showToast('Failed to send recruitment notification: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 style={{ color: '#f97316', marginBottom: '1rem' }}>Send Recruitment Notification</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>Game</label>
            <input
              type="text"
              value={formData.game}
              onChange={(e) => setFormData({...formData, game: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb'
              }}
              placeholder="e.g., Valorant, BGMI, COD"
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>Position</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb'
              }}
              placeholder="e.g., Entry Fragger, IGL, Support"
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>Requirements</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Describe the requirements, skills needed, etc."
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>Contact Information</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb'
              }}
              placeholder="Discord, WhatsApp, or other contact info"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Sending...' : 'Send Recruitment Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Gamer Response Modal Component
const GamerResponseModal = ({ open, onClose, recruitment, onSubmit, showToast }) => {
  const [formData, setFormData] = useState({
    gameDetail: '',
    inGameUserId: '',
    screenshotUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file (PNG, JPG, JPEG)', 'error');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      
      setSelectedFile(file);
      // Convert file to base64 for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, screenshotUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.gameDetail || !formData.inGameUserId || !selectedFile) {
      showToast('Please fill all fields and upload a screenshot', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Create FormData with only the required fields
      const formDataToSend = new FormData();
      formDataToSend.append('screenshot', selectedFile);
      formDataToSend.append('gameDetail', formData.gameDetail);
      formDataToSend.append('inGameUserId', formData.inGameUserId);
      
      console.log('Sending FormData:', {
        file: selectedFile.name,
        gameDetail: formData.gameDetail,
        inGameUserId: formData.inGameUserId
      });
      
      const response = await API.post(`/api/v1/recruitment/${recruitment._id}/respond`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        showToast('Response submitted successfully! 🎉');
        onSubmit();
        onClose();
        setFormData({ gameDetail: '', inGameUserId: '', screenshotUrl: '' });
        setSelectedFile(null);
      }
    } catch (error) {
      showToast('Failed to submit response: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !recruitment) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2 style={{ color: '#f97316', marginBottom: '1rem' }}>Submit Application</h2>
        <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
          Apply for {recruitment.game} - {recruitment.requirement}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>Game Details & Experience</label>
            <textarea
              value={formData.gameDetail}
              onChange={(e) => setFormData({...formData, gameDetail: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb',
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Describe your experience, rank, achievements, etc."
              required
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb' }}>In-Game User ID</label>
            <input
              type="text"
              value={formData.inGameUserId}
              onChange={(e) => setFormData({...formData, inGameUserId: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #374151',
                background: '#111827',
                color: '#f9fafb'
              }}
              placeholder="Your in-game username/ID"
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#f9fafb', fontWeight: '600' }}>
              📸 Profile Card Screenshot *
            </label>
            <label style={{
              border: '2px dashed #374151',
              borderRadius: '0.5rem',
              padding: '1rem',
              textAlign: 'center',
              background: '#111827',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
              display: 'block',
              margin: 0
            }} onMouseOver={(e) => e.target.style.borderColor = '#f97316'} onMouseOut={(e) => e.target.style.borderColor = '#374151'}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  display: 'none'
                }}
                required
              />
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                {selectedFile ? (
                  <div>
                    <div style={{ color: '#f97316', fontWeight: '600', marginBottom: '0.5rem' }}>
                      ✅ File selected: {selectedFile.name}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      Click to change file
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
                    <div style={{ color: '#f97316', fontWeight: '600', marginBottom: '0.25rem' }}>
                      Click to upload screenshot
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      PNG, JPG, JPEG up to 5MB
                    </div>
                  </div>
                )}
              </div>
            </label>
            {formData.screenshotUrl && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <div style={{ color: '#f97316', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Preview:
                </div>
                <img 
                  src={formData.screenshotUrl} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '0.5rem',
                    border: '2px solid #374151',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }} 
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Recruitment card rendering for orgs (used in both sections)
const RecruitmentCard = ({ rec, user, setOrgRecruitments }) => (
  <div style={{ 
    background: '#1a202c', 
    borderRadius: '0.5rem', 
    padding: '0.75rem', 
    border: '1px solid #374151',
    marginBottom: 8
  }}>
    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>
      {rec.game}
    </div>
    <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
      {rec.requirement}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#38bdf8', fontSize: '0.8rem' }}>
        {rec.responses?.length || 0} responses
      </span>
      <button
        onClick={() => window.open(`/recruitment/${rec._id}/responses`, '_blank')}
        style={{
          background: '#374151',
          color: '#f9fafb',
          border: 'none',
          borderRadius: '0.25rem',
          padding: '0.25rem 0.5rem',
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={e => e.target.style.background = '#4b5563'}
        onMouseOut={e => e.target.style.background = '#374151'}
      >
        View Responses
      </button>
      {rec.isOpen !== false ? (
        <button
          onClick={async () => {
            if (!window.confirm('Are you sure you want to stop responses for this recruitment? This will remove notifications for gamers.')) return;
            try {
              await API.patch(`/api/v1/recruitment/close/${rec._id}`);
              showToast('Recruitment closed and notifications removed! 🔒');
              // Refresh recruitments
              API.get(`/api/v1/recruitment?orgId=${user._id}`)
                .then(res => setOrgRecruitments(res.data.recruitments || []));
            } catch (err) {
              showToast('Failed to close recruitment: ' + (err.response?.data?.message || err.message), 'error');
            }
          }}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            marginLeft: 8,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={e => e.target.style.background = '#b91c1c'}
          onMouseOut={e => e.target.style.background = '#ef4444'}
        >
          Stop Responses
        </button>
      ) : (
        <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', marginLeft: 8 }}>Closed</span>
      )}
    </div>
  </div>
);

const ConfirmationModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <h3 style={{ color: '#f97316', marginBottom: '1rem' }}>Are you sure?</h3>
        <p style={{ color: '#f9fafb', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', background: '#374151', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '0.5rem 1rem', background: '#f97316', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Yes, Stop</button>
        </div>
      </div>
    </div>
  );
};

const RightPane = () => {
    const { user } = useSelector((state) => state.auth);
    const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
    const [gamerResponseModalOpen, setGamerResponseModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orgRecruitments, setOrgRecruitments] = useState([]);
    const [showAllRecruitments, setShowAllRecruitments] = useState(false);
    const socket = useSocket();
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [recruitmentToClose, setRecruitmentToClose] = useState(null);

    // Show toast notification
    const showToast = (message, type = 'success') => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Fetch recruitments for gamers
    useEffect(() => {
      if (user?.role === 'gamer') {
        setLoading(true);
        API.get('/api/v1/recruitment')
          .then(res => {
            setRecruitments(res.data.recruitments || []);
          })
          .catch(() => setRecruitments([]))
          .finally(() => setLoading(false));
      }
    }, [user]);

    // Fetch recruitments for orgs
    useEffect(() => {
      if (user?.role === 'org') {
        API.get(`/api/v1/recruitment?orgId=${user._id}`)
          .then(res => {
            setOrgRecruitments(res.data.recruitments || []);
          })
          .catch(() => setOrgRecruitments([]));
      }
    }, [user]);

    // Real-time updates for org recruitments
    useEffect(() => {
      if (!socket || !socket.connected || user?.role !== 'org') return;
      console.log('Setting up org recruitment listeners for user:', user._id);
      const handleRecruitmentUpdate = (data) => {
        console.log('Org received recruitment update:', data);
        // Refetch recruitments on any update
        API.get(`/api/v1/recruitment?orgId=${user._id}`)
          .then(res => setOrgRecruitments(res.data.recruitments || []))
          .catch(() => setOrgRecruitments([]));
      };
      socket.on('recruitment_updated', handleRecruitmentUpdate);
      socket.on('recruitment_added', handleRecruitmentUpdate);
      socket.on('recruitment_closed', handleRecruitmentUpdate);
      return () => {
        socket.off('recruitment_updated', handleRecruitmentUpdate);
        socket.off('recruitment_added', handleRecruitmentUpdate);
        socket.off('recruitment_closed', handleRecruitmentUpdate);
      };
    }, [socket, user]);

    // Re-setup listeners when socket connects
    useEffect(() => {
      if (!socket) return;
      
      const handleConnect = () => {
        console.log('Socket connected, re-setting up listeners');
        if (user?.role === 'org') {
          // Re-setup org listeners
          const handleRecruitmentUpdate = (data) => {
            console.log('Org received recruitment update:', data);
            API.get(`/api/v1/recruitment?orgId=${user._id}`)
              .then(res => setOrgRecruitments(res.data.recruitments || []))
              .catch(() => setOrgRecruitments([]));
          };
          socket.on('recruitment_updated', handleRecruitmentUpdate);
          socket.on('recruitment_added', handleRecruitmentUpdate);
          socket.on('recruitment_closed', handleRecruitmentUpdate);
        } else if (user?.role === 'gamer') {
          // Re-setup gamer listeners
          const handleNewRecruitment = (data) => {
            console.log('Gamer received new recruitment:', data);
            API.get('/api/v1/recruitment')
              .then(res => setRecruitments(res.data.recruitments || []))
              .catch(() => setRecruitments([]));
          };
          socket.on('recruitment_added', handleNewRecruitment);
        }
      };

      socket.on('connect', handleConnect);
      return () => {
        socket.off('connect', handleConnect);
      };
    }, [socket, user]);

    // Real-time updates for gamer recruitments
    useEffect(() => {
      if (!socket || !socket.connected || user?.role !== 'gamer') return;
      console.log('Setting up gamer recruitment listeners for user:', user._id);
      const handleNewRecruitment = (data) => {
        console.log('Gamer received new recruitment:', data);
        // Refetch recruitments when a new one is added
        API.get('/api/v1/recruitment')
          .then(res => setRecruitments(res.data.recruitments || []))
          .catch(() => setRecruitments([]));
      };
      socket.on('recruitment_added', handleNewRecruitment);
      return () => {
        socket.off('recruitment_added', handleNewRecruitment);
      };
    }, [socket, user]);

    const handleAcceptRecruitment = (recruitment) => {
      setSelectedRecruitment(recruitment);
      setGamerResponseModalOpen(true);
    };

    const handleResponseSubmitted = () => {
      // Refresh recruitments after submission
      if (user?.role === 'gamer') {
        API.get('/api/v1/recruitment')
          .then(res => {
            setRecruitments(res.data.recruitments || []);
          })
          .catch(() => setRecruitments([]));
      }
    };

    // Show Recruitment Requirements for orgs
    if (user?.role === 'org') {
    return (
        <>
        <motion.aside 
            className="right-pane-container"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="right-pane-announcement-card" style={{
              background: '#232b36',
              borderRadius: '1rem',
              padding: '0.5rem', // reduced from 1.5rem
              border: '2px solid #f97316',
              margin: '0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              minHeight: 250, 
              height: 850,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              overflowX: 'hidden',
              justifyContent: 'flex-start',
              position: 'sticky',
              // top: '2rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ color: '#f97316', fontSize: '1.3rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span role="img" aria-label="target">🎯</span> Recruitment Requirements
                </h2>
                <button
                  onClick={() => setRecruitmentModalOpen(true)}
                  style={{
                    background: '#f97316',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#ea580c'}
                  onMouseOut={(e) => e.target.style.background = '#f97316'}
                >
                  + Add New
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{
                  background: '#1a202c',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#f97316', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span role="img" aria-label="game">🎮</span> Game
                  </span>
                  <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                    Specify the game you're recruiting for (Valorant, BGMI, COD, etc.)
                  </span>
                </div>
                <div style={{
                  background: '#1a202c',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span role="img" aria-label="position">👥</span> Position
                  </span>
                  <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                    Define the role needed (Entry Fragger, IGL, Support, etc.)
                  </span>
                </div>
                <div style={{
                  background: '#1a202c',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#f97316', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span role="img" aria-label="requirements">📋</span> Requirements
                  </span>
                  <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                    List skills, experience, and qualifications needed
                  </span>
                </div>
                <div style={{
                  background: '#1a202c',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #374151',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: '#f97316', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span role="img" aria-label="contact">📞</span> Contact
                  </span>
                  <span style={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                    Provide Discord, WhatsApp, or other contact methods
                  </span>
                </div>
              </div>
              
              {/* Show org's recruitments with response counts */}
              {orgRecruitments.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ color: '#f97316', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Your Recruitments
                  </h3>
                  {/* First two recruitments always visible */}
                  {[...orgRecruitments].reverse().slice(0, 2).map(rec => (
                    <RecruitmentCard key={rec._id} rec={rec} user={user} setOrgRecruitments={setOrgRecruitments} />
                  ))}
                  {/* Rest in non-scrollable container if more than two */}
                  {orgRecruitments.length > 2 && (
                    <div style={{
                      marginTop: 8,
                      // Removed maxHeight and overflowY to prevent inner scroll
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      borderRadius: 8,
                      background: '#181c23',
                      padding: '6px 10px',
                    }}>
                      {[...orgRecruitments].reverse().slice(2).map(rec => (
                        <RecruitmentCard key={rec._id} rec={rec} user={user} setOrgRecruitments={setOrgRecruitments} />
                      ))}
                    </div>
                  )}
                </div>
              )}
                </div>
          </motion.aside>
          <RecruitmentModal 
            open={recruitmentModalOpen} 
            onClose={() => setRecruitmentModalOpen(false)}
            showToast={showToast}
          />
          <ConfirmationModal
            open={confirmModalOpen}
            onClose={() => setConfirmModalOpen(false)}
            message="Do you really want to stop accepting responses for this recruitment? This action cannot be undone."
            onConfirm={async () => {
              setConfirmModalOpen(false);
              if (!recruitmentToClose) return;
              try {
                const response = await API.patch(`/api/v1/recruitment/close/${recruitmentToClose}`);
                if (response.data.success) {
                  showToast('Recruitment closed and notifications removed.');
                } else {
                  showToast('Failed to close recruitment: ' + response.data.message, 'error');
                }
              } catch (error) {
                showToast('Failed to close recruitment: ' + (error.response?.data?.message || error.message), 'error');
              } finally {
                setRecruitmentToClose(null);
              }
            }}
          />
        </>
      );
    }

    // Show Announcements for gamers
    if (user?.role === 'gamer') {
      return (
        <>
          <motion.aside 
            className="right-pane-container"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="right-pane-announcement-card" style={{
              background: '#232b36',
              borderRadius: '1rem',
              padding: '1rem',
              border: '2px solid #f97316',
              margin: '0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              maxHeight: 600,
              height: 600,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              position: 'sticky',
              top: '2rem',
            }}>
              <h2 style={{ color: '#f97316', fontSize: '1.3rem', fontWeight: '700', margin: 0, marginBottom: '1rem' }}>
                Announcements
              </h2>
              {loading ? (
                <p style={{ color: '#d1d5db', fontSize: '1rem', textAlign: 'center', margin: 0 }}>Loading...</p>
              ) : recruitments.length === 0 ? (
                <p style={{ color: '#d1d5db', fontSize: '1rem', textAlign: 'center', margin: 0 }}>No new announcements</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {recruitments.filter(rec => rec.isOpen !== false).map(rec => {
                    const hasApplied = rec.responses && rec.responses.some(
                      (resp) => (resp.gamerId && (resp.gamerId._id || resp.gamerId)) === user._id
                    );
                    return (
                      <li key={rec._id} style={{ marginBottom: 18, background: '#1a202c', borderRadius: 10, padding: 14, border: '1px solid #374151' }}>
                        <div style={{ color: '#f97316', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{rec.game}</div>
                        <div style={{ color: '#fff', fontSize: 15, marginBottom: 4 }}>{rec.requirement}</div>
                        {rec.contactInfo && (
                          <div style={{ color: '#38bdf8', fontSize: 14, marginBottom: 4 }}>Contact: {rec.contactInfo}</div>
                        )}
                        <div style={{ color: '#9ca3af', fontSize: 13, marginBottom: 8 }}>By: {rec.orgId?.username || 'Org'}</div>
                        <button
                          disabled={hasApplied}
                          onClick={() => handleAcceptRecruitment(rec)}
                          style={{
                            background: hasApplied ? '#6b7280' : '#f97316',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: hasApplied ? 'not-allowed' : 'pointer',
                            marginLeft: 8
                          }}
                        >
                          {hasApplied ? 'Already Applied' : 'Apply'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
          <GamerResponseModal
            open={gamerResponseModalOpen}
            onClose={() => {
              setGamerResponseModalOpen(false);
              setSelectedRecruitment(null);
            }}
            recruitment={selectedRecruitment}
            onSubmit={handleResponseSubmitted}
            showToast={showToast}
          />
        </>
      );
    }

    // Toast Notification (available for all roles)
    return (
      <>
        {/* For other roles, show nothing */}
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

export default RightPane; 