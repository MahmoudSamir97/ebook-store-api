const { Schema, Types, model } = require('mongoose');

const WishlistSchema = new Schema(
    {
        orderBy: {
            type: Types.ObjectId,
            ref: 'User',
        },
        wishlistItems: [
            {
                bookId: {
                    type: Types.ObjectId,
                    ref: 'Book',
                },
            },
        ],
        totalQuantity: Number,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const wishlistModel = model('Wishlist', WishlistSchema);
module.exports = wishlistModel;
