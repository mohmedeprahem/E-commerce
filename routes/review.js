// Package requirement
const express = require('express');
const router = express.Router();

const {
  postReview, 
  getReviews,
  deleteReview,
  putReview
} = require('../controller/review');

// middlewares files
const {
  isAuthanticated
} = require('../middlewares/authanticatedPolices')

// @route: 'POST'  api/v1/reviews/addNewReview/:productId
// @disc: create new review
// @access: private(user: sall porduct)
router.post('/api/v1/reviews/addNewReview/:productId', isAuthanticated, postReview)

// @route: 'GET'  api/v1/product/reviews/:productId?page=1
// @disc: get all reviews
// @access: public
router.get('/api/v1/product/reviews/:productId', getReviews)

// @route: 'DELETE'  api/v1/reviews/:reviewId
// @disc: delete review
// @access: private(user: review owner)
router.delete('/api/v1/reviews/:reviewId', isAuthanticated, deleteReview)


// @route: 'DELETE'  api/v1/reviews/:reviewId
// @disc: Edit review
// @access: private(user: review owner)
router.put('/api/v1/reviews/:reviewId', isAuthanticated, putReview)
module.exports = router 