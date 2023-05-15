// Package requirement
const express = require('express');
const { postProduct } = require('../controller/product');
const router = express.Router();

// Middlewares
const upload = require('../middlewares/handleProductImage')

// @route: 'POST'  api/v1/product
// @disc: create new product
// @access: private(admin)
router.post('/api/v1/product', upload.array('images'), postProduct)

module.exports = router