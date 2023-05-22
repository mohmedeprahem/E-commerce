// Package requirement
const express = require('express');
const router = express.Router();

const {
  postReview, 
  getReviews
} = require('../controller/review');

// @route: 'POST'  api/v1/reviews/addNewReview/:productId
// @disc: create new review
// @access: private(user: sall porduct)
router.post('/api/v1/reviews/addNewReview/:productId', postReview)

// @route: 'GET'  api/v1/product/reviews/:productId?page=1
// @disc: get all reviews
// @access: public
router.get('/api/v1/product/reviews/:productId', getReviews)

module.exports = router 