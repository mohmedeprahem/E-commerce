// Package requirement
const express = require('express')
const router = express.Router();

// controller files
const { getUserProfile } = require('../controller/user')

// @route: 'GET'  /api/v1/user/profile
// @disc: Get user info   
// @access: private(logged in user)
router.get('/api/v1/user/profile', getUserProfile)

module.exports = router