const User = require('../models/user');
const Message = require('../models/message');
const cloudinary = require('../lib/cloudinary');
const { decodeToken } = require('../lib/util.js');
const { getReceiverSocketId , io } = require('../lib/socket.js');

const getUsers=async(req,res)=>{
    try {
        const loggedUserId=req.userId;
        const findUsers=await User.find({_id: {$ne: loggedUserId}}).select('-password');
        res.status(200).json(findUsers);
    } catch (error) {
        res.status(500).json({error : "Internal server error."});
    }
}

const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId} = req.params;
        const myId= req.userId;

        const message= await  Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId},
                {senderId:userToChatId , receiverId:myId}
            ]
        })

        res.status(200).json(message);

    } catch (error) {
        res.status(500).json({error: "Internal server error."});
    }
}

const sendMessage=async(req,res)=>{
    try {
        const {text, image} = req.body;
        const { id:receiverId}= req.params;
        const senderId= req.userId;

        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse= await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        
        const receiverSocketId= getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({error: "Interval server error."})
    }
}

module.exports={
    getUsers,
    getMessages,
    sendMessage,
}