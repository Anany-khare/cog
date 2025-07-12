import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    profilepic:{type:String,default:''},
    role:{type:String,required:true, enum:['gamer', 'host', 'org']},
    tags:{type:String,default:''},
    gender:{type:String,enum:['male','female','other']},
    followers:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId , ref:"User"}],
    posts:[{type:mongoose.Schema.Types.ObjectId , ref:"Post"}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId , ref:"Post"}],
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    dob: { type: String, default: '' },
    discord: { type: String, default: '' },
    twitch: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    valorantRank: { type: String, default: '' },
    bgmiRank: { type: String, default: '' },
    codRank: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    gameDetails: { type: String, default: '' },
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

export const User = mongoose.model('User',userSchema)