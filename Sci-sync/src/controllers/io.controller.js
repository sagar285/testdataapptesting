
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const uuid = require('uuid').v4;
const crypto =require("crypto");
const ioModel = require("../models/io.model");

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })
const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
  region:'ap-south-1',
  credentials: {
    accessKeyId:'AKIAXDSGBYONW4CKXHOL',
    secretAccessKey:'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'
  }
})
// Function to upload file to AWS S3
const uploadFile =(fileBuffer, fileName, mimetype)=>{
  console.log(mimetype)
  const uploadParams = {
      Bucket: "dataappbucket",
      Body: fileBuffer,
      Key: fileName,
      ContentType: mimetype
    } 
return s3Client.send(new PutObjectCommand(uploadParams));
}
// user send survey data


exports.TextToImage = async(req,res)=>{
    const {surveyid,datatype,input}=req.body;
    console.log(req.body)
    try {
       const imageFile = req.files['image']?.[0];
     
    const imgname = imageFile && generateFileName()  
    await uploadFile(imageFile?.buffer, imgname, imageFile.mimetype);
    const  imgurl =`https://d2xw2of6hxx7fn.cloudfront.net/${imgname}`
        const newIo = await ioModel.create({userid:req.user._id,surveyid,input:input,output:imgname})    
        return res.status(200).send({newsurvey:true,message:"your entry succefully uploaded"});
    } catch (error) {
        console.log("error in text to image",error)
        res.status(500).send(error)
    }
}