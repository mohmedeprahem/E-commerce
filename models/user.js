// Package requirement
const mongoose = require('mongoose');
const Joi = require('joi')

// Define the sub-document in user schema
const addressSchema = new mongoose.Schema(
{
  country: {
    type: String,
    required: true,
    maxlength: 50
  },
  physicalAddress: {
    type: String,
    required: true,
    maxlength: 100,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40
  },
  apartmentNumber: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  governorate:{
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  postalCode: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}
, { timestamps: true });

// Define the user collections Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  firstName: {
    type: String,
    minlengt: 1,
    maxlength: 20
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 20
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
    required: true
  },
}, { timestamps: true });

const UserSchema = mongoose.model('User', userSchema);

// Define Joi schema for AddressSchema
const AddressJoiSchema = Joi.object({
  country: Joi.string().required(),
  physicalAddress: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  apartmentNumber: Joi.number().required(),
  city: Joi.string().required(),
  governorate: Joi.string().required(),
  postalCode:Joi.number().required(),
  phoneNumber: Joi.string().required(),
});

// Define Joi schema for UserSchema
const UserJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  addresses: Joi.array().items(AddressJoiSchema).optional()
});

const JoiUserName = Joi.object({
  firstName: Joi.string().min(1).max(20),
  lastName: Joi.string().min(3).max(20)
})

module.exports = { UserSchema, UserJoiSchema, AddressJoiSchema, JoiUserName}