const Subscribtion = require('../models/subscribtionModel');

const subscribtionRouter = require('express').Router();

subscribtionRouter.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        const subscribedUser = await Subscribtion.create({ email });
        res.status(200).json({ subscribedUser });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});
subscribtionRouter.get('/', async (req, res) => {
    try {
        const subscribedUsers = await Subscribtion.find({});
        res.status(200).json({ subscribedUsers });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
});

module.exports = subscribtionRouter;
