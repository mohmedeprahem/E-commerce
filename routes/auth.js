// Package requirement
const express = require('express')
const router = express.Router();

// Controller folder
const { login } = require('../controller/auth')

// @route: 'POST'  /api/v1/auth/login
// @disc: create new user or login user 
// @access: public
router.post(`/api/v1/auth/login`, login)

module.exports = router