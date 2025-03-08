const express =require('express');
require('dotenv').config();
const connectDB=require('./lib/db.js');
const authRoute= require('./routes/auth.js');
const messageRoute= require('./routes/message.js');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const { app, server} = require('./lib/socket.js');
const path=require('path')


const PORT=process.env.PORT;
// const app=express();
const dirname=path.resolve();

app.use(express.urlencoded({limit: '10mb',extended: true}));
app.use(express.json({ limit: '10mb'}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use('/api/auth',authRoute);
app.use('/api/messages',messageRoute);

app.use(express.static(path.join(__dirname,"../../client/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../../client","dist","index.html"))
})


server.listen(PORT || 5000,()=>{
    connectDB().then(()=>{
        console.log(`server running at port ${PORT}`);
    })
})