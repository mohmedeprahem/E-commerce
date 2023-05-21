const stripe = require('stripe')(process.env.STRIPE_SECRITE_KEY);

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
      console.log(paymentIntentSucceeded.billing_details.email);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send();
};