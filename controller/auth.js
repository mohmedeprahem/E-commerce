// Package requirement
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');

// Mongodb collections
const { UserSchema } = require('../models/user')

// Service folder
const nodemailerService = require('../service/nodemailer');

// @route: 'POST'  /api/v1/auth/login
// @disc: create new user or login user 
// @access: public
exports.login = async (req, res, next) => {
  try {
    // Generate a 6-digit OTP 
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Generate date now plus 1 hour 
    let oneHourLater = new Date(); 
    oneHourLater.setHours(oneHourLater.getHours() + 1);

    // Check if email exists, create new user if it doesn't
    let userInfo = await UserSchema.findOne({ email: req.body.email })
      if (userInfo) {
        userInfo.otpCode = otp;
        userInfo.otpCreatedAt = oneHourLater
        await userInfo.save()
      } else {
        const newUser = new UserSchema({
          email: req.body.email,
          otpCode: otp,
          otpCreatedAt: oneHourLater
        });
        userInfo = await newUser.save()
      }
    
    await nodemailerService.sendEmail(otp, req.body.email);
    
    return res.status(201).json({
      success: true,
      isOTPSent: true,
      message: "Verfiy your email.",
      userId: userInfo._id
    })
  } catch (err) {
    next(err)
  }
} 

// @route: 'POST'  /api/v1/auth/verify-email/:userId
// @disc: Verify user's email to login  
// @access: public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Find user in database
    const userInfo = await UserSchema.findById(req.params.userId);
    if(!userInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 400,
        message: "Invalid id."
      })
    }
  
    // Check if otp valid and not expired
    if (req.body.OTP !== userInfo.otpCode || userInfo.otpCreatedAt <= Date.now()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Incorrect or expired Code."
      })
    }

    // login user by jwt and cookies
    const token = jwt.sign({id: userInfo._id}, process.env.SECRET_KEY_JWT);

    res.cookie('jwt', token, { httpOnly: true });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      accessToken: token,
      message: "User loggedIn successfully."
    })

  } catch (err) {
    next(err)
  }
} 