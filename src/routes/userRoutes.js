const userRouter = require('express').Router();
const { getAllUsers, updatePassword, updateUserData, deleteUser, deleteUserById } = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer');

userRouter.get('/', getAllUsers);
userRouter.patch('/update-Password', isAuthenticated, updatePassword);
userRouter.patch('/update-data', isAuthenticated, upload.single('profileImage'), updateUserData);
userRouter.delete('/delete', isAuthenticated, deleteUser);

userRouter.delete('/:id',deleteUserById);

module.exports = userRouter;
