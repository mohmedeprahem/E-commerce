// Package requirement
const express = require('express');
const router = express.Router();

// Controller files
const {
  addProduct,
  getCart
} = require('../controller/cart')

// @route: 'POST'  api/v1/cart/:productId
// @disc: add product to cart
// @access: private(user: logged in)
router.post('/api/v1/cart/:productId', addProduct)

// @route: 'GET'  api/v1/cart/
// @disc: Get products that on the cart page.
// @access: private(user: logged in)
router.get('/api/v1/cart', getCart)

module.exports = router