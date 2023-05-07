// Package requirement
const mongoose = require('mongoose');

// Define the sub-document in user schema
const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    maxLength: 50
  },
  physicalAddress: {
    type: String,
    required: true,
    maxLength: 100,
  },
  firstName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 40
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 40
  },
  apartmentNumber: Number,
  city: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30
  },
  governorate:{
    type: String,
    required: true,
    minLength: 1,
    maxLength: 30
  },
  postalCode: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Define the user collections Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  firstName: {
    type: String,
    minLength: 1,
    maxLength: 20
  },
  lastName: {
    type: String,
    minLength: 1,
    maxLength: 20
  },
  otpCode: Number,
  otpCreatedAt: Date,
  paymentInfo: {
    cardNumber: Number,
    expirationMonth: Number,
    expirationYear: Number,
    CardNames: String,
  },
  addresses: {
    type: [addressSchema],
    required: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User