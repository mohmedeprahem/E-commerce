// Package requirement
const express = require('express')
const router = express.Router();

// controller files
const { getUserProfile, postNewAddress } = require('../controller/user')

// @route: 'GET'  /api/v1/user/profile
// @disc: Get user info   
// @access: private(logged in user)
router.get('/api/v1/user/profile', getUserProfile)

// @route: 'POST'  api/v1/address
// @disc: Post user address   
// @access: private(logged in user)
router.post('/api/v1/address', postNewAddress);

module.exports = router