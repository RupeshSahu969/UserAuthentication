const express = require("express");
const { productGet, productPost } = require("../controller/productController");
const { requireSignIn,uploadImages } = require("../middilware/auth");

const router = express.Router();

// Public - anyone can see products
router.get("/", productGet);

// Protected - only authenticated users can add products
router.post("/", requireSignIn, uploadImages.single("image"), productPost);

module.exports = router;
