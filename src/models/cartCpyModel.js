const { Schema, Types, model } = require('mongoose');

const CartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User' },
    items: [
        {
            bookTitle: String,
            bookPrice: String,
            bookImage: String,
        },
    ],
});
const cartCpyModel = model('Cartcpy', CartSchema);
module.exports = cartCpyModel;
