// Mongodb collections
const UserSchema = require('../models/user')

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
    
    const isDuplicated = userInfo.addresses.find(address => address.apartmentNumber === req.body.apartmentNumber)

    console.log(result)

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "New address added."
    })
  } catch (err) {
    next(err)
  }

}