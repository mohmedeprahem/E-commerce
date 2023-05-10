// Mongodb collections
const { UserSchema, UserJoiSchema, AddressJoiSchema } = require('../models/user')

// @route: 'GET'  /api/v1/user/profile
// @disc: Get user info   
// @access: private(logged in user)
exports.getUserProfile = async (req, res, next) => {
  try {
    // Find user in database
    const userInfo = await UserSchema.findById(req.user.id)

    if(!userInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not found."
      })
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User basic Info.",
      userBasicInfo: {
        email: userInfo.email,
        firstName: userInfo.firstName || null,
        lastName: userInfo.lastName || null
      }
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'POST'  /api/v1/address
// @disc: Post user address   
// @access: private(logged in user)
exports.postNewAddress = async (req, res, next) => {
  try {
    // add new address
    const userInfo = await UserSchema.findById(req.user.id);

    if(!userInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not found."
      })
    }

    const userDataValid = AddressJoiSchema.validate(req.body); 
    if (userDataValid.error) {
      console.log(userDataValid.error)
      return res.status(400).json({
        success: false,
        statusCode: 400,
         message: "Bad request."
      })
    }
    
    userInfo.addresses.push({
      country: req.body.country,
      physicalAddress: req.body.physicalAddress,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      apartmentNumber: req.body.apartmentNumber,
      city: req.body.city,
      governorate: req.body.governorate,
      postalCode: req.body.postalCode,
      phoneNumber: req.body.phoneNumber
    })

    await userInfo.save()
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "New address added."
    })
  } catch (err) {
    next(err)
  }

}