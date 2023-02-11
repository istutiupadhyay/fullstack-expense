const jwt=require('jsonwebtoken');
const Expuser=require('../models/user');


const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization')
       
        const user=jwt.verify(token,'34hfn5736fnnieowr753845nfr56ygd348kjtfht795478thrfw578whhhr8');
       
        Expuser.findByPk(user.userId).then(user=>{
    
            req.user=user;
            next()
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
        }
}
module.exports={
    authenticate
}