const express = require('express');
const protectRoute = require('../middleware/auth');

const {getUsers,getMessages,sendMessage} = require('../controllers/message.js')


const router= express.Router();


router.get('/users',protectRoute,getUsers);
router.get('/:id',protectRoute,getMessages);
router.post('/send/:id',protectRoute,sendMessage);

module.exports=router;