import jwt from "jsonwebtoken";
<<<<<<< HEAD
const isAuthenticated = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:'Invalid',
                success:false
            });
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
=======
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid',
                success: false
            });
        }
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false
            });
        }
        req.user = user;
        req.id = user._id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Authentication failed',
            success: false
        });
>>>>>>> d997b8b (Initial commit: project ready for deployment)
    }
}
export default isAuthenticated;