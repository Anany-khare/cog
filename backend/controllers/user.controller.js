import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const register = async(req,res) =>{
    try {
        const {username,email,password,role} = req.body
        if(!username || !password || !email || !role){
            return res.status(401).json({
                message:"Something went wrong! Please check",
                success:false
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"Try different email",
                success:false
            })
        }
        const hashpassword = await bcrypt.hash(password,5)
        await User.create({
            username,
            email,
            password:hashpassword,
            role
        })
        return res.status(201).json({
            message:"Account created successfully!",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}
export const login = async(req,res) =>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(401).json({
                message:"Enter all details to Login", 
                success:false
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password",
                success:false
            })
        }
        let checkpassword=await bcrypt.compare(password,user.password)
        if(!checkpassword){
            return res.status(401).json({
                message:"Invalid email or password",
                success:false
            })
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
        // console.log('Generated Token:', token);
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilepic,
            tags: user.tags,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts.filter(post => post !== null), 
            role: user.role
        }
        
        // res.cookie('token', token, { sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 });
        res.cookie('token', token, { 
            httpOnly: true, 
            sameSite: 'strict', 
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
          });
          
          // Send the JSON response
          return res.json({
            message: `Hello ${user.username}, Welcome back!`,
            success: true,
            user
          });
          
    } catch(error){
        console.error(error);
        return res.status(500).json({
          message: "Something went wrong during login.",
          success: false,
          error: error.message
        });
    }
}
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};
export const logout = async (req, res) => {
    try {
      res.cookie('token', '', { httpOnly: true, sameSite: 'strict', maxAge: 0 }); // Clear the token cookie
      return res.json({ message: 'Logout successful', status: true });
    } catch (error) {
      return res.status(500).json({ message: 'Logout failed', status: false });
    }
  };
  

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { tags, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (tags) user.tags = tags;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
        const follower1 = req.id;
        const follower2 = req.params.id;
        if (follower1 === follower2) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(follower1);
        const targetUser = await User.findById(follower2);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.following.includes(follower2);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: follower1 }, { $pull: { following: follower2 } }),
                User.updateOne({ _id: follower2 }, { $pull: { followers: follower1 } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            await Promise.all([
                User.updateOne({ _id: follower1 }, { $push: { following: follower2 } }),
                User.updateOne({ _id: follower2 }, { $push: { followers: follower1 } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}