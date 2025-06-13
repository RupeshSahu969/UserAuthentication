const express = require("express");
const { userGetRoute, userPostRoute ,userLogin, updateUser, deleteUser} = require("../controller/userController");

const router = express.Router();

router.get("/", userGetRoute); 
router.post("/", userPostRoute);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", userLogin);

module.exports = router; 

