const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const EUser = require("../models/userModels");
// Environment-based secret (fallback to hardcoded one for development)
const secretKey = process.env.JWT_SECRET || 'shhhshh';

// Hash password
const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (err) {
    throw new Error("Hashing failed: " + err.message);
  }
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    throw new Error("Comparison failed: " + err.message);
  }
};

// Generate JWT token
const JWTToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    secretKey,
    { expiresIn: "1d" }
  );
};

// Middleware to verify token
const requireSignIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/image')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const uploadImages = multer({ storage });



module.exports = {
  hashPassword,
  comparePassword,
  JWTToken,
  requireSignIn,
  uploadImages
};
