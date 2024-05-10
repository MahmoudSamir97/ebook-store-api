const createToken = require('./createToken');
const verifyTemplate = require('../utils/verifyTemplate');
const sendeEmail = require('../services/sendEmail');

const sendVerifyEmail = async (user) => {
    user.isVerfied = false;
    await user.save();
    const { _id, email, userName } = user;
    const token = createToken(_id, process.env.JWT_EXPIRES_IN);
    const verifyURL = `http://127.0.0.1:${process.env.PORT}/auth/verify/${token}`;
    const loginUrl = 'http://localhost:3000/login';
    sendeEmail(verifyTemplate, email, verifyURL, userName, loginUrl);
};

module.exports = sendVerifyEmail;
