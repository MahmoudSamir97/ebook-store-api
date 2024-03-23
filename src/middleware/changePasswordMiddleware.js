const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const updatePassMiddleware = async (req, res, next) => {
    // 1-)Find user
    const foundedUser = await User.findById(req.user._id).select('+password');
    console.log(foundedUser, 'changepasswordMidd page');
    // 2-) check if provided password is correct
    const passwordMatch = bcrypt.compareSync(req.body.oldPassword, foundedUser.password);
    if (!passwordMatch)
        return res.status(401).json({
            status: 'fail',
            message: 'Wrong password! Please try again',
        });
    next();
};
module.exports = updatePassMiddleware;
