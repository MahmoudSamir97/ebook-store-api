const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const dataurl = require('dataurl');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendeEmail = require('../services/sendEmail');
const createToken = require('../utils/createToken');
const verifyTemplate = require('../utils/verifyTemplate');
const resetTemplate = require('../utils/resetTemplate');
const { createandSendToken } = require('../utils/createandSendToken');
const { uploadToCloudinary } = require('../services/cloudinary');

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
            message: 'verification link has been sent to your email',
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
            return res.status(404).json({ status: 'fail', message: 'Your account is Deleted!' });
        // 4-) check if provided password is correct
        const passwordMatch = bcrypt.compareSync(password, registeredUser.password);
        if (!passwordMatch)
            return res.status(401).json({
                status: 'fail',
                message: 'You entered wrong password!',
            });
        // 5-) send token to user if logged successfully
        const token = createToken(registeredUser._id, process.env.JWT_EXPIRES_IN);
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        };
        // FOR PRODUCTION
        res.cookie('token', token, cookieOptions);
        return res.status(200).json({
            status: 'success',
            token,
            message: 'Logged in successfully!',
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
        const hashedLink = crypto.createHash('sha256').update(req.params.resetlink).digest('hex');
        const foundedUser = await User.findOne({
            passwordResetString: hashedLink,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!foundedUser) return res.status(400).json({ message: 'Reset link is invalid or has been expired' });
        res.status(200).json({ status: 'success', message: 'Enter your new password', data: { foundedUser } });
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
        if (!password) return res.staus(400).json({ status: 'fail', message: 'Please provide a new password' });
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ status: 'success', message: 'New Password added successfully!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        // 1-FIND USER
        const user = await User.findById(req.user.id).select('+password');
        // 2-CHECK IF PROVIDED PASSWORD CORRECT
        const passwordMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
        if (!passwordMatch) return res.status(404).json({ status: 'fail', message: 'Old password is not correct!' });
        // 3-UPDATE PASSWORD
        const hashedPassword = await bcrypt.hash(req.body.newPassword, Number(process.env.BCRYPT_SALT));
        user.password = hashedPassword;
        await user.save();
        // 4-CREATE AND SEND TOKEN
        createandSendToken(user, user._id, process.env.JWT_EXPIRES_IN, 200, res);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
exports.updateUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (req.file) {
            const dataUrlString = dataurl.format({
                data: req.file.buffer,
                mimetype: req.file.mimetype,
            });
            const result = await uploadToCloudinary(dataUrlString, 'Portfolio');
            user.image.url = result.secure_url;
            user.image.public_id = result.public_id;
            await user.save();
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { ...req.body },
            { runValidators: true, new: true }
        );
        res.status(200).json({ status: 'success', message: 'data updated successfully', data: { updatedUser } });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isDeleted: true });
        res.status(200).json({ status: 'success', message: 'User deleted successfully!' });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: { users },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
