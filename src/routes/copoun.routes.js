const express = require('express');
const {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deletedCoupon,
    applyCoupon,
} = require('../controllers/copoun.controller');

const couponRouter = express.Router();

// couponRouter.post('/', isAuthenticated, isAdmin, createCoupon);

// couponRouter.get('/', isAuthenticated, isAdmin, getAllCoupons);

// couponRouter.patch('/:couponId', isAuthenticated, isAdmin, updateCoupon);

// couponRouter.delete('/:couponId', isAuthenticated, isAdmin, deletedCoupon);

// couponRouter.post('/applyCoupon', isAuthenticated, applyCoupon);


couponRouter.post('/', createCoupon);

couponRouter.get('/',getAllCoupons);

couponRouter.patch('/:couponId', updateCoupon);

couponRouter.delete('/:couponId', deletedCoupon);

couponRouter.post('/applyCoupon', applyCoupon);



module.exports = couponRouter;
