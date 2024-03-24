const userRouter = require('express').Router();
const { getAllUsers, updatePassword, updateUserData, deleteUser, getUser } = require('../controllers/userController');
const updatePassMiddleware = require('../middleware/changePasswordMiddleware');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer');
const { validation } = require('../middleware/validation');
const resetSchema = require('../validations/resetPasswordSchema');
const updateDataSchema = require('../validations/updateDataSchema');

userRouter.get('/', getAllUsers);
userRouter.get('/data', isAuthenticated, getUser);
userRouter.patch('/update-Password', isAuthenticated, updatePassMiddleware, validation(resetSchema), updatePassword);
userRouter.patch(
    '/update-data',
    isAuthenticated,
    upload.single('profileImage'),
    validation(updateDataSchema),
    updateUserData
);
userRouter.delete('/delete', isAuthenticated, deleteUser);
module.exports = userRouter;
// upload.single('profileImage'),
