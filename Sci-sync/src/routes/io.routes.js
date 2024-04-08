const express = require("express");
const router = express.Router();
const multer = require('multer');
const {  TextToImage } = require("../controllers/io.controller");
const { isAuthenticated } = require("../middleware/auth");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

console.log("yhan bhi aayi h")
router.post('/user/uploadsurvey',isAuthenticated, upload.fields([{ name: 'image', maxCount: 1 },]), TextToImage);






module.exports = router;