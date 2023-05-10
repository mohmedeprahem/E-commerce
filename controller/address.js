const { UserSchema, AddressJoiSchema } = require('../models/user')

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

// @route: 'PUT'  /api/v1/address
// @disc: put user address   
// @access: private(logged in user)
exports.getUserAddresses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    // Find user addresses
    const userInfo = await UserSchema.findById(req.user.id).select('addresses')

    const totalAddresses = userInfo.addresses.length;
    const offset = (page - 1) * limit;

    const subsetOfAddresses = userInfo.addresses.slice(offset, offset + limit);

    

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User addresses.",
      totalItemsCount: 20,
      maxPages: 2,
      currentPage: 1,
      itemPerPage: 10,
      userAddresses: subsetOfAddresses
    })   
  } catch (err) {
    next(err)
  }
}