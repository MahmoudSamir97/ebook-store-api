const express = require('express');
const authRouter = express.Router();
const validate = require('../middleware/validateFn');
const signupSchema = require('../validations/signupSchema');

// Controller functions
const {
    signup,
    login,
    forgetPassword,
    getResetPassword,
    verify,
    PostResetPassword,
} = require('../controllers/authController');

authRouter.post('/signup', validate(signupSchema), signup);
authRouter.get('/verify/:token', verify);
authRouter.post('/login', login);
authRouter.post('/forget-password', forgetPassword);
authRouter.get('/reset-password/:resetlink', getResetPassword);
authRouter.post('/reset-password', PostResetPassword);

module.exports = authRouter;
