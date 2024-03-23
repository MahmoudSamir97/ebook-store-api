const User = require('../models/userModel');
const crypto = require('crypto');

const resetMiddleware = async (req, res, next) => {
    const hashedLink = crypto.createHash('sha256').update(req.params.resetLink).digest('hex');
    const foundedUser = await User.findOne({
        passwordResetString: hashedLink,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!foundedUser) return res.status(400).json({ message: 'Reset link is invalid or has been expired' });
    req.user = foundedUser;
    next();
};
module.exports = resetMiddleware;
