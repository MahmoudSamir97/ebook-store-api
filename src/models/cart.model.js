const { Schema, Types, model } = require('mongoose');

const CartSchema = new Schema(
    {
        orderBy:{
            type: Types.ObjectId,
            ref: 'User',

        },
        cartItems: [
            {
                bookId: {
                    type: Types.ObjectId,
                    ref: 'Book',
                },
                quantity:{
                    type:Number,
                    default:1
                }
            }
        ],
        totalPrice: Number,
        totalQuantity:Number,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const cartModel = model('Cart', CartSchema);
module.exports = cartModel;
