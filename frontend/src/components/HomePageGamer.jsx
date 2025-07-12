import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllPosts, addPostRealtime, updatePostLike, addCommentRealtime, updateCommentLike, fetchPostsPage } from '../redux/postSlice';
import API from '../api';
import './../assets/PostCard.css';
import CreatePost from './CreatePost';
import { motion } from 'framer-motion';
import useSocket from '../hooks/useSocket';
import PostCard from './PostCard';

const ImageCarouselModal = ({ post, onClose }) => {
    if (!post) return null;

    const [currentImage, setCurrentImage] = useState(0);
    const images = Array.isArray(post.image) ? post.image : (post.image ? [post.image] : []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const showPrev = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const showNext = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick} style={{ zIndex: 10000 }}>
            <div className="modal-content" style={{ background: 'transparent', boxShadow: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: 'unset', padding: 0 }}>
                <button className="modal-close-btn" style={{ top: 24, right: 24, background: '#f97316', position: 'absolute', zIndex: 2 }} onClick={onClose}>×</button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', minWidth: '60vw' }}>
                    {images.length > 1 && (
                        <button onClick={showPrev} className="popup-nav-btn" style={{ marginRight: 16 }}>&lt;</button>
                    )}
                    <img src={images[currentImage]} alt="Full" className="popup-image" style={{ cursor: 'default', maxHeight: '80vh', maxWidth: '80vw', borderRadius: '1rem', background: '#181c23' }} />
                    {images.length > 1 && (
                        <button onClick={showNext} className="popup-nav-btn" style={{ marginLeft: 16 }}>&gt;</button>
                    )}
                </div>
                {images.length > 1 && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {images.map((_, idx) => (
                            <span key={idx} onClick={(e) => { e.stopPropagation(); setCurrentImage(idx); }} style={{ width: 10, height: 10, borderRadius: '50%', background: idx === currentImage ? '#f97316' : '#fff', display: 'inline-block', cursor: 'pointer' }}></span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable CommentBox component
const CommentBox = ({ comment, setComment, onAddComment }) => (
    <form className="comment-input-container" style={{marginTop:12, display: 'flex', gap: 8}} onSubmit={onAddComment}>
        <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            style={{ flex: 1 }}
        />
        <button type="submit" className="comment-button">Post</button>
    </form>
);

// Add custom scrollbar style for comments section
const commentScrollStyle = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#f97316 #23272f', // orange thumb, dark track
};

// Updated CommentModal
const CommentModal = ({ post, open, onClose, onCommentAdded }) => {
    const [comment, setComment] = useState('');
    const [likingComments, setLikingComments] = useState(new Set());
    const { user } = useSelector((state) => state.auth);
    const { posts } = useSelector((state) => state.post);
    
    // Get comments from Redux state instead of local state
    const currentPost = posts.find(p => p._id === post?._id);
    const comments = currentPost?.comments || [];

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        const res = await API.post(`/api/v1/post/${post._id}/comment`, { text: comment });
        setComment('');
        onCommentAdded && onCommentAdded(res.data.comment);
    };
    
    const handleLikeComment = async (commentId) => {
        if (likingComments.has(commentId)) return; // Prevent multiple clicks
        
        setLikingComments(prev => new Set(prev).add(commentId));
        try {
            await API.post(`/api/v1/post/comment/${commentId}/togglelike`);
            // No need to update local state - Socket.IO will handle it
        } catch (e) {
            console.error('Error liking comment:', e);
        } finally {
            setLikingComments(prev => {
                const newSet = new Set(prev);
                newSet.delete(commentId);
                return newSet;
            });
        }
    };

    if (!open || !post) return null;
    return (
        <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: 500,
                    width: '95%',
                    margin: '40px auto',
                    position: 'relative',
                    background: '#181c23',
                    borderRadius: 12,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 600,
                    minHeight: 400,
                    height: '80vh',
                }}
            >
                <button type="button" className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>×</button>
                {/* Main content starts from author name, no images */}
                <div style={{ padding: 16, paddingTop: 24, minHeight: 60 }}>
                  <div className="post-header" style={{display: 'flex', alignItems: 'center', marginBottom: 12}}>
                      <img src={post?.author?.profilepic} alt={post?.author?.username} className="author-avatar" style={{width: 28, height: 28}} />
                      <span className="author-name" style={{marginLeft: 8, fontWeight: 500, fontSize: '1rem'}}>{post?.author?.username}</span>
                  </div>
                  {post.caption && (
                    <div className="post-content"><p className="post-caption">{post.caption}</p></div>
                  )}
                </div>
                {/* Comments section (vertically scrollable) */}
                <div
                  className="modal-comments-section"
                  style={{
                    margin: '0 16px',
                    flex: 1,
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 80,
                    maxHeight: 220,
                    ...commentScrollStyle,
                  }}
                >
                    <h4 style={{color:'#f97316', marginBottom:8}}>Comments</h4>
                    {comments.length === 0 && <p style={{color:'#9ca3af'}}>No comments yet.</p>}
                    {comments.map((c) => {
                        const liked = c.likes && c.likes.includes(user._id);
                        return (
                        <div key={c._id} className="modal-comment-row" style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                            <img src={c.author?.profilepic} alt={c.author?.username} className="author-avatar" style={{width:24, height:24}} />
                            <span className="author-name" style={{marginLeft:8, marginRight:8, fontWeight: 500, fontSize: '0.95rem'}}>{c.author?.username}</span>
                            <span className="modal-comment-text">{c.text}</span>
                            <button
                                onClick={() => handleLikeComment(c._id)}
                                disabled={likingComments.has(c._id)}
                                style={{
                                    marginLeft: 12,
                                    background: 'none',
                                    border: 'none',
                                    cursor: likingComments.has(c._id) ? 'not-allowed' : 'pointer',
                                    color: liked ? '#f97316' : '#9ca3af',
                                    fontWeight: liked ? 700 : 400,
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: likingComments.has(c._id) ? 0.6 : 1,
                                }}
                                title={liked ? 'Unlike' : 'Like'}
                            >
                                <span role="img" aria-label="like">👍</span>
                                <span style={{ marginLeft: 4, fontSize: '0.95rem' }}>{c.likes?.length || 0}</span>
                            </button>
                        </div>
                    )})}
                </div>
                {/* Add comment box at the bottom */}
                <div style={{ padding: 16, paddingTop: 8 }}>
                  <CommentBox comment={comment} setComment={setComment} onAddComment={handleAddComment} />
                </div>
            </div>
        </div>
    );
};

const HomePageGamer = () => {
  const dispatch = useDispatch();
  const { posts, loading, error, page, hasMore } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const [modalPost, setModalPost] = useState(null);
  const [imageModalPost, setImageModalPost] = useState(null);
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

    // Listen for new posts
    socket.on('new_post', (newPost) => {
      dispatch(addPostRealtime(newPost));
    });

    // Listen for post likes
    socket.on('post_liked', (data) => {
      dispatch(updatePostLike(data));
    });

    // Listen for new comments
    socket.on('new_comment', (data) => {
      dispatch(addCommentRealtime(data));
    });

    // Listen for comment likes
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
      <CommentModal post={modalPost} open={!!modalPost} onClose={() => setModalPost(null)} onCommentAdded={handleCommentAdded} />
      <ImageCarouselModal post={imageModalPost} onClose={() => setImageModalPost(null)} />
    </div>
  );
};

// Add global CSS for Webkit scrollbar
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .modal-comments-section::-webkit-scrollbar {
      width: 8px;
    }
    .modal-comments-section::-webkit-scrollbar-thumb {
      background: #f97316;
      border-radius: 4px;
    }
    .modal-comments-section::-webkit-scrollbar-track {
      background: #23272f;
      border-radius: 4px;
    }
    
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

export default HomePageGamer;
