const express = require("express");
const { clientRegistration, clientLogin } = require("../controllers/client.controller");
const router = express.Router();


router.post("/client/registration",clientRegistration)

router.post("/client/login",clientLogin)


module.exports = router;