// Package requirement
const express = require('express')
const router = express.Router();

// controller files
const { getUserProfile, postNewAddress, putUserName } = require('../controller/user')

// @route: 'GET'  /api/v1/user/profile
// @disc: Get user info   
// @access: private(logged in user)
router.get('/api/v1/user/profile', getUserProfile)

// @route: 'POST'  api/v1/address
// @disc: Post user address   
// @access: private(logged in user)
router.post('/api/v1/address', postNewAddress);

// @route: 'PUT'  api/v1/user/profile/updateName
// @disc: Update userName  
// @access: private(logged in user)
router.put('/api/v1/user/profile/updateName', putUserName);

module.exports = router