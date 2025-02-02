const userdb = require("../models/profile.model");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/sendToken");

const {handleOtpProcess} = require('../utils/generateRoute');
const { OAuth2Client } = require("google-auth-library");

// Register User
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { email,token } = req.body;
  const user = await userdb.findOne({ email });
  if (user) {
    try {
      res.status(200).json({ userexist: true, user });
    } catch (error) {
      console.error("Registration Error: ", error);
      res.status(500).json({ message: "Error processing request" });
    }
  } else {
    try {
      const newUser = await userdb.create({ email,token });
      res.status(200).json({ userexist: false, user: newUser });
    } catch (error) {
      console.error("Registration Error: ", error);
      res.status(500).json({ message: "User registration failed" });
    }
  }
});

exports.userProfileUpdate = catchAsyncErrors(async (req, res) => {

  const { firstName,lastName,email,phoneNumber,language,location} = req.body;
  try {
  const user = await userdb.findByIdAndUpdate(req.user._id,{
     firstName,lastName,email,phoneNumber,language,location
  },{new:true});
  console.log(user)
  res.status(200).json({
    message:"User Profile Updated Successfuly",
    user
  })

} catch (error) {
    console.log("User Update Error",error)
    return  res.status(200).json({
      message:error.message,
    })
}

});




const client = new OAuth2Client("668217070920-5sl8ehi20uqruvqgbf797r2big80c30k.apps.googleusercontent.com");


exports.registerUserGoogle = catchAsyncErrors(async (req, res) => {
  const { token } = req.body; // Token received from the client (front-end)
  // Verify the Google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:"668217070920-5sl8ehi20uqruvqgbf797r2big80c30k.apps.googleusercontent.com",
  });

  const { name, email } = ticket.getPayload();

  // Check if the user already exists in your database

  // let user = await User.findOne({ email }); --- i think this is mistake that's why i comment 
  let user = await userdb.findOne({ email });

  if (!user) {
    // If user does not exist, create a new user
    user = new userdb({
      name,
      email,
    });
    await user.save();
  }

  // Return response
 sendToken(user,201,res)
});
// Resend OTP
exports.resendOTP = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;
  const user = await userdb.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }  
  try {
    await handleOtpProcess(email,res);
    res.status(200).json({ message: "OTP has been resent" });
  } catch (error) {
    console.error("OTP Resend Error: ", error);
    res.status(500).json({ message: "Error resending OTP" });
  }
});

// Verify OTP
exports.verifyOTP = catchAsyncErrors(async (req, res) => {
  const { email, otp } = req.body;
  console.log(email,otp)
  const user = await userdb.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isOtpValid = user.otp === otp && user.otpExpiry > new Date();

  if (!isOtpValid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await userdb.updateOne({ email }, { otp: null, otpExpiry: null });
  sendToken(user, 200, res);
});

exports.verifyUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    message:"User Exists",
    user:req.user
  })
})