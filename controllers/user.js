
const Expuser=require(('../models/user'))
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');


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

function generateAccessToken(id,name){
    return jwt.sign({userId:id},'34hfn5736fnnieowr753845nfr56ygd348kjtfht795478thrfw578whhhr8')
    }

exports.existinguser=(req,res,next)=>{
        const {email,password}=req.body;
        if(email.length==0 || password.length==0){
            return res.status(400).json({err: "somethings missing"})
        }
        Expuser.findAll({where:{email:email}})
        .then((user)=>{
            if(user.length>0){
                if(user[0].password === password){
                    res.status(200).json({success: true, message:"Successfully logged in", token:generateAccessToken(User.id)})
                } else{
                    return res.status(401).json({success: false, message:"Password is incorrect"})
                }
            } else{
                return res.status(404).json({success: false, message:"User not exist"})
            }
        }).catch(err => {
            res.status(500).json({success: false, message: err})
        })
    }



