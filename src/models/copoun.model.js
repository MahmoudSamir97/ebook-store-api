const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        couponCode: {
            type: String,
        },
        couponValue: {
            type: Number,
        },
        expireIn: {
            type: Date,
        },
    },
    { timestamps: true }
);

const couponModel = mongoose.model('Coupon', couponSchema);

module.exports = couponModel;
