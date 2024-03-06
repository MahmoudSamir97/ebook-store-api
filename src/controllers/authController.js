const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendeEmail = require('../services/sendEmail');
const createToken = require('../utils/createToken');
const verifyTemplate = require('../utils/verifyTemplate');
const resetTemplate = require('../utils/resetTemplate');

exports.signup = async (req, res) => {
    try {
        //1-) CHECK IF USER REGISTERED BEFORE
        const { password } = req.body;
        const foundedUser = await User.findOne({ email: req.body.email });
        if (foundedUser)
            return res.status(400).json({
                status: 'failed',
                message: 'User already registered',
            });
        //2-) HASHING PASSWORD, THEN SAVE IT IN DB
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
        const newUser = await User.create({ ...req.body, password: hashedPassword });
        // 3-) SEND VERIFICATION STRING THROUGH EMAIL
        const { _id, userName, email } = newUser;
        const token = createToken(_id, process.env.JWT_EXPIRES_IN);
        const verifyURL = `http://127.0.0.1:${process.env.PORT}/user/verify/${token}`;
        sendeEmail(verifyTemplate, email, verifyURL, userName);
        res.status(201).json({
            status: 'success',
            message: 'verification link have been sent to your email',
            data: {
                newUser,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message,
        });
    }
};

exports.verify = async (req, res) => {
    try {
        const { token } = req.params;
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const foundedUser = await User.findById(id);
        if (!foundedUser)
            return res.status(404).json({ status: 'fail', message: 'User not found!, verification failed' });
        foundedUser.isVerfied = true;
        await foundedUser.save();
        res.status(200).json({
            status: 'success',
            message: 'User verified successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        // 1-) check if user has been registered
        const { email, password } = req.body;
        const registeredUser = await User.findOne({ email }).select('+password');
        if (!registeredUser)
            return res.status(404).json({
                status: 'fail',
                message: 'User with given email not exist',
            });
        // 2-) check if user has verified email
        if (!registeredUser.isVerfied)
            return res.status(401).json({ status: 'fail', message: 'You should verify your account before logging!' });
        // 3-) check if user account is deactivated
        if (registeredUser.isDeleted)
            return res.status(404).json({ status: 'fail', message: 'Your account is Deleted temporarly!' });
        // 4-) check if provided password is correct
        const passwordMatch = bcrypt.compareSync(password, registeredUser.password);
        if (!passwordMatch)
            return res.status(401).json({
                status: 'fail',
                message: 'You entered wrong password!',
            });
        // 5-) send token to user if logged successfully
        const token = jwt.sign({ id: registeredUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(201).json({
            status: 'success',
            token,
            data: {
                registeredUser,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        // 1- GET USER BY POSTED EMAIL
        const oldUser = await User.findOne({ email: req.body.email });
        if (!oldUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User with given email not exist',
            });
        }
        // 2-GENERATE RESET RANDOM STRING
        const resetLink = oldUser.creatResetRandomString();
        await oldUser.save();
        // 3-SEND RESET STRING THROUGH EMAIL
        const { email, userName } = oldUser;
        const resetURL = `http://127.0.0.1:${process.env.PORT}/user/reset-password/${resetLink}`;
        sendeEmail(resetTemplate, email, resetURL, userName);

        res.status(201).json({
            status: 'success',
            message: 'Check your mail to reset your password!',
            data: {
                oldUser,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: 'failed',
            message: err.message,
        });
    }
};
exports.getResetPassword = async (req, res) => {
    try {
        const { resetLink } = req.params;
        const hashedLink = crypto.createHash('sha256').update(resetLink).digest('hex');
        const foundedUser = User.findOne({
            passwordResetString: hashedLink,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!foundedUser) return res.status(400).json({ message: 'Reset link is invalid or has been expired' });
        res.status(200).json({ status: 'success', message: 'reset your password safely' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
exports.PostResetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.staus(404).json({ status: 'fail', message: 'User with given email not exist ' });
        if (!password) return res.staus(404).json({ status: 'fail', message: 'Please provide new password' });
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ status: 'success', message: 'New Password added successfully' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
