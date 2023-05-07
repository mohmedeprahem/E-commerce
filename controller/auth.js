// Package requirement
const nodemailer = require('nodemailer')

// Mongodb collections
const UserSchema = require('../models/user')

// Service folder
const nodemailerService = require('../service/nodemailer')

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
        userInfo = new UserSchema({
          email: req.body.email,
          otpCode: otp,
          otpCreatedAt: oneHourLater
        });
        await userInfo.save()
      }
    
    await nodemailerService.sendEmail(otp, req.body.email);
      
    return res.status(201).json({
      success: true,
      isOTPSent: true,
      message: "Verfiy your email.",
      userId: "56cb91bdc3464f14678934ca"
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: err.message });
  }
  

} 