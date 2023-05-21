// Package requirement
const express = require('express');
const router = express.Router();

// Controller files
const {
  addProductCart,
  getCart,
  deletePorductCart,
  checkout
} = require('../controller/cart')

// @route: 'GET'  api/v1/cart/checkout
// @disc: checkout
// @access: private(user: logged in)
router.get('/api/v1/cart/checkout', checkout)

// @route: 'POST'  api/v1/cart/:productId
// @disc: add product to cart
// @access: private(user: logged in)
router.post('/api/v1/cart/:productId', addProductCart)

// @route: 'GET'  api/v1/cart/
// @disc: Get products that on the cart page.
// @access: private(user: logged in)
router.get('/api/v1/cart', getCart)

// @route: 'DELETE'  api/v1/cart/:cartId
// @disc: Delete products from the cart.
// @access: private(user: logged in)
router.delete('/api/v1/cart/:productId', deletePorductCart)

module.exports = router