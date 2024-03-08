const createToken = require('./createToken');

exports.createandSendToken = (user, id, expireTime, statusCode, res) => {
    const token = createToken(id, expireTime);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};
