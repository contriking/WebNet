const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const { generateToken }=require('../lib/util.js');
const cloudinary= require('../lib/cloudinary.js');

const signup=async (req,res)=>{
    // res.send('signup route');
    try {
        const {fullName,email,password}=req.body;
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required."});
        }
        if(password.length < 6 ){
            return res.status(400).json({message: "Password must be at least 6 characters."});
        }

        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message : "Email already exists."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser=new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(!newUser){
            res.status(400).json({message: "Invaild user data."});
        }
        // generate jwt token
        generateToken(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName: newUser.fullName,
            email : newUser.email,
            profilePic : newUser.profilePic,
        });
    } catch (error) {
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: "Internal server error."})
    }
}

const login=async(req,res)=>{
    // res.send('login route');
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials."})
        }
        const isPasswordCorrect= await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials."})
        }

        generateToken(user._id,res);


        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email : user.email,
            profilePic : user.profilePic,
            createdAt: user.createdAt,
        })
    } catch (error) {
        console.log("Error in login controller.",error.message);
        return res.status(500).json({message: "Internal server Error."})
    }
}

const logout=(req,res)=>{
    // res.send('logout route');
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully."});
    } catch (error) {
        console.log("Error in logout controller.",error.message);
        return res.status(500).json({message: "Internal server error."})
    }
}

const updateProfile=async (req,res)=>{
    try {
        const { profilePic } = req.body; 
        const userId=req.userId;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"});
        }
        const user=await User.findById(userId);
        if(user.profilePic){
            const url = user.profilePic;
            const parts = url.split('/');
            let lastPart = parts[parts.length - 1];

            // Remove the .jpg extension
            const public_ID = lastPart.split('.').slice(0, -1).join('.');
            
            cloudinary.uploader.destroy(public_ID);
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        ).select('-password')

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in upload profile:",error);
        res.status(500).json({message: "Internal server error."});
    }
}

const checkAuth = async (req, res) => {
    
    try {
        const userId=req.userId;
        const user=await User.findById(userId).select('-password');
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports={
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
}