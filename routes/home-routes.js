const express =require('express');
const authMiddleware=require('../middleware/auth-middleware')
const router = express.Router();

router.post('/welcome',authMiddleware,(req,res)=>{
    const {username,userId,role}=req.userInfo;
    res.json({
        message:"Welcome to the Home page",
        user:{
            _id:userId,
            username,
            role
        }
    })
})

module.exports=router;