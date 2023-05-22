// Package requirement
const mongoose = require('mongoose');

// Build sub-document items that want to buy from user
const orderSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true,
    min:1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'userId'
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  }]
}, { timestamps: true})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order