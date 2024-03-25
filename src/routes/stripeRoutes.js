const express = require('express');
const { pay, webHookFn } = require('../controllers/stripeController');
const isAuthenticated = require('../middleware/isAuthenticated');
const stripeRouter = require('express').Router();

stripeRouter.post('/create-checkout-session', isAuthenticated, pay);
stripeRouter.post('/webhook', express.raw({ type: 'application/json' }), webHookFn);

module.exports = stripeRouter;
