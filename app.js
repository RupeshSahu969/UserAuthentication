const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const dbConnect = require("./config/db");
dbConnect(); // Connect to the database
// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Load environment port or fallback to 8080
const PORT = process.env.PORT || 8080;

// Import user routes
const userRouter = require("./router/userRoute");

// Use user routes with base URL /user
app.use("/user", userRouter);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


