// Package requirement
const mongoose = require('mongoose')

// build product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 100000,
  },
  imgs: {
    type: [String],
    required: true
  },
  color: {
    type: [String],
    required: true
  },
  size: {
    type: [String],
    required: true
  },
  productInfo: {
    type: [String],
    required: true
  },
  desc: {
    type: String,
    default: false
  },
  outOfStock: {
    type: Boolean,
    default: false
  },
  soldCount: {
    type: Number,
    default: 0
  },
  starRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema);

module.exports = Product