const couponModel = require('../models/copoun.model');
const cartModel = require('../models/cart.model');

exports.createCoupon = async (req, res) => {
    try {
        // if (!req.user.id) {
        //     return res
        //         .status(401)
        //         .json({ status: 'FAIL', data: { message: 'You do not have permission to create Coupon' } });
        // }
        const newCoupon = new couponModel({
            couponCode: req.body.couponCode,
            couponValue: req.body.couponValue,
            expireIn: req.body.expireIn,
        });

        await newCoupon.save();
        res.status(201).json({ status: 'SUCCESS', data: { message: 'Coupon Add successfully', newCoupon } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find();
        res.status(201).json({ status: 'SUCCESS', data: { message: 'ALL Coupons', coupons } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.updateCoupon = async (req, res) => {
    try {
        // if (!req.user.id) {
        //     return res
        //         .status(401)
        //         .json({ status: 'FAIL', data: { message: 'You do not have permission to create Coupon' } });
        // }
        const couponId = req.params.couponId;
        const { couponCode, couponValue, expireIn } = req.body;

        const coupon = await couponModel.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'coupon not found' } });
        }

        // Update the coupon
        const updateCoupon = await couponModel.findOneAndUpdate(
            { _id: couponId },
            {
                $set: {
                    couponCode,
                    couponValue,
                    expireIn,
                },
            },
            { new: true }
        );

        if (!updateCoupon) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'coupon not found' } });
        }

        res.status(200).json({ status: 'SUCCESS', data: { updateCoupon } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.deletedCoupon = async (req, res) => {
    try {
        const couponId = req.params.couponId;
        const coupon = await couponModel.findById(couponId);

        if (!coupon) {
            return res.status(404).json({ status: 'FAIL', data: { message: 'Coupon not found' } });
        }
        // Use findOneAndUpdate to update the deletedBy field without actually deleting the coupon
        const deletedCoupon = await couponModel.findOneAndDelete({ _id: couponId });

        res.status(200).json({
            status: 'SUCCESS',
            data: deletedCoupon,
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;

        // Find the user's cart
        const cart = await cartModel.findOne({ orderBy: req.user.id });

        if (!cart) {
            return res.status(404).json({ status: 'FAIL', message: 'Cart not found' });
        }

        // Find the coupon by code
        const coupon = await couponModel.findOne({ couponCode });

        if (!coupon) {
            return res.status(404).json({ status: 'FAIL', message: 'Coupon not found' });
        }

        // Check if the coupon has expired
        const currentDate = new Date();
        if (coupon.expireIn && currentDate > coupon.expireIn) {
            return res.status(400).json({ status: 'FAIL', message: 'Coupon has expired' });
        }

        // Apply discount to the cart's total price
        const discount = coupon.couponValue || 0; // Assuming couponValue is the discount percentage

        // Calculate the discounted price
        const discountedPrice = (1 - discount / 100) * cart.totalPrice;

        // Update the cart's total price after the discount
        cart.totalPriceAfterCoupon = discountedPrice;

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Coupon applied successfully',
            discountedPrice,
            cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'ERROR', message: 'Internal Server Error' });
    }
};
