const bcrypt = require('bcrypt');
const e = require('express');
const jwt=require('jsonwebtoken');
// Takes a plain password and returns the hashed version
const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(plainPassword, saltRounds);
    return hashed;
  } catch (err) {
    throw new Error("Hashing failed: " + err.message);
  }
};

const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    throw new Error("Comparison failed: " + err.message);
  }
};

const JWTToken=async(user)=>{
const token =jwt.sign({id:user._id,email:user.email},'shhhshh',{expiresIn:"1d"});
return token;
}

module.exports = { hashPassword, comparePassword ,JWTToken};
