const express = require('express');
const protectRoute=require('../middleware/auth.js');

const {signup,login,logout,updateProfile,checkAuth}=require('../controllers/auth.js')

const router=express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)

router.put('/update-profile',protectRoute,updateProfile);

router.get('/check',protectRoute,checkAuth);
 
module.exports=router