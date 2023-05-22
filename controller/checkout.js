const stripe = require('stripe')(process.env.STRIPE_SECRITE_KEY);
const cartSchema = require('../models/cart')
const orderSchema = require('../models/order')

// @route: 'post'  /webhook
// @disc: save user order in database
// @access: private(stripe APIs)
exports.handerCompletePay =  async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_SIGNATURE_KEY,{ tolerance: 600 });
  } catch (err) {
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case 'charge.succeeded':
      const paymentIntentSucceeded = event.data.object;
      const cart = await cartSchema.findById(paymentIntentSucceeded.metadata.cartId)

      // create order
      const order = await new orderSchema({
        price: paymentIntentSucceeded.amount / 100,
        userId: cart.userId,
        productIds: cart.items.map(item => {
          return item.productId
        })
      })

      // format cart
      cart.items = []
      cart.bill = 0
      await cart.save()
      break;
    default:
      console.log(`Unhandled event type ${event}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
};