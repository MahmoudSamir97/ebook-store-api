const express = require('express');
const {
    signup,
    login,
    forgetPassword,
    getResetPassword,
    verify,
    PostResetPassword,
} = require('../controllers/authController');
const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.get('/verify/:token', verify);
userRouter.post('/login', login);
userRouter.post('/forget-password', forgetPassword);
userRouter.get('/reset-password/:resetlink', getResetPassword);
userRouter.post('/reset-password', PostResetPassword);

module.exports = userRouter;
