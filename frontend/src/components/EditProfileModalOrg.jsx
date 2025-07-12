import React, { useState, useEffect } from 'react';
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
  maxWidth: 500,
  width: '95vw',
  boxShadow: '0 8px 32px #000a',
  color: '#fff',
  position: 'relative',
  maxHeight: 600,
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

const EditProfileModalOrg = ({ open, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    youtube: '',
    instagram: '',
    website: '',
    profilePhoto: null,
  });
  const [preview, setPreview] = useState('/default-avatar.png');
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens or user changes
  useEffect(() => {
    if (open && user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        youtube: user.youtube || '',
        instagram: user.instagram || '',
        website: user.website || '',
        profilePhoto: null,
      });
      setPreview(user.profilepic || '/default-avatar.png');
    }
  }, [open, user]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto' && files && files[0]) {
      console.log('Profile photo selected:', files[0]);
      setForm(f => ({ ...f, profilePhoto: files[0] }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        console.log('Preview updated');
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleCameraClick = () => {
    document.getElementById('profilepic-input-org').click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    
    console.log('Form data being sent:', form);
    console.log('Profile photo in form:', form.profilePhoto);
    
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'profilePhoto') {
          console.log('Adding profile photo to form data:', value);
          formData.append('profilePhoto', value);
        } else if (key !== 'profilepic') {
          formData.append(key, value);
        }
      }
    });
    
    // Log form data contents
    for (let [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value);
    }
    
    try {
      console.log('About to call onSave with formData');
      await onSave(formData);
      console.log('onSave completed successfully');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={modalStyle}>
        <button style={closeBtnStyle} onClick={onClose}>&times;</button>
        <h2 style={{ fontWeight: 900, fontSize: 26, marginBottom: 18, color: '#fff', textAlign: 'center' }}>Edit Organization Profile</h2>
        <form onSubmit={handleSubmit} style={{
          maxHeight: 500,
          overflowY: 'auto',
          paddingRight: 8,
        }} className="edit-profile-form-scroll">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={preview} 
                alt="Profile Preview" 
                style={{ 
                  width: 140, 
                  height: 140, 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '3px solid #f97316', 
                  background: '#23272f' 
                }} 
              />
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
                id="profilepic-input-org"
                type="file"
                name="profilePhoto"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleChange}
              />
            </div>
            {form.profilePhoto && (
              <div style={{ color: '#10b981', fontSize: 12, marginTop: 8 }}>
                ✓ New image selected: {form.profilePhoto.name}
              </div>
            )}
          </div>
          <div style={labelStyle}>Organization Name</div>
          <input style={{...inputStyle, background: '#23272f88', color: '#aaa', cursor: 'not-allowed'}} name="username" value={form.username}  onChange={handleChange} readOnly disabled />
          <div style={labelStyle}>Email</div>
          <input style={{ ...inputStyle, background: '#23272f88', color: '#aaa', cursor: 'not-allowed' }} name="email" value={form.email} type="email" onChange={handleChange} readOnly disabled />
          <div style={labelStyle}>YouTube Channel</div>
          <input style={inputStyle} name="youtube" value={form.youtube} onChange={handleChange} placeholder="Enter your YouTube channel URL or username" />
          <div style={labelStyle}>Instagram</div>
          <input style={inputStyle} name="instagram" value={form.instagram} onChange={handleChange} placeholder="Enter your Instagram username" />
          <div style={labelStyle}>Website</div>
          <input style={inputStyle} name="website" value={form.website} onChange={handleChange} placeholder="Enter your organization's website URL" />
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

export default EditProfileModalOrg; 