const express = require('express');
const { addToCart, getCart, removeCart, updateCartQuantity } = require('../controller/cartController');
const { requireSignIn } = require("../middilware/auth");

const router = express.Router();

router.post('/add', requireSignIn, addToCart);
router.get('/', requireSignIn, getCart);
router.delete('/remove', requireSignIn, removeCart);
router.patch('/update', requireSignIn, updateCartQuantity);  // <-- new route

module.exports = router;
