const  Product  = require("../models/productModel");
const { jWTToken ,uploadImages} = require("../middilware/auth");

// GET handler
const productGet = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({message: "Products fetched successfully", products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST handler
const productPost = async (req, res) => {
  try {
    const { name, price, description, category, stock } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
      : null;

    if (!name || !price || !description || !category || !stock || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ name, price, description, category, stock, image });
    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  productGet,
  productPost,
};
