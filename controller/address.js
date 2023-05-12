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

// @route: 'GET'  api/v1/address
// @disc: Get user addresses   
// @access: private(logged in user)
exports.getUserAddresses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const userInfo = await UserSchema.findById(req.user.id).select('addresses')

    const totalAddresses = userInfo.addresses.length;
    const offset = (page - 1) * limit;

    const subsetOfAddresses = userInfo.addresses.slice(offset, offset + limit);

    

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User addresses.",
      totalItemsCount: totalAddresses,
      maxPages: Math.ceil(totalAddresses / limit),
      currentPage: page,
      itemPerPage: 10,
      userAddresses: subsetOfAddresses
    })   
  } catch (err) {
    next(err)
  }
}

// @route: 'PUT'  /api/v1/address/addressId
// @disc: update user address   
// @access: private(logged in user)
exports.updateUserAddress = async (req, res, next) => {
  // Get user Addresses
  const userInfo = await UserSchema.findById(req.user.id).select('addresses')
  
  if (!userInfo) return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Server error."
  })

  // Udatate the address
  const addressDataValid = AddressJoiSchema.validate(req.body); 
  if (addressDataValid.error) {
    console.log(addressDataValid)
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Bad request."
    })
  }

  const addressIndex = userInfo.addresses.findIndex(address => {
    return address._id == req.params.addressId
  })

  if(addressIndex < 0) return res.status(400).json({
    success: false,
    statusCode: 400,
    message: "Invalid id."
  })   

  userInfo.addresses[addressIndex] = req.body
  await userInfo.save()

  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Address updated successfully.",
    newAddress: req.body
  })   
}