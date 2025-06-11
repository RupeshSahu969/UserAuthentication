const { User } = require("../models/userModels");
const {hashPassword,comparePassword,JWTToken} = require("../middilware/auth");

// GET
const userGetRoute = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST
const userPostRoute = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();
    console.log("Saved User:", newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("ERROR IN POST /user:", err.message, err.stack); // Better debug info
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLogin=async(req,res)=>{

try{
  const {email,password}=req.body;

if(!email || !password){
  return res.status(400).json({message:"credentials are required"});
}

const user=await User.findOne({email});

if(!user){
  return res.status(401).json({message:"Invalid credentials"});
}

const isMatch=await comparePassword(password,user.password);
if(!isMatch){
  return res.status(401).json({message:"Invalid credentials"});
}

const token=await JWTToken(user);
return res.status(200).json({message:"Login Successful",user:{
  name:user.name,
  email:user.email,
  phone:user.phone,
  id:user._id,
  token
}});




}
catch(err){
  console.log(err);
  return res.status(500).json({message:"Internal Server Error"});
}


}

module.exports = { userGetRoute, userPostRoute ,userLogin};
