const AWS=require('aws-sdk');

const uploadToS3=(data,filename)=>{

    let s3bucket=new AWS.S3({
      accessKeyId:process.env.IAM_USER_KEY,
      secretAccessKey:process.env.IAM_USER_SECRET,
    })

    var params={
      Bucket:process.env.S3_BUCKET_NAME,
      Key:filename,
      Body:data,
      ACL:'public-read'
    }

  return new Promise((resolve,reject)=>{

    s3bucket.upload(params,(err,response)=>{ 
      if(err){
        console.log('Error :',err);
        reject(err);
      }
      else{
        console.log('success',response);
       resolve(response.Location);

      }
    })
  })
  }

module.exports={
    uploadToS3
  }