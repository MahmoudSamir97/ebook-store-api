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
    verify,
    resetPassword,
    getDashboard,
    getDeactivated,
    postDeactivated,
} = require('../controllers/authController');

authRouter.post('/signup', validation(signupSchema), signup);
authRouter.get('/verify/:token', verify);
authRouter.post('/login', login);
authRouter.post('/admin', getDashboard);
// deactivated
authRouter.get('/deactivated', getDeactivated);
authRouter.post('/deactivated', postDeactivated);
// deactivated
authRouter.post('/forget-password', forgetPassword);
authRouter.post('/reset-password/:resetLink', resetMiddleware, validation(resetSchema), resetPassword);
module.exports = authRouter;
