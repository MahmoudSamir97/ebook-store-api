const { Schema, Types, model } = require('mongoose');

const CartSchema = new Schema(
    {
        // registered user
        userId: {
            type: Types.ObjectId,
            ref: 'User',
        },
        // Stripe properties
        customerId: String,
        paymentIntentId: String,
        paymentStatus: {
            type: String,
            required: true,
        },
        cartItems: [
            {
                name: {
                    type: String,
                },
                price: {
                    type: String,
                },
            },
        ],
        totalPrice: Number,
        totalPriceAfterCoupon: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const cartModel = model('Cart', CartSchema);
module.exports = cartModel;
