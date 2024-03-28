const bcrypt = require('bcrypt');
const dataurl = require('dataurl');
const User = require('../models/userModel');
const { createandSendToken } = require('../utils/createandSendToken');
const { uploadToCloudinary } = require('../services/cloudinary');
const sendVerifyEmail = require('../services/sendVerifyEmail');

exports.updatePassword = async (req, res) => {
    try {
        // 1-FIND USER
        const { user } = req;
        // 2-UPDATE PASSWORD
        const hashedPassword = await bcrypt.hash(req.body.newPassword, Number(process.env.BCRYPT_SALT));
        user.password = hashedPassword;
        await user.save();
        // 3-CREATE AND SEND TOKEN
        createandSendToken(user, user._id, process.env.JWT_EXPIRES_IN, 200, res);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
exports.updateUserData = async (req, res) => {
    try {
        console.log('first');
        const user = await User.findById(req.user._id);
        if (req.file) {
            const dataUrlString = dataurl.format({
                data: req.file.buffer,
                mimetype: req.file.mimetype,
            });
            const result = await uploadToCloudinary(dataUrlString, 'Portfolio');
            console.log(result);
            user.image.url = result.secure_url;
            user.image.public_id = result.public_id;
            await user.save();
        }
        // IF EMAIL CHANGED. SEND VERIFICATION EMAIL
        if (req.body.email) {
            sendVerifyEmail(user);
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

exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params; // Get the user ID from request parameters
        const deletedUser = await User.findByIdAndDelete(id); // Find and delete the user by ID
        if (!deletedUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            error: err.message,
        });
    }
};
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+isDeleted');
        if (!user) return res.status(404).json({ status: 'fail', message: 'User not found!' });
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            err: err.message,
        });
    }
};
