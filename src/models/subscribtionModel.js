const mongoose = require('mongoose');

const subscribtionSchema = new mongoose.Schema({
    email: {
        type: String,
    },
});

const Subscribtion = mongoose.model('subscribtion', subscribtionSchema);
module.exports = Subscribtion;
