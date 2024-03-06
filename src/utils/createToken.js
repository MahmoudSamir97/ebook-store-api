const jwt = require('jsonwebtoken');

const createToken = (id, expireTime) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: expireTime,
    });
    return token;
};

module.exports = createToken;
