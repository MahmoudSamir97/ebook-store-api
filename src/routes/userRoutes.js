const express = require('express');
const {
    signup,
    login,
    forgetPassword,
    PatchResetPassword,
    getResetPassword,
    verify,
} = require('../controllers/authController');
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.get('/verify/:token', verify);
userRouter.post('/login', login);
userRouter.post('/forget-password', forgetPassword);
userRouter.get('/reset-password/:resetlink', getResetPassword);
userRouter.post('/reset-password', PatchResetPassword);

module.exports = userRouter;
