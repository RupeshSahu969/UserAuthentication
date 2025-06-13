const express = require("express");
const app = express();
const path = require("path");
const cros=require("cors");
require("dotenv").config();
const dbConnect = require("./config/db");
dbConnect(); // Connect to the database
// Middleware
app.use(express.json());
app.use(cros());
app.use(express.urlencoded({ extended: true }));

app.use('/image', express.static(path.join(__dirname, 'public/image')));

// Load environment port or fallback to 8080
const PORT = process.env.PORT || 8080;

// Import user routes
const userRouter = require("./router/userRoute");
const productRouter = require("./router/productRouter");
const cartRouter = require("./router/cartRouter");

// Use user routes with base URL /user
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


