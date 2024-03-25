const { Schema, Types, model } = require('mongoose');

const CartSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
        },
        // Stripe properties
        customerId: String,
        paymentIntentId: String,
        paymentStatus: {
            type: String,
        },
        cartItems: [
            {
                bookTitle: String,
                bookPrice: String,
                bookImage: String,
                name: {
                    type: String,
                },
                price: {
                    type: String,
                },
                image: {
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
