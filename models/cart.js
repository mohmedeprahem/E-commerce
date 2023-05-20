// Package requirement
const { string, number } = require('joi');
const mongoose = require('mongoose');

// Build sub-document items that want to buy from user
const itemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
}, {_id: true, timestamps: false, versionKey: false, strict: false, embedded: true})

// Build cart schema
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: {
    type: [itemSchema],
    required: false
  },
  bill: {
    type: Number,
    default: 0
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart