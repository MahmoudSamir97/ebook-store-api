const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deletedCoupon, applyCoupon } = require('../controllers/copoun.controller');
const isAdmin = require('../middleware/isAdmin');
const isAuthenticated = require('../middleware/isAuthenticated');

const couponRouter = express.Router();

couponRouter.post('/',isAuthenticated,isAdmin,createCoupon);

couponRouter.get('/',isAuthenticated,isAdmin,getAllCoupons);

couponRouter.patch('/:couponId',isAuthenticated,isAdmin,updateCoupon);

couponRouter.delete('/:couponId',isAuthenticated,isAdmin,deletedCoupon);

couponRouter.post('/applyCoupon',isAuthenticated,applyCoupon);

module.exports = couponRouter;
