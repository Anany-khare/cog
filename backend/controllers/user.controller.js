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
<<<<<<< HEAD
        const hashpassword = await bcrypt.hash(password,5)
        await User.create({
            username,
            email,
            password:hashpassword,
=======
        await User.create({
            username,
            email,
            password,
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            role
        })
        return res.status(201).json({
            message:"Account created successfully!",
            success:true
        })
    } catch (error) {
<<<<<<< HEAD
        console.log(error)
=======
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong during registration.",
            success:false,
            error: error.message
        })
>>>>>>> d997b8b (Initial commit: project ready for deployment)
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
<<<<<<< HEAD
        let checkpassword=await bcrypt.compare(password,user.password)
        if(!checkpassword){
=======
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            return res.status(401).json({
                message:"Invalid email or password",
                success:false
            })
        }
        const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
<<<<<<< HEAD
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
=======
        
        // Return complete user data including all profile fields
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            role: user.role,
            followers: user.followers,
            following: user.following,
            bio: user.bio,
            location: user.location,
            dob: user.dob,
            phone: user.phone,
            discord: user.discord,
            twitch: user.twitch,
            youtube: user.youtube,
            instagram: user.instagram,
            website: user.website,
            valorantRank: user.valorantRank,
            bgmiRank: user.bgmiRank,
            codRank: user.codRank,
            gender: user.gender,
            tags: user.tags,
            gameDetails: user.gameDetails,
        };

        return res.status(200).cookie("token",token,{httpOnly:true, sameSite:"lax"}).json({
            message:`Hello ${user.username}, Welcome back!`,
            success:true,
            user: userResponse,
            token: token // Include token in response for localStorage
        })
>>>>>>> d997b8b (Initial commit: project ready for deployment)
          
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
<<<<<<< HEAD
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
=======
        const userId = req.params.id || req.id; // Use params.id if provided, otherwise use req.id (current user)
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }
        
>>>>>>> d997b8b (Initial commit: project ready for deployment)
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
<<<<<<< HEAD
=======
        return res.status(500).json({
            message:"Something went wrong while getting profile.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
};
export const logout = async (req, res) => {
    try {
<<<<<<< HEAD
      res.cookie('token', '', { httpOnly: true, sameSite: 'strict', maxAge: 0 }); // Clear the token cookie
=======
      res.cookie('token', '', { httpOnly: true, sameSite: 'lax', maxAge: 0 }); // Clear the token cookie
      res.cookie('user', '', { httpOnly: false, sameSite: 'lax', maxAge: 0 }); // Clear the user cookie
>>>>>>> d997b8b (Initial commit: project ready for deployment)
      return res.json({ message: 'Logout successful', status: true });
    } catch (error) {
      return res.status(500).json({ message: 'Logout failed', status: false });
    }
  };
  

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
<<<<<<< HEAD
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
=======
        const {
          tags, gender, bio, location, dob, discord, twitch, youtube, instagram, website,
          valorantRank, bgmiRank, codRank, phone, gameDetails, username, email
        } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        // Find user
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Only update fields if present
        if (tags !== undefined) user.tags = tags;
        if (gender !== undefined) user.gender = gender;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (dob !== undefined) user.dob = dob;
        if (discord !== undefined) user.discord = discord;
        if (twitch !== undefined) user.twitch = twitch;
        if (youtube !== undefined) user.youtube = youtube;
        if (instagram !== undefined) user.instagram = instagram;
        if (website !== undefined) user.website = website;
        if (valorantRank !== undefined) user.valorantRank = valorantRank;
        if (bgmiRank !== undefined) user.bgmiRank = bgmiRank;
        if (codRank !== undefined) user.codRank = codRank;
        if (phone !== undefined) user.phone = phone;
        if (gameDetails !== undefined) user.gameDetails = gameDetails;
        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;

        // Handle profile picture upload
        if (profilePicture) {
          console.log('Profile picture received:', profilePicture.originalname, profilePicture.size);
          try {
            const fileUri = getDataUri(profilePicture);
            console.log('File URI generated, uploading to Cloudinary...');
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            console.log('Cloudinary upload successful:', cloudResponse.secure_url);
            user.profilepic = cloudResponse.secure_url;
          } catch (err) {
            console.log('Cloudinary upload error:', err);
            console.log('Error details:', err.message, err.stack);
            return res.status(500).json({
              message: 'Failed to upload profile picture.',
              success: false,
              error: err.message
            });
          }
        } else {
          console.log('No profile picture provided in request');
        }
>>>>>>> d997b8b (Initial commit: project ready for deployment)

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
<<<<<<< HEAD
        console.log(error);
=======
        console.log('--- editProfile ERROR ---');
        console.log(error);
        if (error && error.stack) console.log(error.stack);
        return res.status(500).json({
            message:"Something went wrong during profile edit.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
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
<<<<<<< HEAD
=======
        return res.status(500).json({
            message:"Something went wrong while getting suggested users.",
            success:false,
            error: error.message
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
};
export const followOrUnfollow = async (req, res) => {
    try {
<<<<<<< HEAD
        const follower1 = req.id;
        const follower2 = req.params.id;
        if (follower1 === follower2) {
=======
        const currentUserId = req.id;
        const targetUserId = req.params.id;
        if (currentUserId === targetUserId) {
>>>>>>> d997b8b (Initial commit: project ready for deployment)
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

<<<<<<< HEAD
        const user = await User.findById(follower1);
        const targetUser = await User.findById(follower2);
=======
        const user = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);
>>>>>>> d997b8b (Initial commit: project ready for deployment)

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

<<<<<<< HEAD
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
=======
        let isFollowing;
        if (user.following.includes(targetUserId)) {
            // Unfollow
            await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
            isFollowing = false;
        } else {
            // Follow
            await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
            await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
            isFollowing = true;
        }

        return res.status(200).json({
            message: isFollowing ? 'User followed successfully' : 'User unfollowed successfully',
            success: true,
            isFollowing
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong while following/unfollowing.",
            success: false,
            error: error.message
        });
    }
};
>>>>>>> d997b8b (Initial commit: project ready for deployment)
