const stripe = require('stripe')(process.env.STRIPE_KEY);
const cartModel = require('../models/cart.model');
let endpointSecret;
// 'whsec_0b5ee4a9b885efdc8ee09b44ca3aa04fe3997d3353f60c98c874bd9dde5fd53e';
exports.pay = async (req, res) => {
    const { cartItems } = req.body;
    const objectIdString = req.user._id.toString();
    const customer = await stripe.customers.create({
        metadata: {
            userId: objectIdString,
            cart: JSON.stringify(cartItems),
        },
    });
    const line_items = cartItems.map((item) => {
        return {
            price_data: {
                currency: 'egp',
                unit_amount: item.bookPrice * 100,
                product_data: {
                    name: item.bookTitle,
                    images: [item.bookImage],
                },
            },
            quantity: 1,
        };
    });
    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.send({ url: session.url });
    // LOGIC
    let cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart) {
        cart = await cartModel.create({ userId: req.user._id, cartItems: [] });
    }
    // const existingItem = cart.cartItems.find((item) => item.bookTitle === bookTitle);
    cart.cartItems = cartItems;
    cart.paymentStatus = 'paid';
    await cart.save();

    // LOGIC
};
exports.webHookFn = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let data;
    let eventType;
    if (endpointSecret) {
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        data = event.data.object;
        eventType = event.type;
    } else {
        data = req.body.data.object;
        eventType = req.body.type;
    }
    // // handle the event
    // if (eventType === 'checkout.session.completed') {
    //     stripe.customers
    //         .retrieve(data.customer)
    //         .then((customer) => {
    //             createOrder(customer, data);
    //         })
    //         .catch((err) => console.log(err));
    // }
    // res.status(200).end();

    // handle the event
    console.log(eventType, 'eventType');
    if (eventType === 'checkout.session.completed') {
        // Retrieve the customer's information from Stripe
        const customer = await stripe.customers.retrieve(data.customer);
        console.log(data.customer, 'data.customer');

        // Create order based on the retrieved customer information and data from the checkout session
        // await createOrder(customer, data);

        // Update payment status in cart model
        try {
            let cart = await cartModel.findOneAndUpdate(
                { userId: customer.metadata.userId }, // Find cart by user ID
                { $set: { paymentStatus: 'paid' } }, // Update payment status to 'paid'
                { new: true } // Return the updated cart
            );
            console.log('Payment status updated in cart model:', cart);
        } catch (err) {
            console.error('Error updating payment status in cart model:', err);
        }
    }
    res.status(200).end();
};
