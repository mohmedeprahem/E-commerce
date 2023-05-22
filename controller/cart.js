const stripe = require('stripe')(process.env.STRIPE_SECRITE_KEY);

const cartSchema = require('../models/cart')
const ProductSchema = require('../models/product')
const orderSchema = require('../models/order')

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

// @route: 'DELETE'  api/v1/cart/:productId
// @disc: Delete products from the cart.
// @access: private(user: logged in)
exports.deletePorductCart = async (req, res, next) => {
  try {
    const cartInfo = await cartSchema.findOne({
      userId: req.user.id
    });
    if (!cartInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Item Not Found."
      })
    }

    const itemIndex = cartInfo.items.findIndex(item => item.productId == req.params.productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Item Not Found."
      })
    }
    
    cartInfo.bill -=  (cartInfo.items[itemIndex].quantity * cartInfo.items[itemIndex].price)
    

    cartInfo.items.splice(itemIndex, 1);

    await cartInfo.save()

    return res.status(204).json({})
  } catch (err) {
    next(err)
  }
}

// @route: 'GET'  api/v1/cart/payUrl
// @disc: get pay url page
// @access: private(user: logged in)
exports.checkout = async (req, res, next) => {
  try {
    const cartPorduct = await cartSchema.findOne({ userId: req.user.id }).populate('items.productId')
    
    if (!cartPorduct || !cartPorduct.items.length) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'No products in cart'
      })
    };

    console.log(cartPorduct.items[0].productId.price)
    const paymentIntent = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartPorduct.items.map(item => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productId.name
            },
            unit_amount: item.productId.price * 100
          },
          quantity: item.quantity
        }
      }),
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    
    return res.status(200).json({
      success: true,
      statusCode: 200,
      checkoutUrl: paymentIntent.url
    })
  } catch(err) {
    next(err)
  }
}