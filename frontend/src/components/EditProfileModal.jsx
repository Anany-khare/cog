import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 2000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
const modalStyle = {
  background: '#181c23',
  borderRadius: 18,
  padding: '32px 32px 24px 32px',
  minWidth: 400,
  maxWidth: 600,
  width: '95vw',
  boxShadow: '0 8px 32px #000a',
  color: '#fff',
  position: 'relative',
  maxHeight: 1040,
  height: 'auto',
};
const closeBtnStyle = {
  position: 'absolute',
  top: 16,
  right: 18,
  background: 'none',
  border: 'none',
  color: '#f97316',
  fontSize: 28,
  cursor: 'pointer',
  fontWeight: 700,
};
const labelStyle = { fontWeight: 600, marginBottom: 4, color: '#f97316' };
const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1.5px solid #23272f',
  background: '#23272f',
  color: '#fff',
  marginBottom: 14,
  fontSize: 15,
};
const saveBtnStyle = {
  background: 'linear-gradient(90deg, #f97316 60%, #00f0ff 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: 18,
  border: 'none',
  borderRadius: 10,
  padding: '12px 0',
  width: '100%',
  marginTop: 8,
  boxShadow: '0 0 12px #f9731688, 0 0 12px #00f0ff88',
  letterSpacing: 1,
  cursor: 'pointer',
};

const EditProfileModal = ({ open, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    dob: user?.dob || '',
    phone: user?.phone || '',
    discord: user?.discord || '',
    twitch: user?.twitch || '',
    youtube: user?.youtube || '',
    valorantRank: user?.valorantRank || '',
    bgmiRank: user?.bgmiRank || '',
    codRank: user?.codRank || '',
    gender: user?.gender || '',
    profilePhoto: null,
  });
  const [preview, setPreview] = useState(user?.profilepic || '/default-avatar.png');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto' && files && files[0]) {
      setForm(f => ({ ...f, profilePhoto: files[0] }));
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleCameraClick = () => {
    document.getElementById('profilepic-input').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'profilePhoto') {
          formData.append('profilePhoto', value);
        } else if (key !== 'profilepic') {
          formData.append(key, value);
        }
      }
    });
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        <h2 style={{ fontWeight: 900, fontSize: 26, marginBottom: 18, color: '#fff', textAlign: 'center' }}>Edit Profile</h2>
        <form onSubmit={handleSubmit} style={{
          maxHeight: 740,
          overflowY: 'auto',
          paddingRight: 8,
        }} className="edit-profile-form-scroll">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={preview} alt="Profile Preview" style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '3px solid #f97316', background: '#23272f' }} />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #23272f 60%, #2d1a22 100%)',
                  border: '2px solid #f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f97316',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #f9731622',
                  fontSize: 18,
                  transition: 'box-shadow 0.2s, background 0.2s',
                  outline: 'none',
                  zIndex: 2,
                }}
                onClick={handleCameraClick}
                title="Change Profile Picture"
              >
                <FaCamera />
              </button>
              <input
                id="profilepic-input"
                type="file"
                name="profilePhoto"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={labelStyle}>Username</div>
          <input style={inputStyle} name="username" value={form.username} onChange={handleChange} required />
          <div style={labelStyle}>Email</div>
          <input style={{ ...inputStyle, background: '#23272f88', color: '#aaa', cursor: 'not-allowed' }} name="email" value={form.email} type="email" readOnly disabled />
          <div style={labelStyle}>Bio</div>
          <input style={inputStyle} name="bio" value={form.bio} onChange={handleChange} />
          <div style={labelStyle}>Location</div>
          <input style={inputStyle} name="location" value={form.location} onChange={handleChange} />
          <div style={labelStyle}>Date of Birth</div>
          <input style={inputStyle} name="dob" value={form.dob} onChange={handleChange} type="date" />
          <div style={labelStyle}>Phone</div>
          <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} />
          <div style={labelStyle}>Discord</div>
          <input style={inputStyle} name="discord" value={form.discord} onChange={handleChange} />
          <div style={labelStyle}>Twitch</div>
          <input style={inputStyle} name="twitch" value={form.twitch} onChange={handleChange} />
          <div style={labelStyle}>YouTube</div>
          <input style={inputStyle} name="youtube" value={form.youtube} onChange={handleChange} />
          <div style={labelStyle}>Gender</div>
          <select style={inputStyle} name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div style={labelStyle}>Valorant Rank</div>
          <select style={inputStyle} name="valorantRank" value={form.valorantRank} onChange={handleChange}>
            <option value="">Select Rank</option>
            <option value="Iron">Iron</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Diamond">Diamond</option>
            <option value="Ascendant">Ascendant</option>
            <option value="Immortal">Immortal</option>
            <option value="Radiant">Radiant</option>
          </select>
          <div style={labelStyle}>BGMI Rank</div>
          <select style={inputStyle} name="bgmiRank" value={form.bgmiRank} onChange={handleChange}>
            <option value="">Select Rank</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Diamond">Diamond</option>
            <option value="Crown">Crown</option>
            <option value="Ace">Ace</option>
            <option value="Conqueror">Conqueror</option>
          </select>
          <div style={labelStyle}>COD Rank</div>
          <select style={inputStyle} name="codRank" value={form.codRank} onChange={handleChange}>
            <option value="">Select Rank</option>
            <option value="Rookie">Rookie</option>
            <option value="Veteran">Veteran</option>
            <option value="Elite">Elite</option>
            <option value="Pro">Pro</option>
            <option value="Master">Master</option>
            <option value="Grandmaster">Grandmaster</option>
            <option value="Legendary">Legendary</option>
          </select>
          <button type="submit" style={saveBtnStyle} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
      <style>{`
        .edit-profile-form-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .edit-profile-form-scroll::-webkit-scrollbar-thumb {
          background: #f97316;
          border-radius: 4px;
        }
        .edit-profile-form-scroll::-webkit-scrollbar-track {
          background: #23272f;
          border-radius: 4px;
        }
        .edit-profile-form-scroll {
          scrollbar-width: thin;
          scrollbar-color: #f97316 #23272f;
        }
      `}</style>
    </div>
  );
};

export default EditProfileModal; 