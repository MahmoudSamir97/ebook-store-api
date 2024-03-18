const cartModel = require('../models/cart.model');

const createOrder = async (customer, data) => {
    try {
        const items = JSON.parse(customer.metadata.cart);
        const newCart = await cartModel.create({
            userId: customer.metadata.userId,
            cartItems: items,
            customerId: data.customer,
            paymentIntentId: data.payment_intent,
            paymentStatus: data.payment_status,
            totalPrice: data.amount_total / 100,
        });
        console.log(newCart);
    } catch (err) {
        console.log(err);
    }
};

module.exports = createOrder;
