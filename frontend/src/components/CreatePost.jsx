import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost, fetchAllPosts } from '../redux/postSlice';
import './../assets/CreatePost.css';
import { motion } from 'framer-motion';

const CreatePost = () => {
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption && images.length === 0) return;
        const formData = new FormData();
        formData.append('caption', caption);
        images.forEach((img, idx) => formData.append('images', img));
        
        try {
            await dispatch(addNewPost(formData)).unwrap();
            // No need to manually refresh - Socket.IO will handle real-time updates
        setCaption('');
        setImages([]);
        setPreviews([]);
        if(e.target.reset) e.target.reset();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <motion.div 
            className="create-post-card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <img src={user?.profilepic} alt="Your avatar" className="create-post-avatar"/>
            <form onSubmit={handleSubmit} className="create-post-form">
                <textarea
                    className="create-post-textarea"
                    placeholder={`What's on your mind, ${user?.username}?`}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                {previews.length > 0 && (
                    <div className="image-preview-container">
                        {previews.map((src, idx) => (
                            <div key={idx} className="image-preview-wrapper">
                                <img src={src} alt={`Preview ${idx+1}`} className="image-preview" />
                                <button type="button" className="remove-image-btn" onClick={() => {
                                    setPreviews(previews.filter((_, i) => i !== idx));
                                    setImages(images.filter((_, i) => i !== idx));
                                }}>&times;</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="create-post-actions">
                    <label htmlFor="file-upload" className="file-upload-label">
                        Add Images
                    </label>
                    <input id="file-upload" type="file" accept="image/*" multiple onChange={handleImageChange} />
                    <button type="submit" className="create-post-button">Post</button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreatePost; 