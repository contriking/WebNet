const { Server } = require("socket.io")
const http = require('http')
const express = require('express')

const app=express();
const server=http.createServer(app);


const io=new Server(server,{
    cors:{
        origin: ["http://localhost:5173"]
    }
})


const getReceiverSocketId=(userId)=>{
    return userSocketMap[userId]
}

// Store online users
const userSocketMap= {}; // {userId : socketId}

io.on("connection",(socket) =>{
    
    // Connect a user to the socket

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }

    // Send event to all the connected Users
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        // Disconnect a user from the socket
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

module.exports={ app, server , io , getReceiverSocketId }