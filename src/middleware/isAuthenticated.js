const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    // 1-)CHECK IF TOKEN EXIST
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ status: 'fail', message: 'Missing authenticated Token!' });
    // 2-)TOKEN VERIFICATION
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3-)CHECK IF USER EXIST
    const newUser = await User.findById(decoded.id);
    if (!newUser) return res.status(401).json({ status: 'fail', message: 'Invalid signature! please log in again' });
    req.user = newUser;
    next();
};

module.exports = isAuthenticated;
