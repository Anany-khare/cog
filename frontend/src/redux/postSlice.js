import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const fetchAllPosts = createAsyncThunk(
    'post/fetchAllPosts',
    async () => {
        const response = await API.get('/api/v1/post/all');
        return response.data.posts;
    }
);

export const addNewPost = createAsyncThunk(
    'post/addNewPost',
    async (formData) => {
        const response = await API.post('/api/v1/post/addpost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.post;
    }
);

export const fetchPostsPage = createAsyncThunk(
    'post/fetchPostsPage',
    async ({ page = 1, limit = 10 }) => {
        const response = await API.get(`/api/v1/post/all?page=${page}&limit=${limit}`);
        return response.data;
    }
);

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        loading: false,
        error: null,
        page: 1,
        totalPages: 1,
        hasMore: true,
    },
    reducers: {
        addPostRealtime: (state, action) => {
            // Check if post already exists to prevent duplicates
            const postExists = state.posts.some(post => post._id === action.payload._id);
            if (!postExists) {
                // Add new post to the beginning of the array
            state.posts.unshift(action.payload);
            }
        },
        updatePostRealtime: (state, action) => {
            const { postId, updates } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
            }
        },
        updatePostLike: (state, action) => {
            const { postId, post } = action.payload;
            const postIndex = state.posts.findIndex(p => p._id === postId);
            if (postIndex !== -1) {
                state.posts[postIndex] = post;
            }
        },
        addCommentRealtime: (state, action) => {
            const { postId, comment } = action.payload;
            const postIndex = state.posts.findIndex(post => post._id === postId);
            if (postIndex !== -1) {
                if (!state.posts[postIndex].comments) {
                    state.posts[postIndex].comments = [];
                }
                state.posts[postIndex].comments.unshift(comment);
                // Update the comment count
                state.posts[postIndex].commentCount = (state.posts[postIndex].commentCount || 0) + 1;
            }
        },
        updateCommentLike: (state, action) => {
            const { commentId, comment } = action.payload;
            // Find the comment in any post and update it
            state.posts.forEach(post => {
                if (post.comments) {
                    const commentIndex = post.comments.findIndex(c => c._id === commentId);
                    if (commentIndex !== -1) {
                        post.comments[commentIndex] = comment;
                    }
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchPostsPage.pending, (state, action) => {
                // Only set loading to true for the first page
                if (action.meta.arg.page === 1) {
                    state.loading = true;
                }
                state.error = null;
            })
            .addCase(fetchPostsPage.fulfilled, (state, action) => {
                state.loading = false;
                const { posts, page, totalPages } = action.payload;
                state.page = page;
                state.totalPages = totalPages;
                state.hasMore = page < totalPages;
                if (page === 1) {
                    state.posts = posts;
                } else {
                    // Append new posts, avoid duplicates
                    const existingIds = new Set(state.posts.map(p => p._id));
                    const newPosts = posts.filter(p => !existingIds.has(p._id));
                    state.posts = [...state.posts, ...newPosts];
                }
            })
            .addCase(fetchPostsPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Don't add the post here - let Socket.IO handle it
                // This prevents duplicates when the same post is added via API and Socket.IO
            })
            .addCase(addNewPost.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});

export const { addPostRealtime, updatePostRealtime, updatePostLike, addCommentRealtime, updateCommentLike } = postSlice.actions;
export default postSlice.reducer; 