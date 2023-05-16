// Package requirement
const express = require('express');
const {
  postProduct,
  getProductSlider,
  getProductatHomePage
} = require('../controller/product');
const router = express.Router();

// Middlewares
const upload = require('../middlewares/handleProductImage')

// @route: 'POST'  api/v1/product
// @disc: create new product
// @access: private(admin)
router.post('/api/v1/product', upload.array('images'), postProduct)

// @route: 'GET'  api/v1/products/slider
// @disc: Get card slider images
// @access: public
router.get('/api/v1/products/slider', getProductSlider)

// @route: 'GET'  api/v1/products/home
// @disc: Get products at home page
// @access: public
router.get('/api/v1/products/home', getProductatHomePage)

module.exports = router