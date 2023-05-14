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
  colors: {
    type: [String],
    required: true
  },
  sizes: {
    type: [String],
    required: true
  },
  productInfo: {
    type: [String],
    required: true
  },
  outOfStock: {
    type: Boolean,
    default: false
  },
  rateCounter: {
    type: Number,
    default: 0
  },
  starRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const Product = mongoose.model('Porduct', productSchema);

module.exports = Product