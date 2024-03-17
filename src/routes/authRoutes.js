const express = require('express');
const authRouter = express.Router();
const signupSchema = require('../validations/signupSchema');
const { validation } = require('../middleware/validation');
const resetSchema = require('../validations/resetPasswordSchema');
const resetMiddleware = require('../middleware/resetMiddleware');
// Controller functions
const {
    signup,
    login,
    forgetPassword,
    getResetPassword,
    verify,
    resetPassword,
} = require('../controllers/authController');

authRouter.post('/signup', validation(signupSchema), signup);
authRouter.get('/verify/:token', verify);
authRouter.post('/login', login);
authRouter.post('/forget-password', forgetPassword);
authRouter
    .route('/reset-password/:resetlink')
    .get(getResetPassword)
    .post(resetMiddleware, validation(resetSchema), resetPassword);
module.exports = authRouter;
