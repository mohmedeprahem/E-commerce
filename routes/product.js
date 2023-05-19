// Package requirement
const express = require('express');
const {
  postProduct,
  getProductSlider,
  getProductatHomePage,
  getAllPruducts,
  getSearchProducts,
  getProductInfo,
  getSuggestProduct
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

// @route: 'GET'  api/v1/products/all?page=1&outOfStock=true&minPrice=200&maxPrice=500
// @disc: Get all product
// @access: public
router.get('/api/v1/products/all', getAllPruducts)

// @route: 'GET'  /api/v1/products/search?product=T-Shirt&page=1
// @disc: Search product based on product name
// @access: public
router.get('/api/v1/products/search', getSearchProducts)

// @route: 'GET'  /api/v1/products/singleProduct/:productId
// @disc: Get product info
// @access: public
router.get('/api/v1/products/singleProduct/:productId', getProductInfo)

// @route: 'GET' api/v1/products/suggestedProducts
// @disc: Get suggested products related
// @access: public
router.get('/api/v1/products/suggestedProducts', getSuggestProduct)

module.exports = router