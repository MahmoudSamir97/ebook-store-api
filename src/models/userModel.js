const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Please Enter your first name!'],
        },
        lastName: {
            type: String,
            required: [true, 'Please Enter your last name!'],
        },
        userName: {
            type: String,
            required: [true, 'Please Enter a unique user name!'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please Provide your email address!'],
            unique: true,
            validate: [validator.isEmail, 'Please Provide a valid email address!'],
        },
        image: {
            public_id: String,
            url: String,
        },
        password: {
            type: String,
            required: [true, 'Please Provide your password!'],
            unique: true,
            minlength: 8,
            select: false,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Please Provide your phone number!'],
        },
        dateOfBirth: {
            type: String,
            trim: true,
            required: [true, 'Please Provide your date of birth!'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isVerfied: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            select: false,
        },
        passwordResetString: String,
        passwordResetExpires: Date,
    },
    { minimize: false }
);
// PRE HOOK, NOT RETRIEVE USERS WITH DELETED ACCOUNT
userSchema.pre(/^find/, function () {
    this.find({ isDeleted: false });
});
// MONGOOSE SCHEMA METHODS FIELD
userSchema.methods.creatResetRandomString = function () {
    const resetString = crypto.randomBytes(32).toString('hex');
    this.passwordResetString = crypto.createHash('sha256').update(resetString).digest('hex');
    this.passwordResetExpires = Date.now() + 2 * 60 * 1000;
    return resetString;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
