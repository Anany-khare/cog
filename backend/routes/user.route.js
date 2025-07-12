import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/me').get(isAuthenticated, (req, res) => {
  req.params.id = req.user._id;
  return getProfile(req, res);
});
router.route('/profile/:id').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePhoto'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);

// Test endpoint to check authentication
router.route('/test-auth').get(isAuthenticated, (req, res) => {
    res.json({
        message: 'User is authenticated',
        user: {
            id: req.user._id,
            username: req.user.username,
            role: req.user.role
        },
        success: true
    });
});

export default router;