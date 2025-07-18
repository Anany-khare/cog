import {Conversation} from "../models/conversation.model.js";
// import { getReceiverSocketId, io } from "../socket/socket.js";
import {Message} from "../models/message.model.js"

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage:message} = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        });
        // establish the conversation if not started yet.
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),newMessage.save()])

        return res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong while sending message.",
            success:false,
            error: error.message
        });
    }
}
export const getMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all: [senderId, receiverId]}
        }).populate('messages');
        if(!conversation) return res.status(200).json({success:true, messages:[]});

        return res.status(200).json({success:true, messages:conversation?.messages});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong while getting messages.",
            success:false,
            error: error.message
        });
    }
}