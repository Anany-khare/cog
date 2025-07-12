import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js"

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
<<<<<<< HEAD
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });
=======
        const imageFiles = req.files;
        const authorId = req.id;

        if (!caption && (!imageFiles || imageFiles.length === 0)) {
            return res.status(400).json({ message: "Post cannot be empty. Please provide a caption or an image." });
        }

        const postData = {
            author: authorId,
            caption: caption || '', // Ensure caption is not undefined
            image: [],
        };

        if (imageFiles && imageFiles.length > 0) {
            for (const file of imageFiles) {
                const optimizedImageBuffer = await sharp(file.buffer)
                    .resize({ width: 800, height: 800, fit: 'inside' })
                    .toFormat('jpeg', { quality: 80 })
                    .toBuffer();

                const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
                const cloudResponse = await cloudinary.uploader.upload(fileUri);
                postData.image.push(cloudResponse.secure_url);
            }
        }

        const post = await Post.create(postData);
        
        // Populate author details for the response
        const populatedPost = await Post.findById(post._id).populate({ path: 'author', select: 'username profilepic' });

        // Add comment count to the post
        const postWithCommentCount = populatedPost.toObject();
        postWithCommentCount.commentCount = 0; // New posts have 0 comments

        // Update user's post list
>>>>>>> d997b8b (Initial commit: project ready for deployment)
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

<<<<<<< HEAD
        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
=======
        // Emit Socket.IO event to all connected clients
            const io = req.app.get('io');
            if (io) {
            io.emit('new_post', postWithCommentCount);
        }

        return res.status(201).json({
            message: 'New post added',
            post: postWithCommentCount, // Send the populated post back
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            success: true,
        })

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        return res.status(500).json({
            message:"Something went wrong while adding new post.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}
export const getAllPost = async (req, res) => {
    try {
<<<<<<< HEAD
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
=======
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: 'author', select: 'username profilepic' })
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
<<<<<<< HEAD
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error);
=======
                    select: 'username profilepic'
                }
            });
        
        // Add comment count to each post
        const postsWithCommentCount = posts.map(post => {
            const postObj = post.toObject();
            postObj.commentCount = post.comments ? post.comments.length : 0;
            return postObj;
        });

        return res.status(200).json({
            posts: postsWithCommentCount,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong while getting all posts.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
};
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
<<<<<<< HEAD
            select: 'username, profilePicture'
=======
            select: 'username, profilepic'
>>>>>>> d997b8b (Initial commit: project ready for deployment)
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
<<<<<<< HEAD
                select: 'username, profilePicture'
=======
                select: 'username, profilepic'
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            }
        });
        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
<<<<<<< HEAD
        console.log(error);
    }
}
export const likePost = async (req, res) => {
    try {
        const likedid = req.id;
        const postId = req.params.id; 
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $addToSet: { likes: likedid } });
        await post.save();

        // implement socket io for real time notification
        // const user = await User.findById(likedid).select('username profilePicture');
         
        // const postOwnerId = post.author.toString();
        // if(postOwnerId !== likedid){
        //     // emit a notification event
        //     const notification = {
        //         type:'like',
        //         userId:likedid,
        //         userDetails:user,
        //         postId,
        //         message:'Your post was liked'
        //     }
        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        //     io.to(postOwnerSocketId).emit('notification', notification);
        // }

        return res.status(200).json({message:'Post liked', success:true});

    } catch (error) {

    }
}

