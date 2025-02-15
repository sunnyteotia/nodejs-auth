

const isAdminUser=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(402).json({
            success:false,
            message:"Access denied !Amdin rights required"
        })
    }
    next();
}
module.exports = isAdminUser