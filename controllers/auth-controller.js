const User=require('../models/User')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
//register controller
const registerUser=async(req,res)=>{
    try{
        //extract user information from our request body
        const {username,email,password,role}=req.body;
        //check if the user is already exists in our database
        const checkExistingUser=await User.findOne({$or:[{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists! Either with same username or email.Please try with a different username or email"
            })
        }
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //create a new user and save in your database
        const newlyCreatedUser=new User({username,email,password:hashedPassword,role:role||'user'});
        await newlyCreatedUser.save();
        if(newlyCreatedUser){
            res.status(201).json({
                success: true,
                message: "User registered successfully",
            })
        }else{
            res.status(500).json({
                success: false,
                message: "Failed to register user. Please try again"
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}


//login controller

const loginUser=async(req,res)=>{
    try{
        const {username,password} = req.body;
        //find if the current user is exists in database or not
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found! Please check the username"
            })
        }
        //if the password is correct or not
        const isPasswordMatch=await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Incorrect password! Please try again"
            })
        }
        //generate a token for the user---bearer token
        const accessToken=jwt.sign({
            userId:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn: "30m"
        })
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            accessToken
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
    }
}
const changePassword=async(req,res)=>{
    try{
      const userId=req.userInfo.userId
      //extract old and new password
      const {oldPassword,newPassword} =req.body;
      //find the current user in the database
      const user=await User.findById(userId);
      if(!user){
        return res.status(400).json({
            success: false,
            message: "User not found! Please check the user id"
        })
      }
      //compare the old password with the hashed password in the database
      const isOldPasswordMatch=await bcrypt.compare(oldPassword,user.password);
      if(!isOldPasswordMatch){
        return res.status(400).json({
            success: false,
            message: "Incorrect old password! Please try again"
        })
      }
      //hash the new password
      const salt=await bcrypt.genSalt(10);
      const hashedNewPassword=await bcrypt.hash(newPassword,salt);
      //update the password in the database
      user.password=hashedNewPassword;
      await user.save(); 
      res.status(200).json({
        success: true,
        message: "Password changed successfully"
      })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Something went wrong! Please try again"
        })
        
    }
}
// const searchUser = async(req, res) => {
//     const username=req.body;
//     const checkExistingUser=await User.findOne({username});
//     if(!checkExistingUser){
//         return res.status(400).json({
//             success: false,
//             message: "User not found! Please check the username"
//         })
//     }
//     res.status(200).json({
//         success: true,
//         message: "User found successfully",
//         data: checkExistingUser
//     })
// }
module.exports={loginUser, registerUser,changePassword};