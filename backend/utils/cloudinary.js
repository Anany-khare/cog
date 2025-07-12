import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
<<<<<<< HEAD
dotenv.config({});
=======

dotenv.config();
>>>>>>> d997b8b (Initial commit: project ready for deployment)

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
<<<<<<< HEAD
    api_secret: process.env.API_SECRET
});
=======
    api_secret: process.env.API_SECRET,
    secure: true
});

>>>>>>> d997b8b (Initial commit: project ready for deployment)
export default cloudinary;