const jwt=require('jsonwebtoken');
const User=require('../models/user');

const protectRoute= async(req,res,next)=>{
    try {
        const token= req.cookies.jwt;
        if(!token){
            return res.status(401).json({message: "Unauthorized User"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(401).json({message: "Unauthorized User"});
        }
        const user=User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found."})
        }
        req.userId=decoded.userId;
        next();

    } catch (error) {
        console.log("Error in protected middleware.",error.message);
        return res.status(500).json({message: "Protected error server error."});
    }
}

module.exports=protectRoute