const express = require("express");
const { userGetRoute, userPostRoute ,userLogin} = require("../controller/userController");

const router = express.Router();

router.get("/", userGetRoute); 
router.post("/", userPostRoute);
router.post("/login", userLogin);

module.exports = router; 

