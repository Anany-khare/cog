import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import API from '../api';

const PostCard = ({ post, onCommentClick, onImageClick, onCommentAdded }) => {
    const { user } = useSelector((state) => state.auth);
    const [currentImage, setCurrentImage] = useState(0);
    const [liking, setLiking] = useState(false);
    const images = Array.isArray(post.image) ? post.image : (post.image ? [post.image] : []);
    const liked = post.likes && post.likes.includes(user._id);
    const likeCount = post.likes ? post.likes.length : 0;

    const handleLike = async () => {
        if (liking) return; // Prevent multiple clicks
        setLiking(true);
        try {
            await API.post(`/api/v1/post/${post._id}/togglelike`);
            // No need to update local state - Socket.IO will handle it
        } catch (e) {
            console.error('Error liking post:', e);
        } finally {
            setLiking(false);
        }
    };

    const showPrev = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const showNext = (e) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="post-card"
            style={{
                background: '#181c23',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflowY: 'auto',
            }}
        >
            <div className="post-header" style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                <img src={post.author?.profilepic} alt={post.author?.username} className="author-avatar" style={{width: 40, height: 40, borderRadius: '50%', marginRight: '12px'}} />
                <div>
                    <div className="author-name" style={{fontWeight: 600, fontSize: '1rem', color: '#f8fafc'}}>{post.author?.username}</div>
                    <div className="post-time" style={{fontSize: '0.875rem', color: '#64748b'}}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
            </div>
            
            {post.caption && (
                <div className="post-content" style={{marginBottom: '1rem'}}>
                    <p className="post-caption" style={{color: '#f1f5f9', lineHeight: '1.6', fontSize: '1rem'}}>{post.caption}</p>
                </div>
            )}
            
            {images.length > 0 && (
                <div className="post-images" style={{marginBottom: '1rem', position: 'relative'}}>
                    <div className="image-carousel" style={{position: 'relative', borderRadius: '8px', overflow: 'visible', display: 'flex', alignItems: 'center'}}>
                        {images.length > 1 && (
                            <button onClick={showPrev} className="carousel-nav-btn" style={{position: 'absolute', left: '10px', zIndex: 10}}>&lt;</button>
                        )}
                        <div className="post-image-container" onClick={onImageClick} style={{flex: 1}}>
                            <img 
                                src={images[currentImage]} 
                                alt={`Post ${currentImage+1}`}
                                className="post-image"
                            />
                            {images.length > 1 && (
                                <div className="carousel-dots">
                                    {images.map((_, idx) => (
                                        <span key={idx} className={`carousel-dot ${idx === currentImage ? 'active' : ''}`}></span>
                                    ))}
                                </div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <button onClick={showNext} className="carousel-nav-btn" style={{position: 'absolute', right: '10px', zIndex: 10}}>&gt;</button>
                        )}
                    </div>
                </div>
            )}
            <div className="post-actions" style={{display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: 8}}>
                <button
                    className={`like-btn${liked ? ' liked' : ''}`}
                    onClick={handleLike}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: liked ? '#f97316' : '#9ca3af',
                        fontWeight: liked ? 700 : 400,
                        fontSize: '1.1rem',
                    }}
                    title={liked ? 'Unlike' : 'Like'}
                >
                    <span role="img" aria-label="like" style={{ color: liked ? '#f97316' : '#9ca3af' }}>👍</span>
                    <span style={{ marginLeft: 4 }}>{likeCount}</span>
                </button>
                <button className="comment-btn" onClick={onCommentClick}>
                    <span role="img" aria-label="comment">💬</span> {post.comments?.length || 0}
                </button>
            </div>
        </motion.div>
    );
};

export default PostCard; 