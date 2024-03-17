const bcrypt = require('bcrypt');
const dataurl = require('dataurl');
const User = require('../models/userModel');
const { createandSendToken } = require('../utils/createandSendToken');
const { uploadToCloudinary } = require('../services/cloudinary');

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