export const dislikePost = async (req, res) => {
    try {
        const disliker = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // like logic started
        await post.updateOne({ $pull: { likes: disliker } });
        await post.save();

        // implement socket io for real time notification
        // const user = await User.findById(disliker).select('username profilePicture');
        // const postOwnerId = post.author.toString();
        // if(postOwnerId !== disliker){
            // emit a notification event
        //     const notification = {
        //         type:'dislike',
        //         userId:disliker,
        //         userDetails:user,
        //         postId,
        //         message:'Your post was liked'
        //     }
        //     const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        //     io.to(postOwnerSocketId).emit('notification', notification);
        // }



        return res.status(200).json({message:'Post disliked', success:true});
    } catch (error) {

    }
}
=======
        return res.status(500).json({
            message:"Something went wrong while getting user posts.",
            success:false,
            error: error.message
        });
    }
}
export const toggleLike = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found', success: false });
        }

        let liked;
        if (post.likes.includes(userId)) {
            // Dislike
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            liked = false;
        } else {
            // Like
            await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } });
            liked = true;
        }

        // Get updated post with populated author
        const updatedPost = await Post.findById(postId).populate({ path: 'author', select: 'username profilepic' });

        // Add comment count to the updated post
        const postWithCommentCount = updatedPost.toObject();
        postWithCommentCount.commentCount = updatedPost.comments ? updatedPost.comments.length : 0;

        // Emit Socket.IO event to all connected clients
        const io = req.app.get('io');
        if (io) {
            io.emit('post_liked', { postId, post: postWithCommentCount, liked });
        }

        return res.status(200).json({ message: liked ? 'Post liked' : 'Post disliked', success: true });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while toggling like.",
            success: false,
            error: error.message
        });
    }
};
>>>>>>> d997b8b (Initial commit: project ready for deployment)

export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentUserid = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required', success:false});

        const comment = await Comment.create({
            text,
            author:commentUserid,
            post:postId
        })

<<<<<<< HEAD
        

        await comment.populate({
            path:'author',
            select:"username profilePicture"
=======
        await comment.populate({
            path:'author',
            select:"username profilepic"
>>>>>>> d997b8b (Initial commit: project ready for deployment)
        });
        
        post.comments.push(comment._id);
        await post.save();

<<<<<<< HEAD
=======
        // Emit Socket.IO event to all connected clients
        const io = req.app.get('io');
        if (io) {
            io.emit('new_comment', { postId, comment });
        }

>>>>>>> d997b8b (Initial commit: project ready for deployment)
        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        return res.status(500).json({
            message:"Something went wrong while adding comment.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}
export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;

<<<<<<< HEAD
        const comments = await Comment.find({post:postId}).populate('author', 'username profilePicture');
=======
        const comments = await Comment.find({post:postId}).populate('author', 'username profilepic');
>>>>>>> d997b8b (Initial commit: project ready for deployment)

        if(!comments) return res.status(404).json({message:'No comments found for this post', success:false});

        return res.status(200).json({success:true,comments});

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        return res.status(500).json({
            message:"Something went wrong while getting comments of post.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}
export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        // check if the logged-in user is the owner of the post
        if(post.author.toString() !== authorId) return res.status(403).json({message:'Unauthorized'});

        // delete post
        await Post.findByIdAndDelete(postId);

        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            success:true,
            message:'Post deleted'
        })

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        return res.status(500).json({
            message:"Something went wrong while deleting post.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}
export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            // bookmark 
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        return res.status(500).json({
            message:"Something went wrong while bookmarking post.",
            success:false,
            error: error.message
        });
    }
}
export const toggleLikeComment = async (req, res) => {
    try {
        const userId = req.id;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found', success: false });
        }
        let liked;
        if (comment.likes.includes(userId)) {
            // Unlike
            await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
            liked = false;
        } else {
            // Like
            await Comment.findByIdAndUpdate(commentId, { $addToSet: { likes: userId } });
            liked = true;
        }

        // Get updated comment with populated author
        const updatedComment = await Comment.findById(commentId).populate({
            path: 'author',
            select: 'username profilepic'
        });

        // Emit Socket.IO event to all connected clients
            const io = req.app.get('io');
            if (io) {
            io.emit('comment_liked', { commentId, comment: updatedComment, liked });
        }

        return res.status(200).json({ message: liked ? 'Comment liked' : 'Comment unliked', success: true, liked });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while toggling like on comment.",
            success: false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}