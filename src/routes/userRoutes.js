const express = require('express');
const {
    signup,
    login,
    forgetPassword,
    getResetPassword,
    verify,
    PostResetPassword,
    updatePassword,
    updateUserData,
    deleteUser,
    getAllUsers,
} = require('../controllers/authController');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer');
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.post('/signup', signup);
userRouter.get('/verify/:token', verify);
userRouter.post('/login', login);
userRouter.post('/forget-password', forgetPassword);
userRouter.get('/reset-password/:resetlink', getResetPassword);
userRouter.post('/reset-password', PostResetPassword);
userRouter.patch('/updateCurrentPassword', isAuthenticated, updatePassword);
userRouter.patch('/updateUserData', isAuthenticated, upload.single('profileImage'), updateUserData);
userRouter.delete('/delete', isAuthenticated, deleteUser);

module.exports = userRouter;
