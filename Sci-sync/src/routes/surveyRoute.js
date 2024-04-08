const express = require("express");
const { isAuthenticated, isadminAuthenticated } = require("../middleware/auth");
const { addSurvey, getAllSurveys, getSingleSurvey, updateSingleSurvey, deleteSingleSurvey } = require("../controllers/survey.controller");
const router = express.Router();

// Survey Routes
router.post("/survey/addSurvey",isadminAuthenticated,addSurvey)

router.get("/survey/allSurveys",getAllSurveys)

router.post("/survey/singleSurvey",getSingleSurvey)


router.put("/survey/updateSurvey",isadminAuthenticated,updateSingleSurvey)

router.post("/survey/deleteSurvey",isadminAuthenticated,deleteSingleSurvey)


module.exports =router;