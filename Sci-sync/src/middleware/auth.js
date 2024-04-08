// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/profile.model"); // Adjust the path as per your project structure
const adminModel = require("../models/admin.model");

exports.isAuthenticated = async (req, res, next) => {
  const token  = !!req?.headers["authorization"] ? req?.headers["authorization"] : null // Assuming JWT is stored in cookies
  console.log(req.body)
   console.log("tokennnnnn",token)
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login to access this resource" });
  }
  console.log(token)
  const decodedData = jwt.verify(token, "hjfenjnefnjnefnjnefvkjnfevnknefvnkjevfk");
  req.user = await User.findById(decodedData.id);
  next();
};

exports.isadminAuthenticated = async (req, res, next) => {
  const { token } = req.body; // Assuming JWT is stored in cookies
  console.log("tokennnnnn",token)

  if (!token) {
    return res.status(401).json({ success: false, message: "Please login to access this resource" });
  }
  console.log(token)
  const decodedData = jwt.verify(token, "hjfenjnefnjnefnjnefvkjnfevnknefvnkjevfk");
  req.user = await adminModel.findById(decodedData.id);
  next();
};
exports.issuperadminAuthenticated = async (req, res, next) => {
  const { token } = req.body; // Assuming JWT is stored in cookies
  console.log("tokennnnnn",token)
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login to access this resource" });
  } 
  const decodedData = jwt.verify(token, "hjfenjnefnjnefnjnefvkjnfevnknefvnkjevfk");
  req.user = await adminModel.findById(decodedData.id);
  if(!req?.user?.issuperadmin){
    return res.status(401).json({ success: false, message: "This resource only accesed by super Admin" });
  }
  next();
};
