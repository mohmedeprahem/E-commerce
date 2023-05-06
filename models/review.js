// Package requirement
const mongoose = require('mongoose');

// Build review schema
const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  rate: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxLength: 100,
    default: ""
  }
}, { timestamps: true})

const Review = mongoose.model('Review', userSchema);

exports.model = Review