
const Expuser=require(('../models/user'))
const bcrypt=require('bcrypt')
//const jwt=require('jsonwebtoken')

exports.newuser=  (req,res,next)=>{
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;
    const {name,email,password}=req.body
if(name.length==0 || email.length==0 || password.length==0){
    return res.status(400).json({err: "somethings missing"})
}

bcrypt.hash(password,10,(err,hash)=>{
    Expuser.findAll({where:{email:email}})
    .then((user)=>{
       if(user.length>0){
          res.status(200).json({message:"User already exist"})
          }
       else{
           Expuser.create({
               name:name,
               email:email,
               password:hash,
           })
           .then(()=>{
               res.status(200).json({message:"User Created"})
           }).catch(err=>console.log(err))
       }
    })   
})
}



//function generateAccessToken(id,name){
//return jwt.sign({userId:id,name:name},process.env.TOKEN_SECRET)
//}