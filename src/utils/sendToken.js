const createToken = require('./createToken');

exports.sendToken = (user, id, expireTime, statusCode, res) => {
    const token = createToken(id, expireTime);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};
