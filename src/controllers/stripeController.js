const stripe = require('stripe')(process.env.STRIPE_KEY);
const createOrder = require('../utils/createOrder');
let endpointSecret;

exports.pay = async (req, res) => {
    const customer = await stripe.customers.create({
        metadata: {
            userId: req.body.userId,
            cart: JSON.stringify(req.body.cartItems),
        },
    });
    const { cartItems } = req.body;
    const line_items = cartItems.map((item) => {
        return {
            price_data: {
                currency: 'usd',
                unit_amount: item.price * 100,
                product_data: {
                    name: item.name,
                    images: [item.image],
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
};
exports.webHookFn = (req, res) => {
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
    // handle the event
    if (eventType === 'checkout.session.completed') {
        stripe.customers
            .retrieve(data.customer)
            .then((customer) => {
                createOrder(customer, data);
            })
            .catch((err) => console.log(err));
    }
    res.status(200).end();
};
