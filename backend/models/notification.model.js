import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['recruitment', 'like', 'comment', 'follow'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    recruitmentDetails: {
        game: String,
        position: String,
        requirements: String,
        contactInfo: String
    }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema); 