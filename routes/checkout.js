// Package requirement
const express = require('express');
const router = express.Router();

// Controller files
const {
  handerCompletePay
} = require('../controller/checkout')

// @route: 'post'  /webhook
// @disc: save user order in database
// @access: private(stripe APIs)
router.post('/webhook', express.raw({type: 'application/json'}), handerCompletePay)

module.exports = router