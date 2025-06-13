const {Cart}=require("../models/cartSchema");

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // This assumes requireSignIn middleware sets req.user
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

 

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Error adding to cart:", err); // Log full error to terminal
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name price image");

    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty array if no cart
    }

    res.status(200).json({ items: cart.items }); // Only return `items`, for frontend simplicity
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const removeCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (existingItem.quantity > 1) {
      existingItem.quantity--;
    } else {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    }
    await cart.save();
    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCartQuantity = async (req, res) => {
  const userId = req.user._id || req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity cannot be negative" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (quantity === 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addToCart, getCart, removeCart, updateCartQuantity };