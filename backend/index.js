import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import connectDB from './utils/db.js'
dotenv.config({})

const PORT = process.env.PORT ||  5000
const app = express()
app.get('/',(_,res)=>{
    return res.status(200).json({
        Message:"Backend connected Successfully",
        sucess: true
    })
})
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))


app.use("/api/v1/user",userRoute)
app.use("/api/v1/message",messageRoute)
app.use("/api/v1/post",postRoute)


app.listen(PORT, () => {
    console.log(`Server at port ${PORT}`);  
    connectDB()
})