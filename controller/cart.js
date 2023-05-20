const cartSchema = require('../models/cart')
const ProductSchema = require('../models/product')

// @route: 'POST'  api/v1/cart/:productId
// @disc: add product to cart
// @access: private(user: logged in)
exports.addProductCart = async (req, res, next) => {
  try {
    // check if product id found
    const productInfo = await ProductSchema.findById(req.params.productId);

    if (!productInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Product not found."
      })
    }

    // create cart if there are no cart 
    let cartInfo = await cartSchema.findOne({ userId: req.user.id });

    if (!cartInfo) {
      cartInfo = await new cartSchema({
        userId: req.user.id,
        bill: 0
      })
    }

    // Push the product to cart
    cartInfo.items.push({
      productId: req.params.productId,
      ...req.body
    })

    cartInfo.bill += (req.body.quantity * req.body.price)

    await cartInfo.save();

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product added to the cart successfully."
    })

  } catch(err) {
    next(err)
  }
}

// @route: 'GET'  api/v1/cart/
// @disc: Get products that on the cart page.
// @access: private(user: logged in)
exports.getCart = async (req, res, next) => {
  try {
    let cartInfo = await cartSchema.findOne({ userId: req.user.id });

    if (!cartInfo) {
      cartInfo = {}
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product in the cart page.",
      bill: cartInfo.bill || 0,
      products: cartInfo.items || []
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'DELETE'  api/v1/cart/:cartId
// @disc: Delete products from the cart.
// @access: private(user: logged in)
exports.deletePorductCart = async (req, res, next) => {
  try {
    const cartInfo = await cartSchema.deleteOne({ _id: req.params.cartId });
    console.log(cartInfo)

    return res.status(204)
  } catch (err) {
    next(err)
  }
}