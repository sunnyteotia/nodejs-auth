
const jwt=require('jsonwebtoken');
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    console.log(authHeader);
    const token=authHeader && authHeader.split(' ')[1]
    if(!token){
        return res.status(401).json({
        success:false,
        message:"Access denied.No token Provided. Please login to continue"
        })
    }
    //decode the token
    try{
        const decoddedTokenInfo=jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decoddedTokenInfo);
        req.userInfo=decoddedTokenInfo
        next()
    }catch(e){
        return res.status(500).json({
        success:false,
        message:"Access denied. Invalid token"
        })
    }
}
module.exports = authMiddleware