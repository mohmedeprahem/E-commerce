// Package requirement
const express = require('express')
const router = express.Router();

// Controller folder
const { login, verifyEmail } = require('../controller/auth')

// @route: 'POST'  /api/v1/auth/login
// @disc: Create new user or login user 
// @access: public
router.post(`/api/v1/auth/login`, login)

// @route: 'POST'  /api/v1/auth/verify-email/:userId
// @disc: Verify user's email to login  
// @access: public
router.post(`/api/v1/auth/verify-email/:userId`, verifyEmail)

module.exports = router