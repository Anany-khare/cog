import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsPage, addPostRealtime, updatePostLike, addCommentRealtime, updateCommentLike } from '../redux/postSlice';
import API from '../api';
import './../assets/PostCard.css';
import CreatePost from './CreatePost';
import { motion } from 'framer-motion';
import useSocket from '../hooks/useSocket';
import PostCard from './PostCard';

// Recruitment Modal Component
const RecruitmentModal = ({ open, onClose, onRecruitmentSent }) => {
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
      alert(`Recruitment notification sent to ${response.data.data.count} gamers!`);
      onRecruitmentSent();
      onClose();
      setFormData({ game: '', position: '', requirements: '', contactInfo: '' });
    } catch (error) {
      alert('Failed to send recruitment notification: ' + (error.response?.data?.message || error.message));
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

const HomePageOrg = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, page, hasMore } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const [modalPost, setModalPost] = useState(null);
  const [imageModalPost, setImageModalPost] = useState(null);
  const [recruitmentModalOpen, setRecruitmentModalOpen] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  
  // Socket.IO connection
  const socket = useSocket();

  useEffect(() => {
    if (user) {
      dispatch(fetchPostsPage({ page: 1, limit: 10 }));
    }
  }, [dispatch, user]);

  // Infinite scroll handler for scrollable center column
  useEffect(() => {
    const scrollParent = document.querySelector('.main-content-custom.card-bg');
    if (!scrollParent) return;
    const handleScroll = () => {
      if (!hasMore || loading || fetchingMore) return;
      const scrollTop = scrollParent.scrollTop;
      const scrollHeight = scrollParent.scrollHeight;
      const clientHeight = scrollParent.clientHeight;
      if (scrollHeight - (scrollTop + clientHeight) < 200) {
        setFetchingMore(true);
        dispatch(fetchPostsPage({ page: page + 1, limit: 10 })).finally(() => setFetchingMore(false));
      }
    };
    scrollParent.addEventListener('scroll', handleScroll);
    return () => scrollParent.removeEventListener('scroll', handleScroll);
  }, [dispatch, page, hasMore, loading, fetchingMore]);

  // Socket.IO event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;
    socket.on('new_post', (newPost) => {
      dispatch(addPostRealtime(newPost));
    });
    socket.on('post_liked', (data) => {
      dispatch(updatePostLike(data));
    });
    socket.on('new_comment', (data) => {
      dispatch(addCommentRealtime(data));
    });
    socket.on('comment_liked', (data) => {
      dispatch(updateCommentLike(data));
    });
    return () => {
      socket.off('new_post');
      socket.off('post_liked');
      socket.off('new_comment');
      socket.off('comment_liked');
    };
  }, [socket, dispatch]);

  const handleCommentAdded = (comment) => {};

  return (
    <div>
      {/* Posts Section */}
      <CreatePost />
      {loading && <p className="text-center">Loading posts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="posts-container" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#f97316 #23272f',
          paddingRight: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          {posts.length === 0 && (
            <p className="text-center text-gray-500">No posts yet. Create the first post!</p>
          )}
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onCommentClick={() => setModalPost(post)}
              onImageClick={() => setImageModalPost(post)}
              onCommentAdded={handleCommentAdded} />
          ))}
          {fetchingMore && hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '24px 0' }}>
              <div style={{ width: 32, height: 32, border: '4px solid #f97316', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#f97316', marginLeft: 12 }}>Loading more posts...</span>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      )}
      {/* Modals */}
      <RecruitmentModal 
        open={recruitmentModalOpen} 
        onClose={() => setRecruitmentModalOpen(false)}
        onRecruitmentSent={() => console.log('Recruitment sent')}
      />
  </div>
  );
};

// Add global CSS for Webkit scrollbar
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .posts-container::-webkit-scrollbar {
      width: 8px;
    }
    .posts-container::-webkit-scrollbar-thumb {
      background: #f97316;
      border-radius: 4px;
    }
    .posts-container::-webkit-scrollbar-track {
      background: #23272f;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

export default HomePageOrg;
