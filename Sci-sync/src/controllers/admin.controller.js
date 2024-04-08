const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const adminModel = require("../models/admin.model");
const sendToken = require("../utils/sendToken");
const bcrypt =require("bcrypt")


// registration api for admin
exports.adminRegistration = catchAsyncErrors(async(req,res)=>{
    const {name,email,password}=req.body;
    const admin = await adminModel.findOne({email});
    if(admin){
        try {
            res.status(200).json({adminexist:true,admin});
        } catch (error) {
           console.log("Error in admin registration",error)
           res.status(500).json({message:"Error processing request"}) 
        }
    }
    else{
        try {
            const hashedpassword = await bcrypt.hash(password,10)
        const newadmin = await adminModel.create({email,password:hashedpassword,name})
        res.status(200).json({adminexist:false,admin:newadmin})
        } catch (error) {
            console.error("Admin Registration Error",error)
            res.status(500).json({message:"Admin registration failed"})
        } 
    }
})

exports.adminLogin =catchAsyncErrors(async(req,res)=>{
    const {email,password} =req.body;
    const admin = await adminModel.findOne({email})
    try {
        if(admin){
            const passwordVerify =  bcrypt.compare(password,admin.password)
            if(passwordVerify){
                sendToken(admin,200,res)
            }
            else{
                res.status(401).json({message: "Invalid email or password"})
            }
        }
    } catch (error) {
        console.log("Login Admin Error",error)
        res.status(500).json({message:"Error in login"})
    }
})

exports.adminStatusUpdate =catchAsyncErrors(async(req,res)=>{

    const {status,id} = req.body;
    if(req.user.issuperadmin){
        try {
            const  adminstatusupdate = await adminModel.findByIdAndUpdate({_id:id},{Approve:status},{new:true})
            res.status(200).send({message:"Status Updated Successfully",data:adminstatusupdate})
        } catch (error) {
            console.log("Error in status update",error)
            res.status(500).json({message:"Error in updating admin status"})
        }
    }
    else{
        res.status(401).json({message:"This resource not accessed publicly"})
    }
  
})

// superadmin get all admin signup request who has not admin 
exports.getalladminrequest =catchAsyncErrors(async(req,res)=>{
        console.log("request aayi h")
        try {
        const adminrequest = await adminModel.find({Approve:false});
        console.log("request yhan tk aayi h")
        res.status(200).json({request:adminrequest})
    } catch (error) {
        console.log("error in getting all request",error)
        res.status(500).json({message:error.message})
    }
})




