import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import API, { logoutUser } from '../api';
import { setUserProfile, setSelectedUser, setAuthUser } from '../redux/authSlice';
import Header from './Header';
import EditProfileModal from './EditProfileModal';
import PostCard from './PostCard';
import { FaDiscord, FaTwitch, FaYoutube, FaInstagram, FaGlobe, FaMapMarkerAlt, FaPhone, FaBirthdayCake, FaUser } from 'react-icons/fa';
import '../assets/ProfilePage.css';

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userProfile, selectedUser } = useSelector(state => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userId = id || user._id;
        const response = await API.get(`/api/v1/user/profile/${userId}`);
        const profileData = response.data.user;
        
        dispatch(setUserProfile(profileData));
        dispatch(setSelectedUser(profileData));
        setPosts(profileData.posts || []);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          logoutUser();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, user, navigate, dispatch]);

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

  const handleSave = async (formData) => {
    try {
      const res = await API.post('/api/v1/user/profile/edit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.user) {
        dispatch(setAuthUser(res.data.user));
        setShowEditModal(false);
        // Refresh the profile data
        const userId = id || user._id;
        const profileRes = await API.get(`/api/v1/user/profile/${userId}`);
        const profileData = profileRes.data.user;
        dispatch(setUserProfile(profileData));
        dispatch(setSelectedUser(profileData));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const profileUser = selectedUser || userProfile || user;
  const isOwnProfile = user._id === profileUser._id;
  const showRanks = profileUser.role !== 'org';

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="profile-container">
        <div className="profile-details">
          {/* Profile Pic & Username */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
            <img src={profileUser?.profilepic || '/default-avatar.png'} alt="Profile" style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '5px solid #f97316', boxShadow: '0 0 30px #f9731699, 0 0 60px #00f0ff55', marginBottom: 18 }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 0 20px #f97316cc, 0 0 40px #00f0ff55', letterSpacing: 1 }}>{profileUser?.username}</h1>
          </div>

          {/* Profile Details Section */}
          <h2>Profile Details</h2>
          <div className="details-grid">
            {/* Personal Information */}
            <div className="details-section">
              <h3>Personal Information</h3>
              <div className="detail-item">
                <FaUser className="detail-icon" />
                <span className="detail-label">Email:</span>
                <span className="detail-value">{profileUser?.email}</span>
              </div>
              {profileUser?.location && (
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{profileUser.location}</span>
                </div>
              )}
              {profileUser?.dob && (
                <div className="detail-item">
                  <FaBirthdayCake className="detail-icon" />
                  <span className="detail-label">Date of Birth:</span>
                  <span className="detail-value">{profileUser.dob}</span>
                </div>
              )}
              {profileUser?.phone && (
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{profileUser.phone}</span>
                </div>
              )}
              {profileUser?.gender && (
                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <span className="detail-label">Gender:</span>
                  <span className="detail-value">{profileUser.gender}</span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="details-section">
              <h3>Social Media</h3>
              {profileUser?.discord && (
                <div className="detail-item">
                  <FaDiscord className="detail-icon discord" />
                  <span className="detail-label">Discord:</span>
                  <a href={`https://discord.com/users/${profileUser.discord.replace(/[^\w#]/g, '')}`} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {profileUser.discord}
                  </a>
                </div>
              )}
              {profileUser?.twitch && (
                <div className="detail-item">
                  <FaTwitch className="detail-icon twitch" />
                  <span className="detail-label">Twitch:</span>
                  <a href={`https://twitch.tv/${profileUser.twitch}`} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {profileUser.twitch}
                  </a>
                </div>
              )}
              {profileUser?.youtube && (
                <div className="detail-item">
                  <FaYoutube className="detail-icon youtube" />
                  <span className="detail-label">YouTube:</span>
                  <a href={profileUser.youtube.startsWith('http') ? profileUser.youtube : `https://youtube.com/${profileUser.youtube}`} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {profileUser.youtube}
                  </a>
                </div>
              )}
              {profileUser?.instagram && (
                <div className="detail-item">
                  <FaInstagram className="detail-icon instagram" />
                  <span className="detail-label">Instagram:</span>
                  <a href={profileUser.instagram.startsWith('http') ? profileUser.instagram : `https://instagram.com/${profileUser.instagram}`} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {profileUser.instagram}
                  </a>
                </div>
              )}
              {profileUser?.website && (
                <div className="detail-item">
                  <FaGlobe className="detail-icon website" />
                  <span className="detail-label">Website:</span>
                  <a href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {profileUser.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Game Ranks (for gamers only) - Centered in the middle */}
          {showRanks && (
            <div style={{ margin: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="details-section" style={{ width: '100%', maxWidth: 500 }}>
                <h3>Game Ranks</h3>
                {profileUser?.valorantRank && (
                  <div className="detail-item">
                    <span className="game-icon valorant">🎯</span>
                    <span className="detail-label">Valorant:</span>
                    <span className="detail-value rank valorant">{profileUser.valorantRank}</span>
                  </div>
                )}
                {profileUser?.bgmiRank && (
                  <div className="detail-item">
                    <span className="game-icon bgmi">📱</span>
                    <span className="detail-label">BGMI:</span>
                    <span className="detail-value rank bgmi">{profileUser.bgmiRank}</span>
                  </div>
                )}
                {profileUser?.codRank && (
                  <div className="detail-item">
                    <span className="game-icon cod">🎮</span>
                    <span className="detail-label">COD:</span>
                    <span className="detail-value rank cod">{profileUser.codRank}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Profile Button at the bottom */}
          {isOwnProfile && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <button className="edit-profile-btn" style={{ background: '#f97316', backgroundImage: 'none' }} onClick={() => setShowEditModal(true)}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
        <div className="profile-posts">
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
      <EditProfileModal 
        open={showEditModal}
        onClose={() => setShowEditModal(false)} 
        user={user}
        onSave={handleSave}
      />
    </div>
  );
}

export default ProfilePage; 