// Package requirement
const express = require('express')
const router = express.Router();

// controller files
const { getUserProfile, putUserName } = require('../controller/user')
const { postNewAddress, getUserAddresses, updateUserAddress, deleteUserAddress } = require('../controller/address')

// middlewares files
const {
  isAuthanticated
} = require('../middlewares/authanticatedPolices')

// @route: 'GET'  /api/v1/user/profile
// @disc: Get user info   
// @access: private(logged in user)
router.get('/api/v1/user/profile', isAuthanticated, getUserProfile)

// @route: 'PUT'  api/v1/user/profile/updateName
// @disc: Update userName  
// @access: private(logged in user)
router.put('/api/v1/user/profile/updateName', isAuthanticated, putUserName);

// @route: 'POST'  api/v1/address
// @disc: post new user address   
// @access: private(logged in user)
router.post('/api/v1/address', isAuthanticated, postNewAddress);

// @route: 'GET'  api/v1/address
// @disc: Get user addresses   
// @access: private(logged in user)
router.get('/api/v1/address', isAuthanticated, getUserAddresses);

// @route: 'PUT'  /api/v1/address/addressId
// @disc: update user address   
// @access: private(logged in user)
router.put('/api/v1/address/:addressId', isAuthanticated, updateUserAddress)

// @route: 'DELETE'  /api/v1/address/addressId
// @disc: Delete user delete
// @access: private(logged in user)
router.delete('/api/v1/address/:addressId', isAuthanticated, deleteUserAddress)

module.exports = router