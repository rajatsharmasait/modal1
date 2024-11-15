const express = require("express");
const stripe = require('stripe')("sk_test_51QDcatEzbi0h5MNO3LhDSkuPBG9wmiBCxlaGCBpdGofmSWLuxdSp9CrKsS7xh9Kv4CwU1vXDjY1FbLFiuFOJLHLO00hJy6KWo0");

const app = express();
const endpointSecret = 'whsec_d01a539ddacd58874cf755bf4c08439a5110736fe5413c355581b541d12ff911';
app.use(express.json());

app.post('/payment-sheet', async (req, res) => {
  const { amount } = req.body; 
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2024-09-30.acacia'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'eur',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51QDcatEzbi0h5MNOXHcj4LI87q2cGxfVkRAcHEjLGhTBCw9XXLjjDcSeMo9DkbQ8IP0HzJ4jaoSwXCFHZ9PWyhJC00Ldh4R3XZ'
  });
});

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Payment method attached:', paymentMethod);
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.status(200).send('Event received');
  });

  app.get('/config', (req, res) => {
  res.json({ publishableKey: 'pk_test_51QDcatEzbi0h5MNOXHcj4LI87q2cGxfVkRAcHEjLGhTBCw9XXLjjDcSeMo9DkbQ8IP0HzJ4jaoSwXCFHZ9PWyhJC00Ldh4R3XZ' });
});

  
  app.listen(4242, () => console.log('Running on port 4242'));