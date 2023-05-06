// Package requirement
const mongoose = require('mongoose');

// Build sub-document items that want to buy from user
const itemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  quantity: Number,
  color: String,
  size: String,
  price: Number
}, {_id: false, timestamps: false, versionKey: false, strict: false, embedded: true})

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
  bill: Number
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart