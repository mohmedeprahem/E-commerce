// Mongodb collections
const { UserSchema, JoiUserName } = require('../models/user')

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

// @route: 'PUT'  api/v1/user/profile/updateName
// @disc: Update userName  
// @access: private(logged in user)
exports.putUserName = async (req, res, next) => {
  try {
    const { error, value } = JoiUserName.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Bad request."
      })
    }

    // update username
    const userInfo = await UserSchema.updateOne({_id: req.user.id},{
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })

    // send success 
    return res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Name updated.",
      userInfo: req.body
    })
  } catch (err) {
    next(err)
  }
}